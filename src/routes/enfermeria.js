const express = require('express');
const router = express.Router();
const enfermeriaController = require('../controllers/enfermeriaController');

// GET: Ver formulario de signos vitales (esta es la ruta original que busca el botón)
router.get('/evaluar/:idInternacion', enfermeriaController.mostrarFormulario);

// POST: Guardar datos de enfermería
router.post('/guardar', enfermeriaController.guardarEvaluacion);

module.exports = router;