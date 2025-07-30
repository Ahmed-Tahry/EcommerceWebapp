
import { Request, Response, NextFunction } from 'express';
import * as ShopService from '../services/shop.service';
import { IOffer, IOrder, IOrderItem, IProduct, IProductVatRate } from '../models/shop.model';
import axios from 'axios';

// Shop Info
export const getShopInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const shopDetails = await ShopService.getShopDetailsFromSource(shopId);
    if (!shopDetails) {
      res.status(404).json({ message: `Shop with ID ${shopId} not found.` });
      return;
    }
    res.status(200).json(shopDetails);
  } catch (error) {
    console.error('Error in getShopInfo controller:', error);
    next(error);
  }
};

// Offer CRUD
export const createOfferHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const offerData: IOffer = { ...req.body, shopId };
    if (!offerData.offerId || !offerData.ean) {
      res.status(400).json({ message: 'Missing required fields: offerId, ean' });
      return;
    }
    const newOffer = await ShopService.createOffer(offerData);
    res.status(201).json(newOffer);
  } catch (error) {
    console.error('Error creating offer:', error);
    next(error);
  }
};

export const getOfferByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { offerId } = req.params;
    const offer = await ShopService.getOfferById(offerId, shopId);
    if (offer) {
      res.status(200).json(offer);
    } else {
      res.status(404).json({ message: `Offer with ID ${offerId} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error fetching offer ID ${req.params.offerId}:`, error);
    next(error);
  }
};

export const getAllOffersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const offers = await ShopService.getAllOffers(shopId);
    res.status(200).json(offers);
  } catch (error) {
    console.error('Error fetching all offers:', error);
    next(error);
  }
};

export const updateOfferHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { offerId } = req.params;
    const updateData: Partial<IOffer> = req.body;
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: 'No update data provided.' });
      return;
    }
    if (updateData.offerId && updateData.offerId !== offerId) {
      res.status(400).json({ message: 'Offer ID in body does not match ID in path.' });
      return;
    }
    delete updateData.offerId;
    delete updateData.shopId;
    const updatedOffer = await ShopService.updateOffer(offerId, shopId, updateData);
    if (updatedOffer) {
      res.status(200).json(updatedOffer);
    } else {
      res.status(404).json({ message: `Offer with ID ${offerId} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error updating offer ID ${req.params.offerId}:`, error);
    next(error);
  }
};

export const deleteOfferHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { offerId } = req.params;
    const success = await ShopService.deleteOffer(offerId, shopId);
    if (success) {
      res.status(200).json({ message: `Offer with ID ${offerId} deleted successfully` });
    } else {
      res.status(404).json({ message: `Offer with ID ${offerId} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error deleting offer ID ${req.params.offerId}:`, error);
    next(error);
  }
};

export const exportAllOffersAsCsvHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const userId = req.userId as string;
    
    console.log(`Starting CSV export for shopId: ${shopId}, userId: ${userId}`);
    
    // 1. Perform the CSV export and save offers to database
    const result = await ShopService.exportAllOffersAsCsv(userId, shopId);
    
    console.log(`CSV export and offers save completed. Result:`, result);

    // 2. Create products from offers
    console.log(`Starting product creation from offers for shopId: ${shopId}`);
    const productSyncResult = await ShopService.syncProductsFromOffersAndRetailerApi(userId, shopId);
    console.log(`Product creation completed. Result:`, productSyncResult);

    // 3. Update onboarding status ONLY after both offers and products are created
    const settingsServiceDirectUrl = process.env.SETTINGS_SERVICE_DIRECT_URL || 'http://settings_service:3000';
    const onboardingUrl = `${settingsServiceDirectUrl}/settings/onboarding/status`;

    console.log(`Updating onboarding status at: ${onboardingUrl}`);

    await axios.post(
      onboardingUrl,
      { hasCompletedShopSync: true },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
          'x-shop-id': shopId,
        },
      }
    );

    console.log(`Onboarding status updated successfully`);

    // Return combined result
    res.status(200).json({
      ...result,
      productSync: productSyncResult,
      message: `Successfully exported ${result.successCount} offers and created ${productSyncResult.success} products from Bol.com for shopId ${shopId}.`
    });

  } catch (error: unknown) {
    console.error('Error in exportAllOffersAsCsvHandler:');
    
    // Proper error type narrowing
    if (error instanceof Error) {
      console.error(error.message);
      
      // Check if it's an AxiosError
      if (axios.isAxiosError(error)) {
        next(new Error(`Onboarding status update failed: ${error.response?.data?.message || error.message}`));
      } else {
        next(error);
      }
    } else {
      next(new Error('Unknown error occurred during CSV export'));
    }
  }
};
// Order CRUD
export const createOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const orderData: IOrder = { ...req.body, shopId };
    if (!orderData.orderId || !orderData.orderPlacedDateTime) {
      res.status(400).json({ message: 'Missing required fields: orderId, orderPlacedDateTime' });
      return;
    }
    const newOrder = await ShopService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    next(error);
  }
};

