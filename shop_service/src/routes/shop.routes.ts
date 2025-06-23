import { Router } from 'express';
import {
    getShopInfo,
    createOfferHandler,
    getOfferByIdHandler,
    getAllOffersHandler,
    updateOfferHandler,
    deleteOfferHandler,
    // Order controllers
    createOrderHandler,
    getOrderByIdHandler,
    getAllOrdersHandler,
    updateOrderHandler,
    deleteOrderHandler,
    // OrderItem controllers
    createOrderItemHandler,
    getOrderItemByIdHandler,
    getOrderItemsByOrderIdHandler,
    updateOrderItemHandler,
    deleteOrderItemHandler
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

// Routes for Orders CRUD
router.post('/orders', createOrderHandler); // Create a new order
router.get('/orders', getAllOrdersHandler); // Get all orders
router.get('/orders/:orderId', getOrderByIdHandler); // Get a specific order by ID
router.put('/orders/:orderId', updateOrderHandler);
router.delete('/orders/:orderId', deleteOrderHandler);

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

export default router;
