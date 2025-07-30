'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { callApi } from '@/utils/api';

export default function ShopSync() {
  const { onboardingStatus, isLoading, shopSyncInProgress, setShopSyncInProgress, fetchOnboardingStatus } = useOnboarding();
  const [syncStatus, setSyncStatus] = useState({ offers: '' });
  const [error, setError] = useState(null);
  const [isSyncingOffers, setIsSyncingOffers] = useState(false);
  const [syncTriggered, setSyncTriggered] = useState(false);
  const prevUserId = useRef(onboardingStatus?.userId);

  // Reset local state only if user ID changes
  useEffect(() => {
    if (prevUserId.current !== onboardingStatus?.userId) {
      setSyncStatus({ offers: '' });
      setError(null);
      setIsSyncingOffers(false);
      setSyncTriggered(false);
      prevUserId.current = onboardingStatus?.userId;
    }
  }, [onboardingStatus?.userId]);

  // Reset syncTriggered when onboarding is complete
  useEffect(() => {
    if (onboardingStatus && onboardingStatus.hasCompletedShopSync) {
      setSyncTriggered(false);
    }
  }, [onboardingStatus]);

  const handleSyncOffers = async () => {
    setIsSyncingOffers(true);
    setShopSyncInProgress(true);
    setSyncStatus({ offers: 'Requesting offer export from Bol.com...' });
    setError(null);
    setSyncTriggered(true);
    try {
      await callApi('/shop/api/shop/offers/export/csv', 'GET');
      setSyncStatus({ offers: 'Offer export and sync completed successfully!' });
      
      // Wait a moment for the onboarding status to be updated in the backend
      setTimeout(async () => {
        try {
          // Refetch onboarding status to update the UI
          await fetchOnboardingStatus();
        } catch (error) {
          console.error('Error refetching onboarding status:', error);
        }
      }, 1000);
      
    } catch (err) {
      const errorMessage = (err && err.message) ? err.message : String(err);
      setSyncStatus({ offers: `Error syncing offers: ${errorMessage}` });
      setError(`Offer sync failed: ${errorMessage}`);
      setSyncTriggered(false);
      setIsSyncingOffers(false);
      setShopSyncInProgress(false);
    }
  };

  if (onboardingStatus && onboardingStatus.hasCompletedShopSync) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Step 2: Initial Shop Synchronization - Complete</h2>
        <p className="text-gray-600">Initial shop synchronization has been marked as complete.</p>
      </div>
    );
  }

  // Show loader if sync is in progress or triggered but not yet complete
  if (isSyncingOffers || syncTriggered) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Step 2: Initial Shop Synchronization</h2>
        <div className="flex items-center justify-center my-4">
          <svg className="animate-spin h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-blue-600">{syncStatus.offers || 'Syncing offers...'}</span>
        </div>
        <p className="text-gray-600 mb-4">
          Please wait while your offers are being synced. The system will update when complete.
        </p>
        {error && <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}
      </div>
    );
  }

  // Initial sync UI
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Step 2: Initial Shop Synchronization</h2>
      <p className="text-gray-600 mb-6">
        Next, let's sync your offers from Bol.com. This might take a few moments.<br/>
        Product details will be synced as needed based on your offers.
      </p>

      {error && <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}

      <div className="space-y-4 mb-6">
        <div>
          <button
            onClick={handleSyncOffers}
            className="tf-button style-1 w-full sm:w-auto"
            disabled={isSyncingOffers || isLoading || shopSyncInProgress}
          >
            {isSyncingOffers ? 'Syncing Offers...' : 'Sync Bol.com Offers (CSV Export)'}
          </button>
          {syncStatus.offers && <p className={`text-sm mt-2 ${syncStatus.offers.includes('Error') ? 'text-red-600' : 'text-gray-600'}`}>{syncStatus.offers}</p>}
        </div>
      </div>

      <p className="text-gray-600 mb-4">
        Once your offers are synced, the system will update and you can proceed to the next step.
      </p>
    </div>
  );
}
