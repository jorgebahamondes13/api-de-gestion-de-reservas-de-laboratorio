const express = require('express');
const reservasRouter = require('./routes/reservas');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'API de reservas de laboratorio' });
});

app.use('/reservas', reservasRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
