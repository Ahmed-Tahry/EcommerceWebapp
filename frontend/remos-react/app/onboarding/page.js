'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';

// Import actual components that will be re-created
import BolApiForm from '@/components/onboarding/BolApiForm';
import ShopSync from '@/components/onboarding/ShopSync';
import VatSetup from '@/components/onboarding/VatSetup';
import InvoiceSettingsForm from '@/components/onboarding/InvoiceSettingsForm';

const OnboardingStepStatus = ({ label, completed }) => (
  <li className={`flex items-center space-x-2 ${completed ? 'text-green-600' : 'text-gray-600'}`}>
    {completed ? (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
    ) : (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
    )}
    <span>{label}: <strong>{completed ? 'Done' : 'Pending'}</strong></span>
  </li>
);

const OnboardingContent = () => {
  const { onboardingStatus, isLoading, error } = useOnboarding();

  if (isLoading) {
    return <div className="text-center py-10"><div className="text-lg">Loading onboarding status...</div></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600"><div className="text-lg font-semibold">Error loading onboarding status:</div><p>{error}</p></div>;
  }

  const allStepsComplete =
    onboardingStatus.hasConfiguredBolApi &&
    onboardingStatus.hasCompletedShopSync &&
    onboardingStatus.hasCompletedVatSetup &&
    onboardingStatus.hasCompletedInvoiceSetup;

  if (allStepsComplete) {
    return (
      <div className="p-6 bg-green-50 border border-green-400 text-green-700 rounded-md shadow-lg text-center wg-box">
        <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
        <h2 className="text-2xl font-semibold mb-3">Onboarding Complete!</h2>
        <p>Congratulations, you have completed all the onboarding steps. Your account is fully configured.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome! Let's get you set up.</h1>
        <p className="text-gray-600 mt-2">Follow the steps below to configure your account.</p>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Onboarding Progress:</h3>
        <ul className="space-y-2">
          <OnboardingStepStatus label="Connect Bol.com Account" completed={onboardingStatus.hasConfiguredBolApi} />
          <OnboardingStepStatus label="Initial Shop Synchronization" completed={onboardingStatus.hasCompletedShopSync} />
          <OnboardingStepStatus label="VAT Settings Configuration" completed={onboardingStatus.hasCompletedVatSetup} />
          <OnboardingStepStatus label="Invoice Details Setup" completed={onboardingStatus.hasCompletedInvoiceSetup} />
        </ul>
      </div>

      {!onboardingStatus.hasConfiguredBolApi && <BolApiForm />}
      {onboardingStatus.hasConfiguredBolApi && !onboardingStatus.hasCompletedShopSync && <ShopSync />}
      {onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && !onboardingStatus.hasCompletedVatSetup && <VatSetup />}
      {onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && onboardingStatus.hasCompletedVatSetup && !onboardingStatus.hasCompletedInvoiceSetup && <InvoiceSettingsForm />}

    </div>
  );
};

export default function OnboardingPage() {
  return (
    <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Onboarding">
      <OnboardingProvider>
        <div className="max-w-4xl mx-auto px-4 py-10"> {/* Centered and constrained width */}
          <OnboardingContent />
        </div>
      </OnboardingProvider>
    </Layout>
  );
}
