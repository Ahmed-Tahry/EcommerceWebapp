'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { callApi } from "@/lib/api";
import { useShop } from "@/contexts/ShopContext";
import { Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceSettingsForm {
  invoicePrefix?: string;
  startNumber?: string;
  fileNameBase?: string;
  defaultInvoiceNotes?: string;
}

export function InvoiceSettings() {
  const [form, setForm] = useState<InvoiceSettingsForm>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { selectedShop } = useShop();

  useEffect(() => {
    async function fetchSettings() {
      if (!selectedShop) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await callApi('/settings/settings/invoice', 'GET', undefined, {}, selectedShop);
        setForm(data || {});
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load invoice settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [toast, selectedShop]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: string, value: string) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await callApi('/settings/settings/invoice', 'POST', form, {}, selectedShop);
      toast({
        title: "Success",
        description: "Invoice settings saved successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save invoice settings.",
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
            <FileText className="h-5 w-5" />
            Invoice Configuration
          </CardTitle>
          <CardDescription>
            Configure how your invoices are generated and numbered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Invoice Numbering */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Invoice Numbering</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    name="invoicePrefix"
                    value={form.invoicePrefix || ''}
                    onChange={handleChange}
                    placeholder="e.g., INV-2024-"
                  />
                  <p className="text-xs text-muted-foreground">
                    Prefix for all invoice numbers
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startNumber">Start Number</Label>
                  <Input
                    id="startNumber"
                    name="startNumber"
                    value={form.startNumber || ''}
                    onChange={handleChange}
                    placeholder="e.g., 0001"
                  />
                  <p className="text-xs text-muted-foreground">
                    Starting number for invoices
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileNameBase">File Name Base</Label>
                  <Select
                    value={form.fileNameBase || ''}
                    onValueChange={(value) => handleSelectChange('fileNameBase', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select file name base" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice_number">Invoice Number</SelectItem>
                      <SelectItem value="order_number">Order Number</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Basis for invoice file names
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Invoice Content</h3>
              <div className="space-y-2">
                <Label htmlFor="defaultInvoiceNotes">Default Invoice Notes</Label>
                <Textarea
                  id="defaultInvoiceNotes"
                  name="defaultInvoiceNotes"
                  value={form.defaultInvoiceNotes || ''}
                  onChange={handleChange}
                  placeholder="Default notes to include on all invoices"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  These notes will appear on all generated invoices
                </p>
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Invoice Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Preview</CardTitle>
          <CardDescription>
            Preview of how your invoice numbers will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Example Invoice Number:</p>
            <p className="text-lg font-mono">
              {form.invoicePrefix || 'INV-2024-'}{form.startNumber || '0001'}
            </p>
            {form.fileNameBase && (
              <>
                <p className="text-sm font-medium mt-4 mb-2">Example File Name:</p>
                <p className="text-lg font-mono">
                  {form.fileNameBase === 'invoice_number' 
                    ? `${form.invoicePrefix || 'INV-2024-'}${form.startNumber || '0001'}.pdf`
                    : 'ORDER-123456.pdf'
                  }
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Settings Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Invoice Prefix:</strong> A text prefix that appears before the invoice number (e.g., "INV-2024-")</p>
            <p><strong>Start Number:</strong> The starting number for your invoice sequence. Use leading zeros for consistent formatting.</p>
            <p><strong>File Name Base:</strong> Determines how invoice PDF files are named when downloaded or sent.</p>
            <p><strong>Default Notes:</strong> Standard text that appears on all invoices, such as payment terms or company policies.</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Once you start generating invoices, changing the numbering system may cause 
              confusion. Set up your preferred format before processing your first orders.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
