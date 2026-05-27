-- SQL Dump for HIS Hospital (MySQL/MariaDB - XAMPP)
-- Base de datos: `his_hospital`
-- --------------------------------------------------------

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "-03:00";

CREATE DATABASE IF NOT EXISTS `his_hospital` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `his_hospital`;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `alas`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `alas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL UNIQUE,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `habitacions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `habitacions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero` varchar(255) NOT NULL,
  `tipo` enum('Individual','Compartida','Shockroom') DEFAULT 'Individual',
  `ala_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ala_id` (`ala_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `camas`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `camas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero_cama` int(11) DEFAULT NULL,
  `estado` enum('Disponible','Ocupada','Mantenimiento','Limpieza') DEFAULT 'Disponible',
  `habitacion_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `habitacion_id` (`habitacion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `pacientes`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pacientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `dni` varchar(255) DEFAULT NULL UNIQUE,
  `es_nn` boolean NOT NULL DEFAULT FALSE,
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `usuarios`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `rol` enum('Admin','Medico','Enfermeria','Admision','Paciente') NOT NULL DEFAULT 'Admision',
  `paciente_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `internacions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `internacions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `origen` enum('Guardia','Consultorio Externo','Derivacion') DEFAULT 'Guardia',
  `prioridad_triage` enum('Verde','Amarillo','Rojo') DEFAULT 'Verde',
  `motivo` text DEFAULT NULL,
  `estado` enum('Activa','Alta_Medica','Traslado','Defuncion','Cancelada') DEFAULT 'Activa',
  `resumen_epicrisis` text DEFAULT NULL,
  `recetas` text DEFAULT NULL,
  `recomendaciones` text DEFAULT NULL,
  `seguimiento` text DEFAULT NULL,
  `fecha_ingreso` datetime DEFAULT NULL,
  `fecha_egreso` datetime DEFAULT NULL,
  `cama_id` int(11) DEFAULT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `cama_id` (`cama_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `evolucions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `evolucions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` enum('Medico','Enfermeria') NOT NULL,
  `nota` text NOT NULL,
  `signos_vitales` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`signos_vitales`)),
  `fecha` datetime DEFAULT NULL,
  `internacion_id` int(11) DEFAULT NULL,
  `autor_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `internacion_id` (`internacion_id`),
  KEY `autor_id` (`autor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `signos_vitales`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `signos_vitales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `presion_arterial` varchar(255) DEFAULT NULL,
  `frecuencia_cardiaca` int(11) DEFAULT NULL,
  `frecuencia_respiratoria` int(11) DEFAULT NULL,
  `temperatura` decimal(4,1) DEFAULT NULL,
  `saturacion_oxigeno` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `internacion_id` int(11) DEFAULT NULL,
  `enfermero_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `internacion_id` (`internacion_id`),
  KEY `enfermero_id` (`enfermero_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `indicaciones`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `indicaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` text NOT NULL,
  `dosis` varchar(255) DEFAULT NULL,
  `frecuencia` varchar(255) DEFAULT NULL,
  `estado` enum('Activa','Suspendida','Finalizada') NOT NULL DEFAULT 'Activa',
  `fecha_indicacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `internacion_id` int(11) DEFAULT NULL,
  `medico_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `internacion_id` (`internacion_id`),
  KEY `medico_id` (`medico_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `administraciones_medicamentos`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `administraciones_medicamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dosis_aplicada` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_administracion` datetime DEFAULT CURRENT_TIMESTAMP,
  `indicacion_id` int(11) DEFAULT NULL,
  `enfermero_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `indicacion_id` (`indicacion_id`),
  KEY `enfermero_id` (`enfermero_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `auditoria`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accion` varchar(255) NOT NULL,
  `detalles` text DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `visitas`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `visitas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `motivo` varchar(255) NOT NULL,
  `prioridad` enum('Baja','Media','Alta/Emergencia') DEFAULT 'Baja',
  `estado` enum('Esperando','En Atención','Finalizado','Derivado a Internación') DEFAULT 'Esperando',
  `tipo_ingreso` varchar(255) DEFAULT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `turnos`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `turnos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `especialidad` varchar(255) NOT NULL DEFAULT 'Medicina General',
  `motivo` varchar(255) DEFAULT NULL,
  `estado` enum('Programado','Asistió','Cancelado') DEFAULT 'Programado',
  `paciente_id` int(11) DEFAULT NULL,
  `medico_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `medico_id` (`medico_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `estudios`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `estudios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_estudio` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `estado` enum('Pendiente','Realizado','Cancelado') DEFAULT 'Pendiente',
  `resultado` text DEFAULT NULL,
  `fecha_realizacion` datetime DEFAULT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `medico_id` int(11) DEFAULT NULL,
  `internacion_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `medico_id` (`medico_id`),
  KEY `internacion_id` (`internacion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Restricciones de Claves Foráneas
-- --------------------------------------------------------
ALTER TABLE `habitacions`
  ADD CONSTRAINT `habitacions_ibfk_1` FOREIGN KEY (`ala_id`) REFERENCES `alas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `camas`
  ADD CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `internacions`
  ADD CONSTRAINT `internacions_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_2` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `evolucions`
  ADD CONSTRAINT `evolucions_ibfk_1` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_2` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `signos_vitales`
  ADD CONSTRAINT `signos_vitales_ibfk_1` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signos_vitales_ibfk_2` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `indicaciones`
  ADD CONSTRAINT `indicaciones_ibfk_1` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `indicaciones_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `administraciones_medicamentos`
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_1` FOREIGN KEY (`indicacion_id`) REFERENCES `indicaciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `administraciones_medicamentos_ibfk_2` FOREIGN KEY (`enfermero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `visitas`
  ADD CONSTRAINT `visitas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `estudios`
  ADD CONSTRAINT `estudios_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `estudios_ibfk_3` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
