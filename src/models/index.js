const sequelize = require('../config/database');

// Importar Modelos
const Usuario = require('./Usuario');
const Paciente = require('./Paciente');
const Habitacion = require('./Habitacion');
const Cama = require('./Cama');
const Internacion = require('./Internacion');
const Evolucion = require('./Evolucion');
const Auditoria = require('./Auditoria'); 
const Visita = require('./Visita');

// --- RELACIONES ---

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

// Relación: Una Auditoría pertenece a un Usuario
Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación: Un Paciente tiene muchas Visitas
Paciente.hasMany(Visita, { foreignKey: 'paciente_id' });
// Relación: Una Visita pertenece a un Paciente
Visita.belongsTo(Paciente, { foreignKey: 'paciente_id' });

module.exports = { 
    sequelize, Usuario, Paciente, Habitacion, Cama, Internacion, Evolucion, Auditoria, Visita
};