const express = require('express');
const router = express.Router();

const { 
 febriles,
 } = require('../controllers/StataticsController')

const { isAuthenticatedUser, authorizeRole } = require("../../middlewares/auth")

router.get('/febriles',isAuthenticatedUser, febriles);

module.exports = router;
