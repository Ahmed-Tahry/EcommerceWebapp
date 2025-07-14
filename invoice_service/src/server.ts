import app, { initializeApp } from './app';
import http from 'http';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

let serverInstance: http.Server;

async function startServer() {
  try {
    // Initialize the application (database, models, etc.)
    await initializeApp();

    // Create HTTP server
    serverInstance = app.listen(PORT, () => {
      console.log(`Invoice Service: Server running on port ${PORT} in ${NODE_ENV} mode`);
      console.log(`Invoice Service: Health check available at http://localhost:${PORT}/health`);
    });

    // Handle server errors
    serverInstance.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      console.error(`Invoice Service: Failed to start server on port ${PORT}: ${error.message}`);
      process.exit(1);
    });

  } catch (error) {
    console.error('Invoice Service: Critical error during server startup:', error);
    process.exit(1);
  }
}

// Graceful shutdown function
async function shutdown(signal: string) {
  console.log(`Invoice Service: ${signal} received. Shutting down gracefully...`);
  
  if (serverInstance) {
    serverInstance.close(async (err) => {
      if (err) {
        console.error('Invoice Service: Error during HTTP server closing:', err);
      } else {
        console.log('Invoice Service: HTTP server closed.');
      }

      // Close database connection
      try {
        const { sequelize } = await import('./config/database');
        await sequelize.close();
        console.log('Invoice Service: Database connection closed.');
      } catch (dbError) {
        console.error('Invoice Service: Error closing database connection:', dbError);
      }

      if (err) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  } else {
    console.log('Invoice Service: HTTP server was not running.');
    process.exit(0);
  }
}

// Handle termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Invoice Service: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Invoice Service: Uncaught Exception:', err);
  shutdown('uncaughtException');
});

// Start the server
startServer().catch(error => {
  console.error("Invoice Service: Critical error during server startup:", error);
  process.exit(1);
});

// Export for testing
export { app, serverInstance }; 