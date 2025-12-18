const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware para asegurar que SOLO el Admin entre aquí
const soloAdmin = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol === 'Admin') {
        next();
    } else {
        res.redirect('/admision'); // Expulsar a otros roles
    }
};

router.get('/usuarios', soloAdmin, adminController.listarUsuarios);
router.get('/usuarios/nuevo', soloAdmin, adminController.mostrarFormulario);
router.post('/usuarios/guardar', soloAdmin, adminController.crearUsuario);
router.post('/usuarios/eliminar/:id', soloAdmin, adminController.eliminarUsuario);
router.get('/auditoria', adminController.verAuditoria);

module.exports = router;