export const getOrderByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { orderId } = req.params;
    const order = await ShopService.getOrderById(orderId, shopId);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: `Order with ID ${orderId} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error fetching order ID ${req.params.orderId}:`, error);
    next(error);
  }
};

export const getAllOrdersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const orders = await ShopService.getAllOrders(shopId);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    next(error);
  }
};

export const updateOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { orderId } = req.params;
    const updateData: Partial<IOrder> = req.body;
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: 'No update data provided.' });
      return;
    }
    if (updateData.orderId && updateData.orderId !== orderId) {
      res.status(400).json({ message: 'Order ID in body does not match ID in path.' });
      return;
    }
    delete updateData.orderId;
    delete updateData.shopId;
    const updatedOrder = await ShopService.updateOrder(orderId, shopId, updateData);
    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: `Order with ID ${orderId} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error updating order ID ${req.params.orderId}:`, error);
    next(error);
  }
};

export const deleteOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { orderId } = req.params;
    const success = await ShopService.deleteOrder(orderId, shopId);
    if (success) {
      res.status(200).json({ message: `Order with ID ${orderId} deleted successfully` });
    } else {
      res.status(404).json({ message: `Order with ID ${orderId} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error deleting order ID ${req.params.orderId}:`, error);
    next(error);
  }
};

export const synchronizeBolOrdersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const userId = req.userId as string;
    const { status, fulfilmentMethod, latestChangedDate } = req.query;
    const result = await ShopService.synchronizeBolOrders(
      userId,
      shopId,
      status as string || 'OPEN',
      fulfilmentMethod as 'FBR' | 'FBB' | null,
      latestChangedDate as string | null
    );
    res.status(200).json(result);
  } catch (error) {
    console.error('Error synchronizing Bol orders:', error);
    next(error);
  }
};

// Order Item CRUD
export const createOrderItemHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const orderItemData: IOrderItem = { ...req.body, shopId };
    if (!orderItemData.orderItemId || !orderItemData.orderId || !orderItemData.ean) {
      res.status(400).json({ message: 'Missing required fields: orderItemId, orderId, ean' });
      return;
    }
    const newOrderItem = await ShopService.createOrderItem(orderItemData);
    res.status(201).json(newOrderItem);
  } catch (error) {
    console.error('Error creating order item:', error);
    next(error);
  }
};

export const getOrderItemByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { orderItemId } = req.params;
    const orderItem = await ShopService.getOrderItemById(orderItemId, shopId);
    if (orderItem) {
      res.status(200).json(orderItem);
    } else {
      res.status(404).json({ message: `Order item with ID ${orderItemId} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error fetching order item ID ${req.params.orderItemId}:`, error);
    next(error);
  }
};

export const getOrderItemsByOrderIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { orderId } = req.params;
    const orderItems = await ShopService.getOrderItemsByOrderId(orderId, shopId);
    res.status(200).json(orderItems);
  } catch (error) {
    console.error(`Error fetching order items for order ID ${req.params.orderId}:`, error);
    next(error);
  }
};

export const updateOrderItemHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { orderItemId } = req.params;
    const updateData: Partial<IOrderItem> = req.body;
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: 'No update data provided.' });
      return;
    }
    if (updateData.orderItemId && updateData.orderItemId !== orderItemId) {
      res.status(400).json({ message: 'Order item ID in body does not match ID in path.' });
      return;
    }
    delete updateData.orderItemId;
    delete updateData.orderId;
    delete updateData.shopId;
    const updatedOrderItem = await ShopService.updateOrderItem(orderItemId, shopId, updateData);
    if (updatedOrderItem) {
      res.status(200).json(updatedOrderItem);
    } else {
      res.status(404).json({ message: `Order item with ID ${orderItemId} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error updating order item ID ${req.params.orderItemId}:`, error);
    next(error);
  }
};

