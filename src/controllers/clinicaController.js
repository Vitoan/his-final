const { Internacion, Paciente, Cama, Habitacion, Evolucion, Usuario } = require('../models');

// Dashboard (Tablero General)
exports.dashboard = async (req, res) => {
    try {
        const internaciones = await Internacion.findAll({
            where: { estado: 'Activa' },
            include: [
                { model: Paciente },
                { 
                    model: Cama, 
                    include: [{ model: Habitacion }] 
                },
                { 
                    model: Evolucion, 
                    limit: 1, 
                    order: [['createdAt', 'DESC']],
                    include: [{ model: Usuario, as: 'Autor' }] 
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        res.render('clinical/dashboard', {
            title: 'Tablero Clínico General',
            pacientes: internaciones,
            usuario: req.session.usuario
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error cargando el dashboard clínico');
    }
};

// Ver Historial Completo (Aquí aplicamos la lógica de "Vida Real")
exports.verHistorialCompleto = async (req, res) => {
    const { idInternacion } = req.params;
    const rolUsuario = req.session.usuario.rol;

    // --- LÓGICA DE VISIBILIDAD ---
    let filtroEvoluciones = {}; // Por defecto: VER TODO (Para Medicos y Admins)

    // Solo si es Enfermera restringimos la vista (Opcional)
    if (rolUsuario === 'Enfermeria') {
        filtroEvoluciones = { tipo: 'Enfermeria' }; 
    }

    try {
        const internacion = await Internacion.findByPk(idInternacion, {
            include: [
                { model: Paciente },
                { model: Cama, include: [{ model: Habitacion }] },
                { 
                    model: Evolucion, 
                    where: filtroEvoluciones, // Aplicamos el filtro (o vacío si es médico)
                    required: false, // Importante: Traer paciente aunque no tenga notas
                    include: [{ model: Usuario, as: 'Autor' }] 
                }
            ],
            order: [[Evolucion, 'createdAt', 'DESC']]
        });

        if (!internacion) {
            return res.redirect('/clinica/dashboard');
        }

        res.render('clinical/detalle', { internacion });
        
    } catch (error) {
        console.error(error);
        res.redirect('/clinica/dashboard');
    }
};