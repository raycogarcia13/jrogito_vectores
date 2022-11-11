const express = require('express');
const router = express.Router();

const { 
 febriles,
 por_enfermedades,
 groupingMonth,
 groupingEnfermedad,
 tasa
 } = require('../controllers/StataticsController')

const { isAuthenticatedUser, authorizeRole } = require("../../middlewares/auth")

router.get('/febriles',isAuthenticatedUser, febriles);
router.get('/por_enferemedades',isAuthenticatedUser, por_enfermedades);
router.get('/groupingMonth',isAuthenticatedUser, groupingMonth);
router.get('/groupingEnfermedad',isAuthenticatedUser, groupingEnfermedad);
router.get('/tasa/:id',isAuthenticatedUser, tasa);

module.exports = router;
