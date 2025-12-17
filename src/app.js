const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const session = require('express-session');

// --- 1. INICIALIZAR APP (Lo primero) ---
const app = express();

// --- 2. IMPORTAR MODELOS Y RUTAS ---
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/auth');
const admisionRoutes = require('./routes/admision');
const habitacionesRoutes = require('./routes/habitaciones');
const internacionesRoutes = require('./routes/internaciones');
const enfermeriaRoutes = require('./routes/enfermeria');
const medicoRoutes = require('./routes/medico');
const clinicaRoutes = require('./routes/clinica');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api'); // <--- FALTABA ESTO (Para AJAX)

// --- 3. CONFIGURACIONES ---
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- 4. MIDDLEWARES GENERALES ---
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false })); // Para recibir datos de formularios
app.use(express.json()); // Para recibir JSON (AJAX)
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

// Públicas
app.use('/auth', authRoutes);

// Protegidas
app.use('/admision', authMiddleware, admisionRoutes);
app.use('/habitaciones', authMiddleware, habitacionesRoutes);
app.use('/internacion', authMiddleware, internacionesRoutes);
app.use('/enfermeria', authMiddleware, enfermeriaRoutes);
app.use('/medico', authMiddleware, medicoRoutes); 
app.use('/clinica', authMiddleware, clinicaRoutes);
app.use('/admin', authMiddleware, adminRoutes);
app.use('/api', authMiddleware, apiRoutes); // <--- AGREGADO (AJAX)

// Redirección Raíz Inteligente
app.get('/', (req, res) => {
    if (req.session.usuario) {
        res.redirect('/admision');
    } else {
        res.redirect('/auth/login');
    }
});

// --- 8. SINCRONIZAR BD E INICIAR SERVIDOR ---
// Solo iniciamos el servidor si la base de datos conecta bien
sequelize.sync({ alter: false })
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`✅ Servidor conectado a BD y corriendo en http://localhost:${app.get('port')}`);
        });
    })
    .catch(err => {
        console.error('❌ No se pudo conectar a la BD:', err);
    });