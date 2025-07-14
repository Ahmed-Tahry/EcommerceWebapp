import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    username: process.env.DB_USER || 'keycloakadmin',
    password: process.env.DB_PASSWORD || 'StrongPassword123!',
    database: process.env.DB_NAME || 'InvoiceDb',
    host: process.env.DB_HOST || 'postgres-db',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres' as const,
    logging: console.log,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'keycloakadmin',
    password: process.env.DB_PASSWORD || 'StrongPassword123!',
    database: process.env.DB_NAME || 'InvoiceDbTest',
    host: process.env.DB_HOST || 'postgres-db',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres' as const,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres' as const,
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

const dbConfig = config[env as keyof typeof config];

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    ...(env === 'production' && { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }),
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('Invoice Service: Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('Invoice Service: Unable to connect to the database:', error);
    return false;
  }
};

export default sequelize; 