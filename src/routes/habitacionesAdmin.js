const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

// ======================================================
// RUTAS DE ADMINISTRACIÓN DE HABITACIONES
// ======================================================

// Listar todas las habitaciones
router.get('/', habitacionController.listar);

// Crear nueva habitación
router.get('/nuevo', habitacionController.mostrarCrear);
router.post('/guardar', habitacionController.crear);

// Editar habitación
router.get('/editar/:id', habitacionController.mostrarEditar);
router.post('/editar/:id', habitacionController.editar);

// Desactivar / Reactivar
router.post('/desactivar/:id', habitacionController.desactivar);
router.post('/reactivar/:id', habitacionController.reactivar);

module.exports = router;