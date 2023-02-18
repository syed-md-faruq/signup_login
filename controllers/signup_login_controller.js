const express = require('express');
const createerror = require('http-errors');
const user_model = require('../models/user_model');
const {authschema} = require('../helpers/schema_validation');
const {accesstoken, refreshtoken, verifyrefreshtoken} = require('../helpers/jwt');

exports.signup = async(req, res, next)=>{
    try {
        const result = await authschema.validateAsync({"email":req.body.email,"password":req.body.password});

        const doesexist = await user_model.findOne({email: result.email});
        if(doesexist) throw createerror.Conflict(`${result.email} already exists`);

        const user = new user_model(req.body);
        const saveduser = await user.save();
        const acctoken = await accesstoken(saveduser.id);
        const reftoken = await refreshtoken(saveduser.id);
        res.send({acctoken,reftoken});

    } catch (error) {
        if(error.isJoi === true) error.status = 422
        next(error);
    }
};
exports.login = async(req, res, next)=>{
    try {
        const result = await authschema.validateAsync(req.body);
        const user = await user_model.findOne({email: result.email});

        if(!user) throw createerror.NotFound("User not registered");

        const ismatch = await user.isvalidpassword(result.password)
        if(!ismatch) throw createerror.Unauthorized("Invalid Username/Password")

        const acctoken = await accesstoken(user.id);
        const reftoken = await refreshtoken(user.id);

        res.send({acctoken,reftoken});
    } catch (error) {
        if(error.isJoi === true) return next(createerror.BadRequest('Invalid Username/Password'));
        next(error);
    }
}
exports.refresh_token = async(req, res, next)=>{
    try {
        const {refresh_token} = req.body;
        if(!refresh_token) throw createerror.BadRequest();
        const userid = await verifyrefreshtoken(refresh_token);

        const acctoken = await accesstoken(userid);
        const reftoken = await refreshtoken(userid);
        res.send({acctoken, reftoken});
    } catch (error) {
        next(error);
    }
}
