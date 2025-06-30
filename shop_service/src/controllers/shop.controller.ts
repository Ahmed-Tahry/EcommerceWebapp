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

export const getAllProductsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    if (page < 1) {
      res.status(400).json({ message: 'Page number must be 1 or greater.' });
      return;
    }
    if (limit < 1 || limit > 100) { // Example: Max limit of 100
      res.status(400).json({ message: 'Limit must be between 1 and 100.' });
      return;
    }

    const result = await ShopService.getAllProducts(page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('getAllProductsHandler: Error fetching products:', error);
    next(error);
  }
};

// Handler for synchronizing orders from Bol.com
export const syncBolOrdersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      res.status(400).json({ message: 'User ID not provided in X-User-ID header.' });
      return;
    }

    // Extract optional filter parameters from request query or body
    // For simplicity, using query params here.
    const status = req.query.status as string || 'OPEN'; // Default to OPEN orders
    const fulfilmentMethod = req.query.fulfilmentMethod as ('FBR' | 'FBB' | undefined) || undefined;
    const latestChangedDate = req.query.latestChangedDate as string || undefined; // Expects YYYY-MM-DD

    console.log(`syncBolOrdersHandler: Initiating Bol.com order synchronization for user ${userId} with params: status=${status}, fulfilmentMethod=${fulfilmentMethod}, latestChangedDate=${latestChangedDate}`);

    const result = await ShopService.synchronizeBolOrders(userId, status, fulfilmentMethod, latestChangedDate);

    console.log(`syncBolOrdersHandler: Synchronization complete for user ${userId}. Sending JSON response.`);
    // Determine overall status based on results
    if (result.failedOrders > 0 || result.errors.length > 0) {
      res.status(207).json({ // Multi-Status: some operations may have succeeded
        message: 'Order synchronization completed with some errors.',
        createdOrders: result.createdOrders,
        updatedOrders: result.updatedOrders,
        createdItems: result.createdItems,
        updatedItems: result.updatedItems,
        failedOrders: result.failedOrders,
        errors: result.errors,
      });
    } else {
      res.status(200).json({
        message: 'Order synchronization completed successfully.',
        createdOrders: result.createdOrders,
        updatedOrders: result.updatedOrders,
        createdItems: result.createdItems,
        updatedItems: result.updatedItems,
      });
    }
  } catch (error) {
    console.error('syncBolOrdersHandler: Error during order synchronization:', error);
    if (error instanceof Error && error.message.includes('Bol API credentials are not configured')) {
      res.status(503).json({ message: 'Service unavailable: Bol API credentials not configured on server.' });
      return;
    }
    if (error instanceof Error && error.message.includes('Bol API Error')) {
      res.status(502).json({ message: 'Failed to retrieve data from Bol.com API.', details: error.message });
      return;
    }
    next(error); // Pass to generic error handler
  }
};

// --- Product Content Controllers ---

export const getProductContentHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      res.status(400).json({ message: 'User ID not provided in X-User-ID header.' });
      return;
    }

    const { ean } = req.params;
    const language = req.query.language as string || 'nl'; // Default to Dutch

    console.log(`getProductContentHandler: Fetching Bol.com product content for EAN ${ean}, lang ${language}, user ${userId}...`);
    const productContent = await ShopService.getBolProductContent(userId, ean, language);

    if (productContent) {
      res.status(200).json(productContent);
    } else {
      res.status(404).json({ message: `Product content not found on Bol.com for EAN ${ean} and language ${language}.` });
    }
  } catch (error) {
    console.error(`getProductContentHandler: Error fetching content for EAN ${req.params.ean}:`, error);
    // Add specific error handling if needed, e.g., for Bol API errors
    next(error);
  }
};

