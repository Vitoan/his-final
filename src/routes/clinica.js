const express = require('express');
const router = express.Router();
const clinicaController = require('../controllers/clinicaController');
// Aquí importaremos el middleware de roles en el futuro
// const verificarRol = require('../middlewares/roles'); 

// Dashboard General (Lo ven Médicos y Enfermeros)
router.get('/dashboard', clinicaController.dashboard);

// Ver detalle de un paciente específico
router.get('/paciente/:idInternacion', clinicaController.verHistorialCompleto);

module.exports = router;