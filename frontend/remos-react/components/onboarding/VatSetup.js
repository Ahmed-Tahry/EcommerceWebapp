'use client';

import React, { useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function VatSetup() {
  const { markStepAsComplete, onboardingStatus } = useOnboarding();

  useEffect(() => {
    // This step is informational, so mark it as complete immediately if it's not already
    if (!onboardingStatus.hasCompletedVatSetup) {
      markStepAsComplete('hasCompletedVatSetup');
    }
  }, [markStepAsComplete, onboardingStatus]);

  return (
    <div className="wg-box p-6">
      <h2 className="text-xl font-semibold mb-4">VAT Setup</h2>
      <p className="mb-4">
        VAT configuration is now managed in the <b>Settings &gt; Products &amp; VAT</b> section.<br/>
        Please go to the settings page to set VAT rates for your products by country.
      </p>
      <p className="text-gray-600">
        You can always update VAT rates for your products later in the settings section.
      </p>
    </div>
  );
}
