'use client';

import { useState, useEffect } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { callApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Package, Percent, Edit, Loader2 } from 'lucide-react';

interface Product {
  ean: string;
  title?: string | null;
  description?: string | null;
  brand?: string | null;
  mainImageUrl?: string | null;
  vatRate?: number | null;
  country?: string | null;
  userId?: string;
  shopId?: string;
}

export default function ProductsVatSettings() {
  const { selectedShop, loading: shopLoading } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProducts = async () => {
    if (!selectedShop) return;
    
    try {
      console.log('ProductsVatSettings: Fetching products for shop:', selectedShop.shopId);
      const response = await callApi('/shop/api/shop/products', 'GET', null, selectedShop);
      console.log('ProductsVatSettings: Products response:', response);
      
      if (response && response.products) {
        setProducts(response.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('ProductsVatSettings: Failed to fetch products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    }
  };

  useEffect(() => {
    if (!shopLoading && selectedShop) {
      fetchProducts().finally(() => {
        setLoading(false);
      });
    } else if (!shopLoading && !selectedShop) {
      setLoading(false);
    }
  }, [selectedShop, shopLoading]);

  const handleUpdateProductVat = async (ean: string, newVatRate: number, country: string = 'NL') => {
    if (!selectedShop) return;

    setUpdating(ean);
    try {
      console.log(`ProductsVatSettings: Updating VAT for product ${ean} to ${newVatRate}%`);
      
      const vatData = {
        ean,
        country,
        vatRate: newVatRate,
        shopId: selectedShop.shopId
      };

      await callApi(`/shop/api/shop/products/${ean}/vat`, 'PUT', vatData, selectedShop);
      
      toast.success(`VAT rate updated to ${newVatRate}% for product`);
      await fetchProducts();
    } catch (error) {
      console.error('ProductsVatSettings: Failed to update product VAT:', error);
      toast.error('Failed to update VAT rate');
    } finally {
      setUpdating(null);
    }
  };

  if (shopLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!selectedShop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products & VAT Settings
          </CardTitle>
          <CardDescription>
            Please select a shop to manage products and VAT settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products & VAT Management
              </CardTitle>
              <CardDescription>
                Manage VAT rates for all products in your shop. Click Edit VAT to update rates.
              </CardDescription>
            </div>
            <Button onClick={() => fetchProducts()} variant="outline">
              Refresh Products
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading products...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>EAN</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Current VAT Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.ean}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.mainImageUrl && (
                          <img 
                            src={product.mainImageUrl} 
                            alt={product.title || 'Product'}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">
                            {product.title || 'Untitled Product'}
                          </div>
                          {product.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.ean}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.brand || 'No brand'}
                    </TableCell>
                    <TableCell>
                      {product.vatRate !== null && product.vatRate !== undefined ? (
                        <Badge variant="secondary">{product.vatRate}%</Badge>
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsEditModalOpen(true);
                        }}
                        disabled={updating === product.ean}
                      >
                        {updating === product.ean ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit VAT
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground/50" />
                        <div>No products found in this shop</div>
                        <div className="text-sm">
                          Products will appear here once you add them to your shop or sync from Bol.com
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Product VAT Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Update VAT Rate
            </DialogTitle>
            <DialogDescription>
              Update the VAT rate for {editingProduct?.title || editingProduct?.ean}
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductVatEditForm
              product={editingProduct}
              onSave={handleUpdateProductVat}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingProduct(null);
              }}
              isUpdating={updating === editingProduct.ean}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductVatEditForm({ 
  product, 
  onSave, 
  onClose,
  isUpdating
}: { 
  product: Product; 
  onSave: (ean: string, vatRate: number, country: string) => void; 
  onClose: () => void;
  isUpdating: boolean;
}) {
  const [vatRate, setVatRate] = useState(product.vatRate?.toString() || '');
  const [country, setCountry] = useState(product.country || 'NL');

  const commonVatRates = [
    { value: '0', label: '0% (Exempt)' },
    { value: '9', label: '9% (Reduced Rate)' },
    { value: '21', label: '21% (Standard Rate)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(vatRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error('Please enter a valid VAT rate between 0 and 100');
      return;
    }
    onSave(product.ean, rate, country);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          {product.mainImageUrl && (
            <img 
              src={product.mainImageUrl} 
              alt={product.title || 'Product'}
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{product.title || 'Untitled Product'}</div>
            <div className="text-sm text-muted-foreground">EAN: {product.ean}</div>
            {product.brand && (
              <div className="text-sm text-muted-foreground">Brand: {product.brand}</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vatRate">VAT Rate (%)</Label>
          <Select value={vatRate} onValueChange={setVatRate}>
            <SelectTrigger>
              <SelectValue placeholder="Select VAT rate" />
            </SelectTrigger>
            <SelectContent>
              {commonVatRates.map((rate) => (
                <SelectItem key={rate.value} value={rate.value}>
                  {rate.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="vatRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            placeholder="Or enter custom rate"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NL">Netherlands</SelectItem>
              <SelectItem value="BE">Belgium</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </>
          ) : (
            'Update VAT Rate'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
