const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

// 1. Ver la agenda de turnos
router.get('/', turnoController.listarTurnos);

// 2. Mostrar formulario para agendar
router.get('/nuevo', turnoController.renderCrearTurno);

// 3. Guardar el turno agendado
router.post('/nuevo', turnoController.crearTurno);

// 4. Actualizar estado (Cancelar o marcar como Asistió)
router.post('/:id/estado', turnoController.cambiarEstado);

module.exports = router;