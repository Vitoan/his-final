const { Auditoria } = require('../models');

/**
 * Registra una acción en la auditoría
 * @param {string} accion - Ej: "Creó paciente", "Dio de alta", "Canceló internación"
 * @param {string} detalles - Descripción detallada
 * @param {number} usuarioId - ID del usuario que realizó la acción
 * @param {string} ip - IP del usuario (req.ip)
 */
async function registrarAuditoria(accion, detalles, usuarioId, ip = null) {
    try {
        await Auditoria.create({
            accion,
            detalles,
            usuario_id: usuarioId,
            ip: ip || 'N/A'
        });
    } catch (error) {
        console.error('Error al registrar auditoría:', error.message);
    }
}

module.exports = { registrarAuditoria };