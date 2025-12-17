require('dotenv').config();
const { sequelize, Usuario, Paciente, Habitacion, Cama, Internacion, Evolucion } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        // FORCE: TRUE -> Borra todo y aplica los cambios de modelo (Estado Limpieza)
        await sequelize.sync({ force: true });
        console.log('✅ Base de datos recreada con nueva estructura.');

        const passwordHash = await bcrypt.hash('123456', 10);

        // 1. PERSONAL
        const medico = await Usuario.create({ nombre: 'Dr. House', email: 'medico@his.com', password: passwordHash, rol: 'Medico' });
        const enfermera = await Usuario.create({ nombre: 'Enf. Joy', email: 'enfermera@his.com', password: passwordHash, rol: 'Enfermeria' });
        const admin = await Usuario.create({ nombre: 'Admin', email: 'admin@his.com', password: passwordHash, rol: 'Admin' });

        // 2. INFRAESTRUCTURA
        // Habitación 101: Ocupada (Prueba de Visibilidad Medico/Enfermera)
        const h1 = await Habitacion.create({ numero: '101', tipo: 'Individual' });
        const c1 = await Cama.create({ numero_cama: 101, estado: 'Ocupada', habitacion_id: h1.id });

        // Habitación 102: En Limpieza (Prueba de Ciclo de Limpieza)
        const h2 = await Habitacion.create({ numero: '102', tipo: 'Individual' });
        const c2 = await Cama.create({ numero_cama: 102, estado: 'Limpieza', habitacion_id: h2.id });

        // 3. PACIENTES
        const paciente = await Paciente.create({ nombre: 'Lionel', apellido: 'Messi', dni: '101010', fecha_nacimiento: '1987-06-24', sexo: 'M' });

        // 4. INTERNACIÓN
        const internacion = await Internacion.create({
            paciente_id: paciente.id,
            cama_id: c1.id,
            motivo: 'Chequeo General',
            estado: 'Activa'
        });

        // 5. HISTORIA CLÍNICA (Datos cruzados)
        // Nota de Enfermería (Signos Vitales)
        await Evolucion.create({
            internacion_id: internacion.id,
            tipo: 'Enfermeria',
            nota: 'Paciente ingresa con presión 120/80. Temp 36.5.',
            autor_id: enfermera.id
        });

        // Nota de Médico (Diagnóstico)
        await Evolucion.create({
            internacion_id: internacion.id,
            tipo: 'Medico',
            nota: 'Se observa buen estado general. Solicito hemograma.',
            autor_id: medico.id
        });

        console.log('🚀 SEED COMPLETADO. Usuario médico: medico@his.com (123456)');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seed();