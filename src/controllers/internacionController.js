const { Internacion, Paciente, Cama, Habitacion } = require('../models');
// 1. GET: Mostrar formulario para internar
const renderCreate = async (req, res) => {
    try {
        const { cama_id, error } = req.query; // Capturamos si viene un error del POST
        
        const cama = await Cama.findByPk(cama_id, {
            include: [{ model: Habitacion }]
        });

        let generoRestringido = null;

        // FIX 1: Convertimos a minúscula para evitar errores tipográficos
        const tipoHab = cama.Habitacion && cama.Habitacion.tipo ? cama.Habitacion.tipo.toLowerCase() : '';

        // Si la palabra contiene "compartida"...
        if (tipoHab.includes('compartida')) {
            // FIX 2: Usamos cama.Habitacion.id que es 100% seguro que existe
            const camasEnHabitacion = await Cama.findAll({
                where: { habitacion_id: cama.Habitacion.id },
                include: [{
                    model: Internacion,
                    where: { estado: 'Activa' },
                    required: false,
                    include: [{ model: Paciente }]
                }]
            });

            for (let c of camasEnHabitacion) {
                if (c.Internacions && c.Internacions.length > 0 && c.Internacions[0].Paciente) {
                    const sexoOcupante = c.Internacions[0].Paciente.sexo;
                    if (sexoOcupante && sexoOcupante !== 'X') {
                        generoRestringido = sexoOcupante; 
                        console.log("🔒 [CANDADO FRONT] Habitación restringida a sexo:", generoRestringido);
                        break; 
                    }
                }
            }
        }

        // Filtramos la lista
        let condicionBusqueda = {};
        if (generoRestringido) {
            const genStr = String(generoRestringido).toUpperCase();
            if (genStr === 'M' || genStr === 'MASCULINO') {
                condicionBusqueda.sexo = ['M', 'Masculino', 'MASCULINO', 'm', 'masculino'];
            } else if (genStr === 'F' || genStr === 'FEMENINO') {
                condicionBusqueda.sexo = ['F', 'Femenino', 'FEMENINO', 'f', 'femenino'];
            } else {
                condicionBusqueda.sexo = generoRestringido;
            }
        }

        const pacientes = await Paciente.findAll({ 
            where: condicionBusqueda,
            order: [['apellido', 'ASC']] 
        });

        res.render('internacion/create', { 
            pacientes, 
            cama, 
            generoRestringido,
            error // Le pasamos el error a la vista por si falló el POST
        });
    } catch (err) {
        console.error("Error al cargar formulario:", err);
        res.redirect('/habitaciones');
    }
};

// 2. POST: Guardar la nueva internación (CON VALIDACIÓN ESTRICTA)
const create = async (req, res) => {
    try {
        const { cama_id, paciente_id, origen, motivo, prioridad_triage } = req.body;

        // Traemos la cama destino y al paciente que queremos internar
        const camaDestino = await Cama.findByPk(cama_id, { include: [Habitacion] });
        const pacienteNuevo = await Paciente.findByPk(paciente_id);

        const tipoHab = camaDestino.Habitacion && camaDestino.Habitacion.tipo ? camaDestino.Habitacion.tipo.toLowerCase() : '';

        // CANDADO BACKEND: Verificamos justo antes de guardar en la Base de Datos
        if (tipoHab.includes('compartida')) {
            const camasMismaHab = await Cama.findAll({
                where: { habitacion_id: camaDestino.Habitacion.id },
                include: [{
                    model: Internacion, where: { estado: 'Activa' }, required: false,
                    include: [{ model: Paciente }]
                }]
            });

            for (let c of camasMismaHab) {
                if (c.Internacions && c.Internacions.length > 0 && c.Internacions[0].Paciente) {
                    const sexoOcupante = c.Internacions[0].Paciente.sexo;
                    // Si ya hay alguien, verificamos que las primeras letras coincidan (M con M, F con F)
                    if (sexoOcupante && sexoOcupante !== 'X' && pacienteNuevo.sexo !== 'X') {
                        const letOcupante = String(sexoOcupante).toUpperCase().charAt(0);
                        const letNuevo = String(pacienteNuevo.sexo).toUpperCase().charAt(0);
                        
                        if (letOcupante !== letNuevo) {
                            console.log(`🚨 [ALERTA SEGURIDAD] Intento de internar ${letNuevo} en habitación de ${letOcupante}`);
                            // RECHAZADO: Lo devolvemos al formulario con un mensaje de error
                            return res.redirect(`/internacion/nuevo?cama_id=${cama_id}&error=Genero_Incompatible`);
                        }
                    }
                }
            }
        }

        // Si pasó las pruebas de seguridad, lo internamos
        await Internacion.create({
            cama_id, paciente_id, origen, motivo, prioridad_triage, estado: 'Activa'
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