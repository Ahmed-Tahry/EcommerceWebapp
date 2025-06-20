import express, { Application, Request, Response, NextFunction } from 'express';
import mainRouter from './routes'; // Will be created later

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Shop Service is running!');
});

// API Routes
app.use('/api', mainRouter);

// Error Handling Middleware (Example)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
