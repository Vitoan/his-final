const { 
    sequelize, 
    Ala, 
    Habitacion, 
    Cama, 
    Usuario, 
    Paciente, 
    Internacion, 
    Evolucion, 
    SignosVitales, 
    Indicacion, 
    AdministracionMedicamento, 
    Visita, 
    Turno, 
    Estudio,
    Auditoria,
    ObraSocial,
    Admision
} = require('./src/models');
const bcrypt = require('bcryptjs');

async function poblarHospitalCompleto() {
    try {
        console.log("⏳ Conectando a la base de datos y limpiando tablas existentes...");
        
        // Deshabilitamos temporalmente las restricciones de clave foránea en MySQL
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        // Forzamos la recreación de las tablas para garantizar un entorno limpio
        await sequelize.sync({ force: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
        console.log("🗑️ Tablas limpiadas e inicializadas con éxito.");

        // 1. Encriptar contraseña común para desarrollo ('123456')
        console.log("🔑 Generando contraseñas seguras para los usuarios...");
        const passwordHash = await bcrypt.hash('123456', 10);

        // 2. Crear Obras Sociales
        console.log("🏥 Creando Obras Sociales...");
        const osde = await ObraSocial.create({ nombre: 'OSDE', descripcion: 'Prepaga OSDE' });
        const swiss = await ObraSocial.create({ nombre: 'Swiss Medical', descripcion: 'Prepaga Swiss Medical' });
        const apross = await ObraSocial.create({ nombre: 'APROSS', descripcion: 'Obra Social de la Provincia de Córdoba' });
        const pami = await ObraSocial.create({ nombre: 'PAMI', descripcion: 'Obra Social de Jubilados' });

        // 3. Crear Usuarios del Personal del Hospital
        console.log("👥 Creando usuarios del personal médico y administrativo...");
        const admin = await Usuario.create({
            nombre: 'Administrador',
            apellido: 'General',
            email: 'admin@his.com',
            password: passwordHash,
            rol: 'Admin'
        });

        const medico1 = await Usuario.create({
            nombre: 'Gregory',
            apellido: 'House',
            email: 'medico@his.com',
            password: passwordHash,
            rol: 'Medico'
        });

        const medico2 = await Usuario.create({
            nombre: 'Lisa',
            apellido: 'Cuddy',
            email: 'cuddy@his.com',
            password: passwordHash,
            rol: 'Medico'
        });

        const enfermera1 = await Usuario.create({
            nombre: 'Joy',
            apellido: 'Nurse',
            email: 'enfermera@his.com',
            password: passwordHash,
            rol: 'Enfermeria'
        });

        const admisionista = await Usuario.create({
            nombre: 'Recepción',
            apellido: 'Mesa',
            email: 'admision@his.com',
            password: passwordHash,
            rol: 'Admision'
        });

        // 4. Crear Estructura Hospitalaria (Alas, Habitaciones, Camas)
        console.log("🏗️ Construyendo Alas y Especialidades...");
        const alaGuardia = await Ala.create({ nombre: 'Guardia y Emergencias', descripcion: 'Atención rápida, Shockroom y triaje' });
        const alaTerapia = await Ala.create({ nombre: 'Terapia Intensiva (UTI)', descripcion: 'Cuidados críticos y monitoreo continuo' });
        const alaComun = await Ala.create({ nombre: 'Internación General', descripcion: 'Recuperación clínica y observación general' });

        console.log("🚪 Instalando Habitaciones...");
        const habShock = await Habitacion.create({ numero: 'SHOCK-1', tipo: 'Shockroom', ala_id: alaGuardia.id });
        const habUti1 = await Habitacion.create({ numero: 'UTI-101', tipo: 'Individual', ala_id: alaTerapia.id });
        const habUti2 = await Habitacion.create({ numero: 'UTI-102', tipo: 'Individual', ala_id: alaTerapia.id });
        const habComun201 = await Habitacion.create({ numero: '201', tipo: 'Compartida', ala_id: alaComun.id });
        const habComun202 = await Habitacion.create({ numero: '202', tipo: 'Compartida', ala_id: alaComun.id });

        console.log("🛏️ Distribuyendo Camas por Habitación...");
        const camaShock1 = await Cama.create({ numero_cama: 10, estado: 'Disponible', habitacion_id: habShock.id });
        const camaShock2 = await Cama.create({ numero_cama: 11, estado: 'Disponible', habitacion_id: habShock.id });
        const camaTerapia1 = await Cama.create({ numero_cama: 101, estado: 'Disponible', habitacion_id: habUti1.id });
        const camaTerapia2 = await Cama.create({ numero_cama: 102, estado: 'Disponible', habitacion_id: habUti2.id });
        const camaComun201_1 = await Cama.create({ numero_cama: 2011, estado: 'Disponible', habitacion_id: habComun201.id });
        const camaComun201_2 = await Cama.create({ numero_cama: 2012, estado: 'Disponible', habitacion_id: habComun201.id });
        const camaComun202_1 = await Cama.create({ numero_cama: 2021, estado: 'Disponible', habitacion_id: habComun202.id });
        const camaComun202_2 = await Cama.create({ numero_cama: 2022, estado: 'Disponible', habitacion_id: habComun202.id });

        // 5. Crear Pacientes de Prueba
        console.log("📂 Cargando historial de pacientes en el padrón...");
        
        // Paciente 1: Hombre con Obra Social - Internado en Cama 2011 (Habitación 201)
        const paciente1 = await Paciente.create({
            nombre: 'Juan Carlos',
            apellido: 'Pérez',
            dni: '20123456',
            es_nn: false,
            fecha_nacimiento: '1975-04-12',
            sexo: 'M',
            obra_social_id: osde.id,
            numero_afiliado: '1-44552-3',
            direccion: 'Av. Colón 1234, Córdoba',
            telefono: '3514445555',
            email: 'juan.perez@email.com',
            alergias: 'Penicilina, Aspirina',
            antecedentes: 'Hipertensión Arterial, Ex-fumador',
            medicamentos_actuales: 'Enalapril 10mg diario',
            contacto_emergencia_nombre: 'María Pérez (Esposa)',
            contacto_emergencia_telefono: '3514445556'
        });

        // Paciente 2: Hombre Particular - Internado en Cama 2012 (Habitación 201 - compartiendo con Paciente 1)
        const paciente2 = await Paciente.create({
            nombre: 'Roberto',
            apellido: 'Benítez',
            dni: '18765432',
            es_nn: false,
            fecha_nacimiento: '1968-11-25',
            sexo: 'M',
            obra_social_id: null,
            numero_afiliado: null,
            direccion: 'La Rioja 720, Córdoba',
            telefono: '3513029182',
            email: 'roberto.benitez@email.com',
            alergias: 'Ninguna conocida',
            antecedentes: 'Dislipemia, Sedentarismo',
            medicamentos_actuales: 'Atorvastatina 10mg noche',
            contacto_emergencia_nombre: 'Lucía Benítez (Hija)',
            contacto_emergencia_telefono: '3519876543'
        });

        // Paciente 3: Mujer con Obra Social
        const paciente3 = await Paciente.create({
            nombre: 'Ana María',
            apellido: 'Gómez',
            dni: '28987654',
            es_nn: false,
            fecha_nacimiento: '1982-08-20',
            sexo: 'F',
            obra_social_id: swiss.id,
            numero_afiliado: 'SM-9988-1',
            direccion: 'Chacabuco 450, Córdoba',
            telefono: '3516112233',
            email: 'ana.gomez@email.com',
            alergias: 'Sulfas',
            antecedentes: 'Diabetes Gestacional en 2018',
            medicamentos_actuales: 'Metformina 850mg con cena',
            contacto_emergencia_nombre: 'Roberto Gómez (Padre)',
            contacto_emergencia_telefono: '3516990099'
        });

        // Paciente 4: Paciente de Emergencia NN
        const pacienteNN = await Paciente.create({
            nombre: 'Emergencia',
            apellido: 'NN-Triage-Rojo',
            dni: null,
            es_nn: true,
            sexo: 'X',
            obra_social_id: null,
            direccion: 'Traído por ambulancia 107',
            telefono: 'No disponible',
            alergias: 'Desconocido',
            antecedentes: 'Paciente inconsciente traído de la vía pública por traumatismo craneoencefálico'
        });

        // 6. Crear Cuentas de Portal para los Pacientes identificados
        console.log("💻 Creando accesos de Portal de Salud para los pacientes...");
        const pacientesIdentificados = [paciente1, paciente2, paciente3];
        for (const p of pacientesIdentificados) {
            await Usuario.create({
                nombre: p.nombre,
                apellido: p.apellido,
                email: p.email,
                password: passwordHash,
                rol: 'Paciente',
                paciente_id: p.id
            });
        }

        // 7. Crear Internaciones Activas y simular Flujo Clínico
        console.log("🏥 Asignando internaciones y simulando flujo clínico...");

        // Internación 1: Paciente 1 (Juan Carlos) en Cama Comun 201_1 (Habitación 201)
        const int1 = await Internacion.create({
            paciente_id: paciente1.id,
            cama_id: camaComun201_1.id,
            origen: 'Guardia',
            prioridad_triage: 'Amarillo',
            motivo: 'Dolor precordial típico opresivo de 2 horas de evolución asociado a diaforesis.',
            estado: 'Activa',
            fecha_ingreso: new Date(new Date().setDate(new Date().getDate() - 2)) // Ingresó hace 2 días
        });
        // Actualizamos estado de cama a Ocupada
        await camaComun201_1.update({ estado: 'Ocupada' });

        // Internación 2: Paciente 2 (Roberto) en Cama Comun 201_2 (Habitación 201)
        const int2 = await Internacion.create({
            paciente_id: paciente2.id,
            cama_id: camaComun201_2.id,
            origen: 'Consultorio Externo',
            prioridad_triage: 'Amarillo',
            motivo: 'Postoperatorio de hernioplastía inguinal izquierda.',
            estado: 'Activa',
            fecha_ingreso: new Date(new Date().setDate(new Date().getDate() - 1)) // Ingresó hace 1 día
        });
        await camaComun201_2.update({ estado: 'Ocupada' });

        // Internación 3: Paciente NN en Cama Terapia 101 (Habitación UTI-101)
        const intNN = await Internacion.create({
            paciente_id: pacienteNN.id,
            cama_id: camaTerapia1.id,
            origen: 'Guardia',
            prioridad_triage: 'Rojo',
            motivo: 'Ingreso rápido de emergencia por accidente en vía pública.',
            estado: 'Activa',
            fecha_ingreso: new Date()
        });
        await camaTerapia1.update({ estado: 'Ocupada' });

        // 8. Cargar Controles Clínicos Estructurados (Signos Vitales y Evoluciones)
        console.log("📈 Cargando signos vitales y notas de evolución de prueba...");

        // Paciente 1 (Juan Carlos Pérez)
        await SignosVitales.create({
            presion_arterial: '150/95',
            frecuencia_cardiaca: 98,
            frecuencia_respiratoria: 20,
            temperatura: 36.6,
            saturacion_oxigeno: 94,
            observaciones: 'Ingresa con dolor de pecho moderado. Se coloca oxígeno por cánula.',
            internacion_id: int1.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
        });
        await Evolucion.create({
            tipo: 'Medico',
            nota: 'Paciente ingresa por dolor de pecho típico. ECG inicial con cambios inespecíficos. Troponina basal pedida.',
            internacion_id: int1.id,
            autor_id: medico1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
        });

        await SignosVitales.create({
            presion_arterial: '120/80',
            frecuencia_cardiaca: 72,
            frecuencia_respiratoria: 16,
            temperatura: 36.2,
            saturacion_oxigeno: 99,
            observaciones: 'Paciente asintomático, descansó bien en la noche.',
            internacion_id: int1.id,
            enfermero_id: enfermera1.id
        });
        await Evolucion.create({
            tipo: 'Enfermeria',
            nota: 'Control de guardia mañana. Paciente refiere sentirse óptimo y sin dolor precordial. Tolera dieta general. Signos vitales estables.',
            internacion_id: int1.id,
            autor_id: enfermera1.id
        });

        // 9. Crear Indicaciones Médicas e Historial de Medicamentos
        console.log("💊 Prescribiendo indicaciones y registrando administración por enfermería...");
        
        // Indicaciones para Paciente 1 (Juan Carlos Pérez)
        const ind1 = await Indicacion.create({
            descripcion: 'Aspirina (Ácido Acetilsalicílico) Comprimidos',
            dosis: '100mg',
            frecuencia: 'Cada 24 hs (Oral)',
            estado: 'Activa',
            internacion_id: int1.id,
            medico_id: medico1.id
        });

        const ind2 = await Indicacion.create({
            descripcion: 'Enalapril Comprimidos',
            dosis: '10mg',
            frecuencia: 'Cada 12 hs (Oral)',
            estado: 'Activa',
            internacion_id: int1.id,
            medico_id: medico1.id
        });

        // Administraciones para Paciente 1
        await AdministracionMedicamento.create({
            dosis_aplicada: '100mg',
            observaciones: 'Administrada con el desayuno. Buena tolerancia oral.',
            indicacion_id: ind1.id,
            enfermero_id: enfermera1.id
        });
        await AdministracionMedicamento.create({
            dosis_aplicada: '10mg',
            observaciones: 'Administrada en ayunas.',
            indicacion_id: ind2.id,
            enfermero_id: enfermera1.id
        });

        // 10. Crear Turnos de Prueba
        console.log("📅 Creando turnos agendados...");
        await Turno.create({
            paciente_id: paciente3.id,
            medico_id: medico1.id,
            fecha: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
            hora: '10:00:00',
            especialidad: 'Cardiología',
            motivo: 'Chequeo general anual',
            estado: 'Programado'
        });

        console.log("✅ Base de datos poblada con éxito. Listo para la defensa.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error al poblar la base de datos:", error);
        process.exit(1);
    }
}

poblarHospitalCompleto();