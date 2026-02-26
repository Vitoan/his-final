const { Turno, Paciente, Usuario } = require('../models');
const { Op } = require('sequelize');

// 1. Listar todos los turnos (Agenda)
exports.listarTurnos = async (req, res) => {
    try {
        const turnos = await Turno.findAll({
            include: [
                { model: Paciente },
                { model: Usuario, as: 'Medico' }
            ],
            order: [['fecha', 'ASC'], ['hora', 'ASC']]
        });
        
        res.render('turnos/index', { title: 'Agenda de Turnos', turnos });
    } catch (error) {
        console.error("Error al listar turnos:", error);
        res.redirect('/');
    }
};

// 2. Mostrar formulario para agendar un nuevo turno
exports.renderCrearTurno = async (req, res) => {
    try {
        // Buscamos todos los pacientes para el desplegable
        const pacientes = await Paciente.findAll({ order: [['apellido', 'ASC']] });
        
        // Buscamos a los usuarios que sean Médicos (asumiendo que tienes un campo 'rol')
        // Si tu campo de rol se llama distinto, avísame.
        const medicos = await Usuario.findAll({ 
            where: { rol: 'Medico' },
            order: [['nombre', 'ASC']] 
        });

        res.render('turnos/create', { title: 'Agendar Turno', pacientes, medicos });
    } catch (error) {
        console.error("Error al cargar formulario de turnos:", error);
        res.redirect('/turnos');
    }
};

// 3. Guardar el nuevo turno en la base de datos
exports.crearTurno = async (req, res) => {
    try {
        const { paciente_id, medico_id, fecha, hora, especialidad, motivo } = req.body;
        
        await Turno.create({
            paciente_id,
            medico_id,
            fecha,
            hora,
            especialidad,
            motivo,
            estado: 'Programado'
        });

        res.redirect('/turnos');
    } catch (error) {
        console.error("Error al crear turno:", error);
        res.redirect('/turnos/nuevo?error=true');
    }
};

// 4. Cambiar estado del turno (Asistió / Cancelado)
exports.cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // Recibirá 'Asistió' o 'Cancelado'

        await Turno.update({ estado }, { where: { id } });
        res.redirect('/turnos');
    } catch (error) {
        console.error("Error al actualizar turno:", error);
        res.redirect('/turnos');
    }
};