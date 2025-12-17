const express = require('express');
const router = express.Router();
const enfermeriaController = require('../controllers/enfermeriaController');

// GET: Ver formulario (recibe ID de la internación)
router.get('/evaluar/:idInternacion', enfermeriaController.mostrarFormulario);

// POST: Guardar datos
router.post('/guardar', enfermeriaController.guardarEvaluacion);

module.exports = router;