const jwt = require('jsonwebtoken');
const createerror = require('http-errors');

exports.accesstoken = (userid) => {
        
        return new Promise((resolve, reject) => {
            const payload ={userid:userid}
            const secret = "ACCESS_TOKEN_SECRET"
            const options = {
                expiresIn: '5min',
            }
            console.log("hello")

            jwt.sign(payload, secret, options, (err,token) => {
                if(err) {
                reject(createerror.InternalServerError())
                return
                }
                resolve(token)
            })
        })
    };

exports.verifyaccesstoken = (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authheader = req.headers['authorization']
        const bearertoken = authheader.split(' ')
        const token = bearertoken[1]
        console.log(token);
        jwt.verify(token,"ACCESS_TOKEN_SECRET",(err,payload)=>{
            if(err){
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createerror.Unauthorized(message))
            }
            req.payload = payload 
            next()
        })
    },

exports.refreshtoken = (userid) => {
        return new Promise((resolve, reject) => {
            const payload ={userid:userid}
            const secret ="REFRESH_TOKEN_SECRET"
            const options = {
                expiresIn: '1y',
            }
            jwt.sign(payload, secret, options,(err,token) => {
                if(err){
                    reject(createerror.InternalServerError())
                }
                resolve(token)   
            })
        })
    },
exports.verifyrefreshtoken = (refreshtoken) =>{
        return new Promise((resolve, reject) =>{
            jwt.verify(refreshtoken,"REFRESH_TOKEN_SECRET",(err,payload)=>{
                if(err) return reject(createerror.Unauthorized())
                const userid = payload.userid
                resolve(userid)
            })
        })
    }