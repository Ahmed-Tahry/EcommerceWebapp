import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import settingsRoutes from './routes/settings.routes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routes
app.use('/settings', settingsRoutes); // Mount settings routes under /settings prefix

// Basic Root Route
app.get('/', (req: Request, res: Response) => {
  res.send('Settings Service is running!');
});

// Global Error Handler (simple version)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  // Check if the error has a status code, otherwise default to 500
  const statusCode = (err as any).statusCode || 500;
  // Send a JSON response
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred.',
    // Optionally, include stack in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});


export default app;
