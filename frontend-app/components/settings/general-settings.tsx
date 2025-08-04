'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { callApi } from "@/lib/api";
import { useShop } from "@/contexts/ShopContext";
import { Loader2 } from "lucide-react";

interface GeneralSettingsForm {
  firstname?: string;
  surname?: string; // Changed from lastname to match backend
  address?: string;
  postcode?: string;
  city?: string;
  accountEmail?: string; // Changed from email to match backend
  phoneNumber?: string; // Changed from phone to match backend
  companyName?: string;
  companyAddress?: string;
  companyPostcode?: string; // Changed from companyPostalCode to match backend
  companyCity?: string;
  customerEmail?: string; // Added to match backend
  companyPhoneNumber?: string; // Added to match backend
  chamberOfCommerce?: string; // Changed from chamberOfCommerceNumber to match backend
  vatNumber?: string;
  iban?: string; // Added to match backend
  optionalVatNumber?: string; // Added to match backend
}

export function GeneralSettings() {
  const [form, setForm] = useState<GeneralSettingsForm>({});
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
        const data = await callApi('/settings/settings/general', 'GET', undefined, {}, selectedShop);
        setForm(data || {});
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load general settings.",
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Prepare data with required fields and default values for NOT NULL constraints
      const formData = {
        firstname: form.firstname || '',
        surname: form.surname || '', // Required field
        address: form.address || '',
        postcode: form.postcode || '',
        city: form.city || '',
        accountEmail: form.accountEmail || '',
        phoneNumber: form.phoneNumber || null,
        companyName: form.companyName || '',
        companyAddress: form.companyAddress || '',
        companyPostcode: form.companyPostcode || '',
        companyCity: form.companyCity || '',
        customerEmail: form.customerEmail || form.accountEmail || '', // Use accountEmail as fallback
        companyPhoneNumber: form.companyPhoneNumber || null,
        chamberOfCommerce: form.chamberOfCommerce || '',
        vatNumber: form.vatNumber || '',
        iban: form.iban || null,
        optionalVatNumber: form.optionalVatNumber || null,
      };

      await callApi('/settings/settings/general', 'POST', formData, {}, selectedShop);
      toast({
        title: "Success",
        description: "General settings saved successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save general settings.",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              name="firstname"
              value={form.firstname || ''}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Last Name</Label>
            <Input
              id="surname"
              name="surname"
              value={form.surname || ''}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            value={form.address || ''}
            onChange={handleChange}
            placeholder="Enter your address"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={form.city || ''}
              onChange={handleChange}
              placeholder="Enter your city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postcode">Postal Code</Label>
            <Input
              id="postcode"
              name="postcode"
              value={form.postcode || ''}
              onChange={handleChange}
              placeholder="Enter postal code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={form.phoneNumber || ''}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountEmail">Account Email</Label>
            <Input
              id="accountEmail"
              name="accountEmail"
              type="email"
              value={form.accountEmail || ''}
              onChange={handleChange}
              placeholder="Enter your account email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Customer Email</Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={form.customerEmail || ''}
              onChange={handleChange}
              placeholder="Enter customer email"
            />
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Information</h3>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            value={form.companyName || ''}
            onChange={handleChange}
            placeholder="Enter your company name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyAddress">Company Address</Label>
          <Textarea
            id="companyAddress"
            name="companyAddress"
            value={form.companyAddress || ''}
            onChange={handleChange}
            placeholder="Enter your company address"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyCity">City</Label>
            <Input
              id="companyCity"
              name="companyCity"
              value={form.companyCity || ''}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyPostcode">Postal Code</Label>
            <Input
              id="companyPostcode"
              name="companyPostcode"
              value={form.companyPostcode || ''}
              onChange={handleChange}
              placeholder="Enter postal code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyPhoneNumber">Company Phone</Label>
            <Input
              id="companyPhoneNumber"
              name="companyPhoneNumber"
              value={form.companyPhoneNumber || ''}
              onChange={handleChange}
              placeholder="Enter company phone"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vatNumber">VAT Number</Label>
            <Input
              id="vatNumber"
              name="vatNumber"
              value={form.vatNumber || ''}
              onChange={handleChange}
              placeholder="Enter VAT number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chamberOfCommerce">Chamber of Commerce Number</Label>
            <Input
              id="chamberOfCommerce"
              name="chamberOfCommerce"
              value={form.chamberOfCommerce || ''}
              onChange={handleChange}
              placeholder="Enter CoC number"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              name="iban"
              value={form.iban || ''}
              onChange={handleChange}
              placeholder="Enter IBAN"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="optionalVatNumber">Optional VAT Number</Label>
            <Input
              id="optionalVatNumber"
              name="optionalVatNumber"
              value={form.optionalVatNumber || ''}
              onChange={handleChange}
              placeholder="Enter optional VAT number"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save General Settings
      </Button>
    </form>
  );
}
