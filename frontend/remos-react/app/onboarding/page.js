'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import ProgressBar from '@/components/onboarding/progress-bar';
import BolApiForm from '@/components/onboarding/BolApiForm';
import ShopSync from '@/components/onboarding/ShopSync';
import VatSetup from '@/components/onboarding/VatSetup';
import InvoiceSettingsForm from '@/components/onboarding/InvoiceSettingsForm';

// Define steps for the ProgressBar
const steps = [
  { id: 1, title: "Connect Bol.com", description: "Link your Bol.com account" },
  { id: 2, title: "Shop Sync", description: "Synchronize your shop data" },
  { id: 3, title: "VAT Setup", description: "Configure VAT settings" },
  { id: 4, title: "Invoice Setup", description: "Set up invoice details" },
  { id: 5, title: "Complete", description: "All done!" },
];

// Component to render the appropriate form based on current step
const OnboardingStepContent = ({ currentStep }) => {
  const { onboardingStatus } = useOnboarding();

  if (currentStep === 1 && !onboardingStatus.hasConfiguredBolApi) {
    return <BolApiForm />;
  }
  if (currentStep === 2 && onboardingStatus.hasConfiguredBolApi && !onboardingStatus.hasCompletedShopSync) {
    return <ShopSync />;
  }
  if (
    currentStep === 3 &&
    onboardingStatus.hasConfiguredBolApi &&
    onboardingStatus.hasCompletedShopSync &&
    !onboardingStatus.hasCompletedVatSetup
  ) {
    return <VatSetup />;
  }
  if (
    currentStep === 4 &&
    onboardingStatus.hasConfiguredBolApi &&
    onboardingStatus.hasCompletedShopSync &&
    onboardingStatus.hasCompletedVatSetup &&
    !onboardingStatus.hasCompletedInvoiceSetup
  ) {
    return <InvoiceSettingsForm />;
  }
  if (currentStep === 5) {
    return (
      <div className="text-center">
        <svg
        style={{ width: '150px', height: '150px' }}
          className="w-16 h-16 mx-auto mb-4 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          ></path>
        </svg>
        <h3 className="text-lg font-semibold mb-3">Onboarding Complete!</h3>
        <p>Congratulations, you have completed all the onboarding steps. Your account is fully configured.</p>
      </div>
    );
  }
  return null;
};

// Component to handle onboarding steps with ProgressBar
const OnboardingSteps = () => {
  const { onboardingStatus, isLoading, error } = useOnboarding();
  console.log(onboardingStatus.hasCompletedShopSync)
  // Calculate current step based on onboarding status
  const getCurrentStep = () => {
    if (!onboardingStatus.hasConfiguredBolApi) return 1;
    if (!onboardingStatus.hasCompletedShopSync) return 2;
    if (!onboardingStatus.hasCompletedVatSetup) return 3;
    if (!onboardingStatus.hasCompletedInvoiceSetup) return 4;
    return 5;
  };

  const currentStep = getCurrentStep();

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="text-lg">Loading onboarding data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <div className="text-lg font-semibold">Error loading onboarding data:</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800">Welcome! Let's get you set up.</h3>
        <p className="text-gray-600 mt-2">Follow the steps below to configure your account.</p>
      </div>
      <ProgressBar currentStep={currentStep} steps={steps}>
        <OnboardingStepContent currentStep={currentStep} />
      </ProgressBar>
    </div>
  );
};

export default function OnboardingPage() {
  const { authenticated, isLoading: authIsLoading, login } = useAuth();

  if (authIsLoading) {
    return (
      <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Onboarding">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="text-lg">Checking authentication status...</div>
        </div>
      </Layout>
    );
  }

  if (!authenticated) {
    return (
      <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Onboarding">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center wg-box">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the onboarding process.</p>
          <button onClick={() => login()} className="tf-button">
            Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Onboarding">
      <OnboardingProvider>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <OnboardingSteps />
        </div>
      </OnboardingProvider>
    </Layout>
  );
}