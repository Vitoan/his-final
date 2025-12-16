const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexiones (Más eficiente que abrir/cerrar conexiones)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función helper para no repetir try/catch en todos lados (DRY)
const query = async (sql, params) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error("Error SQL:", error.message);
        throw error;
    }
};

module.exports = { query };