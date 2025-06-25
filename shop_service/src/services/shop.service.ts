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

// --- Product Model CRUD ---
// Assuming IProduct is defined in ../models/shop.model.ts
import { IProduct } from '../models/shop.model';
// Import ProcessStatus correctly, and other types from bol.service
import BolService, { BolProductContent, BolCreateProductContentPayload, BolCreateProductAttribute, BolProductAttribute, ProcessStatus } from './bol.service';


export async function createProduct(productData: IProduct): Promise<IProduct> {
  const pool = getDBPool();
  // Using ON CONFLICT to handle potential duplicate EANs by updating existing record (upsert)
  const query = `
    INSERT INTO products (ean, title, description, brand, "mainImageUrl", attributes, "lastSyncFromBol", "lastSyncToBol")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (ean) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      brand = EXCLUDED.brand,
      "mainImageUrl" = EXCLUDED."mainImageUrl",
      attributes = EXCLUDED.attributes,
      "lastSyncFromBol" = EXCLUDED."lastSyncFromBol",
      "lastSyncToBol" = EXCLUDED."lastSyncToBol"
    RETURNING *;
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
  ];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(`Error creating/updating product with EAN ${productData.ean}:`, error);
    throw error;
  }
}

export async function getProductByEan(ean: string): Promise<IProduct | null> {
  const pool = getDBPool();
  const query = 'SELECT * FROM products WHERE ean = $1;';
  try {
    const result = await pool.query(query, [ean]);
    if (result.rows.length > 0) {
      const product = result.rows[0];
      // Ensure attributes are parsed if stored as JSON string
      if (typeof product.attributes === 'string') {
        product.attributes = JSON.parse(product.attributes);
      }
      return product;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product by EAN ${ean}:`, error);
    throw error;
  }
}

export async function updateProduct(ean: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
  const pool = getDBPool();
  const setClauses: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  for (let [key, value] of Object.entries(updateData)) {
    if (value !== undefined && key !== 'ean') {
      if (key === 'attributes' && typeof value === 'object' && value !== null) {
        value = JSON.stringify(value); // Stringify attributes if it's an object
      }
      setClauses.push(`"${key}" = $${valueCount++}`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) return getProductByEan(ean);
  values.push(ean);

  const query = `UPDATE products SET ${setClauses.join(', ')} WHERE ean = $${valueCount} RETURNING *;`;
  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      const product = result.rows[0];
      if (typeof product.attributes === 'string') {
        product.attributes = JSON.parse(product.attributes);
      }
      return product;
    }
    return null;
  } catch (error) {
    console.error(`Error updating product EAN ${ean}:`, error);
    throw error;
  }
}


// --- Bol.com Product Content Synchronization ---

