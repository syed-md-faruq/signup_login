
const express = require('express');
const app = express();
const createerror = require('http-errors');
const user = require('../models/user_model');
const {authschema} = require('../helpers/schema_validation');
const helper = require('../helpers/jwt');
const signup_login_controller = require("../controllers/signup_login_controller");

app.post('/signup',signup_login_controller.signup)
app.post('/login',signup_login_controller.login);
app.post('/refresh-token',signup_login_controller.refresh_token);

module.exports = app