-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-06-2026 a las 19:13:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `his_hospital`
--
CREATE DATABASE IF NOT EXISTS `his_hospital` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `his_hospital`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administraciones_medicamentos`
--

CREATE TABLE `administraciones_medicamentos` (
  `id` int(11) NOT NULL,
  `dosis_aplicada` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_administracion` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `indicacion_id` int(11) DEFAULT NULL,
  `enfermero_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administraciones_medicamentos`
--

INSERT INTO `administraciones_medicamentos` (`id`, `dosis_aplicada`, `observaciones`, `fecha_administracion`, `createdAt`, `updatedAt`, `indicacion_id`, `enfermero_id`) VALUES
(1, '100mg', 'Administrada con el desayuno. Buena tolerancia oral.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 1, 4),
(2, '10mg', 'Administrada en ayunas.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 2, 4),
(3, '30mg', 'Administrado de forma lenta diluido en suero.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 3, 4),
(4, '1g', 'Antibiótico infundido en 30 minutos sin rash.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 5, 4),
(5, '10mg', 'Administrado por catéter venoso periférico.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 7, 4),
(6, 'Completa', 'Infusión en bomba activa a ritmo seteado.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 8, 4),
(7, '20mg', 'Paciente orina abundantemente tras dosis.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 9, 4),
(8, '40mg', 'Dosis administrada vía periférica.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 10, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admisiones`
--

CREATE TABLE `admisiones` (
  `id` int(11) NOT NULL,
  `tipo` enum('Programada','Derivacion','Guardia','Emergencia') NOT NULL DEFAULT 'Programada',
  `estado` enum('Pendiente','Activa','Cancelada','Rechazada') NOT NULL DEFAULT 'Pendiente',
  `motivo` text DEFAULT NULL,
  `motivo_cancelacion` text DEFAULT NULL,
  `fecha_admision` datetime DEFAULT current_timestamp(),
  `fecha_cancelacion` datetime DEFAULT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admisiones`
--

INSERT INTO `admisiones` (`id`, `tipo`, `estado`, `motivo`, `motivo_cancelacion`, `fecha_admision`, `fecha_cancelacion`, `paciente_id`, `usuario_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Programada', 'Cancelada', NULL, 'Cancelado por usuario', '2026-06-30 14:04:07', '2026-06-30 14:10:30', 13, 1, '2026-06-30 14:04:07', '2026-06-30 14:10:30'),
(2, 'Programada', 'Cancelada', 'Chequeo', 'Cancelado por usuario', '2026-06-30 14:04:54', '2026-06-30 14:10:09', 15, 1, '2026-06-30 14:04:54', '2026-06-30 14:10:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alas`
--

CREATE TABLE `alas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alas`
--

INSERT INTO `alas` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Guardia y Emergencias', 'Atención rápida, Shockroom y triaje'),
(2, 'Terapia Intensiva (UTI)', 'Cuidados críticos y monitoreo continuo'),
(3, 'Internación General', 'Recuperación clínica y observación general');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL,
  `accion` varchar(255) NOT NULL,
  `detalles` text DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auditoria`
--

INSERT INTO `auditoria` (`id`, `accion`, `detalles`, `usuario_id`, `ip`, `createdAt`, `updatedAt`) VALUES
(1, 'Inicialización de Base de Datos', 'Se realizó el borrado total e inserción de la seed de prueba.', 1, '127.0.0.1', '2026-05-29 21:22:37', '2026-05-29 21:22:37'),
(2, 'Ingreso Paciente Emergencia', 'Se registró el ingreso de paciente NN-Triage-Rojo en Cama 101.', 5, '127.0.0.1', '2026-05-29 21:22:37', '2026-05-29 21:22:37'),
(3, 'Prescripción de Medicamento', 'Dr. House prescribió Aspirina 100mg para Paciente Juan Carlos Pérez.', 2, '127.0.0.1', '2026-05-29 21:22:37', '2026-05-29 21:22:37'),
(4, 'Transferencia de Cama', 'Paciente Valentina Herrera transferido de Cama 10 (ID 1) a Cama 2022 (ID 8). Motivo: esta mejorcita', 1, '::ffff:127.0.0.1', '2026-05-29 21:26:21', '2026-05-29 21:26:21'),
(5, 'Creó paciente', 'Paciente: Victor  Aguilera (DNI: 23253537)', 1, '::ffff:127.0.0.1', '2026-06-29 11:27:08', '2026-06-29 11:27:08'),
(6, 'Creó internación', 'Paciente ID: 13 → Cama ID: 1 | Origen: Derivacion | Motivo: Sed', 1, '::ffff:127.0.0.1', '2026-06-29 11:37:51', '2026-06-29 11:37:51'),
(7, 'Dio de alta', 'Paciente: Victor  Aguilera | Estado: Alta_Medica', 1, '::ffff:127.0.0.1', '2026-06-29 15:00:49', '2026-06-29 15:00:49'),
(8, 'Dio de alta', 'Paciente: Roberto Benítez | Estado: Alta_Medica', 1, '::ffff:127.0.0.1', '2026-06-29 15:11:27', '2026-06-29 15:11:27'),
(9, 'Transfirió paciente de cama', 'Paciente: Mario Domínguez | De Cama 11 → Cama 2012 | Motivo: Mejoria', 1, '::ffff:127.0.0.1', '2026-06-29 16:05:04', '2026-06-29 16:05:04'),
(10, 'Modificó usuario', 'Usuario ID: 1 | Nombre: Administrador General | Rol: Paciente', 1, '::ffff:127.0.0.1', '2026-06-29 17:30:02', '2026-06-29 17:30:02'),
(11, 'Modificó usuario', 'Usuario ID: 1 | Nombre: Administrador General | Rol: Admin', 1, '::ffff:127.0.0.1', '2026-06-29 17:30:44', '2026-06-29 17:30:44'),
(12, 'Modificó usuario', 'Usuario ID: 16 | Nombre: Sandro | Rol: Paciente', 1, '::ffff:127.0.0.1', '2026-06-29 17:43:46', '2026-06-29 17:43:46'),
(13, 'Modificó usuario', 'Usuario ID: 17 | Nombre: Victor  | Rol: Paciente', 1, '::ffff:127.0.0.1', '2026-06-29 17:50:02', '2026-06-29 17:50:02'),
(14, 'Desactivó usuario', 'Usuario ID: 17', 1, '::ffff:127.0.0.1', '2026-06-29 19:07:46', '2026-06-29 19:07:46'),
(15, 'Reactivó usuario', 'Usuario ID: 17', 1, '::ffff:127.0.0.1', '2026-06-29 19:07:51', '2026-06-29 19:07:51'),
(16, 'Desactivó usuario', 'Usuario ID: 17', 1, '::ffff:127.0.0.1', '2026-06-29 19:07:53', '2026-06-29 19:07:53'),
(17, 'Reactivó usuario', 'Usuario ID: 17', 1, '::ffff:127.0.0.1', '2026-06-29 19:07:54', '2026-06-29 19:07:54'),
(18, 'Desactivó usuario', 'Usuario ID: 17', 1, '::ffff:127.0.0.1', '2026-06-29 19:07:55', '2026-06-29 19:07:55'),
(19, 'Reactivó usuario', 'Usuario ID: 17', 1, '::ffff:127.0.0.1', '2026-06-29 19:08:29', '2026-06-29 19:08:29'),
(20, 'Desactivó usuario', 'Usuario ID: 17', 1, '::ffff:127.0.0.1', '2026-06-29 19:08:30', '2026-06-29 19:08:30'),
(21, 'Reactivó usuario', 'Usuario ID: 17', 1, '::ffff:127.0.0.1', '2026-06-29 19:08:32', '2026-06-29 19:08:32'),
(22, 'Desactivó paciente', 'Paciente ID: 13', 1, '::ffff:127.0.0.1', '2026-06-29 20:00:07', '2026-06-29 20:00:07'),
(23, 'Reactivó paciente', 'Paciente ID: 13', 1, '::ffff:127.0.0.1', '2026-06-29 20:00:11', '2026-06-29 20:00:11'),
(24, 'Desactivó obra social', 'Obra Social ID: 2', 1, '::ffff:127.0.0.1', '2026-06-30 10:09:48', '2026-06-30 10:09:48'),
(25, 'Reactivó obra social', 'Obra Social ID: 2', 1, '::ffff:127.0.0.1', '2026-06-30 10:09:50', '2026-06-30 10:09:50'),
(26, 'Desactivó obra social', 'Obra Social: OSDE', 1, '::ffff:127.0.0.1', '2026-06-30 10:24:08', '2026-06-30 10:24:08'),
(27, 'Reactivó obra social', 'Obra Social: OSDE', 1, '::ffff:127.0.0.1', '2026-06-30 10:24:09', '2026-06-30 10:24:09'),
(28, 'Desactivó usuario', 'Usuario: Victor ', 1, '::ffff:127.0.0.1', '2026-06-30 10:24:23', '2026-06-30 10:24:23'),
(29, 'Reactivó usuario', 'Usuario: Victor ', 1, '::ffff:127.0.0.1', '2026-06-30 10:24:25', '2026-06-30 10:24:25'),
(30, 'Desactivó paciente', 'Paciente: Victor  Aguilera', 1, '::ffff:127.0.0.1', '2026-06-30 10:24:45', '2026-06-30 10:24:45'),
(31, 'Reactivó paciente', 'Paciente: Victor  Aguilera', 1, '::ffff:127.0.0.1', '2026-06-30 10:24:48', '2026-06-30 10:24:48'),
(32, 'Creó paciente NN', 'Paciente NN: NN NN', 1, '::ffff:127.0.0.1', '2026-06-30 13:49:13', '2026-06-30 13:49:13'),
(33, 'Creó admisión', 'Admision ID: 1 - Tipo: undefined - Paciente ID: 13', 1, '::ffff:127.0.0.1', '2026-06-30 14:04:07', '2026-06-30 14:04:07'),
(34, 'Creó paciente NN', 'Paciente NN: Ocampo Rita', 1, '::ffff:127.0.0.1', '2026-06-30 14:04:54', '2026-06-30 14:04:54'),
(35, 'Creó admisión', 'Admision ID: 2 - Tipo: Programada - Paciente ID: 15', 1, '::ffff:127.0.0.1', '2026-06-30 14:04:54', '2026-06-30 14:04:54'),
(36, 'Canceló admisión', 'Admision ID: 2 - Motivo: No especificado', 1, '::ffff:127.0.0.1', '2026-06-30 14:10:09', '2026-06-30 14:10:09'),
(37, 'Canceló admisión', 'Admision ID: 1 - Motivo: No especificado', 1, '::ffff:127.0.0.1', '2026-06-30 14:10:30', '2026-06-30 14:10:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camas`
--

CREATE TABLE `camas` (
  `id` int(11) NOT NULL,
  `numero_cama` int(11) DEFAULT NULL,
  `estado` enum('Disponible','Ocupada','Mantenimiento','Limpieza') DEFAULT 'Disponible',
  `habitacion_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `camas`
--

INSERT INTO `camas` (`id`, `numero_cama`, `estado`, `habitacion_id`) VALUES
(1, 10, 'Disponible', 1),
(2, 11, 'Disponible', 1),
(3, 101, 'Ocupada', 2),
(4, 102, 'Ocupada', 3),
(5, 2011, 'Ocupada', 4),
(6, 2012, 'Ocupada', 4),
(7, 2021, 'Ocupada', 5),
(8, 2022, 'Ocupada', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudios`
--

CREATE TABLE `estudios` (
  `id` int(11) NOT NULL,
  `fecha_solicitud` datetime DEFAULT NULL,
  `tipo_estudio` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `estado` enum('Pendiente','Realizado','Cancelado') DEFAULT 'Pendiente',
  `resultado` text DEFAULT NULL,
  `fecha_realizacion` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `medico_id` int(11) DEFAULT NULL,
  `internacion_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudios`
--

INSERT INTO `estudios` (`id`, `fecha_solicitud`, `tipo_estudio`, `descripcion`, `estado`, `resultado`, `fecha_realizacion`, `createdAt`, `updatedAt`, `paciente_id`, `medico_id`, `internacion_id`) VALUES
(1, '2026-05-29 21:22:37', 'Radiografía de Tórax', 'Control evolutivo de foco de condensación lobar.', 'Pendiente', NULL, NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 3, 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evolucions`
--

CREATE TABLE `evolucions` (
  `id` int(11) NOT NULL,
  `tipo` enum('Medico','Enfermeria') NOT NULL,
  `nota` text NOT NULL,
  `signos_vitales` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`signos_vitales`)),
  `fecha` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `internacion_id` int(11) DEFAULT NULL,
  `autor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evolucions`
--

INSERT INTO `evolucions` (`id`, `tipo`, `nota`, `signos_vitales`, `fecha`, `createdAt`, `updatedAt`, `internacion_id`, `autor_id`) VALUES
(1, 'Medico', 'Paciente ingresa por dolor de pecho típico. ECG inicial con cambios inespecíficos. Troponina basal pedida. Se inicia protocolo de dolor de pecho.', NULL, '2026-05-29 21:22:37', '2026-05-27 21:22:37', '2026-05-29 21:22:37', 1, 2),
(2, 'Medico', 'Paciente evoluciona favorablemente. Sin reaparición del dolor. Segundo set de enzimas cardíacas negativo. ECG sin cambios dinámicos.', NULL, '2026-05-29 21:22:37', '2026-05-28 21:22:37', '2026-05-29 21:22:37', 1, 2),
(3, 'Enfermeria', 'Control de guardia mañana. Paciente refiere sentirse óptimo y sin dolor precordial. Tolera dieta general. Signos vitales estables.', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 1, 4),
(4, 'Medico', 'Postoperatorio de hernioplastía inguinal izquierda. Procedimiento sin incidentes. Control de apósito inguinal correcto, seco. Plan: Hidratación y analgesia.', NULL, '2026-05-29 21:22:37', '2026-05-28 21:22:37', '2026-05-29 21:22:37', 2, 3),
(5, 'Enfermeria', 'Paciente lúcido. Dolor controlado con analgésicos. Apósito inguinal limpio y seco. Ya inició deambulación asistida con buena tolerancia. Diuresis positiva.', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 2, 4),
(6, 'Medico', 'Tercer día de ceftriaxona. Favorable evolución clínica, ruidos pulmonares con marcada disminución de estertores. Se suspende aporte de oxígeno y se planifica paso a vía oral en 24 horas si continúa estable.', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 3, 2),
(7, 'Enfermeria', 'Paciente refiere mejoría importante del malestar general y cese del dolor abdominal. Sin registrar emesis en las últimas 12 horas. Tolera líquidos vía oral. Infusión de suero a goteo de mantenimiento.', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 4, 4),
(8, 'Medico', 'UTI - Paciente NN bajo sedoanalgesia profunda en ARM. Rx de tórax muestra tubo endotraqueal bien posicionado. Hemoglobina inicial estable. Pendiente de resolución traumatológica de fractura de fémur una vez lograda estabilidad neurológica.', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 5, 2),
(9, 'Medico', 'Evolución en UTI por ICC. Balance de ingresos y egresos netamente negativo. Ruidos pulmonares con mejor entrada de aire bilateral, estertores basales mínimos. Nitroglicerina suspendida. Continúa control estricto.', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 6, 3),
(10, 'Medico', 'Evaluación en Shockroom. Crisis asmática severa. Paciente responde lentamente al tratamiento de rescate. Se decide dejar bajo monitoreo continuo en Guardia durante las próximas horas para evaluar necesidad de pase a UTI o internación general.', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 7, 2),
(11, 'Medico', 'TRASLADO DE CAMA: Paciente transferido desde Cama 10 a Cama 2022. Motivo: esta mejorcita.', NULL, '2026-05-29 21:26:21', '2026-05-29 21:26:21', '2026-05-29 21:26:21', 7, 1),
(12, 'Medico', 'TRASLADO DE CAMA: Desde Cama 11 → Cama 2012. Motivo: Mejoria.', NULL, '2026-06-29 16:05:04', '2026-06-29 16:05:04', '2026-06-29 16:05:04', 9, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitacions`
--

CREATE TABLE `habitacions` (
  `id` int(11) NOT NULL,
  `numero` varchar(255) NOT NULL,
  `tipo` enum('Individual','Compartida','Shockroom') DEFAULT 'Individual',
  `ala_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitacions`
--

INSERT INTO `habitacions` (`id`, `numero`, `tipo`, `ala_id`) VALUES
(1, 'SHOCK-1', 'Shockroom', 1),
(2, 'UTI-101', 'Individual', 2),
(3, 'UTI-102', 'Individual', 2),
(4, '201', 'Compartida', 3),
(5, '202', 'Compartida', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicaciones`
--

CREATE TABLE `indicaciones` (
  `id` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `dosis` varchar(255) DEFAULT NULL,
  `frecuencia` varchar(255) DEFAULT NULL,
  `estado` enum('Activa','Suspendida','Finalizada') NOT NULL DEFAULT 'Activa',
  `fecha_indicacion` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `internacion_id` int(11) DEFAULT NULL,
  `medico_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `indicaciones`
--

INSERT INTO `indicaciones` (`id`, `descripcion`, `dosis`, `frecuencia`, `estado`, `fecha_indicacion`, `createdAt`, `updatedAt`, `internacion_id`, `medico_id`) VALUES
(1, 'Aspirina (Ácido Acetilsalicílico) Comprimidos', '100mg', 'Cada 24 hs (Oral)', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 1, 2),
(2, 'Enalapril Comprimidos', '10mg', 'Cada 12 hs (Oral)', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 1, 2),
(3, 'Ketorolac Ampollas', '30mg', 'Cada 8 hs (Intravenoso)', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 2, 3),
(4, 'Ranitidina Ampollas', '50mg', 'Cada 12 hs (Intravenoso)', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 2, 3),
(5, 'Ceftriaxona Ampollas', '1g', 'Cada 12 hs (Intravenoso)', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 3, 2),
(6, 'Paracetamol Comprimidos', '1g', 'Condicional a temperatura mayor de 38°C', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 3, 2),
(7, 'Reliverán (Metoclopramida) Ampollas', '10mg', 'Cada 8 hs (Intravenoso)', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 4, 3),
(8, 'Midazolam + Fentanilo (Bomba de Infusión)', '5mg/h fentanilo + 10mg/h midazolam', 'Infusión continua', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 5, 2),
(9, 'Furosemida Ampollas', '20mg', 'Cada 8 hs (Intravenoso)', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 6, 3),
(10, 'Metilprednisolona Ampollas', '40mg', 'Cada 6 hs (Intravenoso)', 'Activa', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 7, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internaciones`
--

CREATE TABLE `internaciones` (
  `id` int(11) NOT NULL,
  `origen` enum('Guardia','Consultorio Externo','Derivacion') DEFAULT 'Guardia',
  `motivo` text DEFAULT NULL,
  `prioridad_triage` enum('Verde','Amarillo','Rojo') DEFAULT 'Verde',
  `estado` enum('Activa','Alta_Medica','Traslado','Defuncion','Cancelada') DEFAULT 'Activa',
  `resumen_epicrisis` text DEFAULT NULL,
  `recetas` text DEFAULT NULL,
  `recomendaciones` text DEFAULT NULL,
  `seguimiento` text DEFAULT NULL,
  `fecha_ingreso` datetime DEFAULT NULL,
  `fecha_egreso` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `cama_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `internaciones`
--

INSERT INTO `internaciones` (`id`, `origen`, `motivo`, `prioridad_triage`, `estado`, `resumen_epicrisis`, `recetas`, `recomendaciones`, `seguimiento`, `fecha_ingreso`, `fecha_egreso`, `createdAt`, `updatedAt`, `paciente_id`, `cama_id`) VALUES
(1, 'Guardia', 'Dolor precordial típico opresivo de 2 horas de evolución asociado a diaforesis.', 'Amarillo', 'Activa', NULL, NULL, NULL, NULL, '2026-05-27 21:22:37', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 1, 5),
(2, 'Consultorio Externo', 'Postoperatorio de hernioplastía inguinal izquierda por hernia incarcerada.', 'Amarillo', 'Alta_Medica', 'Mejoria general', 'Paracetamol', NULL, NULL, '2026-05-28 21:22:37', '2026-06-29 15:11:27', '2026-05-29 21:22:37', '2026-06-29 15:11:27', 2, 6),
(3, 'Guardia', 'Neumonía lobar derecha con disnea y desaturación leve al aire ambiente.', 'Amarillo', 'Activa', NULL, NULL, NULL, NULL, '2026-05-26 21:22:37', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 3, 7),
(4, 'Guardia', 'Gastroenteritis aguda severa con deshidratación clínica moderada e intolerancia total de la vía oral.', 'Verde', 'Alta_Medica', 'a', 'a', 'a', 'a', '2026-05-28 21:22:37', '2026-05-29 21:25:41', '2026-05-29 21:22:37', '2026-05-29 21:25:41', 4, 8),
(5, 'Guardia', 'Paciente traído de la vía pública inconsciente tras colisión en moto. Traumatismo craneoencefálico grave y fractura expuesta de fémur izquierdo.', 'Rojo', 'Activa', NULL, NULL, NULL, NULL, '2026-05-29 21:22:37', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 5, 3),
(6, 'Derivacion', 'Insuficiencia cardíaca descompensada refractaria a tratamiento oral con disnea de reposo y ortopnea.', 'Rojo', 'Activa', NULL, NULL, NULL, NULL, '2026-05-28 21:22:37', NULL, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 6, 4),
(7, 'Guardia', 'Status asmático. Crisis asmática severa refractaria a nebulizaciones y corticoides orales en domicilio.', 'Rojo', 'Activa', NULL, NULL, NULL, NULL, '2026-05-29 21:22:37', NULL, '2026-05-29 21:22:37', '2026-05-29 21:26:21', 7, 8),
(8, 'Guardia', 'Shock anafiláctico secundario a picadura de insecto (avispa).', 'Amarillo', 'Alta_Medica', 'Paciente responde favorablemente a dosis de Adrenalina IM y corticoides endovenosos en shockroom. Remisión total del angioedema y sibilancias. Se otorga alta con pautas de alarma estrictas y derivación a alergista.', 'Deltisona B 40mg diario por 3 días. Loratadina 10mg noche por 7 días. Inyector automático de adrenalina recetado para portación.', 'Evitar áreas con insectos. Consulta ambulatoria con alergología.', NULL, '2026-05-29 11:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 8, 2),
(9, 'Consultorio Externo', 'se cayo', 'Rojo', 'Activa', NULL, NULL, NULL, NULL, '2026-05-29 21:25:23', NULL, '2026-05-29 21:25:23', '2026-06-29 16:05:04', 11, 6),
(10, 'Derivacion', 'Sed', 'Rojo', 'Alta_Medica', 'Mejora clara', 'Ibuprofeno cada 8 hs', 'Reposo', NULL, '2026-06-29 11:37:51', '2026-06-29 15:00:49', '2026-06-29 11:37:51', '2026-06-29 15:00:49', 13, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obras_sociales`
--

CREATE TABLE `obras_sociales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obras_sociales`
--

INSERT INTO `obras_sociales` (`id`, `nombre`, `descripcion`, `activo`, `createdAt`, `updatedAt`) VALUES
(1, 'PAMI', 'Programa de Atención Médica Integral', 1, '2026-06-23 14:27:45', '2026-06-23 14:27:45'),
(2, 'OSDE', 'Obra Social de Ejecutivos', 1, '2026-06-23 14:27:45', '2026-06-30 10:24:09'),
(3, 'Swiss Medical', 'Swiss Medical Group', 1, '2026-06-23 14:27:45', '2026-06-23 14:27:45'),
(4, 'Particular', 'Sin cobertura', 1, '2026-06-23 14:27:45', '2026-06-23 14:27:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `es_nn` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('M','F','X') DEFAULT 'X',
  `obra_social` varchar(255) DEFAULT NULL,
  `numero_afiliado` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT 'No especificada',
  `telefono` varchar(255) DEFAULT 'No especificado',
  `email` varchar(255) DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `antecedentes` text DEFAULT NULL,
  `medicamentos_actuales` text DEFAULT NULL,
  `contacto_emergencia_nombre` varchar(255) DEFAULT NULL,
  `contacto_emergencia_telefono` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Indica si el paciente está activo',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `obra_social_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `dni`, `es_nn`, `fecha_nacimiento`, `sexo`, `obra_social`, `numero_afiliado`, `direccion`, `telefono`, `email`, `alergias`, `antecedentes`, `medicamentos_actuales`, `contacto_emergencia_nombre`, `contacto_emergencia_telefono`, `activo`, `createdAt`, `updatedAt`, `obra_social_id`) VALUES
(1, 'Juan Carlos', 'Pérez', '20123456', 0, '1975-04-12', 'M', 'OSDE', '1-44552-3', 'Av. Colón 1234, Córdoba', '3514445555', 'juan.perez@email.com', 'Penicilina, Aspirina', 'Hipertensión Arterial, Ex-fumador', 'Enalapril 10mg diario', 'María Pérez (Esposa)', '3514445556', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(2, 'Roberto', 'Benítez', '18765432', 0, '1968-11-25', 'M', 'Particular', NULL, 'La Rioja 720, Córdoba', '3513029182', 'roberto.benitez@email.com', 'Ninguna conocida', 'Dislipemia, Sedentarismo', 'Atorvastatina 10mg noche', 'Lucía Benítez (Hija)', '3519876543', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(3, 'Ana María', 'Gómez', '28987654', 0, '1982-08-20', 'F', 'Swiss Medical', 'SM-9988-1', 'Chacabuco 450, Córdoba', '3516112233', 'ana.gomez@email.com', 'Sulfas', 'Diabetes Gestacional en 2018', 'Metformina 850mg con cena', 'Roberto Gómez (Padre)', '3516990099', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(4, 'Clara Luz', 'Rodríguez', '32111444', 0, '1986-06-15', 'F', 'APROSS', 'AP-55441-01', 'Duarte Quirós 1540, Córdoba', '3512229988', 'clara.rodriguez@email.com', 'Aspirina (Ácido Acetilsalicílico)', 'Hipotiroidismo', 'Levotiroxina 75mcg ayunas', 'Santiago Rodríguez (Hermano)', '3515556677', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(5, 'Emergencia', 'NN-Triage-Rojo', '', 1, '0000-00-00', 'X', 'Ninguna', NULL, 'Traído por ambulancia 107', 'No disponible', NULL, 'Desconocido', 'Paciente inconsciente traído de la vía pública por traumatismo craneoencefálico y politraumatismo', NULL, NULL, NULL, 1, '2026-05-29 21:22:37', '2026-06-29 20:12:00', NULL),
(6, 'Carlos', 'D\'Alessandro', '12345678', 0, '1953-09-02', 'M', 'PAMI', 'PA-88992211', 'Av. Patria 480, Córdoba', '3517778888', 'carlos.dalessandro@email.com', 'Ninguna conocida', 'Infarto agudo de miocardio en 2021, Insuficiencia Cardíaca Crónica', 'Furosemida 40mg mañana, Carvedilol 6.25mg cada 12 hs, Espironolactona 25mg almuerzo', 'Mariano D\'Alessandro (Hijo)', '3513334444', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(7, 'Valentina', 'Herrera', '41222333', 0, '1998-03-10', 'F', 'Galeno', 'GA-112233-4', 'Bv. San Juan 800, Córdoba', '3518889900', 'valentina.herrera@email.com', 'Polen, Ácaros, Penicilina', 'Asma bronquial severa diagnosticada en la infancia', 'Budesonida + Formoterol inhalador 2 veces al día', 'Laura Herrera (Madre)', '3512223344', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(8, 'Lucas', 'Romero', '35888999', 0, '1991-07-22', 'M', 'OSECAC', 'OS-998822', 'Catamarca 120, Córdoba', '3515551122', 'lucas.romero@email.com', 'Picadura de avispa', 'Ninguno de relevancia', 'Ninguno', 'Patricia Romero (Hermana)', '3516667788', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(9, 'Mariano', 'López', '38111222', 0, '1995-11-03', 'M', 'Particular', NULL, 'Duarte Quirós 980, Córdoba', '3515887766', 'mariano.lopez@email.com', 'Polvo', 'Asma leve en la infancia', 'Salbutamol SOS', 'Carmen López (Madre)', '3515887700', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(10, 'Elena', 'Peralta', '34567890', 0, '1989-12-14', 'F', 'OSDE', '2-120033-0', 'Rondeau 340, Córdoba', '3517112233', 'elena.peralta@email.com', 'Ninguna conocida', 'Hipertensión crónica controlada', 'Losartán 50mg diario', 'Juan Peralta (Padre)', '3519881122', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(11, 'Mario', 'Domínguez', '14222333', 0, '1961-05-30', 'M', 'APROSS', 'AP-110022-00', 'Castro Barros 1100, Córdoba', '3516664422', 'mario.dominguez@email.com', 'Dipirona', 'Colecistectomía en 2015', 'Aspirina 100mg almuerzo', 'Sonia Domínguez (Esposa)', '3518882211', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(12, 'Sandro', 'DeAmerica', '234765877', 0, '1950-11-12', '', NULL, NULL, '1223', '2664234567', 'sandro@yopmail.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-06-23 17:20:36', '2026-06-23 17:21:02', 2),
(13, 'Victor ', 'Aguilera', '23253537', 0, '1959-04-23', '', NULL, NULL, '5870', '3544537044', 'vic@yopmail.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-06-29 11:27:08', '2026-06-30 10:24:48', 2),
(14, 'NN', 'NN', NULL, 1, NULL, 'M', NULL, NULL, 'No especificada', 'No especificado', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-30 13:49:13', '2026-06-30 13:49:13', NULL),
(15, 'Ocampo', 'Rita', NULL, 1, NULL, 'F', NULL, NULL, 'No especificada', 'No especificado', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-06-30 14:04:54', '2026-06-30 14:04:54', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `signos_vitales`
--

CREATE TABLE `signos_vitales` (
  `id` int(11) NOT NULL,
  `presion_arterial` varchar(255) DEFAULT NULL,
  `frecuencia_cardiaca` int(11) DEFAULT NULL,
  `frecuencia_respiratoria` int(11) DEFAULT NULL,
  `temperatura` decimal(4,1) DEFAULT NULL,
  `saturacion_oxigeno` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `internacion_id` int(11) DEFAULT NULL,
  `enfermero_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `signos_vitales`
--

INSERT INTO `signos_vitales` (`id`, `presion_arterial`, `frecuencia_cardiaca`, `frecuencia_respiratoria`, `temperatura`, `saturacion_oxigeno`, `observaciones`, `createdAt`, `updatedAt`, `internacion_id`, `enfermero_id`) VALUES
(1, '150/95', 98, 20, 36.6, 94, 'Ingresa con dolor de pecho moderado. Se coloca oxígeno por cánula.', '2026-05-27 21:22:37', '2026-05-29 21:22:37', 1, 4),
(2, '135/85', 82, 18, 36.8, 97, 'Paciente estable. Segundo juego de enzimas cardíacas dio negativo.', '2026-05-28 21:22:37', '2026-05-29 21:22:37', 1, 4),
(3, '120/80', 72, 16, 36.2, 99, 'Paciente asintomático, descansó bien en la noche.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 1, 4),
(4, '110/70', 85, 18, 37.2, 96, 'Postoperatorio inmediato. Somnoliento por la anestesia pero reactivo.', '2026-05-28 21:22:37', '2026-05-29 21:22:37', 2, 4),
(5, '120/75', 78, 16, 36.7, 98, 'Refiere dolor leve en zona de la herida quirúrgica al moverse.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 2, 4),
(6, '115/70', 104, 24, 39.1, 91, 'Ingreso. Paciente con fiebre alta y disnea moderada. Requiere oxígeno a 2 l/min.', '2026-05-26 21:22:37', '2026-05-29 21:22:37', 3, 4),
(7, '120/75', 88, 19, 37.8, 95, 'Menos taquipneica, tolera decúbito. Sigue con oxígeno por cánula.', '2026-05-28 21:22:37', '2026-05-29 21:22:37', 3, 4),
(8, '118/78', 76, 17, 36.5, 97, 'Afebril. Se retira cánula de oxígeno de prueba. Saturando bien al aire ambiente.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 3, 4),
(9, '95/60', 102, 19, 37.4, 98, 'Ingresa con taquicardia secundaria a deshidratación. Mucosas secas. PHP a goteo rápido.', '2026-05-28 21:22:37', '2026-05-29 21:22:37', 4, 4),
(10, '110/70', 82, 16, 36.6, 99, 'Recuperando hidratación. Tolera pequeños sorbos de té de manera fraccionada.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 4, 4),
(11, '90/50', 115, 12, 35.8, 89, 'Monitoreo en UTI. Paciente intubado con asistencia respiratoria. Inestabilidad hemodinámica leve.', '2026-05-29 18:22:37', '2026-05-29 21:22:37', 5, 4),
(12, '105/65', 98, 14, 36.3, 95, 'Se administran fluidos y se estabiliza TA. Parámetros de ARM ajustados.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 5, 4),
(13, '170/105', 110, 28, 36.5, 88, 'Ingresa disneico y cianótico. Trabajo respiratorio severo. Se coloca máscara con reservorio y se inicia bolo de furosemida.', '2026-05-28 21:22:37', '2026-05-29 21:22:37', 6, 4),
(14, '140/85', 92, 21, 36.8, 93, 'Respuesta diurética abundante (1000cc). Disminuye disnea. Se tolera CPAP en UTI.', '2026-05-29 09:22:37', '2026-05-29 21:22:37', 6, 4),
(15, '125/75', 80, 18, 36.6, 96, 'Signos vitales estables. Paciente refiere gran alivio respiratorio.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 6, 4),
(16, '130/80', 118, 30, 36.9, 90, 'Shockroom. Ingresa por crisis asmática severa. Tiraje intercostal marcado, sibilancias inspiratorias y espiratorias generalizadas.', '2026-05-29 19:22:37', '2026-05-29 21:22:37', 7, 4),
(17, '122/75', 95, 22, 36.7, 94, 'Refiere leve alivio tras sulfato de magnesio y nebulizaciones continuas con salbutamol.', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 7, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `especialidad` varchar(255) NOT NULL DEFAULT 'Medicina General',
  `motivo` varchar(255) DEFAULT NULL,
  `estado` enum('Programado','Asistió','Cancelado') DEFAULT 'Programado',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `medico_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id`, `fecha`, `hora`, `especialidad`, `motivo`, `estado`, `createdAt`, `updatedAt`, `paciente_id`, `medico_id`) VALUES
(1, '2026-05-30', '11:30:00', 'Cardiología', 'Chequeo post-alta de enzimas cardíacas.', 'Programado', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('Admin','Medico','Enfermeria','Admision','Paciente') NOT NULL DEFAULT 'Admision',
  `activo` tinyint(4) NOT NULL DEFAULT 1 COMMENT 'Indica si el usuario está activo',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paciente_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `activo`, `createdAt`, `updatedAt`, `paciente_id`) VALUES
(1, 'Administrador General', 'admin@his.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Admin', 1, '2026-05-29 21:22:37', '2026-06-29 17:30:44', NULL),
(2, 'Gregory House', 'medico@his.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Medico', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(3, 'Lisa Cuddy', 'cuddy@his.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Medico', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(4, 'Joy Nurse', 'enfermera@his.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Enfermeria', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(5, 'Recepción Mesa', 'admision@his.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Admision', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', NULL),
(6, 'Juan Carlos Pérez', 'juan.perez@email.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Paciente', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 1),
(7, 'Roberto Benítez', 'roberto.benitez@email.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Paciente', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 2),
(8, 'Ana María Gómez', 'ana.gomez@email.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Paciente', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 3),
(9, 'Clara Luz Rodríguez', 'clara.rodriguez@email.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Paciente', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 4),
(10, 'Carlos D\'Alessandro', 'carlos.dalessandro@email.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Paciente', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 6),
(11, 'Valentina Herrera', 'valentina.herrera@email.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Paciente', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 7),
(13, 'Mariano López', 'mariano.lopez@email.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Paciente', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 9),
(14, 'Elena Peralta', 'elena.peralta@email.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Paciente', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 10),
(15, 'Mario Domínguez', 'mario.dominguez@email.com', '$2b$10$5qNzsld3tbID66r8sYinBe4YvDXZ.QzsTJ/RrgSez0SG53.aaiPb2', 'Paciente', 1, '2026-05-29 21:22:37', '2026-05-29 21:22:37', 11),
(16, 'Sandro', 'sandro@yopmail.com', '$2b$10$TaM7.QnbGjFrPklYdcPGturbW9MFYhGJYQvNYZhYXD20WT2DWxVC2', 'Paciente', 1, '2026-06-23 17:20:36', '2026-06-29 17:43:46', 12),
(17, 'Victor ', 'vic@yopmail.com', '$2b$10$Jo1W1/.zJhW0cBajOQj6ge.KOOU2kbyMBK9jsGJtOcbrQ3ygJyjx2', 'Paciente', 1, '2026-06-29 11:27:08', '2026-06-30 10:24:25', 13);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitas`
--

CREATE TABLE `visitas` (
  `id` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `prioridad` enum('Baja','Media','Alta/Emergencia') DEFAULT 'Baja',
  `estado` enum('Esperando','En Atención','Finalizado','Derivado a Internación') DEFAULT 'Esperando',
  `tipo_ingreso` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paciente_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visitas`
--

INSERT INTO `visitas` (`id`, `motivo`, `prioridad`, `estado`, `tipo_ingreso`, `createdAt`, `updatedAt`, `paciente_id`) VALUES
(1, 'Traumatismo y fuerte dolor en tobillo derecho tras torcedura.', 'Media', 'Esperando', 'Guardia/Demanda Espontánea', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 9),
(2, 'Cefalea intensa y mareos, sospecha de pico hipertensivo.', 'Media', 'Derivado a Internación', 'Guardia/Demanda Espontánea', '2026-05-29 21:22:37', '2026-05-29 21:34:32', 10),
(3, 'Fiebre y dolor abdominal agudo en fosa ilíaca derecha.', 'Alta/Emergencia', 'Esperando', 'Guardia/Demanda Espontánea', '2026-05-29 21:22:37', '2026-05-29 21:22:37', 11);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administraciones_medicamentos`
--
ALTER TABLE `administraciones_medicamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indicacion_id` (`indicacion_id`),
  ADD KEY `enfermero_id` (`enfermero_id`);

--
-- Indices de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `alas`
--
ALTER TABLE `alas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`),
  ADD UNIQUE KEY `nombre_3` (`nombre`),
  ADD UNIQUE KEY `nombre_4` (`nombre`),
  ADD UNIQUE KEY `nombre_5` (`nombre`),
  ADD UNIQUE KEY `nombre_6` (`nombre`),
  ADD UNIQUE KEY `nombre_7` (`nombre`),
  ADD UNIQUE KEY `nombre_8` (`nombre`),
  ADD UNIQUE KEY `nombre_9` (`nombre`),
  ADD UNIQUE KEY `nombre_10` (`nombre`),
  ADD UNIQUE KEY `nombre_11` (`nombre`),
  ADD UNIQUE KEY `nombre_12` (`nombre`),
  ADD UNIQUE KEY `nombre_13` (`nombre`),
  ADD UNIQUE KEY `nombre_14` (`nombre`),
  ADD UNIQUE KEY `nombre_15` (`nombre`),
  ADD UNIQUE KEY `nombre_16` (`nombre`),
  ADD UNIQUE KEY `nombre_17` (`nombre`),
  ADD UNIQUE KEY `nombre_18` (`nombre`),
  ADD UNIQUE KEY `nombre_19` (`nombre`),
  ADD UNIQUE KEY `nombre_20` (`nombre`),
  ADD UNIQUE KEY `nombre_21` (`nombre`),
  ADD UNIQUE KEY `nombre_22` (`nombre`),
  ADD UNIQUE KEY `nombre_23` (`nombre`),
  ADD UNIQUE KEY `nombre_24` (`nombre`),
  ADD UNIQUE KEY `nombre_25` (`nombre`),
  ADD UNIQUE KEY `nombre_26` (`nombre`),
  ADD UNIQUE KEY `nombre_27` (`nombre`),
  ADD UNIQUE KEY `nombre_28` (`nombre`),
  ADD UNIQUE KEY `nombre_29` (`nombre`),
  ADD UNIQUE KEY `nombre_30` (`nombre`),
  ADD UNIQUE KEY `nombre_31` (`nombre`),
  ADD UNIQUE KEY `nombre_32` (`nombre`),
  ADD UNIQUE KEY `nombre_33` (`nombre`),
  ADD UNIQUE KEY `nombre_34` (`nombre`),
  ADD UNIQUE KEY `nombre_35` (`nombre`),
  ADD UNIQUE KEY `nombre_36` (`nombre`),
  ADD UNIQUE KEY `nombre_37` (`nombre`),
  ADD UNIQUE KEY `nombre_38` (`nombre`),
  ADD UNIQUE KEY `nombre_39` (`nombre`),
  ADD UNIQUE KEY `nombre_40` (`nombre`),
  ADD UNIQUE KEY `nombre_41` (`nombre`),
  ADD UNIQUE KEY `nombre_42` (`nombre`),
  ADD UNIQUE KEY `nombre_43` (`nombre`),
  ADD UNIQUE KEY `nombre_44` (`nombre`),
  ADD UNIQUE KEY `nombre_45` (`nombre`),
  ADD UNIQUE KEY `nombre_46` (`nombre`),
  ADD UNIQUE KEY `nombre_47` (`nombre`),
  ADD UNIQUE KEY `nombre_48` (`nombre`),
  ADD UNIQUE KEY `nombre_49` (`nombre`),
  ADD UNIQUE KEY `nombre_50` (`nombre`),
  ADD UNIQUE KEY `nombre_51` (`nombre`),
  ADD UNIQUE KEY `nombre_52` (`nombre`),
  ADD UNIQUE KEY `nombre_53` (`nombre`),
  ADD UNIQUE KEY `nombre_54` (`nombre`),
  ADD UNIQUE KEY `nombre_55` (`nombre`),
  ADD UNIQUE KEY `nombre_56` (`nombre`),
  ADD UNIQUE KEY `nombre_57` (`nombre`),
  ADD UNIQUE KEY `nombre_58` (`nombre`),
  ADD UNIQUE KEY `nombre_59` (`nombre`),
  ADD UNIQUE KEY `nombre_60` (`nombre`);

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `camas`
--
ALTER TABLE `camas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `habitacion_id` (`habitacion_id`);

--
-- Indices de la tabla `estudios`
--
ALTER TABLE `estudios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `medico_id` (`medico_id`),
  ADD KEY `internacion_id` (`internacion_id`);

--
-- Indices de la tabla `evolucions`
--
ALTER TABLE `evolucions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `internacion_id` (`internacion_id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indices de la tabla `habitacions`
--
ALTER TABLE `habitacions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ala_id` (`ala_id`);

--
-- Indices de la tabla `indicaciones`
--
ALTER TABLE `indicaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `internacion_id` (`internacion_id`),
  ADD KEY `medico_id` (`medico_id`);

--
-- Indices de la tabla `internaciones`
--
ALTER TABLE `internaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `cama_id` (`cama_id`);

--
-- Indices de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`),
  ADD UNIQUE KEY `nombre_3` (`nombre`),
  ADD UNIQUE KEY `nombre_4` (`nombre`),
  ADD UNIQUE KEY `nombre_5` (`nombre`),
  ADD UNIQUE KEY `nombre_6` (`nombre`),
  ADD UNIQUE KEY `nombre_7` (`nombre`),
  ADD UNIQUE KEY `nombre_8` (`nombre`),
  ADD UNIQUE KEY `nombre_9` (`nombre`),
  ADD UNIQUE KEY `nombre_10` (`nombre`),
  ADD UNIQUE KEY `nombre_11` (`nombre`),
  ADD UNIQUE KEY `nombre_12` (`nombre`),
  ADD UNIQUE KEY `nombre_13` (`nombre`),
  ADD UNIQUE KEY `nombre_14` (`nombre`),
  ADD UNIQUE KEY `nombre_15` (`nombre`),
  ADD UNIQUE KEY `nombre_16` (`nombre`),
  ADD UNIQUE KEY `nombre_17` (`nombre`),
  ADD UNIQUE KEY `nombre_18` (`nombre`),
  ADD UNIQUE KEY `nombre_19` (`nombre`),
  ADD UNIQUE KEY `nombre_20` (`nombre`),
  ADD UNIQUE KEY `nombre_21` (`nombre`),
  ADD UNIQUE KEY `nombre_22` (`nombre`),
  ADD UNIQUE KEY `nombre_23` (`nombre`),
  ADD UNIQUE KEY `nombre_24` (`nombre`),
  ADD UNIQUE KEY `nombre_25` (`nombre`),
  ADD UNIQUE KEY `nombre_26` (`nombre`),
  ADD UNIQUE KEY `nombre_27` (`nombre`),
  ADD UNIQUE KEY `nombre_28` (`nombre`),
  ADD UNIQUE KEY `nombre_29` (`nombre`),
  ADD UNIQUE KEY `nombre_30` (`nombre`),
  ADD UNIQUE KEY `nombre_31` (`nombre`),
  ADD UNIQUE KEY `nombre_32` (`nombre`),
  ADD UNIQUE KEY `nombre_33` (`nombre`),
  ADD UNIQUE KEY `nombre_34` (`nombre`),
  ADD UNIQUE KEY `nombre_35` (`nombre`),
  ADD UNIQUE KEY `nombre_36` (`nombre`),
  ADD UNIQUE KEY `nombre_37` (`nombre`),
  ADD UNIQUE KEY `nombre_38` (`nombre`),
  ADD UNIQUE KEY `nombre_39` (`nombre`),
  ADD UNIQUE KEY `nombre_40` (`nombre`),
  ADD UNIQUE KEY `nombre_41` (`nombre`),
  ADD UNIQUE KEY `nombre_42` (`nombre`),
  ADD UNIQUE KEY `nombre_43` (`nombre`),
  ADD UNIQUE KEY `nombre_44` (`nombre`),
  ADD UNIQUE KEY `nombre_45` (`nombre`),
  ADD UNIQUE KEY `nombre_46` (`nombre`),
  ADD UNIQUE KEY `nombre_47` (`nombre`),
  ADD UNIQUE KEY `nombre_48` (`nombre`),
  ADD UNIQUE KEY `nombre_49` (`nombre`),
  ADD UNIQUE KEY `nombre_50` (`nombre`),
  ADD UNIQUE KEY `nombre_51` (`nombre`),
  ADD UNIQUE KEY `nombre_52` (`nombre`),
  ADD UNIQUE KEY `nombre_53` (`nombre`),
  ADD UNIQUE KEY `nombre_54` (`nombre`),
  ADD UNIQUE KEY `nombre_55` (`nombre`),
  ADD UNIQUE KEY `nombre_56` (`nombre`),
  ADD UNIQUE KEY `nombre_57` (`nombre`),
  ADD UNIQUE KEY `nombre_58` (`nombre`),
  ADD UNIQUE KEY `nombre_59` (`nombre`),
  ADD UNIQUE KEY `nombre_60` (`nombre`),
  ADD UNIQUE KEY `nombre_61` (`nombre`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `dni_2` (`dni`),
  ADD UNIQUE KEY `dni_3` (`dni`),
  ADD UNIQUE KEY `dni_4` (`dni`),
  ADD UNIQUE KEY `dni_5` (`dni`),
  ADD UNIQUE KEY `dni_6` (`dni`),
  ADD UNIQUE KEY `dni_7` (`dni`),
  ADD UNIQUE KEY `dni_8` (`dni`),
  ADD UNIQUE KEY `dni_9` (`dni`),
  ADD UNIQUE KEY `dni_10` (`dni`),
  ADD UNIQUE KEY `dni_11` (`dni`),
  ADD UNIQUE KEY `dni_12` (`dni`),
  ADD UNIQUE KEY `dni_13` (`dni`),
  ADD UNIQUE KEY `dni_14` (`dni`),
  ADD UNIQUE KEY `dni_15` (`dni`),
  ADD UNIQUE KEY `dni_16` (`dni`),
  ADD UNIQUE KEY `dni_17` (`dni`),
  ADD UNIQUE KEY `dni_18` (`dni`),
  ADD UNIQUE KEY `dni_19` (`dni`),
  ADD UNIQUE KEY `dni_20` (`dni`),
  ADD UNIQUE KEY `dni_21` (`dni`),
  ADD UNIQUE KEY `dni_22` (`dni`),
  ADD UNIQUE KEY `dni_23` (`dni`),
  ADD UNIQUE KEY `dni_24` (`dni`),
  ADD UNIQUE KEY `dni_25` (`dni`),
  ADD UNIQUE KEY `dni_26` (`dni`),
  ADD UNIQUE KEY `dni_27` (`dni`),
  ADD UNIQUE KEY `dni_28` (`dni`),
  ADD UNIQUE KEY `dni_29` (`dni`),
  ADD UNIQUE KEY `dni_30` (`dni`),
  ADD UNIQUE KEY `dni_31` (`dni`),
  ADD UNIQUE KEY `dni_32` (`dni`),
  ADD UNIQUE KEY `dni_33` (`dni`),
  ADD UNIQUE KEY `dni_34` (`dni`),
  ADD UNIQUE KEY `dni_35` (`dni`),
  ADD UNIQUE KEY `dni_36` (`dni`),
  ADD UNIQUE KEY `dni_37` (`dni`),
  ADD UNIQUE KEY `dni_38` (`dni`),
  ADD UNIQUE KEY `dni_39` (`dni`),
  ADD UNIQUE KEY `dni_40` (`dni`),
  ADD UNIQUE KEY `dni_41` (`dni`),
  ADD UNIQUE KEY `dni_42` (`dni`),
  ADD UNIQUE KEY `dni_43` (`dni`),
  ADD UNIQUE KEY `dni_44` (`dni`),
  ADD UNIQUE KEY `dni_45` (`dni`),
  ADD UNIQUE KEY `dni_46` (`dni`),
  ADD UNIQUE KEY `dni_47` (`dni`),
  ADD UNIQUE KEY `dni_48` (`dni`),
  ADD UNIQUE KEY `dni_49` (`dni`),
  ADD UNIQUE KEY `dni_50` (`dni`),
  ADD UNIQUE KEY `dni_51` (`dni`),
  ADD UNIQUE KEY `dni_52` (`dni`),
  ADD UNIQUE KEY `dni_53` (`dni`),
  ADD UNIQUE KEY `dni_54` (`dni`),
  ADD UNIQUE KEY `dni_55` (`dni`),
  ADD UNIQUE KEY `dni_56` (`dni`),
  ADD UNIQUE KEY `dni_57` (`dni`),
  ADD UNIQUE KEY `dni_58` (`dni`),
  ADD UNIQUE KEY `dni_59` (`dni`),
  ADD UNIQUE KEY `dni_60` (`dni`),
  ADD KEY `idx_nombre_apellido` (`nombre`,`apellido`),
  ADD KEY `idx_dni` (`dni`),
  ADD KEY `obra_social_id` (`obra_social_id`);

--
-- Indices de la tabla `signos_vitales`
--
ALTER TABLE `signos_vitales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `internacion_id` (`internacion_id`),
  ADD KEY `enfermero_id` (`enfermero_id`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `medico_id` (`medico_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`),
  ADD UNIQUE KEY `email_59` (`email`),
  ADD UNIQUE KEY `email_60` (`email`),
  ADD KEY `paciente_id` (`paciente_id`);

--
-- Indices de la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administraciones_medicamentos`
--
ALTER TABLE `administraciones_medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `alas`
--
ALTER TABLE `alas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `camas`
--
ALTER TABLE `camas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `estudios`
--
ALTER TABLE `estudios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `evolucions`
--
ALTER TABLE `evolucions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `habitacions`
--
ALTER TABLE `habitacions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `indicaciones`
--
ALTER TABLE `indicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `internaciones`
--
ALTER TABLE `internaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `signos_vitales`
--
ALTER TABLE `signos_vitales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `visitas`
--
ALTER TABLE `visitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administraciones_medicamentos`
--
ALTER TABLE `administraciones_medicamentos`
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_10` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_100` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_102` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_104` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_106` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_108` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_110` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_111` FOREIGN KEY (`indicacion_id`) REFERENCES `indicaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_112` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_12` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_14` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_16` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_18` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_2` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_20` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_22` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_24` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_26` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_28` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_30` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_32` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_34` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_36` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_38` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_4` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_40` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_42` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_44` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_46` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_48` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_50` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_52` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_54` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_56` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_58` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_6` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_60` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_62` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_64` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_66` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_68` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_70` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_72` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_74` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_76` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_78` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_8` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_80` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_82` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_84` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_86` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_88` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_90` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_92` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_94` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_96` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_98` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_10` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_11` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_12` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_13` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_14` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_15` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_16` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_17` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_18` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_19` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_20` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_21` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_22` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_23` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_24` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_25` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_26` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_27` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_28` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_29` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_30` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_31` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_32` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_33` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_34` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_35` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_36` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_37` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_38` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_39` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_4` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_40` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_41` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_42` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_43` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_44` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_45` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_46` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_47` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_48` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_49` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_5` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_50` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_51` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_52` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_53` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_54` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_55` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_56` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_57` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_58` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_59` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_6` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_7` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_8` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_9` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `camas`
--
ALTER TABLE `camas`
  ADD CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_10` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_11` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_12` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_13` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_14` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_15` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_16` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_17` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_18` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_19` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_2` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_20` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_21` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_22` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_23` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_24` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_25` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_26` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_27` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_28` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_29` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_3` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_30` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_31` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_32` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_33` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_34` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_35` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_36` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_37` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_38` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_39` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_4` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_40` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_41` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_42` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_43` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_44` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_45` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_46` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_47` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_48` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_49` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_5` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_50` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_51` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_52` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_53` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_54` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_55` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_56` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_57` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_58` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_59` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_6` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_7` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_8` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_9` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudios`
--
ALTER TABLE `estudios`
  ADD CONSTRAINT `estudios_ibfk_101` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_104` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_107` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_11` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_110` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_113` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_116` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_119` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_122` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_125` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_128` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_131` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_134` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_137` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_14` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_140` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_143` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_146` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_149` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_152` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_155` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_158` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_161` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_164` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_167` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_17` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_170` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_173` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_175` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_176` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_177` FOREIGN KEY (`internacion_id`) REFERENCES `internaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_20` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_23` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_26` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_29` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_32` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_35` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_38` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_41` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_44` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_47` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_5` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_50` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_53` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_56` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_59` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_62` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_65` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_68` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_71` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_74` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_77` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_8` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_80` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_83` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_86` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_89` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_92` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_95` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_98` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `evolucions`
--
ALTER TABLE `evolucions`
  ADD CONSTRAINT `evolucions_ibfk_10` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_100` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_102` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_104` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_106` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_108` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_110` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_112` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_114` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_116` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_117` FOREIGN KEY (`internacion_id`) REFERENCES `internaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_118` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_12` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_14` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_16` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_18` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_2` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_20` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_22` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_24` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_26` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_28` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_30` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_32` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_34` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_36` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_38` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_4` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_40` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_42` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_44` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_46` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_48` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_50` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_52` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_54` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_56` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_58` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_6` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_60` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_62` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_64` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_66` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_68` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_70` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_72` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_74` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_76` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_78` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_8` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_80` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_82` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_84` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_86` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_88` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_90` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_92` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_94` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_96` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_98` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `habitacions`
--
ALTER TABLE `habitacions`
  ADD CONSTRAINT `habitacions_ibfk_1` FOREIGN KEY (`ala_id`) REFERENCES `alas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `indicaciones`
--
ALTER TABLE `indicaciones`
  ADD CONSTRAINT `indicaciones_ibfk_10` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_100` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_102` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_104` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_106` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_108` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_110` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_112` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_114` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_115` FOREIGN KEY (`internacion_id`) REFERENCES `internaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_116` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_12` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_14` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_16` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_18` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_20` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_22` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_24` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_26` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_28` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_30` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_32` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_34` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_36` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_38` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_4` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_40` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_42` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_44` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_46` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_48` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_50` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_52` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_54` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_56` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_58` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_6` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_60` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_62` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_64` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_66` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_68` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_70` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_72` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_74` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_76` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_78` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_8` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_80` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_82` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_84` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_86` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_88` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_90` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_92` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_94` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_96` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_98` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `internaciones`
--
ALTER TABLE `internaciones`
  ADD CONSTRAINT `internaciones_ibfk_10` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_100` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_102` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_104` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_106` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_108` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_110` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_112` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_114` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_116` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_117` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_118` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_12` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_14` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_16` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_18` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_2` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_20` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_22` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_24` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_26` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_28` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_30` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_32` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_34` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_36` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_38` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_4` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_40` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_42` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_44` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_46` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_48` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_50` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_52` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_54` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_56` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_58` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_6` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_60` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_62` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_64` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_66` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_68` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_70` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_72` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_74` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_76` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_78` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_8` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_80` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_82` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_84` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_86` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_88` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_90` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_92` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_94` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_96` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_98` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`obra_social_id`) REFERENCES `obras_sociales` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `signos_vitales`
--
ALTER TABLE `signos_vitales`
  ADD CONSTRAINT `signos_vitales_ibfk_10` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_100` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_102` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_104` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_106` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_108` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_110` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_112` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_114` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_116` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_117` FOREIGN KEY (`internacion_id`) REFERENCES `internaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_118` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_12` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_14` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_16` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_18` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_2` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_20` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_22` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_24` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_26` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_28` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_30` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_32` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_34` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_36` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_38` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_4` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_40` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_42` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_44` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_46` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_48` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_50` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_52` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_54` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_56` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_58` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_6` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_60` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_62` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_64` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_66` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_68` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_70` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_72` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_74` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_76` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_78` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_8` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_80` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_82` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_84` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_86` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_88` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_90` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_92` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_94` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_96` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_98` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_10` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_100` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_102` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_104` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_106` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_108` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_110` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_112` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_113` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_114` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_12` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_14` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_16` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_18` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_20` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_22` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_24` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_26` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_28` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_30` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_32` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_34` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_36` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_38` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_4` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_40` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_42` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_44` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_46` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_48` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_50` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_52` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_54` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_56` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_58` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_6` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_60` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_62` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_64` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_66` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_68` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_70` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_72` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_74` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_76` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_78` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_8` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_80` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_82` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_84` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_86` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_88` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_90` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_92` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_94` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_96` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_98` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD CONSTRAINT `visitas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
