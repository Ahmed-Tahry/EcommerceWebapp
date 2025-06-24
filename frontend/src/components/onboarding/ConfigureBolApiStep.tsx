import React, { useState, FormEvent } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext'; // Adjust path as needed
import { saveAccountSettings, updateOnboardingStep } from '../../services/apiService'; // Adjust path

const ConfigureBolApiStep: React.FC = () => {
  const [bolClientId, setBolClientId] = useState<string>('');
  const [bolClientSecret, setBolClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { status: onboardingStatus, fetchStatus: fetchOnboardingStatus } = useOnboarding();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!bolClientId.trim() || !bolClientSecret.trim()) {
      setError('Both Client ID and Client Secret are required.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Save Bol.com API credentials
      await saveAccountSettings({ bolClientId, bolClientSecret });
      setSuccessMessage('Bol.com API credentials saved successfully!');

      // 2. Mark this onboarding step as complete
      await updateOnboardingStep({ hasConfiguredBolApi: true });

      // 3. Refresh overall onboarding status from context
      await fetchOnboardingStatus();

      // Optionally, clear form or redirect
      // setBolClientId('');
      // setBolClientSecret('');

    } catch (err: any) {
      console.error('Failed to save Bol API settings or update onboarding status:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (onboardingStatus?.hasConfiguredBolApi) {
    return (
      <div>
        <h2>Bol.com API Configuration</h2>
        <p style={{ color: 'green' }}>Bol.com API credentials have been configured.</p>
        <p>Client ID: {bolClientId || 'Not shown'}</p> {/* Display saved ID if fetched, or just a success message */}
        {/* Do NOT display the secret */}
        <button onClick={() => fetchOnboardingStatus()} disabled={isLoading}>Refresh Status</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Step 1: Configure Bol.com API Credentials</h2>
      <p>Please enter your Bol.com Retailer API Client ID and Client Secret.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bolClientId">Bol.com Client ID:</label>
          <input
            type="text"
            id="bolClientId"
            value={bolClientId}
            onChange={(e) => setBolClientId(e.target.value)}
            required
            style={{ marginLeft: '5px', marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="bolClientSecret">Bol.com Client Secret:</label>
          <input
            type="password" // Use password type for secrets
            id="bolClientSecret"
            value={bolClientSecret}
            onChange={(e) => setBolClientSecret(e.target.value)}
            required
            style={{ marginLeft: '5px', marginBottom: '10px', width: '300px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Credentials'}
        </button>
      </form>
    </div>
  );
};

export default ConfigureBolApiStep;
