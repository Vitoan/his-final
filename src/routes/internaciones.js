const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacionController'); 

// --- RUTAS DE INTERNACIÓN ---
// Mostrar el formulario de nueva internación (ahora recibe la cama por query: ?cama_id=X)
router.get('/nueva', internacionController.renderCreate);

// Guardar la nueva internación en la BD
router.post('/nueva', internacionController.create);

// Dar de alta a un paciente (Lo hacemos por GET para mostrar una pantalla de confirmación/resumen, o POST si es directo)
router.get('/:id/alta', internacionController.mostrarFormularioAlta);
router.post('/:id/alta', internacionController.darAlta);

module.exports = router;