import express, { Application, Request, Response, NextFunction } from 'express';
import invoiceRouter from './routes/invoice.routes'; // Import the invoice router
import config from './config/config'; // Import config

// Basic error handler middleware (can be moved to its own file in middlewares/)
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${err.message}`);
    console.error(err.stack);

    // Avoid sending stack trace to client in production
    const statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred.',
        // stack: config.env === 'development' ? err.stack : undefined, // Optionally include stack in dev
    });
};


const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send(`Invoice Service is running on port ${config.port} in ${config.env} mode!`);
});

// API Routes
app.use('/api/invoices', invoiceRouter); // Use the invoice router for /api/invoices path

// Error Handling Middleware - should be the last middleware
app.use(errorHandler);

export default app;
