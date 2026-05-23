const express = require('express');
const { ObjectId } = require('mongodb');
const { getReservasCollection } = require('../db');
const { normalizeText, validateReserva, WEEK_DAYS, BLOQUES_VALIDOS } = require('../utils/validation');

const router = express.Router();

function buildReservaPayload(body) {
  return {
    usuario: String(body.usuario || '').trim(),
    rol: String(body.rol || 'docente').trim().toLowerCase(),
    dia: normalizeText(body.dia),
    bloque: String(body.bloque || '').trim(),
    materia: String(body.materia || '').trim(),
    descripcion: String(body.descripcion || '').trim(),
    creadoEn: new Date(),
  };
}

router.get('/', async (req, res) => {
  try {
    const collection = getReservasCollection();
    const reservas = await collection.find({}).sort({ dia: 1, bloque: 1 }).toArray();
    res.json({ data: reservas });
  } catch (error) {
    console.error('Error listando reservas:', error);
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
});

router.get('/disponibilidad', async (req, res) => {
  try {
    const collection = getReservasCollection();
    const filtro = {};

    if (req.query.dia) {
      filtro.dia = normalizeText(req.query.dia);
    }

    if (req.query.bloque) {
      filtro.bloque = String(req.query.bloque).trim();
    }

    const reservadas = await collection.find(filtro).toArray();
    const disponibles = [];

    if (filtro.dia) {
      for (const bloque of BLOQUES_VALIDOS) {
        const ocupada = reservadas.some((item) => item.bloque === bloque);
        disponibles.push({ bloque, disponible: !ocupada });
      }
    }

    res.json({ query: filtro, reservadas, disponibilidad: filtro.dia ? disponibles : undefined });
  } catch (error) {
    console.error('Error consultando disponibilidad:', error);
    res.status(500).json({ error: 'Error al consultar disponibilidad' });
  }
});

router.get('/usuario/:usuario', async (req, res) => {
  try {
    const usuario = String(req.params.usuario || '').trim();
    const collection = getReservasCollection();
    const reservas = await collection.find({ usuario }).sort({ dia: 1, bloque: 1 }).toArray();
    res.json({ usuario, data: reservas });
  } catch (error) {
    console.error('Error listando reservas por usuario:', error);
    res.status(500).json({ error: 'Error al obtener reservas del usuario' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = buildReservaPayload(req.body);
    const errors = validateReserva(payload);

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const collection = getReservasCollection();
    const existencia = await collection.findOne({ dia: payload.dia, bloque: payload.bloque });

    if (existencia) {
      return res.status(409).json({ error: 'El bloque horario ya se encuentra reservado' });
    }

    const resultado = await collection.insertOne(payload);
    res.status(201).json({ insertedId: resultado.insertedId, data: payload });
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Id de reserva inválido' });
    }

    const collection = getReservasCollection();
    const resultado = await collection.deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ deletedId: id });
  } catch (error) {
    console.error('Error eliminando reserva:', error);
    res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
});

module.exports = router;