function mapBolProductContentToLocal(bolContent: BolProductContent): Partial<IProduct> {
  const localProduct: Partial<IProduct> = { ean: bolContent.ean };
  const otherAttributes: Record<string, any> = {};

  bolContent.attributes.forEach(attr => {
    const value = attr.values[0]?.value; // Take first value for simplicity
    if (value === undefined) return;

    switch (attr.id.toLowerCase()) { // Normalize common Bol attribute IDs
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

export async function getBolProductContent(ean: string, language: string = 'nl'): Promise<Partial<IProduct> | null> {
  const credentials = await getBolCredentials(); // Await the promise
  const bolService = new BolService(credentials.clientId, credentials.clientSecret);
  const bolContent = await bolService.fetchProductContent(ean, language);
  if (!bolContent) {
    console.log(`No Bol.com content found for EAN ${ean}, language ${language}.`);
    return null;
  }
  return mapBolProductContentToLocal(bolContent);
}

export async function updateLocalProductFromBol(ean: string, language: string = 'nl'): Promise<IProduct | null> {
  const mappedProductData = await getBolProductContent(ean, language);
  if (!mappedProductData) {
    throw new Error(`Could not fetch or map product content from Bol.com for EAN ${ean}.`);
  }
  const updatePayload: Partial<IProduct> = { ...mappedProductData, lastSyncFromBol: new Date() };
  return createProduct(updatePayload as IProduct);
}

export async function pushLocalProductToBol(ean: string, language: string = 'nl'): Promise<{ processId: string | null; message: string; error?: any }> {
  const credentials = await getBolCredentials(); // Await the promise
  const bolService = new BolService(credentials.clientId, credentials.clientSecret);
  const localProduct = await getProductByEan(ean);
  if (!localProduct) {
    return { processId: null, message: `Product with EAN ${ean} not found locally.`, error: 'Local product not found' };
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
    await updateProduct(ean, { lastSyncToBol: new Date() });
    return { processId: processStatus.processStatusId, message: `Product content update initiated for EAN ${ean}. Poll process ID for status.` };
  } catch (error: unknown) {
    console.error(`Error pushing product EAN ${ean} to Bol:`, error);
    return { processId: null, message: `Failed to initiate product content update for EAN ${ean}.`, error: (error instanceof Error ? error.message : String(error)) };
  }
}

export async function pollBolProcessStatus(processId: string, maxAttempts = 20, pollInterval = 5000): Promise<ProcessStatus> {
    const credentials = await getBolCredentials(); // Await the promise
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

// --- Bol.com Order Synchronization ---
import { BolOrder, BolOrderItem } from './bol.service';

export async function synchronizeBolOrders(
  status: string = 'OPEN',
  fulfilmentMethod: 'FBR' | 'FBB' | null = null,
  latestChangedDate: string | null = null
): Promise<{ createdOrders: number; updatedOrders: number; createdItems: number; updatedItems: number; failedOrders: number; errors: string[] }> {
  const credentials = await getBolCredentials(); // Await the promise
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

  console.log(`Starting Bol.com order synchronization. Params: status=${status}, fulfilmentMethod=${fulfilmentMethod}, latestChangedDate=${latestChangedDate}`);

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
          // Map BolOrder to IOrder
          const localOrderData: Partial<IOrder> = {
            orderId: bolOrder.orderId,
            orderPlacedDateTime: new Date(bolOrder.orderPlacedDateTime),
            // orderItems will be handled separately after order creation/update
          };

          const existingOrder = await getOrderById(bolOrder.orderId);
          let currentOrder: IOrder;

          if (existingOrder) {
            currentOrder = await updateOrder(bolOrder.orderId, localOrderData) as IOrder;
            summary.updatedOrders++;
            console.log(`Updated existing local order ID: ${bolOrder.orderId}`);
          } else {
            // Ensure all required fields for IOrder are present if creating
            // For now, createOrder expects orderItems (even if empty array or stringified)
            // We will create order first, then its items.
            // The createOrder service might need adjustment if it strictly requires items upfront
            // or we ensure localOrderData has a valid (empty) orderItems field.
            const newOrderPayload: IOrder = {
                orderId: bolOrder.orderId,
                orderPlacedDateTime: new Date(bolOrder.orderPlacedDateTime),
                orderItems: [] // Initialize with empty, items will be added/updated below
            };
            currentOrder = await createOrder(newOrderPayload);
            summary.createdOrders++;
            console.log(`Created new local order ID: ${bolOrder.orderId}`);
          }

          // Process OrderItems
          if (bolOrder.orderItems && bolOrder.orderItems.length > 0) {
            const localOrderItems: IOrderItem[] = [];
            for (const bolItem of bolOrder.orderItems) {
              const localItemData: IOrderItem = {
                orderItemId: bolItem.orderItemId,
                orderId: bolOrder.orderId, // Link to parent order
                ean: bolItem.product.ean,
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

              const existingItem = await getOrderItemById(bolItem.orderItemId);
              if (existingItem) {
                await updateOrderItem(bolItem.orderItemId, localItemData);
                summary.updatedItems++;
                 console.log(`Updated order item ID: ${bolItem.orderItemId} for order ${bolOrder.orderId}`);
              } else {
                await createOrderItem(localItemData);
                summary.createdItems++;
                console.log(`Created new order item ID: ${bolItem.orderItemId} for order ${bolOrder.orderId}`);
              }
            }
            // After processing all items for an order, if the order was newly created,
            // we might need to update its orderItems field if it's stored denormalized as JSONB.
            // The current createOrder/updateOrder already handles JSON stringification of orderItems.
            // If we've built `localOrderItems`, we can update the order with this array.
            if (currentOrder) { // currentOrder should be defined here
                 await updateOrder(currentOrder.orderId, { orderItems: localOrderItems });
                 console.log(`Updated order ${currentOrder.orderId} with its processed items.`);
            }
          }
        } catch (orderProcessingError) {
          console.error(`Error processing Bol order ID ${bolOrder.orderId}:`, orderProcessingError);
          summary.failedOrders++;
          summary.errors.push(`Failed to process order ${bolOrder.orderId}: ${(orderProcessingError as Error).message}`);
        }
      }
      currentPage++;
    } catch (fetchError) {
      console.error(`Error fetching orders from Bol.com (page ${currentPage}):`, fetchError);
      summary.failedOrders++; // Consider how to count this; maybe a separate counter for fetch failures
      summary.errors.push(`Failed to fetch orders page ${currentPage}: ${(fetchError as Error).message}`);
      morePages = false; // Stop pagination on fetch error
    }
  }

  console.log('Order synchronization finished.', summary);
  return summary;
}

// --- Bol.com Integration for Offer Export ---
import { parse, CsvError } from 'csv-parse';
import type { Options as CsvParseOptions } from 'csv-parse';
import axios from 'axios';
import type { AxiosError } from 'axios';

interface ParseContext {
  column: string | number | undefined;
}
// Function to get Bol API credentials (already modified to be async and use settings_service)
async function getBolCredentials(): Promise<{ clientId: string; clientSecret: string }> {
  try {
    const settingsServiceNginxUrl = process.env.SETTINGS_SERVICE_NGINX_URL || 'http://nginx:80/api/settings/settings';
    const accountUrl = `${settingsServiceNginxUrl}/account`;

    console.log(`Fetching Bol API credentials for current user from settings service via Nginx at ${accountUrl}...`);

    const response = await axios.get(accountUrl);
    console.log("reponse" , response)
    interface AccountDetailsResponse {
        bolClientId: string | null;
        bolClientSecret: string | null;
    }
    const data = response.data as AccountDetailsResponse;

    if (!data.bolClientId || !data.bolClientSecret) {
      console.error('Fetched Bol API credentials from settings_service are incomplete or null for the user.');
      throw new Error('Bol API credentials from settings_service are incomplete or missing for the user.');
    }
    console.log('Successfully fetched Bol API credentials for the user.');
    return { clientId: data.bolClientId, clientSecret: data.bolClientSecret };

  } catch (error: unknown) {
    console.error('Failed to fetch Bol API credentials from settings_service:', error);
    // Use the static method from the imported 'axios' object
    if (axios.isAxiosError(error)) {
        const axiosError = error; // No need to cast if isAxiosError is true and types are correct
        console.error('Axios error details from settings_service:', axiosError.response?.data);
        const status = axiosError.response?.status;
        const message = (axiosError.response?.data as any)?.message || 'No additional details'; // Access message safely
        throw new Error(`Failed to retrieve Bol API credentials. Settings service responded with status ${status}: ${message}. Ensure settings_service is running and configured, and Nginx is routing correctly.`);
    } else if (error instanceof Error) {
        console.error('Non-Axios error:', error.message);
        throw new Error(`Failed to retrieve Bol API credentials from settings_service. Error: ${error.message}`);
    }
    throw new Error(`Failed to retrieve Bol API credentials from settings_service due to an unknown error.`);
  }
}


export async function exportAllOffersAsCsv(): Promise<any> {
  try {
    const credentials = await getBolCredentials();
    const bolService = new BolService(credentials.clientId, credentials.clientSecret);

    console.log('Attempting to export all offers as CSV via BolService...');
    const csvData = await bolService.exportOffers('CSV');
    console.log('Successfully received CSV data from BolService. Parsing and saving offers...');

    const importResult = await _parseAndSaveOffersFromCsv(csvData);
    console.log(`CSV processing complete. Success: ${importResult.successCount}, Errors: ${importResult.errorCount}`);

    if (importResult.errorCount > 0) {
      return {
        message: `Offer import completed with some errors. Saved: ${importResult.successCount}, Failed: ${importResult.errorCount}.`,
        details: importResult.errors,
        successCount: importResult.successCount,
        errorCount: importResult.errorCount
      };
    }

    return {
        message: `Successfully exported and saved ${importResult.successCount} offers from Bol.com.`,
        successCount: importResult.successCount,
        errorCount: importResult.errorCount
    };

  } catch (error: unknown) {
    console.error('Error in exportAllOffersAsCsv (ShopService):', error);
    if (axios.isAxiosError(error)) { // Use the static method
        const axiosError = error;
        console.error('Axios error during offer export:', axiosError.response?.data || axiosError.message);
        throw new Error(`Failed during offer export process: ${axiosError.message}`);
    } else if (error instanceof Error) {
        throw error;
    }
    throw new Error(String(error));
  }
}

// Helper to normalize CSV header names to IOffer field names
// Handles potential spaces and case insensitivity for common CSV header variations.
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
      return null; // Or throw an error if strict mapping is required
  }
}


