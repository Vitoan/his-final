const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// GET /admision -> Listado principal
router.get('/', admisionController.listarPacientes);

// GET /admision/nuevo -> Mostrar formulario
router.get('/nuevo', admisionController.mostrarFormulario);

// POST /admision/nuevo -> Procesar formulario
router.post('/nuevo', admisionController.registrarPaciente);

module.exports = router;