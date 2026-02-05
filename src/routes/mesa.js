const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');

router.get('/', mesaController.dashboard);
router.get('/nuevo', mesaController.buscarPaciente);

// Ruta para paciente existente
router.post('/guardar', mesaController.registrarVisita);

// NUEVA RUTA: Para paciente nuevo + visita
router.post('/guardar-completo', mesaController.registrarCompleto);

router.get('/atender/:id', mesaController.atender);

module.exports = router;