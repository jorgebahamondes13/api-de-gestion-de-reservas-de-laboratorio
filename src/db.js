const { MongoClient } = require('mongodb');

const url = process.env.DATABASE_URL;
const collectionName = process.env.COLECCION;
const defaultDbName = process.env.DB_NAME || 'laboratorio_reservas';

let client;
let db;
let isConnected = false;

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

  try {
    console.log('[MongoDB] Intentando conectar...');
    console.log('[MongoDB] URL (sin credenciales):', url.replace(/\/\/.*:.*@/, '//<credentials>@'));
    
    client = new MongoClient(url, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    
    await client.connect();
    console.log('[MongoDB] Conectado al servidor');

    const configuredDbName = getUriDatabaseName(url) || defaultDbName;
    db = client.db(configuredDbName);
    
    console.log(`[MongoDB] Base de datos: ${configuredDbName}`);
    console.log(`[MongoDB] Colección: ${collectionName}`);
    
    isConnected = true;
    console.log('[MongoDB] Estado: CONECTADO ✓');
  } catch (error) {
    console.error('[MongoDB] Error en la conexión:', error.message);
    console.error('[MongoDB] Detalles:', error);
    isConnected = false;
    throw error;
  }
}

function getReservasCollection() {
  if (!isConnected || !db) {
    throw new Error('La conexión a MongoDB no ha sido inicializada o se perdió');
  }

  return db.collection(collectionName);
}

function isMongoConnected() {
  return isConnected;
}

module.exports = {
  connectMongo,
  getReservasCollection,
  isMongoConnected,
};
