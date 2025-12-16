const db = require('../config/db');

exports.listarMapa = async (req, res) => {
    // CORRECCIÓN: Quitamos el CAST(... AS JSON) para compatibilidad con MariaDB/XAMPP
    // Usamos IFNULL para que si una habitación no tiene camas, devuelva "[]" en lugar de null
    const sql = `
        SELECT 
            h.id, 
            h.numero, 
            h.tipo, 
            IFNULL(CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
                'id', c.id,
                'numero', c.numero_cama,
                'estado', c.estado
            )), ']'), '[]') as camas
        FROM habitaciones h
        LEFT JOIN camas c ON h.id = c.habitacion_id
        GROUP BY h.id, h.numero, h.tipo
        ORDER BY h.numero ASC
    `;

    try {
        const resultados = await db.query(sql);

        // PROCESAMIENTO JS: Como MySQL/MariaDB devuelve un string, lo convertimos a JSON aquí
        const habitaciones = resultados.map(hab => {
            return {
                ...hab,
                camas: JSON.parse(hab.camas) // Convertimos el texto a Objeto JS real
            };
        });

        res.render('rooms/index', { 
            title: 'Mapa de Camas', 
            habitaciones: habitaciones 
        });

    } catch (error) {
        console.error("Error cargando mapa:", error);
        res.render('rooms/index', { 
            title: 'Mapa de Camas', 
            habitaciones: [], 
            error: 'No se pudo cargar el mapa del hospital.' 
        });
    }
};