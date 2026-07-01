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
router.post('/atender/:id', mesaController.atender);
router.post('/finalizar/:id', mesaController.finalizar);
router.post('/internar/:id', mesaController.internar);

router.post('/ingreso-nn', mesaController.ingresoRapidoNN);


module.exports = router;
