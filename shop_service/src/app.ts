import express, { Application, Request, Response, NextFunction } from 'express';
import mainRouter from './routes'; // Corrected from './routes/index' to './routes'
import { errorHandler } from './middlewares/middlewares';
import config from './config/config';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Shop Service is running! (Phase 1)');
});

// API Routes
app.use('/api', mainRouter);

// Error Handling Middleware - should be last middleware
app.use(errorHandler);

export default app;
