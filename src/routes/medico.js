const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

router.get('/evolucionar/:idInternacion', medicoController.mostrarEvolucion);
router.post('/guardar', medicoController.guardarEvolucion);

module.exports = router;