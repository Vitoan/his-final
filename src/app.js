const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const session = require('express-session'); 

// Importar rutas y middlewares
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/auth');
const admisionRoutes = require('./routes/admision');
const habitacionesRoutes = require('./routes/habitaciones');
const internacionesRoutes = require('./routes/internaciones');
const enfermeriaRoutes = require('./routes/enfermeria');
const medicoRoutes = require('./routes/medico'); // <--- 1. IMPORTANTE: Importar rutas de médico

const app = express();

// --- CONFIGURACIONES ---
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- MIDDLEWARES GENERALES ---
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// --- CONFIGURACIÓN DE SESIÓN ---
app.use(session({
    secret: 'secreto_super_seguro_his_2025',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// --- MIDDLEWARE DE USUARIO GLOBAL ---
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario;
    next();
});

// --- RUTAS ---

// Rutas Públicas
app.use('/auth', authRoutes);

// Rutas Protegidas (Con el guardián authMiddleware)
app.use('/admision', authMiddleware, admisionRoutes);
app.use('/habitaciones', authMiddleware, habitacionesRoutes);
app.use('/internacion', authMiddleware, internacionesRoutes);
app.use('/enfermeria', authMiddleware, enfermeriaRoutes);
app.use('/medico', authMiddleware, medicoRoutes); // <--- 2. IMPORTANTE: Usar las rutas de médico

// Redirección Raíz Inteligente
app.get('/', (req, res) => {
    if (req.session.usuario) {
        res.redirect('/admision');
    } else {
        res.redirect('/auth/login');
    }
});

// --- INICIAR SERVIDOR ---
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});