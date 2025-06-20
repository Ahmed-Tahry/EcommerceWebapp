// Placeholder for ShopModel
// This file would contain the data structure or schema for a 'Shop' entity.

export interface IShop {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Example function (not used, just for placeholder)
export function createShopModel(): IShop {
  return {
    id: 'temp-id',
    name: 'Temporary Shop',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
