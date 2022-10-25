const express = require('express');
const router = express.Router();

const { 
 all,
 create,
 update,
 remove
 } = require('../controllers/VectorController')

const { isAuthenticatedUser, authorizeRole } = require("../../middlewares/auth")

router.get('/vector',isAuthenticatedUser, all);
router.post('/vector',isAuthenticatedUser, create);
router.put('/vector/:id',isAuthenticatedUser, update);
router.delete('/vector/:id',isAuthenticatedUser, remove);

module.exports = router;
