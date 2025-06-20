// Main router file for Phase 1 (renamed from routes.ts for convention)
import { Router } from 'express';
import shopRoutes from './shop.routes';

const router = Router();

router.use('/shop', shopRoutes);

export default router;
