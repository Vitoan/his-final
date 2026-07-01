const express = require('express');
const router = express.Router();
const enfermeriaController = require('../controllers/enfermeriaController');

router.get('/evaluar/:idInternacion', enfermeriaController.mostrarFormulario);

// POST: Guardar datos de enfermería
router.post('/guardar', enfermeriaController.guardarEvaluacion);

// POST: Registrar administración de medicamento
router.post('/administrar', enfermeriaController.registrarAdministracion);

module.exports = router;