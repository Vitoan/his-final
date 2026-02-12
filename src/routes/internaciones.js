const express = require('express');
const router = express.Router();
// Cambiamos 'internacionesController' por 'internacionController'
const internacionController = require('../controllers/internacionController'); 

// --- RUTAS ---
// Usamos el nombre de la variable que definimos arriba
router.get('/nuevo', internacionController.renderCreate);
router.post('/nuevo', internacionController.create);
router.get('/asignar/:idCama', internacionController.mostrarFormularioAsignacion);
router.post('/asignar', internacionController.create);
router.post('/alta', internacionController.darAlta);

module.exports = router;