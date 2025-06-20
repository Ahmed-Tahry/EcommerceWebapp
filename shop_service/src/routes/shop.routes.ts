import { Router } from 'express';
import { getShopInfo } from '../controllers/shop.controller';

const router = Router();

router.get('/info', getShopInfo);

export default router;
