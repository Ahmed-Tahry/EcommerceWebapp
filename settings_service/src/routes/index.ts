// Main router file for Phase 1 (renamed from routes.ts for convention)
import { Router } from 'express';
import settingsRoutes from './settings.routes';

const router = Router();

router.use('/settings', settingsRoutes);

export default router;
