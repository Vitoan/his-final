const express = require('express');
const router = express.Router();
const camaController = require('../controllers/camaController');

// ======================================================
// RUTAS DE ADMINISTRACIÓN DE CAMAS (Admin-Only)
// ======================================================

// Listar todas las camas
router.get('/', camaController.listar);

// Crear nueva cama
router.get('/nuevo', camaController.mostrarCrear);
router.post('/guardar', camaController.crear);

// Editar cama
router.get('/editar/:id', camaController.mostrarEditar);
router.post('/editar/:id', camaController.editar);

// Eliminar cama
router.post('/eliminar/:id', camaController.eliminar);

module.exports = router;
