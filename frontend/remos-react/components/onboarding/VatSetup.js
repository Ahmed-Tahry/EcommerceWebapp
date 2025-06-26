'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function VatSetup() {
  const { markStepAsComplete, onboardingStatus } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompleteVatSetupStep = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await markStepAsComplete('hasCompletedVatSetup');
    } catch (err) {
      console.error('Failed to mark VAT setup as complete:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setError(errorMessage || 'Failed to save progress.');
    } finally {
      setIsLoading(false);
    }
  };

  if (onboardingStatus && onboardingStatus.hasCompletedVatSetup) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Step 3: Configure VAT Settings - Complete</h2>
        <p className="text-gray-600">VAT settings have been marked as complete.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Step 3: Configure VAT Settings</h2>
      <p className="text-gray-600 mb-3">
        Ensure your product VAT (Value Added Tax) rates are correctly configured in the system.
        You can manage detailed VAT settings in the main application settings area.
      </p>
      <p className="text-gray-600 mb-6">
        For the purpose of this onboarding, please confirm once you have reviewed and set up your VAT configurations.
      </p>

      {error && <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}

      <button
        onClick={handleCompleteVatSetupStep}
        className="tf-button w-full sm:w-auto"
        disabled={isLoading || (onboardingStatus && onboardingStatus.hasCompletedVatSetup)}
      >
        {isLoading ? 'Saving...' : 'Mark VAT Setup as Complete'}
      </button>
    </div>
  );
}
