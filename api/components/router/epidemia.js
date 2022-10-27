const express = require('express');
const router = express.Router();

const { 
 all,
 create,
 update,
 remove
 } = require('../controllers/EpidemiaController')

const { isAuthenticatedUser, authorizeRole } = require("../../middlewares/auth")

router.get('/epidemia',isAuthenticatedUser, all);
router.post('/epidemia',isAuthenticatedUser, create);
router.put('/epidemia/:id',isAuthenticatedUser, update);
router.delete('/epidemia/:id',isAuthenticatedUser, remove);

module.exports = router;
