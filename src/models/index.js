const sequelize = require('../config/database');

// Importar Modelos
const Usuario = require('./Usuario');
const Paciente = require('./Paciente');
const Ala = require('./Ala');
const Habitacion = require('./Habitacion');
const Cama = require('./Cama');
const Internacion = require('./Internacion');
const Evolucion = require('./Evolucion');
const Auditoria = require('./Auditoria'); 
const Visita = require('./Visita');
const SignosVitales = require('./SignosVitales');
const Turno = require('./turno');
const Estudio = require('./estudio');

// --- RELACIONES ---
Ala.hasMany(Habitacion, { foreignKey: 'ala_id' });
Habitacion.belongsTo(Ala, { foreignKey: 'ala_id' });

// Relación con Internación (Un episodio tiene muchos signos vitales)
Internacion.hasMany(SignosVitales, { foreignKey: 'internacion_id' });
SignosVitales.belongsTo(Internacion, { foreignKey: 'internacion_id' });

// Relación con Usuario (Sabemos qué enfermero/a tomó los signos)
Usuario.hasMany(SignosVitales, { foreignKey: 'enfermero_id' });
SignosVitales.belongsTo(Usuario, { as: 'Enfermero', foreignKey: 'enfermero_id' });

// 1. Ubicación (Habitación -> Cama)
Habitacion.hasMany(Cama, { foreignKey: 'habitacion_id' });
Cama.belongsTo(Habitacion, { foreignKey: 'habitacion_id' });

// 2. Internación (Paciente + Cama)
Paciente.hasMany(Internacion, { foreignKey: 'paciente_id' });
Internacion.belongsTo(Paciente, { foreignKey: 'paciente_id' });

Cama.hasMany(Internacion, { foreignKey: 'cama_id' });
Internacion.belongsTo(Cama, { foreignKey: 'cama_id' });

// 3. Evoluciones (Internación + Usuario que escribió)
Internacion.hasMany(Evolucion, { foreignKey: 'internacion_id' });
Evolucion.belongsTo(Internacion, { foreignKey: 'internacion_id' });

Usuario.hasMany(Evolucion, { foreignKey: 'autor_id' });
Evolucion.belongsTo(Usuario, { as: 'Autor', foreignKey: 'autor_id' });

// Relación: Un Usuario genera muchas Auditorías
Usuario.hasMany(Auditoria, { foreignKey: 'usuario_id' });
Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación: Un Paciente tiene muchas Visitas
Paciente.hasMany(Visita, { foreignKey: 'paciente_id' });
Visita.belongsTo(Paciente, { foreignKey: 'paciente_id' });


// --- 2. NUEVAS RELACIONES DE TURNOS ---
// Un paciente tiene muchos turnos
Paciente.hasMany(Turno, { foreignKey: 'paciente_id' });
Turno.belongsTo(Paciente, { foreignKey: 'paciente_id' });

// Un médico (Usuario) tiene muchos turnos asignados
Usuario.hasMany(Turno, { foreignKey: 'medico_id' });
Turno.belongsTo(Usuario, { as: 'Medico', foreignKey: 'medico_id' });

// --- 3. NUEVAS RELACIONES DE ESTUDIOS ---
// Un paciente tiene muchos estudios
Paciente.hasMany(Estudio, { foreignKey: 'paciente_id' });
Estudio.belongsTo(Paciente, { foreignKey: 'paciente_id' });

// Un médico solicita muchos estudios
Usuario.hasMany(Estudio, { foreignKey: 'medico_id' });
Estudio.belongsTo(Usuario, { as: 'Medico', foreignKey: 'medico_id' });

// Un estudio puede estar asociado a una internación específica (Opcional)
Internacion.hasMany(Estudio, { foreignKey: 'internacion_id' });
Estudio.belongsTo(Internacion, { foreignKey: 'internacion_id' });
// Relación: Un Usuario puede ser un Paciente (Portal del Paciente)
Paciente.hasOne(Usuario, { foreignKey: 'paciente_id' });
Usuario.belongsTo(Paciente, { foreignKey: 'paciente_id' });

// 3. EXPORTAMOS TODO (Agregamos Turno al final)
module.exports = { 
    sequelize, Usuario, Paciente, Ala, Habitacion, Cama, Internacion, Evolucion, Auditoria, Visita, SignosVitales, Turno, Estudio
};