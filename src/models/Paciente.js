const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('Paciente', {
    es_nn: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: true // Ahora permite null si es NN
    },
    apellido: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    dni: { 
        type: DataTypes.STRING, 
        unique: true,
        allowNull: true // Permite null para evitar choques de DNI en NNs
    },
    fecha_nacimiento: { type: DataTypes.DATEONLY },
    sexo: { type: DataTypes.ENUM('M', 'F', 'X'), defaultValue: 'X' },
    obra_social: { type: DataTypes.STRING },
    numero_afiliado: { type: DataTypes.STRING },
    direccion: { type: DataTypes.STRING, defaultValue: 'No especificada' },
    telefono: { type: DataTypes.STRING, defaultValue: 'No especificado' },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true }
    }
}, { 
    tableName: 'pacientes', 
    timestamps: true,
    // --- VALIDACIÓN INTELIGENTE ---
    validate: {
        validarIdentidadNN() {
            if (!this.es_nn && (!this.dni || !this.nombre || !this.apellido)) {
                throw new Error('Si el paciente NO es de emergencia (NN), el DNI, Nombre y Apellido son obligatorios.');
            }
        }
    }
});

module.exports = Paciente;