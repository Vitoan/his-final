const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ala = sequelize.define('Ala', {
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true // Ej: 'Guardia', 'Terapia Intensiva', 'Pediatría'
    },
    descripcion: { 
        type: DataTypes.STRING 
    }
}, { 
    tableName: 'alas',
    timestamps: false 
});

module.exports = Ala;