import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { testConnection, sequelize } from '@/config/database';
import { initializeModels } from '@/models';
import invoiceRoutes from '@/routes/invoice.routes';
import templateRoutes from '@/routes/template.routes';
import settingsRoutes from '@/routes/settings.routes';
import healthRoutes from '@/routes/health.routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID', 'X-User-Roles']
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - User: ${req.headers['x-user-id'] || 'anonymous'}`);
  next();
});

// Health check route
app.use('/health', healthRoutes);

// API routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/settings', settingsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Invoice Service API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Initialize database and models
const initializeApp = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Initialize Sequelize models
    await initializeModels();
    
    console.log('Invoice Service: Application initialized successfully');
  } catch (error) {
    console.error('Invoice Service: Failed to initialize application:', error);
    process.exit(1);
  }
};

export { initializeApp };
export default app; 