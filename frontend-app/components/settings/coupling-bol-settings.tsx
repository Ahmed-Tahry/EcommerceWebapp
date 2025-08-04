'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { callApi } from "@/lib/api";
import { useShop } from "@/contexts/ShopContext";
import { Loader2, Link, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CouplingBolForm {
  bolClientId?: string;
  bolClientSecret?: string;
}

export function CouplingBolSettings() {
  const [form, setForm] = useState<CouplingBolForm>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const { toast } = useToast();
  const { selectedShop, shops, loading: shopLoading } = useShop();

  // Debug logging
  console.log('CouplingBolSettings: Component rendered');
  console.log('CouplingBolSettings: selectedShop:', selectedShop);
  console.log('CouplingBolSettings: shops:', shops);
  console.log('CouplingBolSettings: shopLoading:', shopLoading);

  useEffect(() => {
    async function fetchSettings() {
      console.log('CouplingBolSettings: fetchSettings called');
      console.log('CouplingBolSettings: selectedShop in useEffect:', selectedShop);
      console.log('CouplingBolSettings: shopLoading in useEffect:', shopLoading);
      
      if (shopLoading) {
        console.log('CouplingBolSettings: Shop context is still loading, waiting...');
        return;
      }
      
      if (!selectedShop) {
        console.log('CouplingBolSettings: No shop selected, not fetching settings');
        setLoading(false);
        return;
      }
      
      console.log('CouplingBolSettings: Fetching settings for shop:', selectedShop);
      
      try {
        setLoading(true);
        console.log('CouplingBolSettings: Making API call with selectedShop:', selectedShop);
        const data = await callApi('/settings/settings/coupling-bol', 'GET', undefined, {}, selectedShop);
        console.log('CouplingBolSettings: API call successful, data:', data);
        setForm(data || {});
      } catch (err) {
        console.error('CouplingBolSettings: API call failed:', err);
        toast({
          title: "Error",
          description: "Failed to load Bol.com settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [toast, selectedShop, shopLoading]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('CouplingBolSettings: handleSubmit called');
    console.log('CouplingBolSettings: selectedShop for submit:', selectedShop);
    console.log('CouplingBolSettings: form data:', form);
    
    setSaving(true);
    try {
      console.log('CouplingBolSettings: Making POST API call with selectedShop:', selectedShop);
      await callApi('/settings/settings/coupling-bol', 'POST', form, {}, selectedShop);
      console.log('CouplingBolSettings: POST API call successful');
      toast({
        title: "Success",
        description: "Bol.com credentials saved successfully!",
      });
    } catch (err) {
      console.error('CouplingBolSettings: POST API call failed:', err);
      toast({
        title: "Error",
        description: "Failed to save Bol.com credentials.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Bol.com API Credentials
          </CardTitle>
          <CardDescription>
            Configure your Bol.com API credentials to enable product synchronization and order management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bolClientId">Client ID</Label>
              <Input
                id="bolClientId"
                name="bolClientId"
                value={form.bolClientId || ''}
                onChange={handleChange}
                placeholder="Enter your Bol.com Client ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bolClientSecret">Client Secret</Label>
              <div className="relative">
                <Input
                  id="bolClientSecret"
                  name="bolClientSecret"
                  type={showSecret ? "text" : "password"}
                  value={form.bolClientSecret || ''}
                  onChange={handleChange}
                  placeholder="Enter your Bol.com Client Secret"
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Bol.com Credentials
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>How to get your Bol.com API credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Step 1:</strong> Log in to your Bol.com Partner account</p>
            <p><strong>Step 2:</strong> Navigate to the API section in your account settings</p>
            <p><strong>Step 3:</strong> Create a new API application or use an existing one</p>
            <p><strong>Step 4:</strong> Copy the Client ID and Client Secret</p>
            <p><strong>Step 5:</strong> Paste them in the form above and save</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Keep your API credentials secure and never share them with unauthorized parties. 
              These credentials allow access to your Bol.com seller account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
