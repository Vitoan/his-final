const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// 1. Listado de Pacientes
router.get('/', admisionController.renderIndex);

// 2. Crear Paciente
router.get('/nuevo', admisionController.renderCreate); // Mostrar formulario
router.post('/nuevo', admisionController.create);      // Guardar datos

// 3. Editar Paciente
router.get('/editar/:id', admisionController.renderEdit); // Mostrar formulario con datos
router.post('/editar/:id', admisionController.update);    // Guardar cambios

// 4. Borrar Paciente
router.post('/borrar/:id', admisionController.delete);

module.exports = router;