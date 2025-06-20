// Placeholder for ShopController
// Real implementation will go here if CRUD operations were to be added.

import { Request, Response } from 'express';

export const getShopInfo = (req: Request, res: Response): void => {
  res.status(200).json({ message: 'Shop information placeholder' });
};
