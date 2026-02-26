const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

// GET: Ver formulario de evolución médica
router.get('/evolucionar/:idInternacion', medicoController.mostrarEvolucion);

// POST: Guardar la evolución
router.post('/guardar', medicoController.guardarEvolucion);

module.exports = router;