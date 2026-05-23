require('dotenv').config();
const app = require('./app');
const { connectMongo } = require('./db');

const PORT = process.env.PORT || 3000;

console.log('Iniciando API de reservas');
console.log('DATABASE_URL definida:', Boolean(process.env.DATABASE_URL));
console.log('COLECCION definida:', Boolean(process.env.COLECCION));
console.log('Puerto:', PORT);

app.listen(PORT, () => {
  console.log(`API de reservas escuchando en http://localhost:${PORT}`);
});

connectMongo()
  .then(() => {
    console.log('Conexión a MongoDB establecida');
  })
  .catch((error) => {
    console.error('Error conectando a MongoDB:', error.stack || error);
    console.error('La API seguirá corriendo, pero las rutas que dependan de MongoDB no estarán disponibles hasta que se resuelva el problema.');
  });
