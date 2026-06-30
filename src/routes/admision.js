const express = require('express');
const router = express.Router();

// Importamos ambos controladores
const admisionController = require('../controllers/admisionController');
const pacienteController = require('../controllers/pacienteController');

const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/roles');

// ======================================================
// RUTAS DE PACIENTES (Gestión administrativa)
// ======================================================
router.get('/', pacienteController.renderIndex);                    // Listado de pacientes
router.get('/nuevo', pacienteController.renderCreate);              // Formulario crear paciente
router.post('/nuevo', pacienteController.create);                   // Guardar paciente
router.get('/editar/:id', pacienteController.renderEdit);           // Formulario editar
router.post('/editar/:id', pacienteController.update);              // Actualizar paciente

// Desactivar / Reactivar paciente
router.post('/desactivar/:id', authMiddleware, checkRole(['Admin', 'Admision']), pacienteController.desactivarPaciente);
router.post('/reactivar/:id', authMiddleware, checkRole(['Admin', 'Admision']), pacienteController.reactivarPaciente);

// Historia clínica
router.get('/historia/:id', pacienteController.verHistoriaClinica);

// ======================================================
// RUTAS DE ADMISIÓN
// ======================================================
router.get('/nueva', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.renderNuevaAdmision);
router.post('/nueva', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.crearAdmision);

router.get('/listado', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.renderListadoAdmisiones);

router.post('/cancelar/:id', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.cancelarAdmision);
router.post('/revertir/:id', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.revertirCancelacion);

module.exports = router;