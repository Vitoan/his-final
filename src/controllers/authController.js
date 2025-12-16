const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. Mostrar Login
exports.mostrarLogin = (req, res) => {
    res.render('auth/login', { title: 'Iniciar Sesión HIS' });
};

// 2. Procesar Login (Con la corrección de db.query)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Consultamos el usuario
        const rows = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.render('auth/login', { error: 'Usuario o contraseña incorrectos' });
        }

        const usuario = rows[0];

        // Comparamos contraseña
        const validPassword = await bcrypt.compare(password, usuario.password);

        if (!validPassword) {
            return res.render('auth/login', { error: 'Usuario o contraseña incorrectos' });
        }

        // Login exitoso
        req.session.usuario = usuario;
        res.redirect('/admision');

    } catch (error) {
        console.error(error);
        res.render('auth/login', { error: 'Error del servidor' });
    }
};

// 3. Logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

// 4. SETUP: Función temporal para crear al Admin (ESTA ES LA QUE FALTABA)
exports.crearAdmin = async (req, res) => {
    try {
        // Encriptamos '123456'
        const passwordEncriptada = await bcrypt.hash('123456', 10);
        
        // Borramos el anterior si existe
        await db.query('DELETE FROM usuarios WHERE email = ?', ['admin@his.com']);
        
        // Insertamos el nuevo
        await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', 
            ['Administrador', 'admin@his.com', passwordEncriptada]);
            
        res.send(`
            <h1>Usuario Admin creado</h1>
            <p>Email: admin@his.com</p>
            <p>Pass: 123456</p>
            <a href="/auth/login">Ir al Login</a>
        `);
    } catch (error) {
        res.send("Error: " + error.message);
    }
};