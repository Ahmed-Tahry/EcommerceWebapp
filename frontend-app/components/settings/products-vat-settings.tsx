'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { callApi } from "@/lib/api";
import { useShop } from "@/contexts/ShopContext";
import { Loader2, Package, Plus, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface VatRate {
  id: string;
  country: string;
  vatRate: number;
  productId?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

export function ProductsVatSettings() {
  const [products, setProducts] = useState<Product[]>([]);
  const [vatRates, setVatRates] = useState<VatRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [vatForm, setVatForm] = useState({
    country: '',
    vatRate: '',
  });
  const [isVatDialogOpen, setIsVatDialogOpen] = useState(false);
  const { toast } = useToast();
  const { selectedShop } = useShop();

  useEffect(() => {
    fetchData();
  }, [selectedShop]);

  async function fetchData() {
    if (!selectedShop) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // Fetch products and VAT rates
      const [productsData, vatData] = await Promise.all([
        // For now, we'll use mock data since the backend might not have product endpoints
        Promise.resolve([
          { id: '1', name: 'Sample Product 1', sku: 'SKU001', price: 29.99 },
          { id: '2', name: 'Sample Product 2', sku: 'SKU002', price: 49.99 },
        ]),
        callApi('/settings/settings/vat', 'GET', undefined, {}, selectedShop).catch(() => [])
      ]);
      
      setProducts(productsData);
      setVatRates(vatData || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load products and VAT settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleVatFormChange(field: string, value: string) {
    setVatForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleVatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;

    setSaving(true);
    try {
      const vatData = {
        country: vatForm.country,
        vatRate: parseFloat(vatForm.vatRate),
        productId: selectedProduct.id,
      };

      await callApi('/settings/settings/vat', 'POST', vatData, {}, selectedShop);
      
      toast({
        title: "Success",
        description: "VAT rate saved successfully!",
      });
      
      setVatForm({ country: '', vatRate: '' });
      setIsVatDialogOpen(false);
      fetchData(); // Refresh data
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save VAT rate.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteVatRate(vatId: string) {
    try {
      await callApi(`/settings/settings/vat/${vatId}`, 'DELETE', undefined, {}, selectedShop);
      toast({
        title: "Success",
        description: "VAT rate deleted successfully!",
      });
      fetchData(); // Refresh data
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete VAT rate.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products
          </CardTitle>
          <CardDescription>
            Manage your products and their VAT configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground">Products will be synchronized from Bol.com</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>€{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Dialog open={isVatDialogOpen} onOpenChange={setIsVatDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add VAT
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add VAT Rate</DialogTitle>
                            <DialogDescription>
                              Configure VAT rate for {selectedProduct?.name}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleVatSubmit}>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Select
                                  value={vatForm.country}
                                  onValueChange={(value) => handleVatFormChange('country', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="NL">Netherlands</SelectItem>
                                    <SelectItem value="BE">Belgium</SelectItem>
                                    <SelectItem value="DE">Germany</SelectItem>
                                    <SelectItem value="FR">France</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="vatRate">VAT Rate (%)</Label>
                                <Input
                                  id="vatRate"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  value={vatForm.vatRate}
                                  onChange={(e) => handleVatFormChange('vatRate', e.target.value)}
                                  placeholder="Enter VAT rate"
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save VAT Rate
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* VAT Rates Section */}
      <Card>
        <CardHeader>
          <CardTitle>VAT Rates</CardTitle>
          <CardDescription>
            Configured VAT rates for your products by country
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vatRates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No VAT rates configured</p>
              <p className="text-sm text-muted-foreground">Add VAT rates for your products above</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>VAT Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vatRates.map((vatRate) => {
                  const product = products.find(p => p.id === vatRate.productId);
                  return (
                    <TableRow key={vatRate.id}>
                      <TableCell className="font-medium">
                        {product?.name || 'Unknown Product'}
                      </TableCell>
                      <TableCell>{vatRate.country}</TableCell>
                      <TableCell>{vatRate.vatRate}%</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVatRate(vatRate.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
