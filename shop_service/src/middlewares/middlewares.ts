import { Request, Response, NextFunction } from 'express';

export const exampleMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Example middleware executed');
  next();
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(`Error: ${err.message}`, { stack: err.stack });
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred.',
        // stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};
