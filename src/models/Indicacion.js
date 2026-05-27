const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Indicacion = sequelize.define('Indicacion', {
    descripcion: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    dosis: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    frecuencia: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: { 
        type: DataTypes.ENUM('Activa', 'Suspendida', 'Finalizada'),
        defaultValue: 'Activa',
        allowNull: false
    },
    fecha_indicacion: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    tableName: 'indicaciones',
    timestamps: true
});

module.exports = Indicacion;
