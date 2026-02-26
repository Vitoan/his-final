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
const apiRoutes = require('./routes/api');

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
app.use('/api', authMiddleware, apiRoutes);
app.use('/mesa-entrada', authMiddleware, require('./routes/mesa'));
app.use('/turnos', authMiddleware, require('./routes/turnos'));
app.use('/estudios', authMiddleware, require('./routes/estudios'));

// --- CAMBIO IMPORTANTE AQUÍ ---
// Ruta Raíz: Si está logueado, muestra el INDEX (Menú Principal), no Admisión.
// --- RUTA DE RESCATE (Para crear usuarios de prueba) ---
app.get('/setup-usuarios', async (req, res) => {
    try {
        const { Usuario } = require('./models');
        
        // Dependiendo de la librería que uses en tu proyecto para las contraseñas,
        // puede que necesites cambiar 'bcryptjs' por 'bcrypt'.
        const bcrypt = require('bcryptjs'); 
        const passwordHash = await bcrypt.hash('123456', 10);

        // 1. Creamos un Administrador
        await Usuario.findOrCreate({
            where: { email: 'admin@his.com' },
            defaults: {
                nombre: 'Admin',
                apellido: 'Sistema',
                email: 'admin@his.com',
                password: passwordHash,
                rol: 'Admin' // o el rol de administrador que manejes
            }
        });

        // 2. Creamos un Médico (Fundamental para poder agendar turnos)
        await Usuario.findOrCreate({
            where: { email: 'medico@his.com' },
            defaults: {
                nombre: 'Gregory',
                apellido: 'House',
                email: 'medico@his.com',
                password: passwordHash,
                rol: 'Medico'
            }
        });

        res.send(`
            <h1>✅ ¡Usuarios creados con éxito!</h1>
            <p>Ya puedes iniciar sesión con:</p>
            <ul>
                <li><b>Email:</b> admin@his.com o medico@his.com</li>
                <li><b>Contraseña:</b> 123456</li>
            </ul>
            <a href="/auth/login" style="padding: 10px; background: blue; color: white; text-decoration: none; border-radius: 5px;">Ir al Login</a>
        `);
    } catch (error) {
        res.send('Hubo un error (revisa tu consola): ' + error.message);
        console.error(error);
    }
});
app.get('/', (req, res) => {
    if (req.session.usuario) {
        // Renderiza la vista 'src/views/index.pug'
        res.render('index', { title: 'Inicio - HIS Pro' });
    } else {
        res.redirect('/auth/login');
    }
});

// --- 8. SINCRONIZAR BD E INICIAR SERVIDOR ---
sequelize.sync({ alter: true })
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`✅ Servidor conectado a BD y corriendo en http://localhost:${app.get('port')}`);
        });
    })
    .catch(err => {
        console.error('❌ No se pudo conectar a la BD:', err);
    });