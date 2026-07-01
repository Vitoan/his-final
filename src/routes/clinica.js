const express = require('express');
const router = express.Router();
const clinicaController = require('../controllers/clinicaController');

// Dashboard General (Lo ven Médicos y Enfermeros)
router.get('/dashboard', clinicaController.dashboard);

router.get('/historial/:idPaciente', clinicaController.historialGeneralPaciente);
// Ver detalle de un paciente específico
router.get('/paciente/:idInternacion', clinicaController.verHistorialCompleto);

module.exports = router;