interface ParseContext {
  column: string | number | undefined;
}

async function _parseAndSaveOffersFromCsv(csvData: string): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
  return new Promise((resolve, reject) => {
    parse(csvData, {
      columns: (header: string[]): (keyof IOffer | null)[] => {
        const normalizedHeaders = header.map(normalizeHeader);
        header.forEach((h: string, i: number) => {
          if (!normalizedHeaders[i]) console.warn(`Header "${h}" was not mapped and will be ignored.`);
        });
        return normalizedHeaders.filter(Boolean) as (keyof IOffer)[];
      },
      skip_empty_lines: true,
      trim: true,
      cast: (value: string, context: ParseContext) => {
        const column = context.column as keyof IOffer | undefined;
        if (!column) return value;

        if (column === 'bundlePricesPrice' || column === 'stockAmount' || column === 'correctedStock') {
          return value === '' || value === null || value === undefined ? null : Number(value);
        }
        if (column === 'onHoldByRetailer') {
          if (typeof value === 'string') {
            return value.toLowerCase() === 'true' || value === '1';
          }
          return Boolean(value);
        }
        if (column === 'mutationDateTime') {
          return value === '' || value === null || value === undefined ? null : new Date(value);
        }
        return value;
      },
    }, (err: CsvError | undefined, records: Partial<IOffer>[] | undefined) => {
      if (err) {
        console.error('Error parsing CSV:', err);
        return reject(new Error(`Failed to parse CSV data: ${err.message}`));
      }
      if (!records) {
        console.error('No records returned from CSV parsing');
        return reject(new Error('No records returned from CSV parsing'));
      }

      // Process records asynchronously
      (async () => {
        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        console.log(`Parsed ${records.length} records from CSV. Attempting to save to database...`);

        for (const record of records) {
          if (!record.offerId || !record.ean) {
            errors.push(`Skipping record due to missing offerId or ean: ${JSON.stringify(record)}`);
            errorCount++;
            continue;
          }

          try {
            const existingOffer = await getOfferById(record.offerId);
            const offerPayload: IOffer = {
              offerId: record.offerId,
              ean: record.ean,
              conditionName: record.conditionName !== undefined ? record.conditionName : (existingOffer?.conditionName || null),
              conditionCategory: record.conditionCategory !== undefined ? record.conditionCategory : (existingOffer?.conditionCategory || null),
              conditionComment: record.conditionComment !== undefined ? record.conditionComment : (existingOffer?.conditionComment || null),
              bundlePricesPrice: record.bundlePricesPrice !== undefined ? record.bundlePricesPrice : (existingOffer?.bundlePricesPrice || null),
              fulfilmentDeliveryCode: record.fulfilmentDeliveryCode !== undefined ? record.fulfilmentDeliveryCode : (existingOffer?.fulfilmentDeliveryCode || null),
              stockAmount: record.stockAmount !== undefined ? record.stockAmount : (existingOffer?.stockAmount || null),
              onHoldByRetailer: record.onHoldByRetailer !== undefined ? record.onHoldByRetailer : (existingOffer?.onHoldByRetailer || false),
              fulfilmentType: record.fulfilmentType !== undefined ? record.fulfilmentType : (existingOffer?.fulfilmentType || null),
              mutationDateTime: record.mutationDateTime !== undefined ? record.mutationDateTime : (existingOffer?.mutationDateTime || new Date()),
              referenceCode: record.referenceCode !== undefined ? record.referenceCode : (existingOffer?.referenceCode || null),
              correctedStock: record.correctedStock !== undefined ? record.correctedStock : (existingOffer?.correctedStock || null),
            };

            if (existingOffer) {
              await updateOffer(record.offerId, offerPayload);
              console.log(`Updated offer with ID: ${record.offerId}`);
            } else {
              await createOffer(offerPayload);
              console.log(`Created new offer with ID: ${record.offerId}`);
            }
            successCount++;
          } catch (dbError) {
            console.error(`Error saving offer with ID ${record.offerId}:`, dbError);
            errors.push(`Failed to save offer ${record.offerId}: ${(dbError as Error).message}`);
            errorCount++;
          }
        }
        console.log(`Finished processing CSV records. Success: ${successCount}, Failed: ${errorCount}`);
        resolve({ successCount, errorCount, errors });
      })();
    });
  });
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
