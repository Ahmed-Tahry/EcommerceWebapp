// Placeholder for ShopModel (Phase 1)


export interface IOffer {
  offerId: string;
  ean: string;
  shopId?: string; // shopId as string in application layer
  conditionName?: string | null;
  conditionCategory?: string | null;
  conditionComment?: string | null;
  bundlePricesPrice?: number | null;
  fulfilmentDeliveryCode?: string | null;
  stockAmount?: number | null;
  onHoldByRetailer?: boolean | null;
  fulfilmentType?: string | null;
  mutationDateTime?: Date | null;
  referenceCode?: string | null;
  correctedStock?: number | null;
}

export interface IOrder {
  orderId: string;
  orderPlacedDateTime: Date;
  orderItems: IOrderItem[] | string;
  shopId?: string; // shopId as string in application layer
}

export interface IOrderItem {
  orderItemId: string;
  orderId: string;
  ean: string;
  shopId?: string; // shopId as string in application layer
  fulfilmentMethod?: string | null;
  fulfilmentStatus?: string | null;
  quantity?: number | null;
  quantityShipped?: number | null;
  quantityCancelled?: number | null;
  cancellationRequest?: boolean | null;
  latestChangedDateTime?: Date | null;
}

export interface IProduct {
  ean: string;
  title?: string | null;
  description?: string | null;
  brand?: string | null;
  mainImageUrl?: string | null;
  attributes?: Record<string, any> | null;
  lastSyncFromBol?: Date | null;
  lastSyncToBol?: Date | null;
  vatRate?: number | null;
  country?: string | null;
  userId?: string;
  shopId?: string; // shopId as string in application layer
}

export interface IProductVatRate {
  ean: string;
  country: string;
  vatRate: number;
  shopId: string; // Required, part of primary key, as string in application layer
}