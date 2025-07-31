import React from 'react';
import { useShop } from '../contexts/ShopContext';
import { Menu } from '@headlessui/react';
import { ChevronDown, Plus, Store } from 'lucide-react';

const ShopDropdown = () => {
  const { shops, selectedShop, selectShop, clearSelectedShop, loading } = useShop();

  const handleShopSelect = (shop) => {
    selectShop(shop);
  };

  const handleNewShop = () => {
    clearSelectedShop();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-12 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm">
        Loading...
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <Menu.Button className="inline-flex items-center justify-between w-full h-12 px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
        <div className="flex items-center">
          <Store size={20} className="mr-3 text-gray-500" />
          <span className="truncate font-semibold">{selectedShop ? selectedShop.name : 'Select a Shop'}</span>
        </div>
        <ChevronDown size={20} className="ml-2 -mr-1 text-gray-500" />
      </Menu.Button>
      <Menu.Items as="ul" className="absolute left-0 w-full mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-2 py-2">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleNewShop}
                className={`${
                  active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                } group flex rounded-md items-center w-full px-3 py-3 text-sm font-medium`}
              >
                <Plus size={20} className="mr-3" />
                Create New Shop
              </button>
            )}
          </Menu.Item>
        </div>
        <div className="px-2 py-2">
          {shops.length === 0 ? (
            <div className="px-3 py-3 text-sm text-gray-500">No shops available</div>
          ) : (
            shops.map((shop) => (
              <Menu.Item key={shop.shopId}>
                {({ active }) => (
                  <button
                    onClick={() => handleShopSelect(shop)}
                    className={`${
                      active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-3 py-3 text-sm font-medium ${
                      selectedShop?.shopId === shop.shopId ? 'bg-indigo-500 text-white' : ''
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span>{shop.name}</span>
                      {shop.description && (
                        <span className="text-xs opacity-70">{shop.description}</span>
                      )}
                    </div>
                  </button>
                )}
              </Menu.Item>
            ))
          )}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default ShopDropdown;