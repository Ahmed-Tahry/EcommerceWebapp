import { testConnection } from './config/database';

async function healthCheck() {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('Health check failed: Database not connected');
      process.exit(1);
    }
    
    console.log('Health check passed: All systems operational');
    process.exit(0);
  } catch (error) {
    console.error('Health check failed:', error);
    process.exit(1);
  }
}

healthCheck(); 