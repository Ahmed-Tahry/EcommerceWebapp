import { getDBPool } from '../utils/db';
import { IOffer, IOrder, IOrderItem } from '../models/shop.model';

// Placeholder for ShopService (Phase 1)
export async function getShopDetailsFromSource(shopId: string): Promise<object | null> {
  console.log(`Fetching details for shop ID (Phase 1): ${shopId}`);
  if (shopId === '123') {
    return { id: shopId, name: 'Awesome Shop Phase 1', owner: 'Admin Phase 1' };
  }
  return null;
}

// --- Service functions for Offers CRUD ---

export async function createOffer(offerData: IOffer): Promise<IOffer> {
  const pool = getDBPool();
  const {
    offerId, ean, conditionName = null, conditionCategory = null, conditionComment = null,
    bundlePricesPrice = null, fulfilmentDeliveryCode = null, stockAmount = null,
    onHoldByRetailer = false, fulfilmentType = null, mutationDateTime = new Date(),
    referenceCode = null, correctedStock = null,
  } = offerData;

  const query = `
    INSERT INTO offers (
      "offerId", ean, "conditionName", "conditionCategory", "conditionComment",
      "bundlePricesPrice", "fulfilmentDeliveryCode", "stockAmount", "onHoldByRetailer",
      "fulfilmentType", "mutationDateTime", "referenceCode", "correctedStock"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *;
  `;
  const values = [
    offerId, ean, conditionName, conditionCategory, conditionComment,
    bundlePricesPrice, fulfilmentDeliveryCode, stockAmount, onHoldByRetailer,
    fulfilmentType, mutationDateTime, referenceCode, correctedStock
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
}

// --- Bol.com Integration for Offer Export ---
import BolService from './bol.service'; // Assuming bol.service.ts is in the same directory

// Function to get Bol API credentials from environment variables
function getBolCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.BOL_CLIENT_ID;
  const clientSecret = process.env.BOL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('BOL_CLIENT_ID or BOL_CLIENT_SECRET environment variables are not set.');
    throw new Error('Bol API credentials are not configured.');
  }
  return { clientId, clientSecret };
}

export async function exportAllOffersAsCsv(): Promise<string> {
  try {
    const { clientId, clientSecret } = getBolCredentials();
    const bolService = new BolService(clientId, clientSecret);

    console.log('Attempting to export all offers as CSV via BolService...');
    const csvData = await bolService.exportOffers('CSV');
    console.log('Successfully received CSV data from BolService.');
    return csvData;
  } catch (error) {
    console.error('Error in exportAllOffersAsCsv (ShopService):', error);
    // Rethrow the error to be handled by the controller or a higher-level error handler
    throw error;
  }
}

