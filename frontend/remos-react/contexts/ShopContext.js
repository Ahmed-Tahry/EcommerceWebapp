import React, { createContext, useContext, useState, useEffect } from 'react';
import { callApi } from '@/utils/api';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load selected shop from localStorage on mount
  useEffect(() => {
    const savedShopId = localStorage.getItem('selectedShopId');
    if (savedShopId) {
      console.log('ShopContext: Loading saved shop ID from localStorage:', savedShopId);
    }
  }, []);

  // Save selected shop to localStorage when it changes
  useEffect(() => {
    if (selectedShop) {
      localStorage.setItem('selectedShopId', selectedShop.shopId);
      console.log('ShopContext: Selected shop saved to localStorage:', selectedShop);
    } else {
      localStorage.removeItem('selectedShopId');
      console.log('ShopContext: Shop selection cleared from localStorage');
    }
  }, [selectedShop]);

  // Fetch shops for the current user
  const fetchShops = async () => {
    try {
      setLoading(true);
      console.log('ShopContext: Fetching shops...');
      
      const data = await callApi('/settings/settings/shops', 'GET');
      console.log('ShopContext: Fetched shops:', data);
      setShops(data);
      
      // Restore selected shop from localStorage or select first shop
      const savedShopId = localStorage.getItem('selectedShopId');
      if (savedShopId && data.length > 0) {
        const savedShop = data.find(shop => shop.shopId === savedShopId);
        if (savedShop) {
          console.log('ShopContext: Restoring saved shop:', savedShop);
          setSelectedShop(savedShop);
        } else {
          console.log('ShopContext: Saved shop not found, clearing selection');
          localStorage.removeItem('selectedShopId');
          setSelectedShop(null);
        }
      } else if (data.length === 1 && !selectedShop) {
        console.log('ShopContext: Auto-selecting single shop:', data[0]);
        setSelectedShop(data[0]);
      }
    } catch (err) {
      console.error('ShopContext: Error fetching shops:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new shop
  const createShop = async (shopData) => {
    try {
      console.log('ShopContext: Creating new shop:', shopData);
      
      const newShop = await callApi('/settings/settings/shops', 'POST', shopData);
      console.log('ShopContext: New shop created:', newShop);
      setShops(prev => [...prev, newShop]);
      
      // Auto-select the newly created shop
      setSelectedShop(newShop);
      console.log('ShopContext: Auto-selected newly created shop');
      
      return newShop;
    } catch (err) {
      console.error('ShopContext: Error creating shop:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update an existing shop
  const updateShop = async (shopId, shopData) => {
    try {
      console.log('ShopContext: Updating shop:', shopId, shopData);
      
      const updatedShop = await callApi(`/settings/settings/shops/${shopId}`, 'PUT', shopData);
      console.log('ShopContext: Shop updated:', updatedShop);
      setShops(prev => prev.map(shop => shop.shopId === shopId ? updatedShop : shop));
      
      // If the updated shop is the selected shop, update the selected shop
      if (selectedShop && selectedShop.shopId === shopId) {
        setSelectedShop(updatedShop);
        console.log('ShopContext: Updated selected shop');
      }
      
      return updatedShop;
    } catch (err) {
      console.error('ShopContext: Error updating shop:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete a shop
  const deleteShop = async (shopId) => {
    try {
      console.log('ShopContext: Deleting shop:', shopId);
      
      await callApi(`/settings/settings/shops/${shopId}`, 'DELETE');
      console.log('ShopContext: Shop deleted from list');
      setShops(prev => prev.filter(shop => shop.shopId !== shopId));
      
      // If the deleted shop is the selected shop, clear the selection
      if (selectedShop && selectedShop.shopId === shopId) {
        setSelectedShop(null);
        console.log('ShopContext: Selected shop deleted, clearing selection');
      }
    } catch (err) {
      console.error('ShopContext: Error deleting shop:', err);
      setError(err.message);
      throw err;
    }
  };

  // Select a shop
  const selectShop = (shop) => {
    console.log('ShopContext: Selecting shop:', shop);
    setSelectedShop(shop);
  };

  // Clear the selected shop (for "New Shop" option)
  const clearSelectedShop = () => {
    console.log('ShopContext: Clearing shop selection (New Shop option)');
    setSelectedShop(null);
  };

  // Load shops when the provider is mounted
  useEffect(() => {
    fetchShops();
  }, []);

  const value = {
    shops,
    selectedShop,
    loading,
    error,
    fetchShops,
    createShop,
    updateShop,
    deleteShop,
    selectShop,
    clearSelectedShop
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};