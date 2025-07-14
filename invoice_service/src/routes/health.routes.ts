import { Router } from 'express';
import { testConnection } from '@/config/database';

const router = Router();

// Basic health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Invoice Service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Detailed health check with database
router.get('/detailed', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    res.status(200).json({
      status: 'OK',
      service: 'Invoice Service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
      },
      environment: {
        node_env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      service: 'Invoice Service',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      database: {
        status: 'error',
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router; 