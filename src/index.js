require('dotenv').config();
const app = require('./app');
const { connectMongo } = require('./db');

const PORT = process.env.PORT || 3000;

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API de reservas escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error iniciando la API:', error);
    process.exit(1);
  });
