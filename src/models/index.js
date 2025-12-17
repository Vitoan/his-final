const sequelize = require('../config/database');
const Paciente = require('./Paciente');
const Cama = require('./Cama');
const Internacion = require('./Internacion');
const Habitacion = require('./Habitacion'); // (Asumiendo que lo crearemos)
const Evolucion = require('./Evolucion');   // (Para las notas médicas)

// Definir Relaciones (Esto permite hacer los "JOINS" automáticos)
// Un Paciente tiene muchas internaciones (historial)
Paciente.hasMany(Internacion, { foreignKey: 'paciente_id' });
Internacion.belongsTo(Paciente, { foreignKey: 'paciente_id' });

// Una Internación ocupa una Cama
Cama.hasMany(Internacion, { foreignKey: 'cama_id' });
Internacion.belongsTo(Cama, { foreignKey: 'cama_id' });

// Una Cama está en una Habitación
Habitacion.hasMany(Cama, { foreignKey: 'habitacion_id' });
Cama.belongsTo(Habitacion, { foreignKey: 'habitacion_id' });

// Una Internación tiene muchas Evoluciones (Notas médicas)
Internacion.hasMany(Evolucion, { foreignKey: 'internacion_id' });
Evolucion.belongsTo(Internacion, { foreignKey: 'internacion_id' });

module.exports = { sequelize, Paciente, Cama, Internacion, Habitacion, Evolucion };