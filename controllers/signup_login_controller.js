const express = require('express');
const createerror = require('http-errors');
const user_model = require('../models/user_model');
const {authschema} = require('../helpers/schema_validation');
const jwt_helper = require('../helpers/jwt');

const jwt = require('jsonwebtoken');

exports.signup = async(req, res, next)=>{
    try {
        const result = await authschema.validateAsync({"email":req.body.email,"password":req.body.password})

        const doesexist = await user_model.findOne({email: result.email})
        if(doesexist) throw createerror.Conflict(`${result.email} already exists`)

        const user = new user_model(req.body)
        const saveduser = await user.save();
        const accesstoken = await jwt_helper.accesstoken(saveduser.id)
        const refreshtoken = await jwt_helper.refreshtoken(saveduser.id)
        res.send({accesstoken,refreshtoken})

    } catch (error) {
        if(error.isJoi === true) error.status = 422
        next(error);
    }
};
exports.login = async(req, res, next)=>{
    try {
        const result = await authschema.validateAsync(req.body)
        const user = await user_model.findOne({email: result.email})

        if(!user) throw createerror.NotFound("User not registered");

        const ismatch = await user.isvalidpassword(result.password)
        if(!ismatch) throw createerror.Unauthorized("Invalid Username/Password")

        const accesstoken = await jwt_helper.accesstoken(user.id)
        const refreshtoken = await jwt_helper.refreshtoken(user.id)

        res.send({accesstoken,refreshtoken})
    } catch (error) {
        if(error.isJoi === true) return next(createError.BadRequest('Invalid Username/Password'))
        next(error)
    }
}
exports.refresh_token = async(req, res, next)=>{
    try {
        const {refreshtoken} = req.body
        if(!refreshtoken) throw createerror.BadRequest()
        const userid = await jwt_helper.verifyrefreshtoken(refreshtoken)

        const accesstoken = await jwt_helper.accesstoken(userid)
        const reftoken = await jwt_helper.refreshtoken(userid)
        res.send({accesstoken:accesstoken, refreshtoken:reftoken})
    } catch (error) {
        next(error)
    }
}