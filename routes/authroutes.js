const express = require('express');
const router = express.Router();
const {signup, login, refresh_token} = require("../controllers/signup_login_controller");

router.post('/signup',signup);
router.post('/login',login);
router.post('/refresh-token',refresh_token);

module.exports = router;