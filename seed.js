require('dotenv').config();
const { sequelize, Usuario, Paciente, Habitacion, Cama, Internacion, Evolucion } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log("🔥 Reiniciando Base de Datos...");
        await sequelize.sync({ force: true });

        const passwordHash = await bcrypt.hash('123456', 10);

        // 1. PERSONAL
        await Usuario.create({ nombre: 'Director', email: 'admin@his.com', password: passwordHash, rol: 'Admin' });
        const medico = await Usuario.create({ nombre: 'Dr. House', email: 'medico@his.com', password: passwordHash, rol: 'Medico' });
        const enfermera = await Usuario.create({ nombre: 'Enf. Joy', email: 'enfermera@his.com', password: passwordHash, rol: 'Enfermeria' });

        // 2. ESCENARIO A: Habitación Compartida ocupada por un HOMBRE
        console.log("🏗️ Construyendo Habitación 201 (Hombres)...");
        const h201 = await Habitacion.create({ numero: '201', tipo: 'Compartida' });
        const c201a = await Cama.create({ numero_cama: 2011, estado: 'Ocupada', habitacion_id: h201.id });
        const c201b = await Cama.create({ numero_cama: 2012, estado: 'Disponible', habitacion_id: h201.id }); // <--- PROBAR ASIGNAR MUJER AQUÍ

        // 3. ESCENARIO B: Habitación Compartida ocupada por una MUJER
        console.log("🏗️ Construyendo Habitación 202 (Mujeres)...");
        const h202 = await Habitacion.create({ numero: '202', tipo: 'Compartida' });
        const c202a = await Cama.create({ numero_cama: 2021, estado: 'Ocupada', habitacion_id: h202.id });
        const c202b = await Cama.create({ numero_cama: 2022, estado: 'Disponible', habitacion_id: h202.id }); // <--- PROBAR ASIGNAR HOMBRE AQUÍ

        // 4. ESCENARIO C: Habitación Vacía y Limpieza
        const h300 = await Habitacion.create({ numero: '300', tipo: 'Individual' });
        await Cama.create({ numero_cama: 3001, estado: 'Limpieza', habitacion_id: h300.id });

        // 5. PACIENTES ACTIVOS (Ya internados)
        const pJuan = await Paciente.create({ nombre: 'Juan', apellido: 'Perez', dni: '11111', sexo: 'M', fecha_nacimiento: '1980-01-01' });
        const pAna = await Paciente.create({ nombre: 'Ana', apellido: 'Gomez', dni: '22222', sexo: 'F', fecha_nacimiento: '1985-01-01' });

        // Internamos a Juan en la 201 (Cama A)
        await Internacion.create({ paciente_id: pJuan.id, cama_id: c201a.id, motivo: 'Neumonía', estado: 'Activa' });
        
        // Internamos a Ana en la 202 (Cama A)
        await Internacion.create({ paciente_id: pAna.id, cama_id: c202a.id, motivo: 'Fractura', estado: 'Activa' });

        // 6. PACIENTES EN SALA DE ESPERA (Para que tú pruebes asignar)
        console.log("👥 Creando pacientes en espera...");
        await Paciente.create({ nombre: 'Pedro', apellido: 'Masculino', dni: '88888', sexo: 'M', fecha_nacimiento: '1990-01-01' });
        await Paciente.create({ nombre: 'Lucia', apellido: 'Femenino', dni: '99999', sexo: 'F', fecha_nacimiento: '1992-01-01' });

        // Evoluciones de relleno
        await Evolucion.create({ internacion_id: 1, tipo: 'Medico', nota: 'Paciente estable.', autor_id: medico.id });

        console.log('✅ SEED COMPLETADO. ¡Listo para testear!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seed();