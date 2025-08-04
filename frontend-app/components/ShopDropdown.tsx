'use client';

import React from 'react';
import { useShop } from '@/contexts/ShopContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Store, Plus } from 'lucide-react';

export default function ShopDropdown() {
  const { shops, selectedShop, selectShop, loading } = useShop();

  const handleShopSelect = (shop: any) => {
    selectShop(shop);
  };

  const handleNewShop = () => {
    selectShop(null);
  };

  if (loading) {
    return (
      <Button variant="outline" className="w-full justify-between">
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center">
            <Store className="mr-2 h-4 w-4" />
            <span className="truncate">{selectedShop ? selectedShop.name : 'Select a Shop'}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <DropdownMenuItem onClick={handleNewShop}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Shop
        </DropdownMenuItem>
        <div className="border-t my-1"></div>
        {shops.map((shop) => (
          <DropdownMenuItem
            key={shop.shopId}
            onClick={() => handleShopSelect(shop)}
            className={selectedShop?.shopId === shop.shopId ? 'bg-accent' : ''}
          >
            <Store className="mr-2 h-4 w-4" />
            {shop.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
