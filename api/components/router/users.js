const express = require('express');
const router = express.Router();

const { 
 users
 } = require('../controllers/UserController')

const { isAuthenticatedUser, authorizeRole } = require("../../middlewares/auth")

router.get('/users',isAuthenticatedUser, users);

module.exports = router;
