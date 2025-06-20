import { Request, Response, NextFunction } from 'express';
import { getDBPool } from '../utils/db'; // Ensure this path is correct

export const getShopInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pool = getDBPool();
    const dbResult = await pool.query('SELECT NOW() as currentTime;');
    res.status(200).json({
      message: 'Shop information with current DB time',
      databaseTime: dbResult.rows[0]?.currentTime || 'N/A',
    });
  } catch (error) {
    console.error('Error in getShopInfo controller while querying DB:', error);
    // Pass error to the central error handling middleware
    next(error);
  }
};
