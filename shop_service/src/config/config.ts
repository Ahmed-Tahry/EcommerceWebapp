// This is a placeholder for configuration
// Environment variables should be loaded here

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
  invoiceServiceInternalUrl?: string;
  // Add other configuration properties here
}

const config: IConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  invoiceServiceInternalUrl: process.env.INVOICE_SERVICE_INTERNAL_URL || 'http://invoice_service:3002',
};

// Basic validation for essential DB config
if (config.env !== 'test' && (!config.db.host || !config.db.user || !config.db.password || !config.db.name)) {
  console.warn(
    'Warning: One or more database configuration variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) are not set. Database connection might fail.'
  );
}

export default config;
