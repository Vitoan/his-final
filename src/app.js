const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const session = require('express-session'); // Importar solo una vez

// Importar rutas y middlewares
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/auth');
const admisionRoutes = require('./routes/admision');
const habitacionesRoutes = require('./routes/habitaciones');
const internacionesRoutes = require('./routes/internaciones');

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

// --- CONFIGURACIÓN DE SESIÓN (Solo una vez) ---
// Requisito de Seguridad del PDF
app.use(session({
    secret: 'secreto_super_seguro_his_2025', // En producción esto va en .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // false para localhost (http), true para producción (https)
}));

// --- MIDDLEWARE DE USUARIO GLOBAL ---
// Debe ir DESPUÉS de la configuración de sesión
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