const { Internacion, Paciente, Cama } = require('../models');

// 1. GET: Mostrar formulario para internar (recibe ?cama_id=X)
const renderCreate = async (req, res) => {
    try {
        const { cama_id } = req.query;
        
        // Buscamos la cama y los datos de su habitación
        const cama = await Cama.findByPk(cama_id, {
            include: [{ model: Habitacion }]
        });

        let generoRestringido = null;

        // LÓGICA DE GÉNERO: Si es compartida, vemos quién más está internado ahí
        if (cama.Habitacion.tipo === 'Compartida') {
            const camasEnHabitacion = await Cama.findAll({
                where: { habitacion_id: cama.habitacion_id },
                include: [{
                    model: Internacion,
                    where: { estado: 'Activa' },
                    required: false,
                    include: [{ model: Paciente }]
                }]
            });

            // Recorremos las camas de la habitación a ver si hay alguien internado
            for (let c of camasEnHabitacion) {
                if (c.Internacions && c.Internacions.length > 0) {
                    const sexoOcupante = c.Internacions[0].Paciente.sexo;
                    if (sexoOcupante === 'M' || sexoOcupante === 'F') {
                        generoRestringido = sexoOcupante; // Guardamos el género del ocupante
                        break; 
                    }
                }
            }
        }

        // Filtramos los pacientes: si la habitación es de Hombres, solo traemos Hombres
        let condicionBusqueda = {};
        if (generoRestringido) {
            condicionBusqueda.sexo = generoRestringido;
        }

        const pacientes = await Paciente.findAll({ 
            where: condicionBusqueda,
            order: [['apellido', 'ASC']] 
        });

        res.render('internacion/create', { 
            pacientes, 
            cama, 
            generoRestringido 
        });
    } catch (error) {
        console.error("Error al cargar formulario:", error);
        res.redirect('/habitaciones');
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