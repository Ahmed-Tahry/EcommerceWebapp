export interface IAccountDetails {
  id: number;
  userId: string;
  shopId?: string; // Added for multi-shop support
  bolClientId?: string;
  bolClientSecret?: string;
  salesNumber?: string;
  status?: string;
  apiCredentials?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVatSetting {
  id: number;
  name: string;
  rate: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoiceSettings {
  shopId: string; // Changed from userId to shopId as primary key
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  invoicePrefix?: string;
  vatNumber?: string;
  defaultInvoiceNotes?: string;
  nextInvoiceNumber?: number;
  bankAccount?: string;
  startNumber?: string;
  fileNameBase?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IUserOnboardingStatus {
  userId: string;
  shopId: string;
  hasConfiguredBolApi: boolean;
  hasCompletedShopSync: boolean;
  hasCompletedInvoiceSetup: boolean;
  hasCompletedVatSetup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGeneralSettings {
  shopId: string; // Changed from userId to shopId as primary key
  firstname?: string;
  surname?: string;
  address?: string;
  postcode?: string;
  city?: string;
  accountEmail?: string;
  phoneNumber?: string;
  companyName?: string;
  companyAddress?: string;
  companyPostcode?: string;
  companyCity?: string;
  customerEmail?: string;
  companyPhoneNumber?: string;
  chamberOfCommerce?: string;
  vatNumber?: string;
  iban?: string;
  optionalVatNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShop {
  id: number;
  userId: string;
  shopId: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}