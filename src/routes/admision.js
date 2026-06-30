const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// === IMPORTAR MIDDLEWARES ===
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/roles');

// ======================================================
// RUTAS DE PACIENTES
// ======================================================
// Listado de pacientes
router.get('/', admisionController.renderIndex);

// Crear paciente
router.get('/nuevo', admisionController.renderCreate);
router.post('/nuevo', admisionController.create);

// Editar paciente
router.get('/editar/:id', admisionController.renderEdit);
router.post('/editar/:id', admisionController.update);

// Desactivar / Reactivar paciente
router.post('/desactivar/:id', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.desactivarPaciente);
router.post('/reactivar/:id', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.reactivarPaciente);

// Historia clínica
router.get('/historia/:id', admisionController.verHistoriaClinica);

// ======================================================
// RUTAS DE ADMISIÓN
// ======================================================
// Formulario y creación de admisión
router.get('/nueva', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.renderNuevaAdmision);
router.post('/nueva', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.crearAdmision);

// Listado de admisiones
router.get('/listado', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.renderListadoAdmisiones);

// Cancelar y Revertir admisión
router.post('/cancelar/:id', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.cancelarAdmision);
router.post('/revertir/:id', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.revertirCancelacion);

module.exports = router;