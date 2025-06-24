import { Request, Response, NextFunction } from 'express';
import { getDBPool } from '../utils/db'; // Ensure this path is correct
import * as ShopService from '../services/shop.service'; // Import all service functions
import { IOffer } from '../models/shop.model'; // Import IOffer for type checking

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

// Handler for exporting offers as CSV
export const exportOffersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('exportOffersHandler: Initiating CSV export...');
    const csvData = await ShopService.exportAllOffersAsCsv();

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="offers.csv"');

    console.log('exportOffersHandler: Sending CSV data as response.');
    res.status(200).send(csvData);
  } catch (error) {
    // Log the error and pass it to the central error handling middleware
    console.error('exportOffersHandler: Error during CSV export:', error);
    if (error instanceof Error && error.message.includes('Bol API credentials are not configured')) {
      res.status(503).json({ message: 'Service unavailable: Bol API credentials not configured on server.' });
      return;
    }
    if (error instanceof Error && error.message.includes('Bol API Error')) {
      // Potentially parse more specific details if needed, or send a generic message
      res.status(502).json({ message: 'Failed to retrieve data from Bol.com API.', details: error.message });
      return;
    }
    // For other errors, use the generic error handler
    next(error);
  }
};

// Controller functions for OrderItems CRUD
import { IOrderItem } from '../models/shop.model'; // Import IOrderItem for type checking

export const createOrderItemHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // If orderId is part of the path, e.g., /orders/:orderId/items
    // const { orderId: pathOrderId } = req.params;
    const orderItemData: IOrderItem = req.body;

    // Basic validation
    if (!orderItemData.orderItemId || !orderItemData.orderId || !orderItemData.ean || orderItemData.quantity === undefined) {
      res.status(400).json({ message: 'Missing required fields: orderItemId, orderId, ean, quantity' });
      return;
    }
    // if (pathOrderId && orderItemData.orderId !== pathOrderId) {
    //   res.status(400).json({ message: 'Order ID in path does not match Order ID in body.' });
    //   return;
    // }

    const newOrderItem = await ShopService.createOrderItem(orderItemData);
    res.status(201).json(newOrderItem);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ message: error.message });
    } else {
        next(error);
    }
  }
};

export const getOrderItemByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderItemId } = req.params;
    const orderItem = await ShopService.getOrderItemById(orderItemId);
    if (orderItem) {
      res.status(200).json(orderItem);
    } else {
      res.status(404).json({ message: `Order item with ID ${orderItemId} not found` });
    }
  } catch (error) {
    next(error);
  }
};

export const getOrderItemsByOrderIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;
    // Optional: Check if order itself exists first, though service might also do this or it might not be required by spec.
    // const orderExists = await ShopService.getOrderById(orderId);
    // if (!orderExists) {
    //   res.status(404).json({ message: `Order with ID ${orderId} not found.` });
    //   return;
    // }
    const orderItems = await ShopService.getOrderItemsByOrderId(orderId);
    res.status(200).json(orderItems); // Returns empty array if no items, which is fine.
  } catch (error) {
    next(error);
  }
};

export const updateOrderItemHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderItemId } = req.params;
    const updateData: Partial<IOrderItem> = req.body;

    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'No update data provided.' });
        return;
    }
    // Prevent critical IDs from being changed in body
    if (updateData.orderItemId && updateData.orderItemId !== orderItemId) {
         res.status(400).json({ message: 'OrderItem ID in body does not match ID in path and cannot be changed.' });
        return;
    }
    delete updateData.orderItemId;
    delete updateData.orderId; // orderId of an item should generally not be changed.

    const updatedOrderItem = await ShopService.updateOrderItem(orderItemId, updateData);
    if (updatedOrderItem) {
      res.status(200).json(updatedOrderItem);
    } else {
      res.status(404).json({ message: `Order item with ID ${orderItemId} not found or no changes made.` });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteOrderItemHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderItemId } = req.params;
    const success = await ShopService.deleteOrderItem(orderItemId);
    if (success) {
      res.status(200).json({ message: `Order item with ID ${orderItemId} deleted successfully` });
      // Alt: res.status(204).send();
    } else {
      res.status(404).json({ message: `Order item with ID ${orderItemId} not found or could not be deleted` });
    }
  } catch (error) {
    next(error);
  }
};

// Controller functions for Orders CRUD
import { IOrder } from '../models/shop.model'; // Import IOrder for type checking

export const createOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderData: IOrder = req.body;
    // Basic validation
    if (!orderData.orderId || !orderData.orderItems) { // orderItems can be an empty array but must be present
      res.status(400).json({ message: 'Missing required fields: orderId and orderItems' });
      return;
    }
    const newOrder = await ShopService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await ShopService.getOrderById(orderId);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: `Order with ID ${orderId} not found` });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await ShopService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;
    const updateData: Partial<IOrder> = req.body;

    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'No update data provided.' });
        return;
    }
    // Prevent orderId from being updated
    if (updateData.orderId && updateData.orderId !== orderId) {
        res.status(400).json({ message: 'Order ID in body does not match Order ID in path and cannot be changed.' });
        return;
    }
    delete updateData.orderId;


    const updatedOrder = await ShopService.updateOrder(orderId, updateData);
    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: `Order with ID ${orderId} not found or no changes made.` });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;
    const success = await ShopService.deleteOrder(orderId);
    if (success) {
      res.status(200).json({ message: `Order with ID ${orderId} and its items deleted successfully` });
      // Alt: res.status(204).send();
    } else {
      res.status(404).json({ message: `Order with ID ${orderId} not found or could not be deleted` });
    }
  } catch (error) {
    next(error);
  }
};

// Controller functions for Offers CRUD

export const createOfferHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const offerData: IOffer = req.body;
    // Basic validation (more robust validation can be added using a library like Joi or Zod)
    if (!offerData.offerId || !offerData.ean) {
      res.status(400).json({ message: 'Missing required fields: offerId and ean' });
      return;
    }
    const newOffer = await ShopService.createOffer(offerData);
    res.status(201).json(newOffer);
  } catch (error) {
    next(error);
  }
};

export const getOfferByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { offerId } = req.params;
    const offer = await ShopService.getOfferById(offerId);
    if (offer) {
      res.status(200).json(offer);
    } else {
      res.status(404).json({ message: `Offer with ID ${offerId} not found` });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllOffersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const offers = await ShopService.getAllOffers();
    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
};

export const updateOfferHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { offerId } = req.params;
    const updateData: Partial<IOffer> = req.body;

    // Prevent offerId or ean from being updated directly via this method if that's a business rule.
    // For now, allowing any partial update.
    // delete updateData.offerId;
    // delete updateData.ean;

    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'No update data provided.' });
        return;
    }

    const updatedOffer = await ShopService.updateOffer(offerId, updateData);
    if (updatedOffer) {
      res.status(200).json(updatedOffer);
    } else {
      res.status(404).json({ message: `Offer with ID ${offerId} not found or no changes made.` });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteOfferHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { offerId } = req.params;
    const success = await ShopService.deleteOffer(offerId);
    if (success) {
      res.status(200).json({ message: `Offer with ID ${offerId} deleted successfully` });
      // Alternative: res.status(204).send(); for no content response
    } else {
      res.status(404).json({ message: `Offer with ID ${offerId} not found or could not be deleted` });
    }
  } catch (error) {
    next(error);
  }
};
