'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useShop } from '@/contexts/ShopContext';
import { callApi } from '@/utils/api';

export default function BolApiForm() {
  const { markStepAsComplete, onboardingStatus, fetchOnboardingStatus } = useOnboarding();
  const { fetchShops, selectShop } = useShop();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Use the bolClientId as the shopId
      const shopId = clientId;
      
      console.log('BolApiForm: Submitting Bol credentials with shopId (bolClientId):', shopId);
      
      // Call the coupling-bol endpoint that creates a shop
      const response = await callApi('/settings/settings/coupling-bol', 'POST', {
        bolClientId: clientId,
        bolClientSecret: clientSecret,
        shopName: shopName || `Bol.com Shop (${clientId})`,
        shopDescription: shopDescription || 'Bol.com connected store',
        shopId: shopId // This is the bolClientId
      });
      
      console.log('BolApiForm: Response from coupling-bol:', response);
      
      setSuccessMessage('Bol.com credentials saved and shop created successfully!');

      // Refresh shops list to include the newly created shop
      await fetchShops();
      
      // Select the newly created shop
      if (response.shop) {
        console.log('BolApiForm: Selecting newly created shop:', response.shop);
        selectShop(response.shop);
      }
      
      // Mark step 1 as complete and navigate to the next step
      await markStepAsComplete('hasConfiguredBolApi');
      goToNextStep();

    } catch (err) {
      console.error('Failed to configure Bol.com API:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setError(errorMessage || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (onboardingStatus && onboardingStatus.hasConfiguredBolApi && !error && !successMessage) {
     // If already completed and no pending messages, show a simple completed state.
     // This avoids showing the form again if user navigates back/forth.
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Step 1: Connect to Bol.com - Complete</h2>
        <p className="text-gray-600">Your Bol.com account is configured.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Step 1: Connect to Bol.com</h2>
      <p className="text-gray-600 mb-6">
        Enter your Bol.com API Client ID and Client Secret to allow us to sync your shop data.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 form-style-2">
        {error && <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}
        {successMessage && !error && <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">{successMessage}</div>}

        <fieldset>
          <div className="body-title mb-2">Bol.com Client ID <span className="tf-color-1">*</span></div>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter your Bol.com Client ID"
            className="flex-grow w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </fieldset>

        <fieldset>
          <div className="body-title mb-2">Bol.com Client Secret <span className="tf-color-1">*</span></div>
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="Enter your Bol.com Client Secret"
            className="flex-grow w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </fieldset>

        <fieldset>
          <div className="body-title mb-2">Shop Name</div>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Enter your shop name (optional)"
            className="flex-grow w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </fieldset>

        <fieldset>
          <div className="body-title mb-2">Shop Description</div>
          <textarea
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            placeholder="Enter your shop description (optional)"
            className="flex-grow w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            disabled={isLoading}
          />
        </fieldset>

        <button
          type="submit"
          className="tf-button w-full sm:w-auto"
          disabled={isLoading || (onboardingStatus && onboardingStatus.hasConfiguredBolApi)}
        >
          {isLoading ? 'Saving...' : ( (onboardingStatus && onboardingStatus.hasConfiguredBolApi) ? 'Configured' : 'Save and Continue')}
        </button>
      </form>
    </div>
  );
}
