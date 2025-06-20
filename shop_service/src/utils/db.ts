import { Pool, PoolConfig } from 'pg';
import config from '../config/config';

let pool: Pool | null = null;

const dbConfig: PoolConfig = {
  user: config.db.user,
  host: config.db.host,
  database: config.db.name,
  password: config.db.password,
  port: config.db.port,
  ssl: config.env === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: config.env === 'test' ? 1000 : 5000, // Shorter timeout for tests
};

export const getDBPool = (): Pool => {
  if (!pool) {
    if (!config.db.host || !config.db.user || !config.db.password || !config.db.name) {
        const errorMessage = 'Database configuration is incomplete. Cannot create connection pool.';
        console.error(`FATAL ERROR: ${errorMessage} Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.`);
        throw new Error(errorMessage);
    }
    pool = new Pool(dbConfig);

    pool.on('connect', (client) => {
      console.log(`Database pool: client connected. Pool totalCount: ${pool?.totalCount}, idleCount: ${pool?.idleCount}, waitingCount: ${pool?.waitingCount}`);
    });

    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client in database pool', err);
    });

    // Graceful shutdown for the pool (e.g. when app terminates)
    // This is more robustly handled in server.ts shutdown hooks now.
    // process.on('SIGINT', () => endDBPool().finally(() => process.exit(0)));
    // process.on('SIGTERM', () => endDBPool().finally(() => process.exit(0)));
  }
  return pool;
};

export const testDBConnection = async (): Promise<boolean> => {
  const currentPool = getDBPool(); // Ensures pool is initialized
  let client;
  try {
    client = await currentPool.connect();
    console.log('Successfully connected to the database via pool client.');
    const res = await client.query('SELECT NOW()');
    console.log('PostgreSQL current time from pool client:', res.rows[0].now);
    return true;
  } catch (error) {
    console.error('Failed to connect to the database or query failed:', error);
    if (error instanceof Error) {
        if (error.message.includes('database') && error.message.includes('does not exist')) {
            console.warn(`Attempted to connect to database "${config.db.name}", but it does not exist. Please ensure it is created.`);
        } else if (error.message.includes('password authentication failed')) {
            console.warn(`Password authentication failed for user "${config.db.user}". Please check credentials.`);
        }
    }
    return false;
  } finally {
    if (client) {
      client.release();
      console.log('Database client released.');
    }
  }
};

export const endDBPool = async (): Promise<void> => {
    if (pool) {
        console.log('Attempting to close database pool...');
        try {
            await pool.end();
            console.log('Database pool has been closed successfully.');
            pool = null; // Reset pool variable
        } catch (error) {
            console.error('Error closing database pool:', error);
        }
    } else {
        console.log('Database pool was not initialized or already closed.');
    }
};
