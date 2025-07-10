'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { callApi } from '@/utils/api';

export default function BolApiForm({ onComplete }) { // Added onComplete prop
  const { markStepAsComplete, onboardingStatus } = useOnboarding();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      await callApi('/settings/settings/account', 'POST', {
        bolClientId: clientId,
        bolClientSecret: clientSecret,
      });
      setSuccessMessage('Bol.com credentials saved successfully! ');

      await markStepAsComplete('hasConfiguredBolApi');
      setSuccessMessage(prev => prev + 'Onboarding step updated.');
      if (onComplete) onComplete(); // Call onComplete on success
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
