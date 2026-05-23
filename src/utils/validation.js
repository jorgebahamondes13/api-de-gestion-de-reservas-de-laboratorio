const WEEK_DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
const BLOQUES_VALIDOS = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00'];

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function validateReserva(payload) {
  const errors = [];

  if (!payload.usuario) {
    errors.push('El campo usuario es obligatorio');
  }

  if (!['docente', 'administrador'].includes(payload.rol)) {
    errors.push('El rol debe ser docente o administrador');
  }

  if (!WEEK_DAYS.includes(payload.dia)) {
    errors.push('El campo dia debe ser uno de lunes, martes, miercoles, jueves o viernes');
  }

  if (!BLOQUES_VALIDOS.includes(payload.bloque)) {
    errors.push(`El campo bloque debe ser uno de: ${BLOQUES_VALIDOS.join(', ')}`);
  }

  return errors;
}

module.exports = {
  normalizeText,
  validateReserva,
  WEEK_DAYS,
  BLOQUES_VALIDOS,
};