// Removed syncProductFromBolHandler as its functionality is covered by the new syncProductsNewHandler
// export const syncProductFromBolHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const userId = req.headers['x-user-id'] as string;
//     if (!userId) {
//       res.status(400).json({ message: 'User ID not provided in X-User-ID header.' });
//       return;
//     }
//     const { ean } = req.params;
//     const language = req.query.language as string || 'nl';
//     console.log(`syncProductFromBolHandler: Syncing product EAN ${ean} from Bol.com (lang ${language}) to local DB for user ${userId}...`);
//     const updatedProduct = await ShopService.updateLocalProductFromBol(userId, ean, language); // This line was causing the error
//     if (updatedProduct) {
//       res.status(200).json({ message: `Product EAN ${ean} synced from Bol.com and updated locally for user ${userId}.`, product: updatedProduct });
//     } else {
//       res.status(500).json({ message: `Failed to sync product EAN ${ean} from Bol.com.` });
//     }
//   } catch (error) {
//     console.error(`syncProductFromBolHandler: Error syncing EAN ${req.params.ean} from Bol:`, error);
//      if (error instanceof Error && error.message.includes('Bol API credentials are not configured')) {
//       res.status(503).json({ message: 'Service unavailable: Bol API credentials not configured on server.' });
//       return;
//     }
//     if (error instanceof Error && error.message.includes('Bol API Error')) {
//       res.status(502).json({ message: `Failed to retrieve product data from Bol.com for EAN ${req.params.ean}.`, details: error.message });
//       return;
//     }
//     if (error instanceof Error && error.message.includes('Could not fetch or map product content')) {
//         res.status(404).json({ message: error.message });
//         return;
//     }
//     next(error);
//   }
// };

export const syncProductToBolHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      res.status(400).json({ message: 'User ID not provided in X-User-ID header.' });
      return;
    }

    const { ean } = req.params;
    const language = req.query.language as string || 'nl';

    console.log(`syncProductToBolHandler: Pushing local product EAN ${ean} content (lang ${language}) to Bol.com for user ${userId}...`);
    const result = await ShopService.pushLocalProductToBol(userId, ean, language);

    if (result.error) {
        // Check if the error is "Local product not found"
        if (result.error === 'Local product not found') {
            res.status(404).json({ message: result.message, error: result.error });
        } else {
            res.status(500).json({ message: result.message, error: result.error });
        }
    } else {
      // As content update is async, we return the processId for client to poll
      res.status(202).json({
        message: result.message,
        processId: result.processId
      });
    }
  } catch (error) {
    console.error(`syncProductToBolHandler: Error pushing EAN ${req.params.ean} to Bol:`, error);
    if (error instanceof Error && error.message.includes('Bol API credentials are not configured')) {
      res.status(503).json({ message: 'Service unavailable: Bol API credentials not configured on server.' });
      return;
    }
    // Bol API errors during the initial POST are caught by BolService and rethrown.
    // The pushLocalProductToBol service method also catches these and returns an error object.
    // So, further specific Bol API error check here might be redundant if service handles it.
    next(error);
  }
};

export const getBolProcessStatusHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.headers['x-user-id'] as string; // Define userId at the function scope

  try {
    if (!userId) {
      // Log the absence of userId before returning, to aid debugging if this path is taken.
      console.error('getBolProcessStatusHandler: User ID not provided in X-User-ID header.');
      res.status(400).json({ message: 'User ID not provided in X-User-ID header.' });
      return;
    }

    const { processId } = req.params;
    console.log(`getBolProcessStatusHandler: Fetching status for process ID ${processId} for user ${userId}...`);
    const status = await ShopService.pollBolProcessStatus(userId, processId, 1, 0); // Poll once immediately
    res.status(200).json(status);
  } catch (error) {
    // userId is now definitely in scope for the catch block
    console.error(`getBolProcessStatusHandler: Error fetching status for process ID ${req.params.processId} for user ${userId || 'UNKNOWN'}:`, error);
    if (error instanceof Error && error.message.includes('Bol API credentials are not configured')) {
      res.status(503).json({ message: 'Service unavailable: Bol API credentials not configured on server.' });
      return;
    }
     if (error instanceof Error && error.message.includes('Bol API Error')) {
      res.status(502).json({ message: `Failed to retrieve process status from Bol.com for ID ${req.params.processId}.`, details: error.message });
      return;
    }
    next(error);
  }
};

