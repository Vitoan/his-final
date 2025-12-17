const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: { 
        type: DataTypes.ENUM('Admin', 'Medico', 'Enfermeria', 'Admision'), 
        defaultValue: 'Admision',
        allowNull: false
    }
}, { timestamps: true });

module.exports = Usuario;