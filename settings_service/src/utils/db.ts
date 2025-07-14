import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
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

// Migration runner for settings service
import * as fs from 'fs/promises';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');

export const runMigrations = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    console.log('Running settings service migrations...');

    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings_schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationFiles = (await fs.readdir(MIGRATIONS_DIR))
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found migration files: ${migrationFiles.join(', ')}`);

    for (const file of migrationFiles) {
      const version = file.split('_')[0]; // Assumes naming like 001_create_tables.sql
      const filePath = path.join(MIGRATIONS_DIR, file);

      const res = await client.query('SELECT version FROM settings_schema_migrations WHERE version = $1', [version]);
      if (res.rowCount === 0) {
        console.log(`Running migration: ${file}`);
        const sql = await fs.readFile(filePath, 'utf-8');
        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query('INSERT INTO settings_schema_migrations (version) VALUES ($1)', [version]);
          await client.query('COMMIT');
          console.log(`Successfully applied migration: ${file}`);
        } catch (migrationError) {
          await client.query('ROLLBACK');
          console.error(`Error running migration ${file}:`, migrationError);
          throw migrationError;
        }
      } else {
        console.log(`Migration ${file} (version ${version}) already applied.`);
      }
    }
    console.log('All settings service migrations processed.');
  } catch (error) {
    console.error('Settings service migration process failed:', error);
    throw error;
  } finally {
    client.release();
  }
};
