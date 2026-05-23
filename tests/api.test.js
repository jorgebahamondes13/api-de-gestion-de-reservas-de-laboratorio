const app = require('../app');
const { getReservasCollection } = require('../db');

describe('API de Reservas', () => {
  beforeAll(async () => {
    // No conectamos a MongoDB en tests; mockeamos la colección
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe('GET /', () => {
    it('debe retornar el estado de la API', async () => {
      const response = await require('supertest')(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('API de reservas de laboratorio');
    });
  });

  describe('GET /api-docs', () => {
    it('debe servir la documentación Swagger UI', async () => {
      const response = await require('supertest')(app).get('/api-docs');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Swagger UI');
    });
  });

  describe('GET /reservas', () => {
    it('debe retornar lista de reservas (vacía si no hay)', async () => {
      // Mock de la colección
      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      };

      jest.spyOn(require('../db'), 'getReservasCollection').mockReturnValue(mockCollection);

      const response = await require('supertest')(app).get('/reservas');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debe retornar error 500 si la conexión falla', async () => {
      const mockCollection = {
        find: jest.fn().mockImplementation(() => {
          throw new Error('Conexión fallida');
        }),
      };

      jest.spyOn(require('../db'), 'getReservasCollection').mockReturnValue(mockCollection);

      const response = await require('supertest')(app).get('/reservas');
      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /reservas', () => {
    it('debe crear una reserva válida', async () => {
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: jest.fn().mockResolvedValue({ insertedId: '123' }),
      };

      jest.spyOn(require('../db'), 'getReservasCollection').mockReturnValue(mockCollection);

      const response = await require('supertest')(app)
        .post('/reservas')
        .send({
          usuario: 'docente1',
          rol: 'docente',
          dia: 'lunes',
          bloque: '08:00-09:00',
          materia: 'Matemáticas',
          descripcion: 'Clase de programación',
        });

      expect(response.status).toBe(201);
      expect(response.body.insertedId).toBe('123');
    });

    it('debe rechazar una reserva si el bloque ya está ocupado', async () => {
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue({ _id: 'existing', dia: 'lunes', bloque: '08:00-09:00' }),
      };

      jest.spyOn(require('../db'), 'getReservasCollection').mockReturnValue(mockCollection);

      const response = await require('supertest')(app)
        .post('/reservas')
        .send({
          usuario: 'docente2',
          rol: 'docente',
          dia: 'lunes',
          bloque: '08:00-09:00',
          materia: 'Física',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain('ya se encuentra reservado');
    });

    it('debe rechazar una reserva con día inválido', async () => {
      const response = await require('supertest')(app)
        .post('/reservas')
        .send({
          usuario: 'docente1',
          rol: 'docente',
          dia: 'sabado',
          bloque: '08:00-09:00',
          materia: 'Matemáticas',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('debe rechazar una reserva con bloque inválido', async () => {
      const response = await require('supertest')(app)
        .post('/reservas')
        .send({
          usuario: 'docente1',
          rol: 'docente',
          dia: 'lunes',
          bloque: '20:00-21:00',
          materia: 'Matemáticas',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('debe rechazar una reserva sin usuario', async () => {
      const response = await require('supertest')(app)
        .post('/reservas')
        .send({
          rol: 'docente',
          dia: 'lunes',
          bloque: '08:00-09:00',
          materia: 'Matemáticas',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /reservas/disponibilidad', () => {
    it('debe retornar disponibilidad para un día específico', async () => {
      const mockCollection = {
        find: jest.fn().mockResolvedValue([
          { dia: 'lunes', bloque: '08:00-09:00' },
        ]),
      };

      jest.spyOn(require('../db'), 'getReservasCollection').mockReturnValue(mockCollection);

      const response = await require('supertest')(app)
        .get('/reservas/disponibilidad')
        .query({ dia: 'lunes' });

      expect(response.status).toBe(200);
      expect(response.body.disponibilidad).toBeDefined();
      expect(Array.isArray(response.body.disponibilidad)).toBe(true);
    });
  });

  describe('GET /reservas/usuario/:usuario', () => {
    it('debe retornar reservas de un usuario específico', async () => {
      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([
          { usuario: 'docente1', dia: 'lunes', bloque: '08:00-09:00' },
        ]),
      };

      jest.spyOn(require('../db'), 'getReservasCollection').mockReturnValue(mockCollection);

      const response = await require('supertest')(app)
        .get('/reservas/usuario/docente1');

      expect(response.status).toBe(200);
      expect(response.body.usuario).toBe('docente1');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('DELETE /reservas/:id', () => {
    it('debe eliminar una reserva existente', async () => {
      const mockCollection = {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      };

      jest.spyOn(require('../db'), 'getReservasCollection').mockReturnValue(mockCollection);

      const response = await require('supertest')(app)
        .delete('/reservas/507f1f77bcf86cd799439011');

      expect(response.status).toBe(200);
      expect(response.body.deletedId).toBeDefined();
    });

    it('debe retornar 404 si la reserva no existe', async () => {
      const mockCollection = {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      };

      jest.spyOn(require('../db'), 'getReservasCollection').mockReturnValue(mockCollection);

      const response = await require('supertest')(app)
        .delete('/reservas/507f1f77bcf86cd799439011');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('no encontrada');
    });

    it('debe rechazar un ID de reserva inválido', async () => {
      const response = await require('supertest')(app)
        .delete('/reservas/id-invalido');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('inválido');
    });
  });

  describe('Rutas no encontradas', () => {
    it('debe retornar 404 para rutas inexistentes', async () => {
      const response = await require('supertest')(app)
        .get('/ruta-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });
});
