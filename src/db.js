const { MongoClient } = require('mongodb');

const url = process.env.DATABASE_URL || process.env.MONGODB_URI || process.env.MONGO_URI;
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

function buildConnectionUrl(rawUrl) {
  if (!rawUrl) {
    return null;
  }

  const hasQuery = rawUrl.includes('?');
  const hasDbName = getUriDatabaseName(rawUrl) !== null;
  const baseUrl = rawUrl.replace(/\?(.+)$/, '');

  const dbName = hasDbName ? '' : `/${defaultDbName}`;
  const options = hasQuery ? '' : '?retryWrites=true&w=majority';

  return `${baseUrl}${dbName}${options}`;
}

async function connectMongo(retries = 3, delayMs = 5000) {
  if (!url) {
    throw new Error('La variable de entorno DATABASE_URL, MONGODB_URI o MONGO_URI no está definida');
  }

  if (!collectionName) {
    throw new Error('La variable de entorno COLECCION no está definida');
  }

  const connectionUrl = buildConnectionUrl(url);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      console.log(`[MongoDB] Intento ${attempt} de conectar...`);
      console.log('[MongoDB] URL (sin credenciales):', connectionUrl.replace(/\/\/.*:.*@/, '//<credentials>@'));

      client = new MongoClient(connectionUrl, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        appName: 'reservas-laboratorio',
        tls: true
      });

      await client.connect();
      console.log('[MongoDB] Conectado al servidor');

      const configuredDbName = getUriDatabaseName(connectionUrl) || defaultDbName;
      db = client.db(configuredDbName);

      console.log(`[MongoDB] Base de datos: ${configuredDbName}`);
      console.log(`[MongoDB] Colección: ${collectionName}`);

      isConnected = true;
      console.log('[MongoDB] Estado: CONECTADO ✓');
      return;
    } catch (error) {
      console.error(`[MongoDB] Error en la conexión en intento ${attempt}:`, error.message);
      if (attempt === retries) {
        console.error('[MongoDB] Se agotaron los intentos de conexión.');
        isConnected = false;
        throw error;
      }
      console.log(`[MongoDB] Reintentando en ${delayMs / 1000} segundos...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
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
