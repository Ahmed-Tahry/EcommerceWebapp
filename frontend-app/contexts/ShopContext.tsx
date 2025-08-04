'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { callApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Shop {
  shopId: string;
  name: string;
  description?: string;
  // Add other shop properties as needed
}

interface ShopContextType {
  shops: Shop[];
  selectedShop: Shop | null;
  loading: boolean;
  error: string | null;
  fetchShops: () => Promise<void>;
  selectShop: (shop: Shop | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, token } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      const data = await callApi('/settings/settings/shops', 'GET');
      setShops(data);
      
      // Restore selected shop from localStorage or select first shop
      const savedShopId = localStorage.getItem('selectedShopId');
      if (savedShopId && data.length > 0) {
        const savedShop = data.find((shop: Shop) => shop.shopId === savedShopId);
        if (savedShop) {
          setSelectedShop(savedShop);
          console.log('ShopContext: Restored saved shop:', savedShop);
        } else {
          // Saved shop not found, remove from localStorage and select first shop
          localStorage.removeItem('selectedShopId');
          if (data.length > 0) {
            setSelectedShop(data[0]);
            console.log('ShopContext: Saved shop not found, selected first shop:', data[0]);
          }
        }
      } else if (data.length > 0 && !selectedShop) {
        // No saved shop, select first available shop
        setSelectedShop(data[0]);
        console.log('ShopContext: No saved shop, selected first shop:', data[0]);
      }
    } catch (err: any) {
      console.error('ShopContext: Error fetching shops:', err);
      setError(err.message || 'Failed to fetch shops');
    } finally {
      setLoading(false);
    }
  };

  // Select a shop
  const selectShop = (shop: Shop | null) => {
    console.log('ShopContext: Selecting shop:', shop);
    setSelectedShop(shop);
  };

  // Load shops when authentication is complete
  useEffect(() => {
    if (authenticated && token) {
      fetchShops();
    }
  }, [authenticated, token]);

  const value = {
    shops,
    selectedShop,
    loading,
    error,
    fetchShops,
    selectShop,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
