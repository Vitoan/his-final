const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/roles');
const obraSocialController = require('../controllers/obraSocialController');


router.get('/', obraSocialController.listar);
router.get('/nuevo', obraSocialController.mostrarCrear);
router.post('/guardar', obraSocialController.crear);
router.get('/editar/:id', obraSocialController.mostrarEditar);
router.post('/editar/:id', obraSocialController.editar);
router.post('/eliminar/:id', obraSocialController.eliminar);
router.post('/desactivar/:id', authMiddleware, checkRole(['Admin']), obraSocialController.desactivarObraSocial);
router.post('/reactivar/:id', authMiddleware, checkRole(['Admin']), obraSocialController.reactivarObraSocial);

module.exports = router;