export const deleteOrderItemHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { orderItemId } = req.params;
    const success = await ShopService.deleteOrderItem(orderItemId, shopId);
    if (success) {
      res.status(200).json({ message: `Order item with ID ${orderItemId} deleted successfully` });
    } else {
      res.status(404).json({ message: `Order item with ID ${orderItemId} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error deleting order item ID ${req.params.orderItemId}:`, error);
    next(error);
  }
};

// Product CRUD
export const createProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const userId = req.userId as string;
    const productData: IProduct = { ...req.body, shopId, userId };
    if (!productData.ean) {
      res.status(400).json({ message: 'Missing required field: ean' });
      return;
    }
    const newProduct = await ShopService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
};

export const getProductByEanHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { ean } = req.params;
    const product = await ShopService.getProductByEan(ean, shopId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: `Product with EAN ${ean} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error fetching product EAN ${req.params.ean}:`, error);
    next(error);
  }
};

export const getAllProductsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const userId = req.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await ShopService.getAllProducts(userId, shopId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching all products:', error);
    next(error);
  }
};

export const updateProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { ean } = req.params;
    const updateData: Partial<IProduct> = req.body;
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: 'No update data provided.' });
      return;
    }
    if (updateData.ean && updateData.ean !== ean) {
      res.status(400).json({ message: 'EAN in body does not match EAN in path.' });
      return;
    }
    delete updateData.ean;
    delete updateData.shopId;
    const updatedProduct = await ShopService.updateProduct(ean, shopId, updateData);
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: `Product with EAN ${ean} not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error updating product EAN ${req.params.ean}:`, error);
    next(error);
  }
};

// VAT Rate CRUD
export const getVatRatesForProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { ean } = req.params;
    const vatRates = await ShopService.getVatRatesForProduct(ean, shopId);
    res.status(200).json(vatRates);
  } catch (error) {
    console.error(`Error fetching VAT rates for EAN ${req.params.ean}:`, error);
    next(error);
  }
};

export const setVatRateForProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { ean } = req.params;
    const { country, vatRate } = req.body;
    if (!country || vatRate === undefined || vatRate === null || isNaN(vatRate)) {
      res.status(400).json({ message: 'Valid country and vatRate must be provided in body.' });
      return;
    }
    const result = await ShopService.setVatRateForProduct(ean, country, vatRate, shopId);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error setting VAT rate for EAN ${req.params.ean}:`, error);
    next(error);
  }
};

export const deleteVatRateForProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const { ean } = req.params;
    const { country } = req.body;
    if (!country) {
      res.status(400).json({ message: 'Country must be provided in body.' });
      return;
    }
    await ShopService.deleteVatRateForProduct(ean, country, shopId);
    res.status(200).json({ message: `VAT rate for EAN ${ean}, country ${country} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting VAT rate for EAN ${req.params.ean}:`, error);
    next(error);
  }
};

// Bol.com Operations
export const getBolProductContentHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const userId = req.userId as string;
    const { ean } = req.params;
    const language = req.query.language as string || 'nl';
    const productContent = await ShopService.getBolProductContent(userId, shopId, ean, language);
    if (productContent) {
      res.status(200).json(productContent);
    } else {
      res.status(404).json({ message: `No Bol.com content found for EAN ${ean} and shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error fetching Bol product content for EAN ${req.params.ean}:`, error);
    next(error);
  }
};

export const pushLocalProductToBolHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const userId = req.userId as string;
    const { ean } = req.params;
    const language = req.query.language as string || 'nl';
    const result = await ShopService.pushLocalProductToBol(userId, shopId, ean, language);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error pushing product EAN ${req.params.ean} to Bol:`, error);
    next(error);
  }
};

export const pollBolProcessStatusHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const userId = req.userId as string;
    const { processId } = req.params;
    const maxAttempts = parseInt(req.query.maxAttempts as string) || 20;
    const pollInterval = parseInt(req.query.pollInterval as string) || 5000;
    const status = await ShopService.pollBolProcessStatus(userId, shopId, processId, maxAttempts, pollInterval);
    res.status(200).json(status);
  } catch (error) {
    console.error(`Error polling Bol process status for processId ${req.params.processId}:`, error);
    next(error);
  }
};

export const syncProductsFromOffersAndRetailerApiHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shopId = req.shopId as string;
    const userId = req.userId as string;
    const result = await ShopService.syncProductsFromOffersAndRetailerApi(userId, shopId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error syncing products from offers and retailer API:', error);
    next(error);
  }
};
