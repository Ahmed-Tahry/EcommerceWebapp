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

  // Debug logging
  console.log('ShopProvider: Component rendered');
  console.log('ShopProvider: authenticated:', authenticated);
  console.log('ShopProvider: token:', token ? 'present' : 'missing');
  console.log('ShopProvider: shops:', shops);
  console.log('ShopProvider: selectedShop:', selectedShop);
  console.log('ShopProvider: loading:', loading);

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
    console.log('ShopContext: fetchShops called');
    console.log('ShopContext: authenticated:', authenticated);
    console.log('ShopContext: token:', token ? 'present' : 'missing');
    
    try {
      setLoading(true);
      console.log('ShopContext: Making API call to fetch shops');
      
      // Note: We can't pass selectedShop here because we're fetching shops to determine selectedShop
      // The shops endpoint should work with just user authentication
      const data = await callApi('/settings/settings/shops', 'GET');
      console.log('ShopContext: Shops API call successful, data:', data);
      setShops(data);
      
      // Restore selected shop from localStorage or select first shop
      const savedShopId = localStorage.getItem('selectedShopId');
      console.log('ShopContext: savedShopId from localStorage:', savedShopId);
      
      if (savedShopId && data.length > 0) {
        const savedShop = data.find((shop: Shop) => shop.shopId === savedShopId);
        console.log('ShopContext: Looking for saved shop with ID:', savedShopId);
        console.log('ShopContext: Found saved shop:', savedShop);
        
        if (savedShop) {
          setSelectedShop(savedShop);
          console.log('ShopContext: Restored saved shop:', savedShop);
        } else {
          // Saved shop not found, remove from localStorage and select first shop
          console.log('ShopContext: Saved shop not found, removing from localStorage');
          localStorage.removeItem('selectedShopId');
          if (data.length > 0) {
            setSelectedShop(data[0]);
            console.log('ShopContext: Saved shop not found, selected first shop:', data[0]);
          }
        }
      } else if (data.length > 0 && !selectedShop) {
        // No saved shop, select first available shop
        console.log('ShopContext: No saved shop, selecting first available shop');
        setSelectedShop(data[0]);
        console.log('ShopContext: No saved shop, selected first shop:', data[0]);
      } else {
        console.log('ShopContext: No shops available or shop already selected');
        console.log('ShopContext: data.length:', data.length);
        console.log('ShopContext: selectedShop:', selectedShop);
      }
    } catch (err: any) {
      console.error('ShopContext: Error fetching shops:', err);
      setError(err.message || 'Failed to fetch shops');
    } finally {
      console.log('ShopContext: fetchShops completed, setting loading to false');
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
    console.log('ShopContext: useEffect for fetchShops triggered');
    console.log('ShopContext: authenticated:', authenticated);
    console.log('ShopContext: token:', token ? 'present' : 'missing');
    
    if (authenticated && token) {
      console.log('ShopContext: Conditions met, calling fetchShops');
      fetchShops();
    } else {
      console.log('ShopContext: Conditions not met for fetchShops');
      console.log('ShopContext: authenticated:', authenticated);
      console.log('ShopContext: token present:', !!token);
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
