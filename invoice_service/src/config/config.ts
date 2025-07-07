import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

interface IDatabaseConfig {
  host?: string;
  port: number;
  user?: string;
  password?: string;
  name?: string;
}

interface IConfig {
  env: string;
  port: number;
  db: IDatabaseConfig;
  shopServiceUrl?: string; // URL for shop_service
  // Add other configuration properties here
}

const config: IConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.INVOICE_SERVICE_PORT || '3002', 10), // Default port for invoice service
  db: {
    host: process.env.INVOICE_DB_HOST || process.env.DB_HOST, // Fallback to generic DB_HOST if specific one isn't set
    port: parseInt(process.env.INVOICE_DB_PORT || process.env.DB_PORT || '5432', 10),
    user: process.env.INVOICE_DB_USER || process.env.DB_USER,
    password: process.env.INVOICE_DB_PASSWORD || process.env.DB_PASSWORD,
    name: process.env.INVOICE_DB_NAME || 'InvoiceDb', // Default DB name for invoice service
  },
  shopServiceUrl: process.env.SHOP_SERVICE_INTERNAL_URL || 'http://shop_service:3000', // Default internal URL
};

// Basic validation for essential DB config
if (config.env !== 'test' && (!config.db.host || !config.db.user || !config.db.password || !config.db.name)) {
  console.warn(
    'Warning: One or more invoice database configuration variables (INVOICE_DB_HOST, INVOICE_DB_USER, INVOICE_DB_PASSWORD, INVOICE_DB_NAME) are not set. Database connection might fail.'
  );
}

export default config;
