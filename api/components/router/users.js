const express = require('express');
const router = express.Router();

const { 
 users,
 create,
 update,
 remove
 } = require('../controllers/UserController')

const { isAuthenticatedUser, authorizeRole } = require("../../middlewares/auth")

router.get('/users',isAuthenticatedUser, users);
router.post('/users',isAuthenticatedUser, create);
router.put('/users/:id',isAuthenticatedUser, update);
router.delete('/users/:id',isAuthenticatedUser, remove);

module.exports = router;
