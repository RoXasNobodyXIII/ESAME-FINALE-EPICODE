const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'sudpontino';

let client;
let db;

async function connectToDB() {
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment');
  }
  if (db) return db;

  client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  db = client.db(DB_NAME);

  // Seed initial data only if empty
  await seedIfNeeded(db);

  return db;
}

async function seedIfNeeded(db) {
  // Users
  const usersCol = db.collection('users');
  await usersCol.createIndex({ username: 1 }, { unique: true });
  // Helper to get next incremental id
  const getNextId = async () => {
    const last = await usersCol.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
    return last.length ? (Number(last[0].id) || 0) + 1 : 1;
  };
  // Ensure admin exists
  const admin = await usersCol.findOne({ username: 'admin' });
  if (!admin) {
    const nextId = await getNextId();
    await usersCol.updateOne(
      { username: 'admin' },
      {
        $setOnInsert: {
          id: nextId,
          username: 'admin',
          password: '$2a$10$Y7s2IECmU/LVyUVYGUzlpuC7MVySDRWKG1S3o7iwGVOsEmx.42VrG',
          role: 'admin',
          email: 'admin@example.com',
        },
      },
      { upsert: true }
    );
  }
  // Do not seed additional test users or sample people

  // Fogli marcia: ensure indexes
  const fmCol = db.collection('fogli_marcia');
  try {
    await fmCol.createIndex({ id: 1 }, { unique: true, name: 'uniq_numeric_id' });
  } catch (_) { /* ignore if exists */ }
  try {
    await fmCol.createIndex({ serviceCode: 1 }, { name: 'idx_service_code' });
  } catch (_) { /* ignore if exists */ }
}

function getDB() {
  if (!db) throw new Error('Database not initialized. Call connectToDB() first.');
  return db;
}

module.exports = { connectToDB, getDB };
