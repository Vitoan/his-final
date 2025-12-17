const db = require('../config/db');

exports.listarMapa = async (req, res) => {
    // MAGIA AQUÍ: Hacemos LEFT JOIN con internaciones para obtener el ID de la internación activa
    // Si la cama está ocupada, 'internacion_id' tendrá un número. Si está libre, será NULL.
    const sql = `
        SELECT 
            h.id, 
            h.numero, 
            h.tipo, 
            IFNULL(CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
                'id', c.id,
                'numero', c.numero_cama,
                'estado', c.estado,
                'internacion_id', i.id  -- <--- ESTO ES LO NUEVO
            )), ']'), '[]') as camas
        FROM habitaciones h
        LEFT JOIN camas c ON h.id = c.habitacion_id
        LEFT JOIN internaciones i ON c.id = i.cama_id AND i.estado = 'Activa' -- Solo internaciones activas
        GROUP BY h.id, h.numero, h.tipo
        ORDER BY h.numero ASC
    `;

    try {
        const resultados = await db.query(sql);

        const habitaciones = resultados.map(hab => {
            return {
                ...hab,
                camas: JSON.parse(hab.camas)
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