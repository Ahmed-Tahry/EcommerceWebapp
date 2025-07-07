import app from './app';
import http from 'http';
import config from './config/config';
import { testDBConnection, endDBPool, getDBPool } from './utils/db';

let serverInstance: http.Server;

async function startServer() {
  console.log('Invoice Service: Initializing database pool...');
  getDBPool(); // Ensures pool is created using settings from config

  if (config.env !== 'test') { // Don't block server start for tests if DB is down
    console.log('Invoice Service: Testing database connection...');
    const dbConnected = await testDBConnection();

    if (!dbConnected) {
      console.error('FATAL: Invoice Service: Database connection failed. Server will not start or may be unstable.');
      // For critical DB dependency, uncomment next line to prevent server start:
      // process.exit(1);
    } else {
      console.log('Invoice Service: Database connection successful.');
      // Placeholder for running migrations if integrated here
      // try {
      //   console.log('Invoice Service: Running database migrations...');
      //   // await runMigrations(); // If you add runMigrations to db.ts
      //   console.log('Invoice Service: Database migrations completed successfully.');
      // } catch (migrationError) {
      //   console.error('FATAL: Invoice Service: Database migrations failed. Server will not start.', migrationError);
      //   process.exit(1); // Exit if migrations fail
      // }
    }
  } else {
    console.warn('Invoice Service: Running in TEST environment. Skipping initial DB connection test and migrations during startup.');
  }

  serverInstance = app.listen(config.port, () => {
    console.log(`Invoice Service is running on port ${config.port} in ${config.env} mode`);
  });

  serverInstance.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    console.error(`Invoice Service: Failed to start server on port ${config.port}: ${error.message}`);
    process.exit(1);
  });
}

async function shutdown(signal: string) {
  console.log(`Invoice Service: ${signal} received. Shutting down gracefully...`);
  if (serverInstance) {
    serverInstance.close(async (err) => {
      if (err) {
        console.error('Invoice Service: Error during HTTP server closing:', err);
      } else {
        console.log('Invoice Service: HTTP server closed.');
      }

      await endDBPool(); // Ensure DB pool is closed

      if (err) {
        process.exit(1); // Exit with error if server close failed
      } else {
        process.exit(0); // Exit cleanly
      }
    });
  } else {
    console.log('Invoice Service: HTTP server was not running or already closed.');
    await endDBPool();
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C

process.on('unhandledRejection', (reason, promise) => {
  console.error('Invoice Service: Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Invoice Service: Uncaught Exception:', err);
  shutdown('uncaughtException');
});

startServer().catch(error => {
    console.error("Invoice Service: Critical error during server startup:", error);
    process.exit(1);
});

export { app, serverInstance };
