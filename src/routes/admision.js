const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// === IMPORTAR MIDDLEWARES ===
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/roles');

// 1. Listado de Pacientes
router.get('/', admisionController.renderIndex);

// 2. Crear Paciente
router.get('/nuevo', admisionController.renderCreate);
router.post('/nuevo', admisionController.create);

// 3. Editar Paciente
router.get('/editar/:id', admisionController.renderEdit);
router.post('/editar/:id', admisionController.update);

// 4. Borrar Paciente
router.post('/borrar/:id', admisionController.delete);

// 5. Desactivar / Reactivar Paciente
router.post('/desactivar/:id', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.desactivarPaciente);
router.post('/reactivar/:id', authMiddleware, checkRole(['Admin', 'Admision']), admisionController.reactivarPaciente);
// 6. Ver Historia Clínican
router.get('/historia/:id', admisionController.verHistoriaClinica);

module.exports = router;