import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const pool = new Pool({
  user: process.env.SETTINGS_DB_USER,
  host: process.env.SETTINGS_DB_HOST,
  database: process.env.SETTINGS_DB_NAME,
  password: process.env.SETTINGS_DB_PASSWORD,
  port: process.env.SETTINGS_DB_PORT ? parseInt(process.env.SETTINGS_DB_PORT, 10) : 5432,
});

pool.on('connect', () => {
  console.log('SettingsService connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client in SettingsService DB Pool', err);
  process.exit(-1); // Exit if the pool encounters a critical error
});

export const getDBPool = () => pool;

// Optional: Test connection function
export const testDBConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('SettingsService database connection successful.');
  } catch (error) {
    console.error('SettingsService database connection failed:', error);
    throw error; // Re-throw to allow caller to know it failed
  }
};

// Function to gracefully end the pool (e.g., during shutdown)
export const endDBPool = async (): Promise<void> => {
  if (pool) {
    console.log('Closing database pool for SettingsService...');
    await pool.end();
    console.log('Database pool for SettingsService closed.');
  }
};

// Placeholder for migrations - in a real app, use a migration tool like node-pg-migrate
export const runMigrations = async (): Promise<void> => {
  console.log('Placeholder: runMigrations() called. In a real app, this would run actual DB migrations.');
  // Example:
  // const client = await pool.connect();
  // try {
  //   await client.query('BEGIN');
  //   // await client.query('CREATE TABLE IF NOT EXISTS ...'); // Your migration queries
  //   await client.query('COMMIT');
  //   console.log('Migrations applied successfully.');
  // } catch (e) {
  //   await client.query('ROLLBACK');
  //   console.error('Migration failed:', e);
  //   throw e;
  // } finally {
  //   client.release();
  // }
  return Promise.resolve();
};
