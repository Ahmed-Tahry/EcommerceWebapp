require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'keycloakadmin',
    password: process.env.DB_PASSWORD || 'StrongPassword123!',
    database: process.env.DB_NAME || 'InvoiceDb',
    host: process.env.DB_HOST || 'postgres-db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
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
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
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