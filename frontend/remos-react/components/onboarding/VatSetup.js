'use client';

import React from 'react';

export default function VatSetup() {
  return (
    <div className="wg-box p-6">
      <h2 className="text-xl font-semibold mb-4">VAT Setup</h2>
      <p className="mb-4">
        VAT configuration is now managed in the <b>Settings &gt; Products & VAT</b> section.<br/>
        Please go to the settings page to set VAT rates for your products by country.
      </p>
      <p className="text-gray-600">
        You can always update VAT rates for your products later in the settings section.
      </p>
    </div>
  );
}
