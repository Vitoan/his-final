const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const session = require('express-session');
const cookieParser = require('cookie-parser');

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
const apiRoutes = require('./routes/api');

// --- 3. CONFIGURACIONES ---
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- 4. MIDDLEWARES GENERALES ---
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser(process.env.SECRET || 'secreto_fallback'));

// --- 5. CONFIGURACIÓN DE SESIÓN ---
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_super_seguro_his_2025',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Middleware para pasar el usuario a las vistas
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario;
    next();
});

// --- 6. DEFINICIÓN DE RUTAS ---
app.use('/auth', authRoutes);

app.use('/admision', authMiddleware, checkRole(['Admin', 'Admision', 'Enfermeria']), admisionRoutes);
app.use('/habitaciones', authMiddleware, checkRole(['Admin', 'Admision', 'Enfermeria', 'Medico']), habitacionesRoutes);
app.use('/internacion', authMiddleware, checkRole(['Admin', 'Admision', 'Medico', 'Enfermeria']), internacionesRoutes);
app.use('/enfermeria', authMiddleware, checkRole(['Admin', 'Enfermeria']), enfermeriaRoutes);
app.use('/medico', authMiddleware, checkRole(['Admin', 'Medico']), medicoRoutes);
app.use('/clinica', authMiddleware, checkRole(['Admin', 'Medico', 'Enfermeria']), clinicaRoutes);
app.use('/admin', authMiddleware, checkRole(['Admin']), adminRoutes);
app.use('/api', authMiddleware, checkRole(['Admin', 'Admision', 'Medico', 'Enfermeria']), apiRoutes);
app.use('/mesa-entrada', authMiddleware, checkRole(['Admin', 'Admision', 'Enfermeria']), require('./routes/mesa'));
app.use('/turnos', authMiddleware, checkRole(['Admin', 'Admision', 'Medico', 'Enfermeria']), require('./routes/turnos'));
app.use('/estudios', authMiddleware, checkRole(['Admin', 'Medico']), require('./routes/estudios')); // ← Solo Admin y Medico
app.use('/portal', authMiddleware, checkRole(['Paciente', 'Admin']), require('./routes/portal'));

// --- 7. RUTA RAÍZ ---
app.get('/', (req, res) => {
    if (req.session.usuario) {
        res.render('index', { title: 'Inicio - HIS Pro' });
    } else {
        res.redirect('/auth/login');
    }
});

// --- 8. SINCRONIZAR BD E INICIAR SERVIDOR ---
sequelize.sync({ alter: true })
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`✅ Servidor corriendo en http://localhost:${app.get('port')}`);
        });
    })
    .catch(err => {
        console.error('❌ Error al conectar con la base de datos:', err);
    });