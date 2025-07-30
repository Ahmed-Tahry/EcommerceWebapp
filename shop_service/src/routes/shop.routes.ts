
import { Router } from 'express';
import {
  getShopInfo,
  createOfferHandler,
  getOfferByIdHandler,
  getAllOffersHandler,
  updateOfferHandler,
  deleteOfferHandler,
  exportAllOffersAsCsvHandler,
  // Order controllers
  createOrderHandler,
  getOrderByIdHandler,
  getAllOrdersHandler,
  updateOrderHandler,
  deleteOrderHandler,
  synchronizeBolOrdersHandler,
  // OrderItem controllers
  createOrderItemHandler,
  getOrderItemByIdHandler,
  getOrderItemsByOrderIdHandler,
  updateOrderItemHandler,
  deleteOrderItemHandler,
  // Product Content Handlers
  getBolProductContentHandler,
  pushLocalProductToBolHandler,
  pollBolProcessStatusHandler,
  // VAT and Product handlers
  getAllProductsHandler,
  getVatRatesForProductHandler,
  setVatRateForProductHandler,
  deleteVatRateForProductHandler,
} from '../controllers/shop.controller';

const router = Router();

// Apply shopId validation to all routes
router.use((req, res, next) => {
  const shopId = req.headers['x-shop-id'] as string | undefined;
  if (!shopId) {
    return res.status(400).json({ message: 'Shop ID must be provided in X-Shop-ID header.' });
  }
  req.shopId = shopId;
  next();
});

// Apply userId validation to routes requiring userId
const userIdRequiredRoutes = [
  '/products',
  '/products/:ean/bol',
  '/products/:ean/sync-to-bol',
  '/bol/process-status/:processId',
  '/orders/sync/bol',
  '/offers/export/csv',
];
router.use(userIdRequiredRoutes, (req, res, next) => {
  const userId = (req.user as { id?: string } | undefined)?.id || 
                 req.query.userId as string | undefined || 
                 req.body.userId as string | undefined ||
                 req.headers['x-user-id'] as string | undefined;
  if (!userId) {
    return res.status(400).json({ message: 'User ID must be provided (via auth, query, body, or X-User-ID header).' });
  }
  req.userId = userId;
  next();
});

// Existing route
router.get('/info', getShopInfo);

// Routes for Offers CRUD
router.post('/offers', createOfferHandler);
router.get('/offers', getAllOffersHandler);
router.get('/offers/:offerId', getOfferByIdHandler);
router.put('/offers/:offerId', updateOfferHandler);
router.delete('/offers/:offerId', deleteOfferHandler);
router.get('/offers/export/csv', exportAllOffersAsCsvHandler);

// Routes for Orders CRUD
router.post('/orders', createOrderHandler);
router.get('/orders', getAllOrdersHandler);
router.get('/orders/:orderId', getOrderByIdHandler);
router.put('/orders/:orderId', updateOrderHandler);
router.delete('/orders/:orderId', deleteOrderHandler);
router.post('/orders/sync/bol', synchronizeBolOrdersHandler);

// Routes for OrderItems CRUD
router.post('/order-items', createOrderItemHandler);
router.get('/order-items/:orderItemId', getOrderItemByIdHandler);
router.get('/orders/:orderId/items', getOrderItemsByOrderIdHandler);
router.put('/order-items/:orderItemId', updateOrderItemHandler);
router.delete('/order-items/:orderItemId', deleteOrderItemHandler);

// Routes for Product Content
router.get('/products/:ean/bol', getBolProductContentHandler);
router.post('/products/:ean/sync-to-bol', pushLocalProductToBolHandler);
router.get('/bol/process-status/:processId', pollBolProcessStatusHandler);

// Per-country VAT endpoints
router.get('/products/:ean/vat', getVatRatesForProductHandler);
router.put('/products/:ean/vat', setVatRateForProductHandler);
router.delete('/products/:ean/vat', deleteVatRateForProductHandler);

// Route to get all products (for VAT management UI)
router.get('/products', getAllProductsHandler);

export default router;
