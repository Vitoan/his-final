const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdministracionMedicamento = sequelize.define('AdministracionMedicamento', {
    dosis_aplicada: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    observaciones: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    fecha_administracion: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    tableName: 'administraciones_medicamentos',
    timestamps: true
});

module.exports = AdministracionMedicamento;
