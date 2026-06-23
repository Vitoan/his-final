const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ObraSocial = sequelize.define('ObraSocial', {
    nombre: { 
        type: DataTypes.STRING(100), 
        allowNull: false, 
        unique: true 
    },
    descripcion: { 
        type: DataTypes.TEXT,
        allowNull: true 
    },
    activo: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, { 
    tableName: 'obras_sociales',
    timestamps: true 
});

module.exports = ObraSocial;