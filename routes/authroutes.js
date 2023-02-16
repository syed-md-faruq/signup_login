const express = require('express');
const app = express();
const {signup, login, refresh_token} = require("../controllers/signup_login_controller");

app.post('/signup',signup);
app.post('/login',login);
app.post('/refresh-token',refresh_token);

module.exports = app;