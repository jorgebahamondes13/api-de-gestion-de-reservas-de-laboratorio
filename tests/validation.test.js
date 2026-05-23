const { normalizeText, validateReserva } = require('../src/utils/validation');

describe('Validación de datos', () => {
  describe('normalizeText', () => {
    it('debe convertir a minúsculas', () => {
      expect(normalizeText('LUNES')).toBe('lunes');
    });

    it('debe remover espacios', () => {
      expect(normalizeText('  lunes  ')).toBe('lunes');
    });

    it('debe manejar null/undefined', () => {
      expect(normalizeText(null)).toBe('');
      expect(normalizeText(undefined)).toBe('');
    });
  });

  describe('validateReserva', () => {
    it('debe validar una reserva correcta', () => {
      const reserva = {
        usuario: 'docente1',
        rol: 'docente',
        dia: 'lunes',
        bloque: '08:00-09:00',
        materia: 'Matemáticas',
      };
      const errors = validateReserva(reserva);
      expect(errors.length).toBe(0);
    });

    it('debe rechazar día inválido', () => {
      const reserva = {
        usuario: 'docente1',
        rol: 'docente',
        dia: 'sabado',
        bloque: '08:00-09:00',
      };
      const errors = validateReserva(reserva);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('dia');
    });

    it('debe rechazar bloque inválido', () => {
      const reserva = {
        usuario: 'docente1',
        rol: 'docente',
        dia: 'lunes',
        bloque: '25:00-26:00',
      };
      const errors = validateReserva(reserva);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debe rechazar rol inválido', () => {
      const reserva = {
        usuario: 'docente1',
        rol: 'usuario_comun',
        dia: 'lunes',
        bloque: '08:00-09:00',
      };
      const errors = validateReserva(reserva);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debe rechazar si falta usuario', () => {
      const reserva = {
        rol: 'docente',
        dia: 'lunes',
        bloque: '08:00-09:00',
      };
      const errors = validateReserva(reserva);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('usuario');
    });
  });
});
