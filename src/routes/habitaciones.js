const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

// Ruta principal del mapa
router.get('/', habitacionController.listarMapa);

router.post('/limpiar/:idCama', habitacionController.finalizarLimpieza);

module.exports = router;