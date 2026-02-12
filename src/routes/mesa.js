const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');

// 1. Ver Sala de Espera (Dashboard)
router.get('/', mesaController.dashboard);

// 2. Formulario de Búsqueda/Ingreso
router.get('/nuevo', mesaController.buscarPaciente);

// 3. Guardar Visita (Paciente Existente)
router.post('/guardar', mesaController.registrarVisita);

// 4. Guardar Completo (Paciente Nuevo + Visita)
router.post('/guardar-completo', mesaController.registrarCompleto);

// 5. Acciones de Botones
router.get('/atender/:id', mesaController.atender);     // Botón Negro "Llamar"
router.get('/finalizar/:id', mesaController.finalizar); // Botón Verde "Alta"

// --- ESTA ES LA LÍNEA QUE TE FALTA ---
router.get('/internar/:id', mesaController.internar);   // Botón Violeta "Internar"

module.exports = router;