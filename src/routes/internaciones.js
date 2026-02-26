const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacionController'); 

// 1. Mostrar el formulario
router.get('/nuevo', internacionController.renderCreate);

// 2. Guardar los datos en la base de datos (¡ESTA ES LA RUTA QUE TE DABA 404!)
router.post('/nuevo', internacionController.create);

// 3. Mostrar formulario de Alta
router.get('/:id/alta', internacionController.mostrarFormularioAlta);

// 4. Procesar el Alta Médica
router.post('/:id/alta', internacionController.darAlta);

module.exports = router;