const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const { isMongoConnected, getLastMongoError } = require('./db');
const reservasRouter = require('./routes/reservas');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'API de reservas de laboratorio',
    mongoConnected: isMongoConnected(),
    mongoError: getLastMongoError()
  });
});

app.get('/health', (req, res) => {
  const mongoStatus = isMongoConnected();
  res.json({
    api: 'ok',
    mongodb: mongoStatus ? 'connected' : 'disconnected',
    mongodbError: getLastMongoError(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

app.use('/reservas', reservasRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
