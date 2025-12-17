const express = require('express');
const router = express.Router();
// Aquí importamos el archivo anterior y lo guardamos en la variable apiController
const apiController = require('../controllers/apiController');

// Ruta POST para recibir notas vía AJAX
router.post('/evolucion', apiController.guardarEvolucionAjax);

module.exports = router;