export async function getOfferById(offerId: string): Promise<IOffer | null> {
  const pool = getDBPool();
  const query = 'SELECT * FROM offers WHERE "offerId" = $1;';
  try {
    const result = await pool.query(query, [offerId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching offer by ID ${offerId}:`, error);
    throw error;
  }
}

export async function getAllOffers(): Promise<IOffer[]> {
  const pool = getDBPool();
  const query = 'SELECT * FROM offers ORDER BY "offerId";';
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all offers:', error);
    throw error;
  }
}

export async function updateOffer(offerId: string, updateData: Partial<IOffer>): Promise<IOffer | null> {
  const pool = getDBPool();
  const setClauses: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined && key !== 'offerId') { // offerId should not be updated
        setClauses.push(`"${key}" = $${valueCount++}`);
        values.push(value);
    }
  }

  if (setClauses.length === 0) return getOfferById(offerId);
  values.push(offerId);

  const query = `
    UPDATE offers SET ${setClauses.join(', ')}
    WHERE "offerId" = $${valueCount} RETURNING *;`;
  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error updating offer ID ${offerId}:`, error);
    throw error;
  }
}

export async function deleteOffer(offerId: string): Promise<boolean> {
  const pool = getDBPool();
  const query = 'DELETE FROM offers WHERE "offerId" = $1;';
  try {
    const result = await pool.query(query, [offerId]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting offer ID ${offerId}:`, error);
    throw error;
  }
}

// --- Service functions for Orders CRUD ---

export async function createOrder(orderData: IOrder): Promise<IOrder> {
  const pool = getDBPool();
  const { orderId, orderPlacedDateTime = new Date(), orderItems } = orderData;
  const orderItemsJson = typeof orderItems === 'string' ? orderItems : JSON.stringify(orderItems);

  const query = `
    INSERT INTO orders ("orderId", "orderPlacedDateTime", "orderItems")
    VALUES ($1, $2, $3) RETURNING *;`;
  const values = [orderId, orderPlacedDateTime, orderItemsJson];

  try {
    const result = await pool.query(query, values);
    const dbOrder = result.rows[0];
    if (dbOrder.orderItems && typeof dbOrder.orderItems === 'string') {
        try { dbOrder.orderItems = JSON.parse(dbOrder.orderItems); }
        catch (e) { console.error('Failed to parse orderItems JSON from DB for orderId:', dbOrder.orderId, e); }
    }
    return dbOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<IOrder | null> {
  const pool = getDBPool();
  const query = 'SELECT * FROM orders WHERE "orderId" = $1;';
  try {
    const result = await pool.query(query, [orderId]);
    if (result.rows.length > 0) {
      const dbOrder = result.rows[0];
      if (dbOrder.orderItems && typeof dbOrder.orderItems === 'string') {
         try { dbOrder.orderItems = JSON.parse(dbOrder.orderItems); }
         catch (e) { console.error('Failed to parse orderItems JSON from DB for orderId:', dbOrder.orderId, e); }
      }
      return dbOrder;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching order by ID ${orderId}:`, error);
    throw error;
  }
}

export async function getAllOrders(): Promise<IOrder[]> {
  const pool = getDBPool();
  const query = 'SELECT * FROM orders ORDER BY "orderPlacedDateTime" DESC;';
  try {
    const result = await pool.query(query);
    return result.rows.map(dbOrder => {
        if (dbOrder.orderItems && typeof dbOrder.orderItems === 'string') {
            try { dbOrder.orderItems = JSON.parse(dbOrder.orderItems); }
            catch (e) { console.error('Failed to parse orderItems JSON from DB for orderId:', dbOrder.orderId, e); }
        }
        return dbOrder;
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
}

export async function updateOrder(orderId: string, updateData: Partial<IOrder>): Promise<IOrder | null> {
  const pool = getDBPool();
  const setClauses: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  if (updateData.orderItems !== undefined) {
    const orderItemsValue = typeof updateData.orderItems === 'string'
        ? updateData.orderItems : JSON.stringify(updateData.orderItems);
    setClauses.push(`"orderItems" = $${valueCount++}`);
    values.push(orderItemsValue);
    delete updateData.orderItems;
  }

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined && key !== 'orderId') {
        setClauses.push(`"${key}" = $${valueCount++}`);
        values.push(value);
    }
  }

  if (setClauses.length === 0) return getOrderById(orderId);
  values.push(orderId);

  const query = `
    UPDATE orders SET ${setClauses.join(', ')}
    WHERE "orderId" = $${valueCount} RETURNING *;`;
  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
        const dbOrder = result.rows[0];
        if (dbOrder.orderItems && typeof dbOrder.orderItems === 'string') {
           try { dbOrder.orderItems = JSON.parse(dbOrder.orderItems); }
           catch (e) { console.error('Failed to parse orderItems JSON from DB for orderId:', dbOrder.orderId, e); }
        }
        return dbOrder;
    }
    return null;
  } catch (error) {
    console.error(`Error updating order ID ${orderId}:`, error);
    throw error;
  }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const pool = getDBPool();
  const query = 'DELETE FROM orders WHERE "orderId" = $1;';
  try {
    const result = await pool.query(query, [orderId]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting order ID ${orderId}:`, error);
    throw error;
  }
}

// --- Service functions for OrderItems CRUD ---

export async function createOrderItem(orderItemData: IOrderItem): Promise<IOrderItem> {
  const pool = getDBPool();
  const {
    orderItemId, orderId, ean, fulfilmentMethod = null, fulfilmentStatus = null,
    quantity = 0, quantityShipped = 0, quantityCancelled = 0,
    cancellationRequest = false, latestChangedDateTime = new Date(),
  } = orderItemData;

  const orderCheckQuery = 'SELECT "orderId" FROM orders WHERE "orderId" = $1';
  const orderCheckResult = await pool.query(orderCheckQuery, [orderId]);
  if (orderCheckResult.rowCount === 0) {
    throw new Error(`Order with ID ${orderId} not found. Cannot create order item.`);
  }

  const query = `
    INSERT INTO order_items (
      "orderItemId", "orderId", ean, "fulfilmentMethod", "fulfilmentStatus",
      quantity, "quantityShipped", "quantityCancelled", "cancellationRequest", "latestChangedDateTime"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [
    orderItemId, orderId, ean, fulfilmentMethod, fulfilmentStatus,
    quantity, quantityShipped, quantityCancelled, cancellationRequest, latestChangedDateTime
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating order item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === '23503') {
        throw new Error(`Order with ID ${orderId} not found or another foreign key constraint failed.`);
    }
    throw error;
  }
}

export async function getOrderItemById(orderItemId: string): Promise<IOrderItem | null> {
  const pool = getDBPool();
  const query = 'SELECT * FROM order_items WHERE "orderItemId" = $1;';
  try {
    const result = await pool.query(query, [orderItemId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching order item by ID ${orderItemId}:`, error);
    throw error;
  }
}

export async function getOrderItemsByOrderId(orderId: string): Promise<IOrderItem[]> {
  const pool = getDBPool();
  const query = 'SELECT * FROM order_items WHERE "orderId" = $1 ORDER BY "orderItemId";';
  try {
    const result = await pool.query(query, [orderId]);
    return result.rows;
  } catch (error) {
    console.error(`Error fetching order items for order ID ${orderId}:`, error);
    throw error;
  }
}

export async function updateOrderItem(orderItemId: string, updateData: Partial<IOrderItem>): Promise<IOrderItem | null> {
  const pool = getDBPool();
  const setClauses: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (key === 'orderItemId' || key === 'orderId') continue;
    if (value !== undefined) {
        setClauses.push(`"${key}" = $${valueCount++}`);
        values.push(value);
    }
  }

  if (setClauses.length === 0) return getOrderItemById(orderItemId);
  values.push(orderItemId);

  const query = `
    UPDATE order_items SET ${setClauses.join(', ')}
    WHERE "orderItemId" = $${valueCount} RETURNING *;`;
  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error updating order item ID ${orderItemId}:`, error);
    throw error;
  }
}

export async function deleteOrderItem(orderItemId: string): Promise<boolean> {
  const pool = getDBPool();
  const query = 'DELETE FROM order_items WHERE "orderItemId" = $1;';
  try {
    const result = await pool.query(query, [orderItemId]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting order item ID ${orderItemId}:`, error);
    throw error;
  }
}
