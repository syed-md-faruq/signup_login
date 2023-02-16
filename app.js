const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const createerror = require('http-errors');
require('dotenv').config()

mongoose.set('strictQuery', false);
const mongoDB = "mongodb://localhost:27017/users";
mongoose.connect(mongoDB);

const authroute = require('./routes/authroutes');
const {verifyaccesstoken} = require('./helpers/jwt');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/', verifyaccesstoken, async (req, res, next) => {
    res.send('Hello user')
});

app.use('/auth', authroute);

app.use(async (req, res, next) => {
    next(createerror.NotFound('route not exist'))
});


app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})