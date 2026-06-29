const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const session = require('express-session');

// --- 1. INICIALIZAR APP ---
const app = express();

// --- 2. IMPORTAR MODELOS Y RUTAS ---
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/auth');
const checkRole = require('./middlewares/roles');
const admisionRoutes = require('./routes/admision');
const habitacionesRoutes = require('./routes/habitaciones');
const internacionesRoutes = require('./routes/internaciones');
const enfermeriaRoutes = require('./routes/enfermeria');
const medicoRoutes = require('./routes/medico');
const clinicaRoutes = require('./routes/clinica');
const adminRoutes = require('./routes/admin');

// --- 3. CONFIGURACIONES ---
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- 4. MIDDLEWARES GENERALES ---
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// --- 5. CONFIGURACIÓN DE SESIÓN ---
app.use(session({
    secret: 'secreto_super_seguro_his_2025',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// --- 6. MIDDLEWARE DE USUARIO GLOBAL ---
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario;
    next();
});

// --- 7. DEFINICIÓN DE RUTAS ---

// Rutas Públicas
app.use('/auth', authRoutes);

// Rutas Protegidas (ordenadas por módulo)
app.use('/admision', authMiddleware, checkRole(['Admin', 'Admision', 'Enfermeria']), admisionRoutes);
app.use('/habitaciones', authMiddleware, checkRole(['Admin', 'Admision', 'Enfermeria', 'Medico']), habitacionesRoutes);
app.use('/internacion', authMiddleware, checkRole(['Admin', 'Admision', 'Medico', 'Enfermeria']), internacionesRoutes);
app.use('/enfermeria', authMiddleware, checkRole(['Admin', 'Enfermeria']), enfermeriaRoutes);
app.use('/medico', authMiddleware, checkRole(['Admin', 'Medico']), medicoRoutes);
app.use('/clinica', authMiddleware, checkRole(['Admin', 'Medico', 'Enfermeria']), clinicaRoutes);
app.use('/mesa-entrada', authMiddleware, checkRole(['Admin', 'Admision', 'Enfermeria']), require('./routes/mesa'));
app.use('/turnos', authMiddleware, checkRole(['Admin', 'Admision', 'Medico', 'Enfermeria']), require('./routes/turnos'));
app.use('/estudios', authMiddleware, checkRole(['Admin', 'Medico', 'Enfermeria']), require('./routes/estudios'));
app.use('/portal', authMiddleware, checkRole(['Paciente']), require('./routes/portal'));app.use('/api', authMiddleware, checkRole(['Admin', 'Admision', 'Medico', 'Enfermeria']), require('./routes/api'));
// === RUTAS ADMIN (Importante: rutas específicas primero) ===
app.use('/admin/obras-sociales', authMiddleware, checkRole(['Admin']), require('./routes/obrasSociales'));
app.use('/admin/reportes', authMiddleware, checkRole(['Admin']), require('./routes/reportes'));
app.use('/admin', authMiddleware, checkRole(['Admin']), adminRoutes);
// =====================================

// --- RUTA RAÍZ ---
app.get('/', (req, res) => {
    if (req.session.usuario) {
        res.render('index', { title: 'Inicio - HIS Pro' });
    } else {
        res.redirect('/auth/login');
    }
});

// --- RUTA DE DESARROLLO (Comentar o eliminar en versión final) ---
app.get('/setup-usuarios', async (req, res) => {
    try {
        const { Usuario } = require('./models');
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash('123456', 10);

        await Usuario.findOrCreate({
            where: { email: 'admin@his.com' },
            defaults: { nombre: 'Admin', apellido: 'Sistema', email: 'admin@his.com', password: passwordHash, rol: 'Admin' }
        });

        res.send('✅ Usuario Admin creado (admin@his.com / 123456)');
    } catch (error) {
        res.send('Error: ' + error.message);
    }
});

// --- 8. INICIAR SERVIDOR ---
sequelize.sync({ alter: true })
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`✅ Servidor corriendo en http://localhost:${app.get('port')}`);
        });
    })
    .catch(err => {
        console.error('❌ Error conectando a la BD:', err);
    });