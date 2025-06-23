// Defines the TypeScript interfaces for the settings_service data models.

export interface IProductVat {
  productId: string; // primary key
  ean: string; // not null
  productName: string; // not null
  basePrice?: number | null; // decimal
  vatRate: number; // decimal, not null
  vatCategory?: string | null;
  countryCode: string; // not null, e.g., ISO country code
  isCompound?: boolean | null;
  appliesToShipping?: boolean | null;
  createdDateTime: Date;
  updatedDateTime: Date;
  isActive?: boolean | null;
}

export interface IAccountSetting {
  accountId: string; // primary key
  accountName: string; // not null
  countryCode: string; // not null, links to products_vat.countryCode
  currencyCode?: string | null; // e.g., ‘EUR’, ‘USD’
  defaultFulfilmentMethod?: string | null; // e.g., ‘FBB’ or ‘FBA’
  vatRegistrationNumber?: string | null;
  createdDateTime: Date;
  updatedDateTime: Date;
  isActive?: boolean | null;
}
