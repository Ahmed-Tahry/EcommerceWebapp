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
import BolService, {
  BolProductContent, // This might become less relevant if /content/products/{ean} is not used by new sync
  BolCreateProductContentPayload,
  BolCreateProductAttribute,
  BolProductAttribute, // Existing, for /content/products/{ean}
  ProcessStatus,
  BolCatalogProductResponse, // New
  BolProductAssetsResponse,   // New
  BolAssetVariant             // New
} from './bol.service';


export async function createProduct(productData: IProduct): Promise<IProduct> {
  const pool = getDBPool();
  // Using ON CONFLICT to handle potential duplicate EANs by updating existing record (upsert)
  const query = `
    INSERT INTO products (ean, title, description, brand, "mainImageUrl", attributes, "lastSyncFromBol", "lastSyncToBol", vat_rate)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (ean) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      brand = EXCLUDED.brand,
      "mainImageUrl" = EXCLUDED."mainImageUrl",
      attributes = EXCLUDED.attributes,
      "lastSyncFromBol" = EXCLUDED."lastSyncFromBol",
      "lastSyncToBol" = EXCLUDED."lastSyncToBol",
      vat_rate = EXCLUDED.vat_rate
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
    productData.vatRate,
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
  const query = 'SELECT ean, title, description, brand, "mainImageUrl", attributes, "lastSyncFromBol", "lastSyncToBol", vat_rate AS "vatRate" FROM products WHERE ean = $1;';
  try {
    const result = await pool.query(query, [ean]);
    if (result.rows.length > 0) {
      const product = result.rows[0] as IProduct; // Cast to IProduct
      // Ensure attributes are parsed if stored as JSON string
      if (typeof product.attributes === 'string') {
        product.attributes = JSON.parse(product.attributes);
      }
      // The vatRate should be correctly mapped due to 'AS "vatRate"'
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
      let dbKey = key;
      if (key === 'attributes' && typeof value === 'object' && value !== null) {
        value = JSON.stringify(value); // Stringify attributes if it's an object
      }
      if (key === 'vatRate') { // Map model key to db column key
        dbKey = 'vat_rate';
      }
      setClauses.push(`"${dbKey}" = $${valueCount++}`);
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

// This is the corrected version, the one above (without userId) will be removed.
export async function getBolProductContent(userId: string, ean: string, language: string = 'nl'): Promise<Partial<IProduct> | null> {
  const credentials = await getBolCredentials(userId); // Await the promise
  const bolService = new BolService(credentials.clientId, credentials.clientSecret);
  const bolContent = await bolService.fetchProductContent(ean, language);
  if (!bolContent) {
    console.log(`No Bol.com content found for EAN ${ean}, language ${language}.`);
    return null;
  }
  return mapBolProductContentToLocal(bolContent);
}

// Removed updateLocalProductFromBol as its functionality is covered by the new syncProductsFromOffersAndRetailerApi

export async function pushLocalProductToBol(userId: string, ean: string, language: string = 'nl'): Promise<{ processId: string | null; message: string; error?: any }> {
  const credentials = await getBolCredentials(userId); // Await the promise
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

export async function pollBolProcessStatus(userId: string, processId: string, maxAttempts = 20, pollInterval = 5000): Promise<ProcessStatus> {
    const credentials = await getBolCredentials(userId); // Await the promise
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

  // Step 1: Fetch from /retailer/catalog-products/{ean}
  try {
    console.log(`_fetchRetailerProductDetails: Fetching from /retailer/catalog-products/${ean} for lang ${language}`);
    const catalogResponse = await bolService.apiClient.get<BolCatalogProductResponse>(`/retailer/catalog-products/${ean}`, {
      params: { language },
      headers: { 'Accept': 'application/vnd.retailer.v10+json' } // Explicitly set, though BolService default might be same
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

      // Extract Brand from parties array
      if (catalogResponse.data.parties) {
        const brandParty = catalogResponse.data.parties.find(party => party.role === 'BRAND');
        if (brandParty) {
          productDetails.brand = brandParty.name;
        }
      }

      // Store all other attributes in the attributes field
      const otherAttributes: Record<string, any> = {};
      attributes.forEach(attr => {
        if (attr.id !== 'Title' && attr.id !== 'Description' && attr.values.length > 0) {
          // Simplified: takes the first value. Could be expanded to handle multiple values or unitIds.
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
      return null; // If catalog product doesn't exist, no point fetching assets.
    }
    console.error(`_fetchRetailerProductDetails: Error fetching catalog details for EAN ${ean}:`, axiosError.message);
    // Log more details if available
    if (axiosError.response) {
        console.error('Catalog API Error Response data:', axiosError.response.data);
        console.error('Catalog API Error Response status:', axiosError.response.status);
    }
    throw new Error(`Failed to fetch catalog details for EAN ${ean}: ${axiosError.message}`);
  }

  // If no title was found from catalog-products, we might not proceed or have a product to update meaningfully.
  // However, the requirement is to get name and image. If name isn't there, image might also be irrelevant.
  // For now, proceed to fetch image if catalog data was found, even if title is missing (it will be null).
  if (!catalogDataFound) { // Or more strictly: if (!productDetails.title)
    console.warn(`_fetchRetailerProductDetails: No catalog data found for EAN ${ean}, skipping asset fetch.`);
    // If we return null, the product won't be created/updated with just an EAN.
    // If we return productDetails, it might be an EAN-only object if nothing was found.
    // Let's return null if no catalog data at all, otherwise proceed.
    return Object.keys(productDetails).length > 1 ? productDetails : null;
  }

  // Step 2: Fetch from /retailer/products/{ean}/assets?usage=PRIMARY
  try {
    console.log(`_fetchRetailerProductDetails: Fetching assets for EAN ${ean}`);
    const assetsResponse = await bolService.apiClient.get<BolProductAssetsResponse>(`/retailer/products/${ean}/assets`, {
      params: { usage: 'PRIMARY' },
      headers: { 'Accept': 'application/vnd.retailer.v10+json' }
    });

    if (assetsResponse.data && assetsResponse.data.assets && assetsResponse.data.assets.length > 0) {
      const primaryAsset = assetsResponse.data.assets[0]; // Assuming the first one is what we need
      if (primaryAsset.variants && primaryAsset.variants.length > 0) {
        let imageUrl: string | undefined;
        const mediumVariant = primaryAsset.variants.find(v => v.size === 'medium');
        const largeVariant = primaryAsset.variants.find(v => v.size === 'large');

        if (mediumVariant) {
          imageUrl = mediumVariant.url;
        } else if (largeVariant) {
          imageUrl = largeVariant.url;
        } else {
          imageUrl = primaryAsset.variants[0].url; // Fallback to the first variant
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
      // Don't nullify productDetails if catalog info was already fetched.
    } else {
      console.error(`_fetchRetailerProductDetails: Error fetching assets for EAN ${ean}:`, axiosError.message);
      if (axiosError.response) {
        console.error('Assets API Error Response data:', axiosError.response.data);
        console.error('Assets API Error Response status:', axiosError.response.status);
      }
      // Not throwing here to allow product creation even if image fetch fails, but log it.
      // The error will be part of the main sync summary if this throw is re-enabled:
      // throw new Error(`Failed to fetch assets for EAN ${ean}: ${axiosError.message}`);
    }
  }

  // Return productDetails if it has more than just EAN, otherwise null
  return Object.keys(productDetails).length > 1 ? productDetails : null;
}

export async function getAllProducts(page: number = 1, limit: number = 10): Promise<{ products: IProduct[], total: number, page: number, limit: number }> {
  const pool = getDBPool();
  const offset = (page - 1) * limit;

  try {
    // Query for the total count of products
    const totalResult = await pool.query('SELECT COUNT(*) FROM products;');
    const total = parseInt(totalResult.rows[0].count, 10);

    // Query for the paginated products
    const productsQuery = `
      SELECT ean, title, description, brand, "mainImageUrl", attributes, "lastSyncFromBol", "lastSyncToBol", vat_rate AS "vatRate"
      FROM products
      ORDER BY title ASC NULLS LAST, ean ASC -- Added a default sort order
      LIMIT $1 OFFSET $2;
    `;
    const productsResult = await pool.query(productsQuery, [limit, offset]);

    const products: IProduct[] = productsResult.rows.map(p => {
      // Ensure attributes are parsed if stored as JSON string
      if (p.attributes && typeof p.attributes === 'string') {
        try {
          p.attributes = JSON.parse(p.attributes);
        } catch (e) {
          console.error(`Error parsing attributes for EAN ${p.ean}:`, e);
          p.attributes = null; // Or some error state
        }
      }
      return p as IProduct;
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

export async function syncProductsFromOffersAndRetailerApi(userId: string): Promise<{ processed: number; success: number; failed: number; errors: string[] }> {
  let eansToProcess: string[] = [];
  const summary = { processed: 0, success: 0, failed: 0, errors: [] as string[] };

  console.log(`Starting product sync for user ${userId}. Fetching EANs from existing offers in the database.`);
  try {
    // Step 1: Query the local 'offers' table to get all unique EANs.
    // It's assumed that the 'offers' table is kept up-to-date by a separate process
    // that calls exportAllOffersAsCsv or a similar mechanism.
    const allLocalOffers = await getAllOffers(); // Fetches all offers from the DB

    if (allLocalOffers.length === 0) {
      summary.errors.push("No offers found in the local database to process EANs from.");
      console.log("Product sync cannot proceed as no offers are available locally.");
      return summary;
    }

    eansToProcess = [...new Set(allLocalOffers.map(offer => offer.ean).filter(Boolean))];

    if (eansToProcess.length === 0) {
      summary.errors.push("No unique EANs found in the local offers database.");
      console.log("Product sync cannot proceed as no EANs were extracted from local offers.");
      return summary;
    }
    console.log(`Extracted ${eansToProcess.length} unique EANs from the local offers database for user ${userId}.`);

  } catch (error: any) {
    console.error(`Error fetching EANs from the local offers database for user ${userId}:`, error);
    summary.errors.push(`Failed to fetch EANs from local offers database: ${error.message}`);
    return summary; // Abort if fetching EANs fails critically
  }

  console.log(`Proceeding to process ${eansToProcess.length} EANs for user ${userId}.`);
  summary.processed = eansToProcess.length;

  // Instantiate BolService once for all EANs
  let bolServiceInstance: BolService;
  try {
    const credentials = await getBolCredentials(userId);
    bolServiceInstance = new BolService(credentials.clientId, credentials.clientSecret);
  } catch (credError: any) {
    console.error(`Failed to get Bol credentials for user ${userId}: ${credError.message}. Aborting sync.`);
    summary.errors.push(`Failed to initialize Bol service for product sync: ${credError.message}`);
    // Update summary to reflect that all planned EANs could not be processed due to this initial failure.
    summary.failed = eansToProcess.length;
    return summary;
  }

  for (const ean of eansToProcess) {
    try {
      console.log(`Processing EAN: ${ean}`);
      let productData: Partial<IProduct> = { ean };

      // Step 1: Fetch details from the retailer API
      // Defaulting language to 'nl', can be made configurable if needed.
      const retailerDetails = await _fetchRetailerProductDetails(ean, bolServiceInstance, 'nl');
      if (retailerDetails) {
        productData = { ...productData, ...retailerDetails };
        // Assuming data from this endpoint implies a sync from Bol, so set lastSyncFromBol
        productData.lastSyncFromBol = new Date();
      } else {
        console.warn(`No details found from Bol.com retailer API for EAN ${ean}. Product will be created/updated with minimal info.`);
      }

      // Step 2: (Placeholder for future) Potentially enrich with other data sources if needed.
      // The current _fetchRetailerProductDetails already uses Bol.com. If another source
      // or a different type of Bol.com content (e.g., from /content/products/ endpoint via getBolProductContent)
      // was needed, it would be called here and merged.
      // For now, the main source of product details is _fetchRetailerProductDetails.

      // Ensure essential fields like title are not empty if possible.
      // If retailerDetails was null and no other source provided a title, it might remain null.
      // A default title could be set here if required:
      // if (!productData.title) {
      //   productData.title = `Product EAN: ${ean}`;
      // }

      // Set vatRate to null initially, to be updated manually via settings service
      productData.vatRate = null;

      await createProduct(productData as IProduct); // createProduct handles upsert
      console.log(`Successfully created/updated product for EAN ${ean}.`);
      summary.success++;
    } catch (error: any) {
      console.error(`Failed to process EAN ${ean}:`, error);
      summary.failed++;
      summary.errors.push(`EAN ${ean}: ${error.message}`);
      // Decide if one error should stop the whole batch or continue. Currently continues.
    }
  }

  console.log("Product synchronization complete.", summary);
  return summary;
}


// --- Bol.com Order Synchronization ---
import { BolOrder, BolOrderItem } from './bol.service';

export async function synchronizeBolOrders(
  userId: string,
  status: string = 'OPEN',
  fulfilmentMethod: 'FBR' | 'FBB' | null = null,
  latestChangedDate: string | null = null
): Promise<{ createdOrders: number; updatedOrders: number; createdItems: number; updatedItems: number; failedOrders: number; errors: string[] }> {
  const credentials = await getBolCredentials(userId); // Await the promise
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
// Function to get Bol API credentials, now accepting userId
async function getBolCredentials(userId: string): Promise<{ clientId: string; clientSecret: string }> {
  if (!userId) {
    console.error('User ID is required to fetch Bol credentials.');
    throw new Error('User ID not provided to getBolCredentials.');
  }
  try {
    // Using a direct URL to settings_service, assuming it's resolvable as 'settings_service' on port 3000
    // This should be configurable, e.g., via process.env.SETTINGS_SERVICE_DIRECT_URL
    const settingsServiceDirectUrl = process.env.SETTINGS_SERVICE_DIRECT_URL || 'http://settings_service:3000';
    const accountUrl = `${settingsServiceDirectUrl}/settings/account?userId=${encodeURIComponent(userId)}`;

    console.log(`Fetching Bol API credentials for user ${userId} directly from settings service at ${accountUrl}...`);

    // Note: If settings_service is called directly (not through Nginx), it won't have JWT validation
    // by default unless settings_service itself implements it (which it currently does not for this path).
    // The X-User-ID header mechanism is an Nginx addition.
    // We are now relying on the modified settings_service to accept userId in query/body.
    const response = await axios.get(accountUrl);

    interface AccountDetailsResponse {
        bolClientId: string | null;
        bolClientSecret: string | null;
    }
    const data = response.data as AccountDetailsResponse;

    if (!data.bolClientId || !data.bolClientSecret) {
      console.error(`Fetched Bol API credentials from settings_service for user ${userId} are incomplete or null.`);
      throw new Error(`Bol API credentials from settings_service for user ${userId} are incomplete or missing.`);
    }
    console.log(`Successfully fetched Bol API credentials for user ${userId}.`);
    return { clientId: data.bolClientId, clientSecret: data.bolClientSecret };

  } catch (error: unknown) {
    console.error(`Failed to fetch Bol API credentials from settings_service for user ${userId}:`, error);
    if (axios.isAxiosError(error)) {
        const axiosError = error;
        const status = axiosError.response?.status;
        const responseData = axiosError.response?.data;
        let message = 'No additional details';
        if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
            message = (responseData as {message: string}).message;
        } else if (typeof responseData === 'string') {
            message = responseData;
        }
        console.error(`Axios error details from settings_service for user ${userId}:`, responseData);
        throw new Error(`Failed to retrieve Bol API credentials for user ${userId}. Settings service responded with status ${status}: ${message}. Ensure settings_service is running at the direct URL and configured to accept userId in query/body.`);
    } else if (error instanceof Error) {
        console.error('Non-Axios error:', error.message);
        throw new Error(`Failed to retrieve Bol API credentials for user ${userId} from settings_service. Error: ${error.message}`);
    }
    throw new Error(`Failed to retrieve Bol API credentials for user ${userId} from settings_service due to an unknown error.`);
  }
}


export async function exportAllOffersAsCsv(userId: string): Promise<any> {
  try {
    const credentials = await getBolCredentials(userId);
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
      columns: true, // Use the first row as header names
      skip_empty_lines: true,
      trim: true,
      cast: (value: string, context: ParseContext) => {
        // context.column will be the string header name from the CSV
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
        // Handle EAN specifically if it comes in scientific notation
        if (columnHeader === 'ean' && typeof value === 'string' && value.toUpperCase().includes('E+')) {
            const num = Number(value);
            if (!isNaN(num)) {
                return String(BigInt(num)); // Convert to BigInt then to string to preserve all digits
            }
        }
        return value;
      },
    }, (err: CsvError | undefined, records: Record<string, any>[] | undefined) => { // records are now Record<string, any>[]
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
          // Access record properties using original CSV header names
          const offerId = record.offerId as string;
          const ean = record.ean as string;

          if (!offerId || !ean) {
            errors.push(`Skipping record due to missing offerId or ean: ${JSON.stringify(record)}`);
            errorCount++;
            continue;
          }

          try {
            const existingOffer = await getOfferById(offerId);

            // Construct offerPayload by mapping fields from CSV record to IOffer fields
            // Ensure all IOffer fields are correctly typed and handled if missing from CSV
            const offerPayload: IOffer = {
              offerId: offerId,
              ean: ean,
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

            // Ensure numeric and boolean fields that might be null/undefined from CSV
            // are correctly passed or defaulted before DB operation
            offerPayload.bundlePricesPrice = offerPayload.bundlePricesPrice === undefined ? null : offerPayload.bundlePricesPrice;
            offerPayload.stockAmount = offerPayload.stockAmount === undefined ? null : offerPayload.stockAmount;
            offerPayload.correctedStock = offerPayload.correctedStock === undefined ? null : offerPayload.correctedStock;
            offerPayload.onHoldByRetailer = offerPayload.onHoldByRetailer === undefined ? false : offerPayload.onHoldByRetailer;


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
