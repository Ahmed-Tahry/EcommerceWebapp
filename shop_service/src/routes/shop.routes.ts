// Placeholder for ShopRoutes
import { Router } from 'express';
import { getShopInfo } from '../controllers/shop.controller'; // Assuming shop.controller.ts exists

const router = Router();

// Example route (no CRUD as per request)
router.get('/info', getShopInfo);

// If CRUD were added, routes like these would be here:
// router.post('/', createShopItem);
// router.get('/:id', getShopItemById);
// router.put('/:id', updateShopItem);
// router.delete('/:id', deleteShopItem);

export default router;
