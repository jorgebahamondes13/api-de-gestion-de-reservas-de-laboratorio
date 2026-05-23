const { MongoClient } = require('mongodb');

const url = process.env.DATABASE_URL;
const collectionName = process.env.COLECCION;
const defaultDbName = process.env.DB_NAME || 'laboratorio_reservas';

let client;
let db;

function getUriDatabaseName(uri) {
  if (!uri) {
    return null;
  }

  const match = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/);
  if (!match || !match[1]) {
    return null;
  }

  return match[1].replace(/\/|\?/g, '') || null;
}

async function connectMongo() {
  if (!url) {
    throw new Error('La variable de entorno DATABASE_URL no está definida');
  }

  if (!collectionName) {
    throw new Error('La variable de entorno COLECCION no está definida');
  }

  client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  const configuredDbName = getUriDatabaseName(url) || defaultDbName;
  db = client.db(configuredDbName);

  console.log(`Conectado a MongoDB en ${configuredDbName}, colección ${collectionName}`);
}

function getReservasCollection() {
  if (!db) {
    throw new Error('La conexión a MongoDB no ha sido inicializada');
  }

  return db.collection(collectionName);
}

module.exports = {
  connectMongo,
  getReservasCollection,
};
