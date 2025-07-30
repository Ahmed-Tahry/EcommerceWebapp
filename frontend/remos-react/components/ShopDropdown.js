import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';
import { ChevronDown, Plus } from 'lucide-react';

const ShopDropdown = () => {
  const { shops, selectedShop, selectShop, clearSelectedShop, loading } = useShop();
  const [isOpen, setIsOpen] = useState(false);

  const handleShopSelect = (shop) => {
    console.log('ShopDropdown: Selecting shop:', shop);
    selectShop(shop);
    setIsOpen(false);
  };

  const handleNewShop = () => {
    console.log('ShopDropdown: New Shop option selected');
    clearSelectedShop();
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return (
      <div className="shop-dropdown">
        <div className="shop-dropdown-button">
          <span>Loading shops...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-dropdown relative">
      <button
        onClick={toggleDropdown}
        className="shop-dropdown-button flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-sm font-medium text-gray-700">
          {selectedShop ? selectedShop.name : 'Select Shop'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="py-1">
            {/* New Shop Option - Always Available */}
            <button
              onClick={handleNewShop}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2 text-green-600" />
              <span>New Shop</span>
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            {/* Existing Shops */}
            {shops.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No shops available
              </div>
            ) : (
              shops.map((shop) => (
                <button
                  key={shop.shopId}
                  onClick={() => handleShopSelect(shop)}
                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 ${
                    selectedShop && selectedShop.shopId === shop.shopId
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="truncate">{shop.name}</span>
                  {shop.description && (
                    <span className="text-xs text-gray-500 ml-2 truncate">
                      ({shop.description})
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ShopDropdown; 