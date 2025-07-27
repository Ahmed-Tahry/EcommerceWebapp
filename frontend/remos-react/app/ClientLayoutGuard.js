'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useMemo, useRef, useEffect } from 'react';

export function ClientLayoutGuard({ children }) {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
    const { authenticated, isLoading: authIsLoading } = useAuth();
    const { onboardingStatus, isLoading: onboardingIsLoading } = useOnboarding();
    
    // Memoize the previous state to detect changes
    const prevStateRef = useRef({ authenticated, authIsLoading, onboardingStatus, onboardingIsLoading });
    
    // Only log when state actually changes
    useEffect(() => {
        const currentState = { authenticated, authIsLoading, onboardingStatus, onboardingIsLoading };
        const prevState = prevStateRef.current;
        
        const hasChanged = JSON.stringify(currentState) !== JSON.stringify(prevState);
        if (hasChanged) {
            console.log('ClientLayoutGuard state changed:', {
                pathname,
                authenticated,
                authIsLoading,
                onboardingStatus,
                onboardingIsLoading
            });
            prevStateRef.current = currentState;
        }
    }, [pathname, authenticated, authIsLoading, onboardingStatus, onboardingIsLoading]);

    // Memoize the onboarding completion check to prevent unnecessary recalculations
    const isOnboardingComplete = useMemo(() => {
        return onboardingStatus && 
            onboardingStatus.hasConfiguredBolApi === true && 
            onboardingStatus.hasCompletedShopSync === true && 
            onboardingStatus.hasCompletedInvoiceSetup === true;
    }, [onboardingStatus]);

    // Always allow home
    if (pathname === '/') return children;

    // If not logged in, only allow home
    if (!authenticated && !authIsLoading) {
        if (pathname !== '/') {
            if (typeof window !== 'undefined') window.location.href = '/';
            return null;
        }
        return children;
    }

    // If logged in, allow onboarding
    if (pathname === '/onboarding') return children;

    // If logged in, allow settings only if onboarding is complete
    if (pathname === '/setting') {
        if (authIsLoading || onboardingIsLoading) {
            return <div>Loading...</div>;
        }
        
        if (!isOnboardingComplete) {
            return (
                <div className="max-w-4xl mx-auto px-4 py-10 text-center wg-box">
                    <h2 className="text-2xl font-semibold mb-4">Complete Onboarding First</h2>
                    <p className="text-gray-600 mb-6">You must finish onboarding before accessing settings.</p>
                    <a href="/onboarding" className="tf-button">Go to Onboarding</a>
                </div>
            );
        }
        return children;
    }

    // For any other route, redirect to home
    if (typeof window !== 'undefined') window.location.href = '/';
    return null;
} 