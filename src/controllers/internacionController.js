const { Internacion, Paciente, Cama } = require('../models');

// 1. GET: Mostrar formulario para internar (recibe ?cama_id=X)
const renderCreate = async (req, res) => {
    try {
        const { cama_id } = req.query;
        
        // Traemos todos los pacientes para poder elegirlos en un desplegable
        const pacientes = await Paciente.findAll({ order: [['apellido', 'ASC']] });
        const cama = await Cama.findByPk(cama_id);

        res.render('internacion/create', { pacientes, cama });
    } catch (error) {
        console.error("Error al cargar formulario de internación:", error);
        res.redirect('/habitaciones'); // Si falla, volvemos al mapa
    }
};

// 2. POST: Guardar la nueva internación
const create = async (req, res) => {
    try {
        const { cama_id, paciente_id, origen, motivo, prioridad_triage } = req.body;

        // Creamos la internación
        // ¡MAGIA! Gracias a nuestro Hook en el modelo Internacion, al crear esto, 
        // la cama pasará automáticamente a estado "Ocupada".
        await Internacion.create({
            cama_id,
            paciente_id,
            origen,
            motivo,
            prioridad_triage,
            estado: 'Activa'
        });

        res.redirect('/habitaciones');
    } catch (error) {
        console.error("Error al internar paciente:", error);
        res.redirect('/habitaciones');
    }
};

// 3. GET: Mostrar formulario de Alta Médica
const mostrarFormularioAlta = async (req, res) => {
    try {
        const internacion = await Internacion.findByPk(req.params.id, {
            include: [{ model: Paciente }]
        });

        if (!internacion) {
            return res.redirect('/habitaciones');
        }

        res.render('internacion/alta', { internacion });
    } catch (error) {
        console.error("Error al cargar formulario de alta:", error);
        res.redirect('/habitaciones');
    }
};

// 4. POST: Procesar el Alta Médica
const darAlta = async (req, res) => {
    try {
        const { estado_alta, resumen_epicrisis } = req.body;

        const internacion = await Internacion.findByPk(req.params.id);

        if (internacion) {
            // Actualizamos el episodio
            // ¡MAGIA 2! Gracias a nuestro Hook, al cambiar a un estado de Alta,
            // la cama pasará automáticamente a estado "Limpieza".
            await internacion.update({
                estado: estado_alta, // 'Alta_Medica', 'Traslado' o 'Defuncion'
                resumen_epicrisis: resumen_epicrisis,
                fecha_egreso: new Date()
            });
        }

        res.redirect('/habitaciones');
    } catch (error) {
        console.error("Error al dar de alta:", error);
        res.redirect('/habitaciones');
    }
};

// Exportamos todas las funciones para que el router de Express no tire el TypeError
module.exports = {
    renderCreate,
    create,
    mostrarFormularioAlta,
    darAlta
};