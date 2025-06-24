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
  }
};
