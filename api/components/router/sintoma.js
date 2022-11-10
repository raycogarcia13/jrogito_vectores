const express = require('express');
const router = express.Router();

const { 
 all,
 store,
 update,
 remove
 } = require('../controllers/SintomasController')

const { isAuthenticatedUser, authorizeRole } = require("../../middlewares/auth")

router.get('/sintoma',isAuthenticatedUser, all);
router.post('/sintoma',isAuthenticatedUser, store);
router.put('/sintoma/:id',isAuthenticatedUser, update);
router.delete('/sintoma/:id',isAuthenticatedUser, remove);

module.exports = router;
