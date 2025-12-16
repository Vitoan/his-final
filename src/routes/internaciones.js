const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacionController');

// 1. GET: Mostrar formulario de asignación
router.get('/asignar/:idCama', internacionController.mostrarFormularioAsignacion);

// 2. POST: Guardar asignación
router.post('/asignar', internacionController.procesarAsignacion);

// 3. POST: Dar de Alta
router.post('/alta', internacionController.darAlta);

// ¡ESTA LÍNEA ES CRÍTICA! Sin esto, app.js falla.
module.exports = router;