// Handler for exporting offers as CSV
export const exportOffersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      res.status(400).json({ message: 'User ID not provided in X-User-ID header.' });
      return;
    }

    console.log(`exportOffersHandler: Initiating CSV export and database save for user ${userId}...`);
    const offerExportResult = await ShopService.exportAllOffersAsCsv(userId);

    console.log(`exportOffersHandler: Offer export part finished for user ${userId}.`);

    if (offerExportResult.errorCount && offerExportResult.errorCount > 0) {
      // If offer export itself had critical errors or saved no offers,
      // respond immediately without attempting product sync.
      res.status(207).json({
        message: "Offer export completed with errors, product sync not initiated.",
        offerExport: offerExportResult
      });
      return; // Ensure function exits here
    }

    if (offerExportResult.successCount === 0) {
      // If no offers were successfully saved, no EANs to process for products.
      res.status(200).json({
        message: "No offers were successfully exported or saved. Product sync not initiated.",
        offerExport: offerExportResult
      });
      return; // Ensure function exits here
    }

    // If offer export was successful (or partially successful with some offers saved), proceed to product sync.
    console.log(`exportOffersHandler: Offer export successful for user ${userId}. Triggering product sync...`);
    const productSyncResult = await ShopService.syncProductsFromOffersAndRetailerApi(userId);
    console.log(`exportOffersHandler: Product sync finished for user ${userId}.`);

    // Consolidate results
    const finalStatus = (offerExportResult.errorCount > 0 || productSyncResult.failed > 0 || productSyncResult.errors.length > 0) ? 207 : 200;
    let finalMessage = "Offer export and product synchronization process completed.";
    if (finalStatus === 207) {
        finalMessage += " Some operations had issues.";
    } else {
        finalMessage += " All operations successful.";
    }

    res.status(finalStatus).json({
        message: finalMessage,
        offerExportSummary: {
            message: offerExportResult.message,
            successCount: offerExportResult.successCount,
            errorCount: offerExportResult.errorCount,
            errors: offerExportResult.details || [],
        },
        productSyncSummary: {
            processed: productSyncResult.processed,
            success: productSyncResult.success,
            failed: productSyncResult.failed,
            errors: productSyncResult.errors,
        }
    });

  } catch (error) {
    console.error('exportOffersHandler: Error during combined offer export and product sync:', error);
    if (error instanceof Error && error.message.includes('Bol API credentials are not configured')) {
      res.status(503).json({ message: 'Service unavailable: Bol API credentials not configured on server.' });
      return;
    }
    if (error instanceof Error && error.message.includes('Bol API Error')) {
      res.status(502).json({ message: 'Failed to retrieve data from Bol.com API.', details: error.message });
      return;
    }
    if (error instanceof Error && error.message.includes('Failed to parse CSV data')) {
      res.status(400).json({ message: 'Error processing offer data.', details: error.message });
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

// Controller for the new product sync logic
// Commented out as this is now triggered by exportOffersHandler
// export const syncProductsNewHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const userId = req.headers['x-user-id'] as string;
//     if (!userId) {
//       res.status(400).json({ message: 'User ID not provided in X-User-ID header.' });
//       return;
//     }
//     // const { csvFileUrl } = req.body; // csvFileUrl is no longer used
//     console.log(`syncProductsNewHandler: Initiating new product synchronization for user ${userId}.`);
//     const result = await ShopService.syncProductsFromOffersAndRetailerApi(userId);
//     if (result.failed > 0 || result.errors.length > 0) {
//       res.status(207).json({ // Multi-Status
//         message: 'Product synchronization completed with some errors.',
//         processed: result.processed,
//         success: result.success,
//         failed: result.failed,
//         errors: result.errors,
//       });
//     } else {
//       res.status(200).json({
//         message: 'Product synchronization completed successfully.',
//         processed: result.processed,
//         success: result.success,
//       });
//     }
//   } catch (error) {
//     console.error('syncProductsNewHandler: Error during product synchronization:', error);
//     // Add more specific error handling if needed (e.g. Bol API errors if it were used directly here)
//     next(error);
//   }
// };

// Controller to update VAT for a specific product
export const updateProductVatHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ean } = req.params;
    const { vatRate } = req.body;

    if (typeof vatRate !== 'number' && vatRate !== null) {
      res.status(400).json({ message: 'Invalid vatRate provided. Must be a number or null.' });
      return;
    }

    // Optional: Add more validation for vatRate range if needed (e.g., 0 to 100)
    if (vatRate !== null && (vatRate < 0 || vatRate > 99.99)) {
        res.status(400).json({ message: 'Invalid vatRate value. Must be between 0 and 99.99, or null.' });
        return;
    }

    // User ID from header might be needed if ShopService.updateProduct requires it for auditing or other purposes.
    // const userId = req.headers['x-user-id'] as string;
    // if (!userId) {
    //   res.status(400).json({ message: 'User ID not provided in X-User-ID header.' });
    //   return;
    // }

    console.log(`updateProductVatHandler: Updating VAT for EAN ${ean} to ${vatRate}`);

    const updatedProduct = await ShopService.updateProduct(ean, { vatRate });

    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: `Product with EAN ${ean} not found or no changes made.` });
    }
  } catch (error) {
    console.error(`updateProductVatHandler: Error updating VAT for EAN ${req.params.ean}:`, error);
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