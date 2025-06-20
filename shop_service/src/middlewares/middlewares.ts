// This is a placeholder for custom middleware
import { Request, Response, NextFunction } from 'express';

export const exampleMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Example middleware executed');
  // Example: Add a custom header
  // req.customProperty = 'Hello from middleware';
  next();
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(`Error: ${err.message}`, { stack: err.stack });
    // Avoid sending stack trace to client in production
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use existing status code if set, otherwise 500
    res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred.',
        // stack: process.env.NODE_ENV === 'production' ? undefined : err.stack, // Optionally include stack in dev
    });
};
