const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacionController'); 

const checkRole = require('../middlewares/roles');

// 1. Mostrar el formulario
router.get('/nuevo', internacionController.renderCreate);

// 2. Guardar los datos en la base de datos
router.post('/nuevo', internacionController.create);

// 3. Mostrar formulario de Alta (Solo Médicos y Admin)
router.get('/:id/alta', checkRole(['Admin', 'Medico']), internacionController.mostrarFormularioAlta);

// 4. Procesar el Alta Médica (Solo Médicos y Admin)
router.post('/:id/alta', checkRole(['Admin', 'Medico']), internacionController.darAlta);

// 5. Transferencia de Cama
router.get('/:id/transferir', internacionController.mostrarFormularioTransferencia);
router.post('/:id/transferir', internacionController.procesarTransferencia);

// 6. Cancelar Internación
router.post('/:id/cancelar', internacionController.cancelarInternacion);

module.exports = router;