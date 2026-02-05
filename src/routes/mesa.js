const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');

router.get('/', mesaController.dashboard); // Ver sala de espera
router.get('/nuevo', mesaController.buscarPaciente); // Formulario de búsqueda/ingreso
router.post('/guardar', mesaController.registrarVisita); // Guardar
router.get('/atender/:id', mesaController.atender); // Sacar de la lista

module.exports = router;