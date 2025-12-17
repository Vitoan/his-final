const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

// Ruta principal del mapa
router.get('/', habitacionController.listarMapa);

// Ruta para limpiar cama (Aquí daba el error si la función de arriba no existía)
router.get('/limpiar/:idCama', habitacionController.finalizarLimpieza);

module.exports = router;