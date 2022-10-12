const express = require('express');
const router = express.Router();

const { 
 login
 } = require('../controllers/AuthController')

const { isAuthenticatedUser, authorizeRole } = require("../../middlewares/auth")

router.post('/login', login);

module.exports = router;
