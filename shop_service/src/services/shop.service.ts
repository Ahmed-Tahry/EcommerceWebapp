
import { getDBPool } from '../utils/db';
import { IOffer, IOrder, IOrderItem, IProduct } from '../models/shop.model';
import { IProductVatRate } from '../models/shop.model';
import BolService, {
  BolProductContent,
  BolCreateProductContentPayload,
  BolCreateProductAttribute,
  BolProductAttribute,
  ProcessStatus,
  BolCatalogProductResponse,
  BolProductAssetsResponse,
  BolAssetVariant,
  BolOrder,
  BolOrderItem
} from './bol.service';
import { parse, CsvError } from 'csv-parse';
import type { Options as CsvParseOptions } from 'csv-parse';
import axios from 'axios';
import type { AxiosError } from 'axios';

interface ParseContext {
  column: string | number | undefined;
}

// Placeholder for ShopService (Phase 1)
export async function getShopDetailsFromSource(shopId: string): Promise<object | null> {
  console.log(`Fetching details for shopId (Phase 1): ${shopId}`);
  if (!shopId) {
    throw new Error('shopId is required for fetching shop details');
  }
  const pool = getDBPool();
  const query = 'SELECT id, name, description FROM shops WHERE id = $1;';
  try {
    const result = await pool.query(query, [shopId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching shop details for shopId ${shopId}:`, error);
    return { id: shopId, name: 'Awesome Shop Phase 1', owner: 'Admin Phase 1' }; // Fallback as in original
  }
}

// --- Service functions for Offers CRUD ---

export async function createOffer(offerData: IOffer): Promise<IOffer> {
  const pool = getDBPool();
  const {
    offerId, ean, shopId, conditionName = null, conditionCategory = null, conditionComment = null,
    bundlePricesPrice = null, fulfilmentDeliveryCode = null, stockAmount = null,
    onHoldByRetailer = false, fulfilmentType = null, mutationDateTime = new Date(),
    referenceCode = null, correctedStock = null,
  } = offerData;

  if (!shopId) throw new Error('shopId is required for creating an offer');

  const query = `
    INSERT INTO offers (
      "offerId", ean, shop_id, "conditionName", "conditionCategory", "conditionComment",
      "bundlePricesPrice", "fulfilmentDeliveryCode", "stockAmount", "onHoldByRetailer",
      "fulfilmentType", "mutationDateTime", "referenceCode", "correctedStock"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *, shop_id AS "shopId";
  `;
  const values = [
    offerId, ean, shopId, conditionName, conditionCategory, conditionComment,
    bundlePricesPrice, fulfilmentDeliveryCode, stockAmount, onHoldByRetailer,
    fulfilmentType, mutationDateTime, referenceCode, correctedStock
  ];

  try {
    const result = await pool.query(query, values);
    return { ...result.rows[0], shopId: result.rows[0].shop_id };
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
}

export async function getOfferById(offerId: string, shopId: string): Promise<IOffer | null> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for fetching an offer');
  const query = 'SELECT *, shop_id AS "shopId" FROM offers WHERE "offerId" = $1 AND shop_id = $2;';
  try {
    const result = await pool.query(query, [offerId, shopId]);
    return result.rows.length > 0 ? { ...result.rows[0], shopId: result.rows[0].shop_id } : null;
  } catch (error) {
    console.error(`Error fetching offer by ID ${offerId} for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function getAllOffers(shopId: string): Promise<IOffer[]> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for fetching offers');
  const query = 'SELECT *, shop_id AS "shopId" FROM offers WHERE shop_id = $1 ORDER BY "offerId";';
  try {
    const result = await pool.query(query, [shopId]);
    return result.rows.map(row => ({ ...row, shopId: row.shop_id }));
  } catch (error) {
    console.error('Error fetching all offers:', error);
    throw error;
  }
}

export async function updateOffer(offerId: string, shopId: string, updateData: Partial<IOffer>): Promise<IOffer | null> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for updating an offer');
  const setClauses: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined && key !== 'offerId' && key !== 'shopId') {
      setClauses.push(`"${key}" = $${valueCount++}`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) return getOfferById(offerId, shopId);
  values.push(offerId, shopId);

  const query = `
    UPDATE offers SET ${setClauses.join(', ')}
    WHERE "offerId" = $${valueCount++} AND shop_id = $${valueCount}
    RETURNING *, shop_id AS "shopId";
  `;
  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? { ...result.rows[0], shopId: result.rows[0].shop_id } : null;
  } catch (error) {
    console.error(`Error updating offer ID ${offerId} for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function deleteOffer(offerId: string, shopId: string): Promise<boolean> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for deleting an offer');
  const query = 'DELETE FROM offers WHERE "offerId" = $1 AND shop_id = $2;';
  try {
    const result = await pool.query(query, [offerId, shopId]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting offer ID ${offerId} for shopId ${shopId}:`, error);
    throw error;
  }
}

// --- Service functions for Orders CRUD ---

export async function createOrder(orderData: IOrder): Promise<IOrder> {
  const pool = getDBPool();
  const { orderId, orderPlacedDateTime = new Date(), orderItems, shopId } = orderData;
  if (!shopId) throw new Error('shopId is required for creating an order');
  const orderItemsJson = typeof orderItems === 'string' ? orderItems : JSON.stringify(orderItems);

  const query = `
    INSERT INTO orders ("orderId", "orderPlacedDateTime", "orderItems", shop_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *, shop_id AS "shopId";
  `;
  const values = [orderId, orderPlacedDateTime, orderItemsJson, shopId];

  try {
    const result = await pool.query(query, values);
    const dbOrder = result.rows[0];
    if (dbOrder.orderItems && typeof dbOrder.orderItems === 'string') {
      try { dbOrder.orderItems = JSON.parse(dbOrder.orderItems); } catch (e) {
        console.error('Failed to parse orderItems JSON for orderId:', dbOrder.orderId, e);
      }
    }
    return { ...dbOrder, shopId: dbOrder.shop_id };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string, shopId: string): Promise<IOrder | null> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for fetching an order');
  const query = 'SELECT *, shop_id AS "shopId" FROM orders WHERE "orderId" = $1 AND shop_id = $2;';
  try {
    const result = await pool.query(query, [orderId, shopId]);
    if (result.rows.length > 0) {
      const dbOrder = result.rows[0];
      if (dbOrder.orderItems && typeof dbOrder.orderItems === 'string') {
        try { dbOrder.orderItems = JSON.parse(dbOrder.orderItems); } catch (e) {
          console.error('Failed to parse orderItems JSON for orderId:', dbOrder.orderId, e);
        }
      }
      return { ...dbOrder, shopId: dbOrder.shop_id };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching order by ID ${orderId} for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function getAllOrders(shopId: string): Promise<IOrder[]> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for fetching orders');
  const query = 'SELECT *, shop_id AS "shopId" FROM orders WHERE shop_id = $1 ORDER BY "orderPlacedDateTime" DESC;';
  try {
    const result = await pool.query(query, [shopId]);
    return result.rows.map(dbOrder => {
      if (dbOrder.orderItems && typeof dbOrder.orderItems === 'string') {
        try { dbOrder.orderItems = JSON.parse(dbOrder.orderItems); } catch (e) {
          console.error('Failed to parse orderItems JSON for orderId:', dbOrder.orderId, e);
        }
      }
      return { ...dbOrder, shopId: dbOrder.shop_id };
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
}

export async function updateOrder(orderId: string, shopId: string, updateData: Partial<IOrder>): Promise<IOrder | null> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for updating an order');
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
    if (value !== undefined && key !== 'orderId' && key !== 'shopId') {
      setClauses.push(`"${key}" = $${valueCount++}`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) return getOrderById(orderId, shopId);
  values.push(orderId, shopId);

  const query = `
    UPDATE orders SET ${setClauses.join(', ')}
    WHERE "orderId" = $${valueCount++} AND shop_id = $${valueCount}
    RETURNING *, shop_id AS "shopId";
  `;
  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      const dbOrder = result.rows[0];
      if (dbOrder.orderItems && typeof dbOrder.orderItems === 'string') {
        try { dbOrder.orderItems = JSON.parse(dbOrder.orderItems); } catch (e) {
          console.error('Failed to parse orderItems JSON for orderId:', dbOrder.orderId, e);
        }
      }
      return { ...dbOrder, shopId: dbOrder.shop_id };
    }
    return null;
  } catch (error) {
    console.error(`Error updating order ID ${orderId} for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function deleteOrder(orderId: string, shopId: string): Promise<boolean> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for deleting an order');
  const query = 'DELETE FROM orders WHERE "orderId" = $1 AND shop_id = $2;';
  try {
    const result = await pool.query(query, [orderId, shopId]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting order ID ${orderId} for shopId ${shopId}:`, error);
    throw error;
  }
}

// --- Service functions for OrderItems CRUD ---

export async function createOrderItem(orderItemData: IOrderItem): Promise<IOrderItem> {
  const pool = getDBPool();
  const {
    orderItemId, orderId, ean, shopId, fulfilmentMethod = null, fulfilmentStatus = null,
    quantity = 0, quantityShipped = 0, quantityCancelled = 0,
    cancellationRequest = false, latestChangedDateTime = new Date(),
  } = orderItemData;

  if (!shopId) throw new Error('shopId is required for creating an order item');

  const orderCheckQuery = 'SELECT "orderId" FROM orders WHERE "orderId" = $1 AND shop_id = $2';
  const orderCheckResult = await pool.query(orderCheckQuery, [orderId, shopId]);
  if (orderCheckResult.rowCount === 0) {
    throw new Error(`Order with ID ${orderId} not found for shopId ${shopId}.`);
  }

  const query = `
    INSERT INTO order_items (
      "orderItemId", "orderId", ean, shop_id, "fulfilmentMethod", "fulfilmentStatus",
      quantity, "quantityShipped", "quantityCancelled", "cancellationRequest", "latestChangedDateTime"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *, shop_id AS "shopId";
  `;
  const values = [
    orderItemId, orderId, ean, shopId, fulfilmentMethod, fulfilmentStatus,
    quantity, quantityShipped, quantityCancelled, cancellationRequest, latestChangedDateTime
  ];

  try {
    const result = await pool.query(query, values);
    return { ...result.rows[0], shopId: result.rows[0].shop_id };
  } catch (error) {
    console.error('Error creating order item:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === '23503') {
      throw new Error(`Order with ID ${orderId} not found for shopId ${shopId} or another foreign key constraint failed.`);
    }
    throw error;
  }
}

export async function getOrderItemById(orderItemId: string, shopId: string): Promise<IOrderItem | null> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for fetching an order item');
  const query = 'SELECT *, shop_id AS "shopId" FROM order_items WHERE "orderItemId" = $1 AND shop_id = $2;';
  try {
    const result = await pool.query(query, [orderItemId, shopId]);
    return result.rows.length > 0 ? { ...result.rows[0], shopId: result.rows[0].shop_id } : null;
  } catch (error) {
    console.error(`Error fetching order item by ID ${orderItemId} for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function getOrderItemsByOrderId(orderId: string, shopId: string): Promise<IOrderItem[]> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for fetching order items');
  const query = 'SELECT *, shop_id AS "shopId" FROM order_items WHERE "orderId" = $1 AND shop_id = $2 ORDER BY "orderItemId";';
  try {
    const result = await pool.query(query, [orderId, shopId]);
    return result.rows.map(row => ({ ...row, shopId: row.shop_id }));
  } catch (error) {
    console.error(`Error fetching order items for order ID ${orderId} and shopId ${shopId}:`, error);
    throw error;
  }
}

export async function updateOrderItem(orderItemId: string, shopId: string, updateData: Partial<IOrderItem>): Promise<IOrderItem | null> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for updating an order item');
  const setClauses: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (key === 'orderItemId' || key === 'orderId' || key === 'shopId') continue;
    if (value !== undefined) {
      setClauses.push(`"${key}" = $${valueCount++}`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) return getOrderItemById(orderItemId, shopId);
  values.push(orderItemId, shopId);

  const query = `
    UPDATE order_items SET ${setClauses.join(', ')}
    WHERE "orderItemId" = $${valueCount++} AND shop_id = $${valueCount}
    RETURNING *, shop_id AS "shopId";
  `;
  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? { ...result.rows[0], shopId: result.rows[0].shop_id } : null;
  } catch (error) {
    console.error(`Error updating order item ID ${orderItemId} for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function deleteOrderItem(orderItemId: string, shopId: string): Promise<boolean> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for deleting an order item');
  const query = 'DELETE FROM order_items WHERE "orderItemId" = $1 AND shop_id = $2;';
  try {
    const result = await pool.query(query, [orderItemId, shopId]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting order item ID ${orderItemId} for shopId ${shopId}:`, error);
    throw error;
  }
}

// --- Product Model CRUD ---

export async function createProduct(productData: IProduct): Promise<IProduct> {
  const pool = getDBPool();
  if (!productData.shopId) throw new Error('shopId is required for creating a product');
  const query = `
    INSERT INTO products (ean, title, description, brand, "mainImageUrl", attributes, "lastSyncFromBol", "lastSyncToBol", vat_rate, "userId", shop_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (ean, shop_id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      brand = EXCLUDED.brand,
      "mainImageUrl" = EXCLUDED."mainImageUrl",
      attributes = EXCLUDED.attributes,
      "lastSyncFromBol" = EXCLUDED."lastSyncFromBol",
      "lastSyncToBol" = EXCLUDED."lastSyncToBol",
      vat_rate = EXCLUDED.vat_rate,
      "userId" = EXCLUDED."userId"
    RETURNING *, shop_id AS "shopId";
  `;
  const values = [
    productData.ean,
    productData.title,
    productData.description,
    productData.brand,
    productData.mainImageUrl,
    productData.attributes ? JSON.stringify(productData.attributes) : null,
    productData.lastSyncFromBol,
    productData.lastSyncToBol,
    productData.vatRate,
    productData.userId || null,
    productData.shopId
  ];
  try {
    const result = await pool.query(query, values);
    const product = result.rows[0];
    if (typeof product.attributes === 'string') {
      product.attributes = JSON.parse(product.attributes);
    }
    return { ...product, shopId: product.shop_id };
  } catch (error) {
    console.error(`Error creating/updating product with EAN ${productData.ean} for shopId ${productData.shopId}:`, error);
    throw error;
  }
}

export async function getProductByEan(ean: string, shopId: string): Promise<IProduct | null> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for fetching a product');
  const query = 'SELECT ean, title, description, brand, "mainImageUrl", attributes, "lastSyncFromBol", "lastSyncToBol", vat_rate AS "vatRate", country, "userId", shop_id AS "shopId" FROM products WHERE ean = $1 AND shop_id = $2;';
  try {
    const result = await pool.query(query, [ean, shopId]);
    if (result.rows.length > 0) {
      const product = result.rows[0] as IProduct;
      if (typeof product.attributes === 'string') {
        product.attributes = JSON.parse(product.attributes);
      }
      return { ...product, shopId: product.shopId };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product by EAN ${ean} for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function updateProduct(ean: string, shopId: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for updating a product');
  const setClauses: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  for (let [key, value] of Object.entries(updateData)) {
    if (value !== undefined && key !== 'ean' && key !== 'shopId') {
      let dbKey = key;
      if (key === 'attributes' && typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      if (key === 'vatRate') {
        dbKey = 'vat_rate';
      }
      if (key === 'userId') {
        dbKey = 'userId';
      }
      setClauses.push(`"${dbKey}" = $${valueCount++}`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) return getProductByEan(ean, shopId);
  values.push(ean, shopId);

  const query = `UPDATE products SET ${setClauses.join(', ')} WHERE ean = $${valueCount++} AND shop_id = $${valueCount} RETURNING *, shop_id AS "shopId";`;
  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      const product = result.rows[0];
      if (typeof product.attributes === 'string') {
        product.attributes = JSON.parse(product.attributes);
      }
      return { ...product, shopId: product.shop_id };
    }
    return null;
  } catch (error) {
    console.error(`Error updating product EAN ${ean} for shopId ${shopId}:`, error);
    throw error;
  }
}

export async function getAllProducts(userId: string, shopId: string, page: number = 1, limit: number = 10): Promise<{ products: IProduct[], total: number, page: number, limit: number }> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for fetching products');
  const offset = (page - 1) * limit;

  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM products WHERE "userId" = $1 AND shop_id = $2;', [userId, shopId]);
    const total = parseInt(totalResult.rows[0].count, 10);

    const productsQuery = `
      SELECT ean, title, description, brand, "mainImageUrl", attributes, "lastSyncFromBol", "lastSyncToBol", vat_rate AS "vatRate", country, "userId", shop_id AS "shopId"
      FROM products
      WHERE "userId" = $1 AND shop_id = $2
      ORDER BY title ASC NULLS LAST, ean ASC
      LIMIT $3 OFFSET $4;
    `;
    const productsResult = await pool.query(productsQuery, [userId, shopId, limit, offset]);

    const products: IProduct[] = productsResult.rows.map(p => {
      if (p.attributes && typeof p.attributes === 'string') {
        try {
          p.attributes = JSON.parse(p.attributes);
        } catch (e) {
          console.error(`Error parsing attributes for EAN ${p.ean}:`, e);
          p.attributes = null;
        }
      }
      return { ...p, shopId: p.shop_id } as IProduct;
    });

    return {
      products,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error('Error fetching all products with pagination:', error);
    throw error;
  }
}

// --- Bol.com Product Content Synchronization ---

function mapBolProductContentToLocal(bolContent: BolProductContent): Partial<IProduct> {
  const localProduct: Partial<IProduct> = { ean: bolContent.ean };
  const otherAttributes: Record<string, any> = {};

  bolContent.attributes.forEach(attr => {
    const value = attr.values[0]?.value;
    if (value === undefined) return;

    switch (attr.id.toLowerCase()) {
      case 'title':
      case 'titel':
        localProduct.title = String(value);
        break;
      case 'description':
      case 'beschrijving':
        localProduct.description = String(value);
        break;
      case 'brand':
      case 'merk':
        localProduct.brand = String(value);
        break;
      default:
        otherAttributes[attr.id] = value;
    }
  });
  localProduct.attributes = otherAttributes;

  const primaryAsset = bolContent.assets.find(
    asset => asset.type === 'IMAGE_HEADER' || asset.variants.some(v => v.usage === 'PRIMARY')
  );
  if (primaryAsset) {
    const largeVariant = primaryAsset.variants.find(v => v.size === 'LARGE') || primaryAsset.variants[0];
    if (largeVariant) {
      localProduct.mainImageUrl = largeVariant.url;
    }
  }
  return localProduct;
}

export async function getBolProductContent(userId: string, shopId: string, ean: string, language: string = 'nl'): Promise<Partial<IProduct> | null> {
  if (!shopId) throw new Error('shopId is required for fetching Bol product content');
  const credentials = await getBolCredentials(userId, shopId);
  const bolService = new BolService(credentials.clientId, credentials.clientSecret);
  const bolContent = await bolService.fetchProductContent(ean, language);
  if (!bolContent) {
    console.log(`No Bol.com content found for EAN ${ean}, language ${language}.`);
    return null;
  }
  return mapBolProductContentToLocal(bolContent);
}

export async function pushLocalProductToBol(userId: string, shopId: string, ean: string, language: string = 'nl'): Promise<{ processId: string | null; message: string; error?: any }> {
  if (!shopId) throw new Error('shopId is required for pushing product to Bol');
  const credentials = await getBolCredentials(userId, shopId);
  const bolService = new BolService(credentials.clientId, credentials.clientSecret);
  const localProduct = await getProductByEan(ean, shopId);
  if (!localProduct) {
    return { processId: null, message: `Product with EAN ${ean} not found locally for shopId ${shopId}.`, error: 'Local product not found' };
  }

  const attributes: BolCreateProductAttribute[] = [];
  if (localProduct.title) attributes.push({ id: 'Title', values: [{ value: localProduct.title }] });
  if (localProduct.description) attributes.push({ id: 'Description', values: [{ value: localProduct.description }] });
  if (localProduct.brand) attributes.push({ id: 'Brand', values: [{ value: localProduct.brand }] });

  if (localProduct.attributes) {
    for (const key in localProduct.attributes) {
      if (!['title', 'description', 'brand'].includes(key.toLowerCase())) {
        attributes.push({ id: key, values: [{ value: localProduct.attributes[key] }] });
      }
    }
  }
  const payload: BolCreateProductContentPayload = { language, data: { ean, attributes } };

  try {
    const processStatus = await bolService.upsertProductContent(payload);
    await updateProduct(ean, shopId, { lastSyncToBol: new Date() });
    return { processId: processStatus.processStatusId, message: `Product content update initiated for EAN ${ean}. Poll process ID for status.` };
  } catch (error: unknown) {
    console.error(`Error pushing product EAN ${ean} to Bol for shopId ${shopId}:`, error);
    return { processId: null, message: `Failed to initiate product content update for EAN ${ean}.`, error: (error instanceof Error ? error.message : String(error)) };
  }
}

export async function pollBolProcessStatus(userId: string, shopId: string, processId: string, maxAttempts = 20, pollInterval = 5000): Promise<ProcessStatus> {
  if (!shopId) throw new Error('shopId is required for polling Bol process status');
  const credentials = await getBolCredentials(userId, shopId);
  const bolService = new BolService(credentials.clientId, credentials.clientSecret);
  let attempts = 0;
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));
    attempts++;
    console.log(`Polling process status for ID ${processId}, attempt ${attempts}`);
    const currentStatus = await bolService.getProcessStatus(processId);
    if (currentStatus.status === 'SUCCESS' || currentStatus.status === 'FAILURE' || currentStatus.status === 'TIMEOUT') {
      console.log(`Process ID ${processId} finished with status: ${currentStatus.status}`);
      return currentStatus;
    }
    console.log(`Process ID ${processId} status: ${currentStatus.status}. Polling again...`);
  }
  throw new Error(`Process ID ${processId} timed out after ${maxAttempts} polling attempts.`);
}

// --- New Product Sync Logic ---

async function _fetchRetailerProductDetails(ean: string, bolService: BolService, language: string = 'nl'): Promise<Partial<IProduct> | null> {
  const productDetails: Partial<IProduct> = { ean };
  let catalogDataFound = false;

  try {
    console.log(`_fetchRetailerProductDetails: Fetching from /content/catalog-products/:ean/${ean} for lang ${language}`);
    const catalogResponse = await bolService.apiClient.get<BolCatalogProductResponse>(`/content/catalog-products/${ean}`, {
      headers: { 'Accept': 'application/vnd.retailer.v10+json', 'Accept-Language': 'nl' }
    });

    if (catalogResponse.data && catalogResponse.data.attributes) {
      catalogDataFound = true;
      const attributes = catalogResponse.data.attributes;

      const titleAttr = attributes.find(attr => attr.id === 'Title');
      if (titleAttr && titleAttr.values.length > 0) {
        productDetails.title = String(titleAttr.values[0].value);
      }

      const descAttr = attributes.find(attr => attr.id === 'Description');
      if (descAttr && descAttr.values.length > 0) {
        productDetails.description = String(descAttr.values[0].value);
      }

      if (catalogResponse.data.parties) {
        const brandParty = catalogResponse.data.parties.find(party => party.role === 'BRAND');
        if (brandParty) {
          productDetails.brand = brandParty.name;
        }
      }

      const otherAttributes: Record<string, any> = {};
      attributes.forEach(attr => {
        if (attr.id !== 'Title' && attr.id !== 'Description' && attr.values.length > 0) {
          otherAttributes[attr.id] = attr.values[0].value;
        }
      });
      if (Object.keys(otherAttributes).length > 0) {
        productDetails.attributes = otherAttributes;
      }

      console.log(`_fetchRetailerProductDetails: Successfully fetched catalog data for EAN ${ean}. Title: ${productDetails.title}`);
    } else {
      console.warn(`_fetchRetailerProductDetails: No attributes found in catalog response for EAN ${ean}.`);
    }
  } catch (error: any) {
    const axiosError = error as AxiosError<any>;
    if (axiosError.isAxiosError && axiosError.response && axiosError.response.status === 404) {
      console.warn(`_fetchRetailerProductDetails: Product EAN ${ean} not found at /retailer/catalog-products.`);
      return null;
    }
    console.error(`_fetchRetailerProductDetails: Error fetching catalog details for EAN ${ean}:`, axiosError.message);
    if (axiosError.response) {
      console.error('Catalog API Error Response data:', axiosError.response.data);
      console.error('Catalog API Error Response status:', axiosError.response.status);
    }
    throw new Error(`Failed to fetch catalog details for EAN ${ean}: ${axiosError.message}`);
  }

  if (!catalogDataFound) {
    console.warn(`_fetchRetailerProductDetails: No catalog data found for EAN ${ean}, skipping asset fetch.`);
    return Object.keys(productDetails).length > 1 ? productDetails : null;
  }

  try {
    console.log(`_fetchRetailerProductDetails: Fetching assets for EAN ${ean}`);
    const assetsResponse = await bolService.apiClient.get<BolProductAssetsResponse>(`/products/${ean}/assets`, {
      params: { usage: 'PRIMARY' },
      headers: { 'Accept': 'application/vnd.retailer.v10+json' }
    });

    if (assetsResponse.data && assetsResponse.data.assets && assetsResponse.data.assets.length > 0) {
      const primaryAsset = assetsResponse.data.assets[0];
      if (primaryAsset.variants && primaryAsset.variants.length > 0) {
        let imageUrl: string | undefined;
        const mediumVariant = primaryAsset.variants.find(v => v.size === 'medium');
        const largeVariant = primaryAsset.variants.find(v => v.size === 'large');

        if (mediumVariant) {
          imageUrl = mediumVariant.url;
        } else if (largeVariant) {
          imageUrl = largeVariant.url;
        } else {
          imageUrl = primaryAsset.variants[0].url;
        }
        productDetails.mainImageUrl = imageUrl;
        console.log(`_fetchRetailerProductDetails: Successfully fetched image URL for EAN ${ean}: ${imageUrl}`);
      } else {
        console.warn(`_fetchRetailerProductDetails: No variants found in primary asset for EAN ${ean}.`);
      }
    } else {
      console.warn(`_fetchRetailerProductDetails: No primary assets found for EAN ${ean}.`);
    }
  } catch (error: any) {
    const axiosError = error as AxiosError<any>;
    if (axiosError.isAxiosError && axiosError.response && axiosError.response.status === 404) {
      console.warn(`_fetchRetailerProductDetails: Assets not found for EAN ${ean}.`);
    } else {
      console.error(`_fetchRetailerProductDetails: Error fetching assets for EAN ${ean}:`, axiosError.message);
      if (axiosError.response) {
        console.error('Assets API Error Response data:', axiosError.response.data);
        console.error('Assets API Error Response status:', axiosError.response.status);
      }
    }
  }

  return Object.keys(productDetails).length > 1 ? productDetails : null;
}

export async function syncProductsFromOffersAndRetailerApi(userId: string, shopId: string): Promise<{ processed: number; success: number; failed: number; errors: string[] }> {
  if (!shopId) throw new Error('shopId is required for syncing products');
  let eansToProcess: string[] = [];
  const summary = { processed: 0, success: 0, failed: 0, errors: [] as string[] };

  console.log(`Starting product sync for user ${userId} and shopId ${shopId}. Fetching EANs from existing offers.`);
  try {
    const allLocalOffers = await getAllOffers(shopId);
    if (allLocalOffers.length === 0) {
      summary.errors.push(`No offers found for shopId ${shopId} to process EANs from.`);
      console.log("Product sync cannot proceed as no offers are available.");
      return summary;
    }

    eansToProcess = [...new Set(allLocalOffers.map(offer => offer.ean).filter(Boolean))];
    if (eansToProcess.length === 0) {
      summary.errors.push(`No unique EANs found for shopId ${shopId}.`);
      console.log("Product sync cannot proceed as no EANs were extracted.");
      return summary;
    }
    console.log(`Extracted ${eansToProcess.length} unique EANs for user ${userId} and shopId ${shopId}.`);
  } catch (error: any) {
    console.error(`Error fetching EANs for user ${userId} and shopId ${shopId}:`, error);
    summary.errors.push(`Failed to fetch EANs: ${error.message}`);
    return summary;
  }

  console.log(`Proceeding to process ${eansToProcess.length} EANs for user ${userId} and shopId ${shopId}.`);
  summary.processed = eansToProcess.length;

  let bolServiceInstance: BolService;
  try {
    const credentials = await getBolCredentials(userId, shopId);
    bolServiceInstance = new BolService(credentials.clientId, credentials.clientSecret);
  } catch (credError: any) {
    console.error(`Failed to get Bol credentials for user ${userId} and shopId ${shopId}: ${credError.message}.`);
    summary.errors.push(`Failed to initialize Bol service: ${credError.message}`);
    summary.failed = eansToProcess.length;
    return summary;
  }

  for (const ean of eansToProcess) {
    try {
      console.log(`Processing EAN: ${ean}`);
      let productData: Partial<IProduct> = { ean, shopId };

      const retailerDetails = await _fetchRetailerProductDetails(ean, bolServiceInstance, 'nl');
      if (retailerDetails) {
        productData = { ...productData, ...retailerDetails };
        productData.lastSyncFromBol = new Date();
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn(`No details found from Bol.com retailer API for EAN ${ean}. Product will be created/updated with minimal info.`);
      }

      productData.vatRate = null;
      productData.userId = userId;
      await createProduct(productData as IProduct);
      console.log(`Successfully created/updated product for EAN ${ean} and shopId ${shopId}.`);
      summary.success++;
    } catch (error: any) {
      console.error(`Failed to process EAN ${ean} for shopId ${shopId}:`, error);
      summary.failed++;
      summary.errors.push(`EAN ${ean}: ${error.message}`);
    }
  }

  console.log("Product synchronization complete.", summary);
  return summary;
}

// --- Bol.com Order Synchronization ---

export async function synchronizeBolOrders(
  userId: string,
  shopId: string,
  status: string = 'OPEN',
  fulfilmentMethod: 'FBR' | 'FBB' | null = null,
  latestChangedDate: string | null = null
): Promise<{ createdOrders: number; updatedOrders: number; createdItems: number; updatedItems: number; failedOrders: number; errors: string[] }> {
  if (!shopId) throw new Error('shopId is required for synchronizing Bol orders');
  const credentials = await getBolCredentials(userId, shopId);
  const bolService = new BolService(credentials.clientId, credentials.clientSecret);
  let currentPage = 1;
  let morePages = true;
  const summary = {
    createdOrders: 0,
    updatedOrders: 0,
    createdItems: 0,
    updatedItems: 0,
    failedOrders: 0,
    errors: [] as string[],
  };

  console.log(`Starting Bol.com order synchronization for shopId ${shopId}. Params: status=${status}, fulfilmentMethod=${fulfilmentMethod}, latestChangedDate=${latestChangedDate}`);

  while (morePages) {
    try {
      console.log(`Fetching page ${currentPage} of orders from Bol.com...`);
      const bolOrders: BolOrder[] = await bolService.fetchOrders(currentPage, status, fulfilmentMethod, latestChangedDate);

      if (bolOrders.length === 0) {
        morePages = false;
        console.log('No more orders found on Bol.com for the given criteria.');
        break;
      }

      console.log(`Processing ${bolOrders.length} orders from page ${currentPage}...`);

      for (const bolOrder of bolOrders) {
        try {
          const localOrderData: Partial<IOrder> = {
            orderId: bolOrder.orderId,
            orderPlacedDateTime: new Date(bolOrder.orderPlacedDateTime),
            shopId,
          };

          const existingOrder = await getOrderById(bolOrder.orderId, shopId);
          let currentOrder: IOrder;

          if (existingOrder) {
            currentOrder = await updateOrder(bolOrder.orderId, shopId, localOrderData) as IOrder;
            summary.updatedOrders++;
            console.log(`Updated existing local order ID: ${bolOrder.orderId} for shopId ${shopId}`);
          } else {
            const newOrderPayload: IOrder = {
              orderId: bolOrder.orderId,
              orderPlacedDateTime: new Date(bolOrder.orderPlacedDateTime),
              orderItems: [],
              shopId,
            };
            currentOrder = await createOrder(newOrderPayload);
            summary.createdOrders++;
            console.log(`Created new local order ID: ${bolOrder.orderId} for shopId ${shopId}`);
          }

          if (bolOrder.orderItems && bolOrder.orderItems.length > 0) {
            const localOrderItems: IOrderItem[] = [];
            for (const bolItem of bolOrder.orderItems) {
              const localItemData: IOrderItem = {
                orderItemId: bolItem.orderItemId,
                orderId: bolOrder.orderId,
                ean: bolItem.product.ean,
                shopId,
                fulfilmentMethod: bolItem.fulfilment?.method || undefined,
                fulfilmentStatus: bolItem.fulfilment?.status || undefined,
                quantity: bolItem.quantity,
                quantityShipped: bolItem.quantityShipped || 0,
                quantityCancelled: bolItem.quantityCancelled || 0,
                cancellationRequest: bolItem.cancellationRequest || false,
                latestChangedDateTime: bolItem.fulfilment?.latestChangedDateTime
                  ? new Date(bolItem.fulfilment.latestChangedDateTime)
                  : new Date(),
              };
              localOrderItems.push(localItemData);

              const existingItem = await getOrderItemById(bolItem.orderItemId, shopId);
              if (existingItem) {
                await updateOrderItem(bolItem.orderItemId, shopId, localItemData);
                summary.updatedItems++;
                console.log(`Updated order item ID: ${bolItem.orderItemId} for order ${bolOrder.orderId} and shopId ${shopId}`);
              } else {
                await createOrderItem(localItemData);
                summary.createdItems++;
                console.log(`Created new order item ID: ${bolItem.orderItemId} for order ${bolOrder.orderId} and shopId ${shopId}`);
              }
            }
            if (currentOrder) {
              await updateOrder(currentOrder.orderId, shopId, { orderItems: localOrderItems });
              console.log(`Updated order ${currentOrder.orderId} with its processed items for shopId ${shopId}.`);
            }
          }
        } catch (orderProcessingError) {
          console.error(`Error processing Bol order ID ${bolOrder.orderId} for shopId ${shopId}:`, orderProcessingError);
          summary.failedOrders++;
          summary.errors.push(`Failed to process order ${bolOrder.orderId}: ${(orderProcessingError as Error).message}`);
        }
      }
      currentPage++;
    } catch (fetchError) {
      console.error(`Error fetching orders from Bol.com (page ${currentPage}) for shopId ${shopId}:`, fetchError);
      summary.failedOrders++;
      summary.errors.push(`Failed to fetch orders page ${currentPage}: ${(fetchError as Error).message}`);
      morePages = false;
    }
  }

  console.log('Order synchronization finished.', summary);
  return summary;
}

// --- Bol.com Integration for Offer Export ---

async function getBolCredentials(userId: string, shopId: string): Promise<{ clientId: string; clientSecret: string }> {
  if (!userId) throw new Error('userId is required to fetch Bol credentials');
  if (!shopId) throw new Error('shopId is required to fetch Bol credentials');
  try {
    const settingsServiceDirectUrl = process.env.SETTINGS_SERVICE_DIRECT_URL || 'http://settings_service:3000';
    const accountUrl = `${settingsServiceDirectUrl}/settings/account?userId=${encodeURIComponent(userId)}&shopId=${encodeURIComponent(shopId)}`;

    console.log(`Fetching Bol API credentials for user ${userId} and shopId ${shopId} from settings service at ${accountUrl}...`);

    const response = await axios.get(accountUrl);

    interface AccountDetailsResponse {
      bolClientId: string | null;
      bolClientSecret: string | null;
    }
    const data = response.data as AccountDetailsResponse;

    if (!data.bolClientId || !data.bolClientSecret) {
      console.error(`Fetched Bol API credentials for user ${userId} and shopId ${shopId} are incomplete or null.`);
      throw new Error(`Bol API credentials for user ${userId} and shopId ${shopId} are incomplete or missing.`);
    }
    console.log(`Successfully fetched Bol API credentials for user ${userId} and shopId ${shopId}.`);
    return { clientId: data.bolClientId, clientSecret: data.bolClientSecret };
  } catch (error: unknown) {
    console.error(`Failed to fetch Bol API credentials for user ${userId} and shopId ${shopId}:`, error);
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      const status = axiosError.response?.status;
      const responseData = axiosError.response?.data;
      let message = 'No additional details';
      if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
        message = (responseData as { message: string }).message;
      } else if (typeof responseData === 'string') {
        message = responseData;
      }
      console.error(`Axios error details from settings_service for user ${userId} and shopId ${shopId}:`, responseData);
      throw new Error(`Failed to retrieve Bol API credentials for user ${userId} and shopId ${shopId}. Settings service responded with status ${status}: ${message}. Ensure settings_service is running at the direct URL and configured to accept userId and shopId in query/body.`);
    } else if (error instanceof Error) {
      console.error('Non-Axios error:', error.message);
      throw new Error(`Failed to retrieve Bol API credentials for user ${userId} and shopId ${shopId} from settings_service. Error: ${error.message}`);
    }
    throw new Error(`Failed to retrieve Bol API credentials for user ${userId} and shopId ${shopId} from settings_service due to an unknown error.`);
  }
}

export async function exportAllOffersAsCsv(userId: string, shopId: string): Promise<any> {
  if (!shopId) throw new Error('shopId is required for exporting offers as CSV');
  try {
    const credentials = await getBolCredentials(userId, shopId);
    const bolService = new BolService(credentials.clientId, credentials.clientSecret);

    console.log('Attempting to export all offers as CSV via BolService...');
    const csvData = await bolService.exportOffers('CSV');
    console.log('Successfully received CSV data from BolService. Parsing and saving offers...');

    const importResult = await _parseAndSaveOffersFromCsv(csvData, shopId);
    console.log(`CSV processing complete. Success: ${importResult.successCount}, Errors: ${importResult.errorCount}`);

    if (importResult.errorCount > 0) {
      console.log(`Returning result with errors. Success: ${importResult.successCount}, Errors: ${importResult.errorCount}`);
      return {
        message: `Offer import completed with some errors. Saved: ${importResult.successCount}, Failed: ${importResult.errorCount}.`,
        details: importResult.errors,
        successCount: importResult.successCount,
        errorCount: importResult.errorCount
      };
    }

    console.log(`Returning successful result. Success: ${importResult.successCount}, Errors: ${importResult.errorCount}`);
    return {
      message: `Successfully exported and saved ${importResult.successCount} offers from Bol.com for shopId ${shopId}.`,
      successCount: importResult.successCount,
      errorCount: importResult.errorCount
    };
  } catch (error: unknown) {
    console.error('Error in exportAllOffersAsCsv (ShopService):', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      console.error('Axios error during offer export:', axiosError.response?.data || axiosError.message);
      throw new Error(`Failed during offer export process for shopId ${shopId}: ${axiosError.message}`);
    } else if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

function normalizeHeader(header: string): keyof IOffer | null {
  const normalized = header.toLowerCase().replace(/\s+/g, '');
  switch (normalized) {
    case 'offerid': return 'offerId';
    case 'ean': return 'ean';
    case 'conditionname': return 'conditionName';
    case 'conditioncategory': return 'conditionCategory';
    case 'conditioncomment': return 'conditionComment';
    case 'bundlepricesprice': return 'bundlePricesPrice';
    case 'fulfilmentdeliverycode': return 'fulfilmentDeliveryCode';
    case 'stockamount': return 'stockAmount';
    case 'onholdbyretailer': return 'onHoldByRetailer';
    case 'fulfilmenttype': return 'fulfilmentType';
    case 'mutationdatetime': return 'mutationDateTime';
    case 'referencecode': return 'referenceCode';
    case 'correctedstock': return 'correctedStock';
    default:
      console.warn(`Unrecognized CSV header: ${header}`);
      return null;
  }
}

async function _parseAndSaveOffersFromCsv(csvData: string, shopId: string): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
  if (!shopId) throw new Error('shopId is required for parsing and saving offers');
  return new Promise((resolve, reject) => {
    parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: (value: string, context: ParseContext) => {
        const columnHeader = context.column as string;
        if (columnHeader === 'bundlePricesPrice' || columnHeader === 'stockAmount' || columnHeader === 'correctedStock') {
          return value === '' || value === null || value === undefined ? null : Number(value);
        }
        if (columnHeader === 'onHoldByRetailer') {
          if (typeof value === 'string') {
            return value.toLowerCase() === 'true' || value === '1';
          }
          return Boolean(value);
        }
        if (columnHeader === 'mutationDateTime') {
          return value === '' || value === null || value === undefined ? null : new Date(value);
        }
        if (columnHeader === 'ean' && typeof value === 'string' && value.toUpperCase().includes('E+')) {
          const num = Number(value);
          if (!isNaN(num)) {
            return String(BigInt(num));
          }
        }
        return value;
      },
    }, (err: CsvError | undefined, records: Record<string, any>[] | undefined) => {
      if (err) {
        console.error('Error parsing CSV:', err);
        return reject(new Error(`Failed to parse CSV data: ${err.message}`));
      }
      if (!records) {
        console.error('No records returned from CSV parsing');
        return reject(new Error('No records returned from CSV parsing'));
      }

      (async () => {
        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        console.log(`Parsed ${records.length} records from CSV. Attempting to save to database for shopId ${shopId}...`);

        for (const record of records) {
          const offerId = record.offerId as string;
          const ean = record.ean as string;

          if (!offerId || !ean) {
            errors.push(`Skipping record due to missing offerId or ean: ${JSON.stringify(record)}`);
            errorCount++;
            continue;
          }

          try {
            const existingOffer = await getOfferById(offerId, shopId);

            const offerPayload: IOffer = {
              offerId: offerId,
              ean: ean,
              shopId,
              conditionName: record.conditionName as string ?? existingOffer?.conditionName ?? null,
              conditionCategory: record.conditionCategory as string ?? existingOffer?.conditionCategory ?? null,
              conditionComment: record.conditionComment as string ?? existingOffer?.conditionComment ?? null,
              bundlePricesPrice: record.bundlePricesPrice as number ?? existingOffer?.bundlePricesPrice ?? null,
              fulfilmentDeliveryCode: record.fulfilmentDeliveryCode as string ?? existingOffer?.fulfilmentDeliveryCode ?? null,
              stockAmount: record.stockAmount as number ?? existingOffer?.stockAmount ?? null,
              onHoldByRetailer: record.onHoldByRetailer as boolean ?? existingOffer?.onHoldByRetailer ?? false,
              fulfilmentType: record.fulfilmentType as string ?? existingOffer?.fulfilmentType ?? null,
              mutationDateTime: record.mutationDateTime as Date ?? existingOffer?.mutationDateTime ?? new Date(),
              referenceCode: record.referenceCode as string ?? existingOffer?.referenceCode ?? null,
              correctedStock: record.correctedStock as number ?? existingOffer?.correctedStock ?? null,
            };

            offerPayload.bundlePricesPrice = offerPayload.bundlePricesPrice === undefined ? null : offerPayload.bundlePricesPrice;
            offerPayload.stockAmount = offerPayload.stockAmount === undefined ? null : offerPayload.stockAmount;
            offerPayload.correctedStock = offerPayload.correctedStock === undefined ? null : offerPayload.correctedStock;
            offerPayload.onHoldByRetailer = offerPayload.onHoldByRetailer === undefined ? false : offerPayload.onHoldByRetailer;

            if (existingOffer) {
              await updateOffer(offerId, shopId, offerPayload);
              console.log(`Updated offer with ID: ${offerId} for shopId ${shopId}`);
            } else {
              await createOffer(offerPayload);
              console.log(`Created new offer with ID: ${offerId} for shopId ${shopId}`);
            }
            successCount++;
          } catch (dbError) {
            console.error(`Error saving offer with ID ${offerId} for shopId ${shopId}:`, dbError);
            errors.push(`Failed to save offer ${offerId}: ${(dbError as Error).message}`);
            errorCount++;
          }
        }
        console.log(`Finished processing CSV records. Success: ${successCount}, Failed: ${errorCount}`);
        console.log(`Resolving _parseAndSaveOffersFromCsv Promise with result:`, { successCount, errorCount, errors });
        resolve({ successCount, errorCount, errors });
      })();
    });
  });
}

// --- VAT Rate CRUD ---

export async function getVatRatesForProduct(ean: string, shopId: string): Promise<IProductVatRate[]> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for fetching VAT rates');
  const result = await pool.query('SELECT ean, country, vat_rate AS "vatRate", shop_id AS "shopId" FROM product_vat_rates WHERE ean = $1 AND shop_id = $2', [ean, shopId]);
  return result.rows.map(row => ({ ...row, shopId: row.shop_id }));
}

export async function setVatRateForProduct(ean: string, country: string, vatRate: number, shopId: string): Promise<IProductVatRate> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for setting VAT rate');
  await pool.query(
    'INSERT INTO product_vat_rates (ean, country, vat_rate, shop_id) VALUES ($1, $2, $3, $4) ON CONFLICT (ean, country, shop_id) DO UPDATE SET vat_rate = $3',
    [ean, country, vatRate, shopId]
  );
  return { ean, country, vatRate, shopId };
}

export async function deleteVatRateForProduct(ean: string, country: string, shopId: string): Promise<void> {
  const pool = getDBPool();
  if (!shopId) throw new Error('shopId is required for deleting VAT rate');
  await pool.query('DELETE FROM product_vat_rates WHERE ean = $1 AND country = $2 AND shop_id = $3', [ean, country, shopId]);
}
