const jwt = require('jsonwebtoken');
const createerror = require('http-errors');

exports.accesstoken = (userid) => {
        
        return new Promise((resolve, reject) => {
            const payload ={userid:userid};
            const secret = process.env.access_token_secret;
            const options = {
                expiresIn: '5min',
            };

            jwt.sign(payload, secret, options, (err,token) => {
                if(err) {
                reject(createerror.InternalServerError());
                return
                }
                resolve(token);
            })
        })
    };

exports.verifyaccesstoken = (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized());
        const authheader = req.headers['authorization'];
        const bearertoken = authheader.split(' ');
        const token = bearertoken[1];
        console.log(token);
        jwt.verify(token,process.env.access_token_secret,(err,payload)=>{
            if(err){
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createerror.Unauthorized(message));
            }
            req.payload = payload;
            next();
        })
    },

exports.refreshtoken = (userid) => {
        return new Promise((resolve, reject) => {
            const payload ={userid:userid};
            const secret =process.env.refresh_token_secret;
            const options = {
                expiresIn: '1y',
            };
            jwt.sign(payload, secret, options,(err,token) => {
                if(err){
                    reject(createerror.InternalServerError());
                }
                resolve(token);
            })
        })
    },
exports.verifyrefreshtoken = (refreshtoken) =>{
        return new Promise((resolve, reject) =>{
            jwt.verify(refreshtoken,process.env.refresh_token_secret,(err,payload)=>{
                if(err) return reject(createerror.Unauthorized());
                const userid = payload.userid;
                resolve(userid);
            })
        })
    }