// This is a placeholder for main router file (often named index.ts in this folder)
// It would aggregate all other route files.

import { Router } from 'express';
import shopRoutes from './shop.routes'; // Assuming shop.routes.ts will be created

const router = Router();

router.use('/shop', shopRoutes);
// Add other resource routes here
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);

export default router;
