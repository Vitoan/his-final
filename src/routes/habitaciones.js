const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

// GET /habitaciones -> Muestra el mapa
router.get('/', habitacionController.listarMapa);
router.get('/limpiar/:idCama', habitacionController.finalizarLimpieza); 
module.exports = router;