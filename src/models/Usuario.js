const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: { 
        type: DataTypes.ENUM('Admin', 'Medico', 'Enfermera', 'Admision'), 
        defaultValue: 'Admision' 
    }
});

module.exports = Usuario;