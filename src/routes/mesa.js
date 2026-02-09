const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');

// Ver Sala de Espera
router.get('/', mesaController.dashboard);

// Formulario de Búsqueda/Ingreso
router.get('/nuevo', mesaController.buscarPaciente);

// Guardar Visita (Paciente Existente)
router.post('/guardar', mesaController.registrarVisita);

// Guardar Completo (Paciente Nuevo + Visita)
router.post('/guardar-completo', mesaController.registrarCompleto);

// Marcar como Atendido
router.get('/atender/:id', mesaController.atender);

module.exports = router;