const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('Paciente', {
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    apellido: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    dni: { 
        type: DataTypes.STRING, 
        unique: true,
        allowNull: false
    },
    fecha_nacimiento: { 
        type: DataTypes.DATEONLY 
    },
    sexo: { 
        type: DataTypes.ENUM('M', 'F', 'X'),
        defaultValue: 'X'
    },
    obra_social: { 
        type: DataTypes.STRING 
    },
    numero_afiliado: { // Agregamos este campo que usas en la vista
        type: DataTypes.STRING
    },
    // --- NUEVOS CAMPOS DE CONTACTO ---
    direccion: {
        type: DataTypes.STRING,
        defaultValue: 'No especificada'
    },
    telefono: {
        type: DataTypes.STRING,
        defaultValue: 'No especificado'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true 
        }
    }
}, { 
    tableName: 'pacientes', 
    timestamps: true 
});

module.exports = Paciente;