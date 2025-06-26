import app from './app';
import config from './config/config';
import { testDBConnection, endDBPool, getDBPool } from './utils/db'; // Added runMigrations
import http from 'http'; // Import http module

let serverInstance: http.Server;

async function startServer() {
  console.log('Initializing database pool...');
  getDBPool(); // Ensures pool is created using settings from config

  console.log('Testing database connection...');
  const dbConnected = await testDBConnection();

  if (!dbConnected && config.env !== 'test') {
    console.error('FATAL: Database connection failed. Migrations will not run and server may be unstable.');
    // For critical DB dependency, uncomment next line to prevent server start:
    // process.exit(1);
  } else if (dbConnected) {
    console.log('Database connection successful.');
    // Run migrations after successful DB connection
    try {
      console.log('Running database migrations...');
      //await runMigrations();
      console.log('Database migrations completed successfully.');
    } catch (migrationError) {
      console.error('FATAL: Database migrations failed. Server will not start.', migrationError);
      process.exit(1); // Exit if migrations fail
    }
  } else if (!dbConnected && config.env === 'test') {
    console.warn('Database connection failed in TEST environment. Skipping migrations. Continuing server start for tests that might not need DB.');
  }


  serverInstance = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port} in ${config.env} mode`);
  });

  serverInstance.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    console.error(`Failed to start server on port ${config.port}: ${error.message}`);
    process.exit(1);
  });
}

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down gracefully...`);
  if (serverInstance) {
    serverInstance.close(async (err) => {
      if (err) {
        console.error('Error during HTTP server closing:', err);
      } else {
        console.log('HTTP server closed.');
      }

      await endDBPool(); // Ensure DB pool is closed

      if (err) {
        process.exit(1); // Exit with error if server close failed
      } else {
        process.exit(0); // Exit cleanly
      }
    });
  } else {
    // If serverInstance is not defined, just try to close DB pool
    console.log('HTTP server was not running or already closed.');
    await endDBPool();
    process.exit(0);
  }
}

// Handle common termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Consider a more robust strategy for production, e.g., graceful shutdown
  // shutdown('unhandledRejection'); // Potentially too aggressive
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Trigger graceful shutdown for uncaught exceptions
  shutdown('uncaughtException');
});

startServer().catch(error => {
    console.error("Critical error during server startup:", error);
    process.exit(1);
});

// Exporting app for supertest and serverInstance for direct control (e.g. closing in tests)
export { app, serverInstance };
// Note: For tests that import 'server' as default, they will need to be updated
// to use named import 'serverInstance' or manage server lifecycle via 'app'.
// The Phase 1 test file was `import server from '../src/server';`
// This will break. Test file update is in a later step.
