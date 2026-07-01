const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turno = sequelize.define('Turno', {
    fecha: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    hora: { 
        type: DataTypes.TIME, 
        allowNull: false 
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Medicina General'
    },
    motivo: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    estado: { 
        type: DataTypes.ENUM('Programado', 'Asistió', 'Cancelado'), 
        defaultValue: 'Programado' 
    }
}, {
    tableName: 'turnos',
    timestamps: true
});

module.exports = Turno;
