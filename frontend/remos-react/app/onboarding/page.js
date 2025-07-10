'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext'; 

// Import actual components that will be re-created
import BolApiForm from '@/components/onboarding/BolApiForm';
import ShopSync from '@/components/onboarding/ShopSync';
import VatSetup from '@/components/onboarding/VatSetup';
import InvoiceSettingsForm from '@/components/onboarding/InvoiceSettingsForm';

const OnboardingStepStatus = ({ label, completed }) => (
  <li className={`flex items-center space-x-2 ${completed ? 'text-green-600' : 'text-gray-600'}`}>
    {completed ? (
      <svg style={{ width: '150px', height: '150px' }} className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
    ) : (
      <svg style={{ width: '150px', height: '150px' }} className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
    )}
    <span>{label}: <strong>{completed ? 'Done' : 'Pending'}</strong></span>
  </li>
);

// This component will hold the actual onboarding steps logic
const OnboardingSteps = () => {
  const { onboardingStatus, isLoading, error, markStepAsComplete } = useOnboarding();
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  // Define the sequence of onboarding steps
  const onboardingFlowSteps = React.useMemo(() => [
    { key: 'hasConfiguredBolApi', title: 'Connect Bol.com Account', Component: BolApiForm },
    { key: 'hasCompletedShopSync', title: 'Initial Shop Synchronization', Component: ShopSync },
    { key: 'hasCompletedVatSetup', title: 'VAT Configuration', Component: VatSetup },
    { key: 'hasCompletedInvoiceSetup', title: 'Invoice Details Setup', Component: InvoiceSettingsForm },
  ], []);

  React.useEffect(() => {
    if (onboardingStatus) {
      const firstIncompleteStep = onboardingFlowSteps.findIndex(step => !onboardingStatus[step.key]);
      setCurrentStepIndex(firstIncompleteStep !== -1 ? firstIncompleteStep : onboardingFlowSteps.length); // Go to "completed" state if all done
    }
  }, [onboardingStatus, onboardingFlowSteps]);

  if (isLoading) {
    return <div className="text-center py-10"><div className="text-lg">Loading onboarding data...</div></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600"><div className="text-lg font-semibold">Error loading onboarding data:</div><p>{error}</p></div>;
  }

  const allStepsComplete = currentStepIndex >= onboardingFlowSteps.length;

  if (allStepsComplete) {
    return (
      <div className="p-6 bg-green-50 border border-green-400 text-green-700 rounded-md shadow-lg text-center wg-box">
        <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
        <h2 className="text-2xl font-semibold mb-3">Onboarding Complete!</h2>
        <p>Congratulations, you have completed all the onboarding steps. Your account is fully configured.</p>
      </div>
    );
  }

  const ActiveStepComponent = onboardingFlowSteps[currentStepIndex]?.Component;
  // const activeStepKey = onboardingFlowSteps[currentStepIndex]?.key; // No longer needed for parent "Next" button logic

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Stepper UI (simplified)
  const StepperUI = () => (
    <div className="mb-8 p-4 border rounded-lg wg-box">
      <h3 className="text-lg font-semibold mb-3">Onboarding Progress</h3>
      <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
        {onboardingFlowSteps.map((step, index) => (
          <li key={step.key} className={`flex items-center space-x-2.5 rtl:space-x-reverse ${index === currentStepIndex ? 'text-blue-600 dark:text-blue-500' : (onboardingStatus[step.key] ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400')}`}>
            <span className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 ${index === currentStepIndex ? 'border-blue-600 dark:border-blue-500' : (onboardingStatus[step.key] ? 'border-green-600 dark:border-green-500' : 'border-gray-500 dark:border-gray-400')}`}>
              {onboardingStatus[step.key] && index < currentStepIndex ? '✓' : index + 1}
            </span>
            <span>
              <h3 className="font-medium leading-tight">{step.title}</h3>
              <p className="text-sm">{index === currentStepIndex ? 'Current Step' : (onboardingStatus[step.key] ? 'Completed' : 'Pending')}</p>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome! Let's get you set up.</h1>
        <p className="text-gray-600 mt-2">Follow the steps below to configure your account.</p>
      </div>

      <StepperUI />

      {/* Render the active step component */}
      {ActiveStepComponent && (
        <div className="wg-box p-6 rounded-lg shadow-md">
          {/* Pass navigation handlers to step components if they need to trigger navigation directly */}
          {/* For now, VatSetup has its own internal completion button */}
          <ActiveStepComponent
            onComplete={() => { // A generic onComplete prop
                // This ensures status is updated before trying to navigate.
                // Child component calls markStepAsComplete, then this onComplete.
                if (currentStepIndex < onboardingFlowSteps.length - 1) {
                    setCurrentStepIndex(currentStepIndex + 1);
                } else {
                    setCurrentStepIndex(onboardingFlowSteps.length); // All steps done
                }
            }}
          />
        </div>
      )}

      {/* Navigation Buttons, shown if not all steps are complete */}
      {!allStepsComplete && ActiveStepComponent && (
        <div className="flex justify-start mt-8"> {/* Changed to justify-start as "Next" is removed */}
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="tf-button style-1 disabled:opacity-50" // Assuming style-1 is for secondary/previous
          >
            Previous
          </button>
          {/* "Next" button removed from parent. Child components' primary actions will trigger onComplete. */}
        </div>
      )}
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

  // If authenticated, render the OnboardingProvider and its content
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
