import { Router } from 'express';
import {
    getShopInfo,
    createOfferHandler,
    getOfferByIdHandler,
    getAllOffersHandler,
    updateOfferHandler,
    deleteOfferHandler,
    exportOffersHandler,
    // Order controllers
    createOrderHandler,
    getOrderByIdHandler,
    getAllOrdersHandler,
    updateOrderHandler,
    deleteOrderHandler,
    syncBolOrdersHandler, // Import the new order sync handler
    // OrderItem controllers
    createOrderItemHandler,
    getOrderItemByIdHandler,
    getOrderItemsByOrderIdHandler,
    updateOrderItemHandler,
    deleteOrderItemHandler,
    // Product Content Handlers
    getProductContentHandler,
    // syncProductFromBolHandler, // Removed as redundant
    syncProductToBolHandler,
    getBolProcessStatusHandler,
    // syncProductsNewHandler, // Commented out as it's now triggered by exportOffersHandler
    updateProductVatHandler, // Import the VAT update handler
    getAllProductsHandler, // Import the new handler for GET /products
    getProductVatRatesHandler, setProductVatRateHandler, deleteProductVatRateHandler
} from '../controllers/shop.controller';

const router = Router();

// Existing route
router.get('/info', getShopInfo);

// Routes for Offers CRUD
router.post('/offers', createOfferHandler);
router.get('/offers', getAllOffersHandler);
router.get('/offers/:offerId', getOfferByIdHandler);
router.put('/offers/:offerId', updateOfferHandler);
router.delete('/offers/:offerId', deleteOfferHandler);
router.get('/offers/export/csv', exportOffersHandler); // New route for CSV export

// Routes for Orders CRUD
router.post('/orders', createOrderHandler); // Create a new order
router.get('/orders', getAllOrdersHandler); // Get all orders
router.get('/orders/:orderId', getOrderByIdHandler); // Get a specific order by ID
router.put('/orders/:orderId', updateOrderHandler);
router.delete('/orders/:orderId', deleteOrderHandler);
router.post('/orders/sync/bol', syncBolOrdersHandler); // New route for Bol order sync

// Routes for OrderItems CRUD
// Create a new order item (could also be POST /api/shop/orders/:orderId/items)
router.post('/order-items', createOrderItemHandler);

// Get a specific order item by its ID
router.get('/order-items/:orderItemId', getOrderItemByIdHandler);

// Get all items for a specific order
router.get('/orders/:orderId/items', getOrderItemsByOrderIdHandler);

// Update a specific order item by its ID
router.put('/order-items/:orderItemId', updateOrderItemHandler);

// Delete a specific order item by its ID
router.delete('/order-items/:orderItemId', deleteOrderItemHandler);

// Routes for Product Content
router.get('/products/:ean/bol', getProductContentHandler); // Get Bol product content
// router.post('/products/:ean/sync-from-bol', syncProductFromBolHandler); // Removed as redundant
router.post('/products/:ean/sync-to-bol', syncProductToBolHandler); // Sync local content to Bol
router.get('/bol/process-status/:processId', getBolProcessStatusHandler); // Generic Bol process status poller

// Route for the new product sync logic
// router.post('/products/sync-new', syncProductsNewHandler); // Commented out as it's now triggered by exportOffersHandler

// Per-country VAT endpoints
router.get('/products/:ean/vat', getProductVatRatesHandler);
router.put('/products/:ean/vat', setProductVatRateHandler);
router.delete('/products/:ean/vat', deleteProductVatRateHandler);

// Route to get all products (for VAT management UI)
router.get('/products', getAllProductsHandler);

export default router;
