'use client';

import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { callApi } from '@/utils/api';

const initialFormData = {
  companyName: '',
  companyAddress: '',
  vatNumber: '',
  defaultInvoiceNotes: '',
  invoicePrefix: 'INV-',
  nextInvoiceNumber: 1,
};

export default function InvoiceSettingsForm({ onComplete }) { // Added onComplete prop
  const { markStepAsComplete, onboardingStatus } = useOnboarding();
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // This effect could pre-fill data if a GET /api/settings/invoice existed
    // For now, it just ensures the form is reset if the step isn't complete
    // and the component is re-rendered.
    if (onboardingStatus && !onboardingStatus.hasCompletedInvoiceSetup) {
      // setFormData(initialFormData); // Or fetch existing settings if API allows
    }
  }, [onboardingStatus]);


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Basic handling for number type, ensuring it's stored as number if valid
    const val = type === 'number' ? (parseInt(value, 10) || 0) : value;
    setFormData(prev => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      await callApi('/settings/settings/invoice', 'POST', formData);
      setSuccessMessage('Invoice settings saved successfully! ');

      await markStepAsComplete('hasCompletedInvoiceSetup');
      setSuccessMessage(prev => prev + 'Onboarding step updated.');
      if (onComplete) onComplete(); // Call onComplete on success
    } catch (err) {
      console.error('Failed to save invoice settings:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setError(errorMessage || 'An unexpected error occurred while saving invoice settings.');
    } finally {
      setIsLoading(false);
    }
  };

  if (onboardingStatus && onboardingStatus.hasCompletedInvoiceSetup && !error && !successMessage) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Step 4: Invoice Settings - Complete</h2>
        <p className="text-gray-600">Your invoice settings have been saved and this step is complete.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Step 4: Configure Invoice Settings</h2>
      <p className="text-gray-600 mb-6">
        Please provide your company information for invoicing purposes.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 form-style-2">
        {error && <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}
        {successMessage && !error && <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">{successMessage}</div>}

        <fieldset>
          <div className="body-title mb-2">Company Name <span className="tf-color-1">*</span></div>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your Company Name" required disabled={isLoading} className="flex-grow w-full p-3 border border-gray-300 rounded-md"/>
        </fieldset>

        <fieldset>
          <div className="body-title mb-2">Company Address <span className="tf-color-1">*</span></div>
          <textarea name="companyAddress" value={formData.companyAddress} onChange={handleChange} placeholder="123 Business Rd, Suite 4B, Commerce City" required disabled={isLoading} className="flex-grow w-full p-3 border border-gray-300 rounded-md" rows="3"></textarea>
        </fieldset>

        <fieldset>
          <div className="body-title mb-2">VAT Number <span className="tf-color-1">*</span></div>
          <input type="text" name="vatNumber" value={formData.vatNumber} onChange={handleChange} placeholder="Your VAT Identification Number" required disabled={isLoading} className="flex-grow w-full p-3 border border-gray-300 rounded-md"/>
        </fieldset>

        <fieldset>
          <div className="body-title mb-2">Default Invoice Notes</div>
          <textarea name="defaultInvoiceNotes" value={formData.defaultInvoiceNotes} onChange={handleChange} placeholder="E.g., Thank you for your purchase!" disabled={isLoading} className="flex-grow w-full p-3 border border-gray-300 rounded-md" rows="2"></textarea>
        </fieldset>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <fieldset>
            <div className="body-title mb-2">Invoice Prefix</div>
            <input type="text" name="invoicePrefix" value={formData.invoicePrefix} onChange={handleChange} placeholder="E.g., INV-" disabled={isLoading} className="flex-grow w-full p-3 border border-gray-300 rounded-md"/>
          </fieldset>
          <fieldset>
            <div className="body-title mb-2">Next Invoice Number <span className="tf-color-1">*</span></div>
            <input type="number" name="nextInvoiceNumber" value={formData.nextInvoiceNumber} onChange={handleChange} required disabled={isLoading} min="1" className="flex-grow w-full p-3 border border-gray-300 rounded-md"/>
          </fieldset>
        </div>

        <button
          type="submit"
          className="tf-button w-full sm:w-auto"
          disabled={isLoading || (onboardingStatus && onboardingStatus.hasCompletedInvoiceSetup)}
        >
          {isLoading ? 'Saving...' : ((onboardingStatus && onboardingStatus.hasCompletedInvoiceSetup) ? 'Settings Saved' : 'Save Invoice Settings & Complete Step')}
        </button>
      </form>
    </div>
  );
}
