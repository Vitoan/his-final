require('dotenv').config();
const { 
    sequelize, Usuario, Paciente, Habitacion, 
    Cama, Internacion, Evolucion, Visita 
} = require('./src/models');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log("🔥 Reiniciando Base de Datos y Sincronizando Modelos...");
        // force: true borra todo y recrea las tablas con las nuevas columnas
        await sequelize.sync({ force: true });

        const passwordHash = await bcrypt.hash('123456', 10);

        // 1. USUARIOS DEL SISTEMA
        console.log("👤 Creando personal del hospital...");
        const admin = await Usuario.create({ nombre: 'Admin HIS', email: 'admin@his.com', password: passwordHash, rol: 'Admin' });
        const medico = await Usuario.create({ nombre: 'Dr. Gregory House', email: 'medico@his.com', password: passwordHash, rol: 'Medico' });
        const enfermera = await Usuario.create({ nombre: 'Enf. Joy', email: 'enfermera@his.com', password: passwordHash, rol: 'Enfermeria' });

        // 2. INFRAESTRUCTURA (Habitaciones y Camas)
        console.log("🏗️ Configurando infraestructura...");
        
        // Habitación 201: Compartida para probar bloqueo de género (Hombres)
        const h201 = await Habitacion.create({ numero: '201', tipo: 'Compartida' });
        const c2011 = await Cama.create({ numero_cama: 2011, estado: 'Ocupada', habitacion_id: h201.id });
        const c2012 = await Cama.create({ numero_cama: 2012, estado: 'Disponible', habitacion_id: h201.id });

        // Habitación 202: Compartida para probar bloqueo de género (Mujeres)
        const h202 = await Habitacion.create({ numero: '202', tipo: 'Compartida' });
        const c2021 = await Cama.create({ numero_cama: 2021, estado: 'Ocupada', habitacion_id: h202.id });
        const c2022 = await Cama.create({ numero_cama: 2022, estado: 'Disponible', habitacion_id: h202.id });

        // Habitación 301: Individual
        const h301 = await Habitacion.create({ numero: '301', tipo: 'Individual' });
        await Cama.create({ numero_cama: 3011, estado: 'Disponible', habitacion_id: h301.id });

        // 3. PACIENTES YA INTERNADOS
        console.log("🏥 Internando pacientes de prueba...");
        
        const pJuan = await Paciente.create({ 
            nombre: 'Juan', apellido: 'Perez', dni: '11111', sexo: 'M', 
            fecha_nacimiento: '1980-05-15', obra_social: 'OSDE', numero_afiliado: '1-4455-2'
        });
        await Internacion.create({ paciente_id: pJuan.id, cama_id: c2011.id, motivo: 'Control Post-Operatorio', estado: 'Activa' });

        const pAna = await Paciente.create({ 
            nombre: 'Ana', apellido: 'Gomez', dni: '22222', sexo: 'F', 
            fecha_nacimiento: '1992-08-20', obra_social: 'Swiss Medical', numero_afiliado: 'SM-9988'
        });
        await Internacion.create({ paciente_id: pAna.id, cama_id: c2021.id, motivo: 'Observación por Cuadro Febril', estado: 'Activa' });

        // 4. PACIENTES EN MESA DE ENTRADA (GUARDIA)
        console.log("🕒 Creando pacientes en Sala de Espera...");

        // Paciente 1: Esperando ser llamado
        const pPedro = await Paciente.create({ 
            nombre: 'Pedro', apellido: 'Ramirez', dni: '33333', sexo: 'M', 
            fecha_nacimiento: '1975-10-10', telefono: '11-4455-6677'
        });
        await Visita.create({ 
            paciente_id: pPedro.id, motivo: 'Dolor abdominal fuerte', 
            prioridad: 'Media', estado: 'Esperando', tipo_ingreso: 'Guardia' 
        });

        // Paciente 2: Ya siendo atendido (Para probar botón INTERNAR)
        const pLucia = await Paciente.create({ 
            nombre: 'Lucia', apellido: 'Fermin', dni: '44444', sexo: 'F', 
            fecha_nacimiento: '1995-03-12', direccion: 'Av. Siempre Viva 742'
        });
        await Visita.create({ 
            paciente_id: pLucia.id, motivo: 'Fractura de muñeca', 
            prioridad: 'Alta/Emergencia', estado: 'En Atención', tipo_ingreso: 'Guardia' 
        });

        // 5. EVOLUCIONES MÉDICAS
        await Evolucion.create({ 
            internacion_id: 1, tipo: 'Medico', 
            nota: 'Paciente evoluciona favorablemente sin signos de infección.', 
            autor_id: medico.id 
        });

        console.log('---------------------------------------------------------');
        console.log('✅ SEED EXITOSO');
        console.log('📧 Admin: admin@his.com | Pass: 123456');
        console.log('📧 Medico: medico@his.com | Pass: 123456');
        console.log('🚀 Sistema listo para probar.');
        console.log('---------------------------------------------------------');
        
        process.exit(0);
    } catch (e) {
        console.error("❌ ERROR EN EL SEED:", e);
        process.exit(1);
    }
}

seed();