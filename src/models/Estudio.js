const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estudio = sequelize.define('Estudio', {
    fecha_solicitud: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    tipo_estudio: { 
        type: DataTypes.STRING, 
        allowNull: false
    },
    descripcion: { 
        type: DataTypes.TEXT, 
        allowNull: false
    },
    estado: { 
        type: DataTypes.ENUM('Pendiente', 'Realizado', 'Cancelado'), 
        defaultValue: 'Pendiente' 
    },
    resultado: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    fecha_realizacion: { 
        type: DataTypes.DATE, 
        allowNull: true 
    }
}, {
    tableName: 'estudios',
    timestamps: true
});

module.exports = Estudio;
