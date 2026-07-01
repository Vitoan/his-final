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
        // Ej: 'Laboratorio', 'Radiografía', 'Ecografía', 'Tomografía'
    },
    descripcion: { 
        type: DataTypes.TEXT, 
        allowNull: false 
        // Ej: 'Hemograma completo', 'Placa de tórax frente y perfil'
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
});

module.exports = Estudio;