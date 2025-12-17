const sequelize = require('../config/database');

// Importar Modelos
const Usuario = require('./Usuario');
const Paciente = require('./Paciente');
const Habitacion = require('./Habitacion');
const Cama = require('./Cama');
const Internacion = require('./Internacion');
const Evolucion = require('./Evolucion');
const Auditoria = require('./Auditoria'); // (Si ya creaste el de auditoría)

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

// Sincronización automática (Crea tablas si no existen)
// OJO: 'alter: true' intenta ajustar las tablas sin borrar datos, pero haz backup siempre.
sequelize.sync({ alter: true }).then(() => {
    console.log("✅ Base de datos sincronizada con Sequelize");
}).catch(err => {
    console.error("❌ Error al sincronizar BD:", err);
});

module.exports = { 
    sequelize, Usuario, Paciente, Habitacion, Cama, Internacion, Evolucion, Auditoria 
};