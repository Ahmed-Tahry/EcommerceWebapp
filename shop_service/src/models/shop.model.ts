// Placeholder for ShopModel (Phase 1)

export interface IShop {
  id: string;
  name: string;
  description?: string;
}

// New table interfaces

export interface IOffer {
  offerId: string;
  ean: string;
  conditionName?: string | null;
  conditionCategory?: string | null;
  conditionComment?: string | null;
  bundlePricesPrice?: number | null;
  fulfilmentDeliveryCode?: string | null;
  stockAmount?: number | null;
  onHoldByRetailer?: boolean | null; // Booleans often default to false, but API might send null
  fulfilmentType?: string | null;
  mutationDateTime?: Date | null;
  referenceCode?: string | null;
  correctedStock?: number | null;
}

export interface IOrder {
  orderId: string;
  orderPlacedDateTime: Date;
  orderItems: IOrderItem[] | string;
}

export interface IOrderItem {
  orderItemId: string;
  orderId: string;
  ean: string;
  fulfilmentMethod?: string | null;
  fulfilmentStatus?: string | null;
  quantity?: number | null;
  quantityShipped?: number | null;
  quantityCancelled?: number | null;
  cancellationRequest?: boolean | null;
  latestChangedDateTime?: Date | null;
  unit_price_inclusive_vat?: number | null; // Price per unit as from Bol.com, assumed VAT inclusive
}

// Represents basic product information, potentially synced with Bol.com product content
export interface IProduct {
  ean: string; // Primary Key, EAN of the product
  title?: string | null;
  description?: string | null;
  brand?: string | null;
  // For simplicity, storing main image URL directly. Bol's asset structure is more complex.
  mainImageUrl?: string | null;
  // Storing other attributes as a flexible JSON object for now.
  // Specific, frequently used attributes could be promoted to top-level fields if needed.
  attributes?: Record<string, any> | null; // To store other Bol attributes like dimensions, series, etc.
  lastSyncFromBol?: Date | null; // Timestamp of the last successful sync from Bol
  lastSyncToBol?: Date | null;   // Timestamp of the last successful push to Bol
  vatRate?: number | null; // VAT percentage for the product
}
