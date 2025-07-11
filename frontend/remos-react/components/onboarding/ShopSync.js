'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { callApi } from '@/utils/api';

export default function ShopSync() {
  const { markStepAsComplete, onboardingStatus } = useOnboarding();
  const [syncStatus, setSyncStatus] = useState({
    orders: '',
    offers: '',
  });
  const [isLoadingStepCompletion, setIsLoadingStepCompletion] = useState(false);
  const [error, setError] = useState(null);
  const [isSyncingOrders, setIsSyncingOrders] = useState(true);
  const [isSyncingOffers, setIsSyncingOffers] = useState(false);

  const handleSyncOrders = async () => {
    setIsSyncingOrders(true);
    setSyncStatus(prev => ({ ...prev, orders: 'Syncing orders from Bol.com...' }));
    setError(null);
    try {
      await callApi('/shop/api/shop/orders/sync/bol', 'POST');
      setSyncStatus(prev => ({ ...prev, orders: 'Order sync initiated successfully. This may take some time in the background.' }));
    } catch (err) {
      console.error('Failed to sync orders:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setSyncStatus(prev => ({ ...prev, orders: `Error syncing orders: ${errorMessage}` }));
      setError(`Order sync failed: ${errorMessage}`);
    } finally {
      setIsSyncingOrders(false);
    }
  };

  const handleSyncOffers = async () => {
    setIsSyncingOffers(true);
    setSyncStatus(prev => ({ ...prev, offers: 'Requesting offer export from Bol.com...' }));
    setError(null);
    try {
      const response = await callApi('/shop/api/shop/offers/export/csv', 'GET');
      console.log(response)
      setSyncStatus(prev => ({ ...prev, offers: 'Offer export and sync initiated. This may take some time.' }));
      console.log(offers)
    } catch (err) {
      console.error('Failed to sync offers:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setSyncStatus(prev => ({ ...prev, offers: `Error syncing offers: ${errorMessage}` }));
      setError(`Offer sync failed: ${errorMessage}`);
    } finally {
      setIsSyncingOffers(false);
    }
  };

  const handleCompleteShopSyncStep = async () => {
    setIsLoadingStepCompletion(true);
    setError(null);
    try {
      await markStepAsComplete('hasCompletedShopSync');
    } catch (err) {
      console.error('Failed to mark shop sync as complete:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setError(errorMessage || 'Failed to save progress.');
    } finally {
      setIsLoadingStepCompletion(false);
    }
  };

  const bingo1 = syncStatus.orders.startsWith('Order sync initiated');
  const bingo2 = syncStatus.offers.startsWith('Offer export and sync initiated');
  const canCompleteStep = true;
  if (onboardingStatus && onboardingStatus.hasCompletedShopSync) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Step 2: Initial Shop Synchronization - Complete</h2>
        <p className="text-gray-600">Initial shop synchronization has been marked as complete.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Step 2: Initial Shop Synchronization</h2>
      <p className="text-gray-600 mb-6">
        Next, let's sync your orders and offers from Bol.com. This might take a few moments.
        Product details will be synced as needed based on your orders and offers.
      </p>

      {error && <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}

      <div className="space-y-4 mb-6">
        {/* <div>
          <button
            onClick={handleSyncOrders}
            className="tf-button style-1 w-full sm:w-auto mr-2"
            disabled={isSyncingOrders || isLoadingStepCompletion}
          >
            {isSyncingOrders ? 'Syncing Orders...' : 'Sync Bol.com Orders'}
          </button>
          {syncStatus.orders && <p className={`text-sm mt-2 ${syncStatus.orders.includes('Error') ? 'text-red-600' : 'text-gray-600'}`}>{syncStatus.orders}</p>}
        </div> */}

        <div>
          <button
            onClick={handleSyncOffers}
            className="tf-button style-1 w-full sm:w-auto"
            disabled={isSyncingOffers || isLoadingStepCompletion}
          >
            {isSyncingOffers ? 'Syncing Offers...' : 'Sync Bol.com Offers (CSV Export)'}
          </button>
          {syncStatus.offers && <p className={`text-sm mt-2 ${syncStatus.offers.includes('Error') ? 'text-red-600' : 'text-gray-600'}`}>{syncStatus.offers}</p>}
        </div>
      </div>

      <p className="text-gray-600 mb-4">
        Once you have initiated both synchronizations, and they have had some time to process, you can mark this step as complete.
        The system will continue to process data in the background if needed.
      </p>

      <button
        onClick={handleCompleteShopSyncStep}
        className="tf-button w-full sm:w-auto"
         //disabled={isLoadingStepCompletion || (onboardingStatus && onboardingStatus.hasCompletedShopSync) || !canCompleteStep}
      >
        {isLoadingStepCompletion ? 'Saving...' : 'Mark Shop Sync as Complete'}
      </button>
      {!canCompleteStep && !(onboardingStatus && onboardingStatus.hasCompletedShopSync) && <p className="text-xs text-gray-500 mt-2">Please initiate both order and offer syncs before completing this step.</p>}

    </div>
  );
}
