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
// Modificar usuario
router.get('/usuarios/editar/:id', soloAdmin, adminController.mostrarFormularioEditar);
router.post('/usuarios/actualizar/:id', soloAdmin, adminController.actualizarUsuario);
router.get('/auditoria', adminController.verAuditoria);

// Ruta principal del panel Admin
router.get('/', soloAdmin, (req, res) => {
    res.render('admin/dashboard', { 
        title: 'Panel de Administración' 
    });
    
});


module.exports = router;