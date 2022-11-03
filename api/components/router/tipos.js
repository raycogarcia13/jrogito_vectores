const express = require('express');
const router = express.Router();

const { 
 all,
 store,
 update,
 remove
 } = require('../controllers/TiposEController')

const { isAuthenticatedUser, authorizeRole } = require("../../middlewares/auth")

router.get('/tipos_e',isAuthenticatedUser, all);
router.post('/tipos_e',isAuthenticatedUser, store);
router.put('/tipos_e/:id',isAuthenticatedUser, update);
router.delete('/tipos_e/:id',isAuthenticatedUser, remove);

module.exports = router;
