const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// Listar (READ)
router.get('/', admisionController.listarPacientes);

// Crear (CREATE)
router.get('/nuevo', admisionController.mostrarFormulario);
router.post('/nuevo', admisionController.registrarPaciente);

// Editar (UPDATE)
router.get('/editar/:id', admisionController.mostrarFormularioEdicion); // Muestra el form con datos
router.post('/editar/:id', admisionController.actualizarPaciente); // Guarda los cambios

// Borrar (DELETE)
router.post('/borrar/:id', admisionController.borrarPaciente);

module.exports = router;