import { Pool, PoolConfig } from 'pg';
import config from '../config/config';

let pool: Pool | null = null;

const dbConfig: PoolConfig = {
  user: config.db.user,
  host: config.db.host,
  database: config.db.name,
  password: config.db.password,
  port: config.db.port,
  ssl: config.env === 'production' ? { rejectUnauthorized: false } : false, // Basic SSL for production
  max: 20, // Max number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: config.env === 'test' ? 2000 : 5000, // How long to wait for a connection
};

export const getDBPool = (): Pool => {
  if (!pool) {
    if (!config.db.host || !config.db.user || !config.db.name) { // Password can be empty for some local setups
        const errorMessage = 'Invoice Service: Database configuration is incomplete. Cannot create connection pool.';
        console.error(`FATAL ERROR: ${errorMessage} Check INVOICE_DB_HOST, INVOICE_DB_USER, INVOICE_DB_NAME.`);
        throw new Error(errorMessage);
    }
    pool = new Pool(dbConfig);

    pool.on('connect', (client) => {
      console.log(`Invoice Service DB Pool: client connected. Pool totalCount: ${pool?.totalCount}, idleCount: ${pool?.idleCount}, waitingCount: ${pool?.waitingCount}`);
    });

    pool.on('error', (err, client) => {
      console.error('Invoice Service DB Pool: Unexpected error on idle client', err);
      // Recommended: implement more robust error handling or reconnect logic if needed
    });
  }
  return pool;
};

export const testDBConnection = async (): Promise<boolean> => {
  const currentPool = getDBPool(); // Ensures pool is initialized
  let client;
  try {
    client = await currentPool.connect();
    console.log('Invoice Service: Successfully connected to the database via pool client.');
    const res = await client.query('SELECT NOW()');
    console.log('Invoice Service: PostgreSQL current time from pool client:', res.rows[0].now);
    return true;
  } catch (error) {
    console.error('Invoice Service: Failed to connect to the database or query failed:', error);
    if (error instanceof Error) {
        if (error.message.includes('database') && error.message.includes('does not exist')) {
            console.warn(`Invoice Service: Attempted to connect to database "${config.db.name}", but it does not exist. Please ensure it is created.`);
        } else if (error.message.includes('password authentication failed')) {
            console.warn(`Invoice Service: Password authentication failed for user "${config.db.user}". Please check credentials.`);
        }
    }
    return false;
  } finally {
    if (client) {
      client.release();
      console.log('Invoice Service: Database client released.');
    }
  }
};

export const endDBPool = async (): Promise<void> => {
    if (pool) {
        console.log('Invoice Service: Attempting to close database pool...');
        try {
            await pool.end();
            console.log('Invoice Service: Database pool has been closed successfully.');
            pool = null; // Reset pool variable
        } catch (error) {
            console.error('Invoice Service: Error closing database pool:', error);
        }
    } else {
        console.log('Invoice Service: Database pool was not initialized or already closed.');
    }
};

// Migration runner logic can be added here or managed separately
// For now, ensure you have a way to run the SQL scripts in the migrations folder.
// Example: psql -U youruser -d YourInvoiceDb -f migrations/001_create_invoices_table.sql
// Or use a migration tool like node-pg-migrate, Knex.js migrations, etc.
