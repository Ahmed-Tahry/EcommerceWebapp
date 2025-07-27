'use client';
import Layout from "@/components/layout/Layout"
import BestShopSellers1 from "@/components/sections/BestShopSellers1"
import ChartDefault1 from "@/components/sections/ChartDefault1"
import Earnings1 from "@/components/sections/Earnings1"
import NewComment1 from "@/components/sections/NewComment1"
import Orders1 from "@/components/sections/Orders1"
import ProductOverview1 from "@/components/sections/ProductOverview1"
import RecentOrder1 from "@/components/sections/RecentOrder1"
import TopCountries1 from "@/components/sections/TopCountries1"
import TopProduct1 from "@/components/sections/TopProduct1"
import { useEffect, useState } from "react";
import { callApi } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePageWrapper() {
    const { authenticated, login, isLoading: authIsLoading } = useAuth();
    const [showVatReminder, setShowVatReminder] = useState(false);
    
    useEffect(() => {
        if (!authenticated) return;
        
        async function checkVat() {
            try {
                const onboarding = await callApi('/settings/settings/onboarding/status', 'GET');
                if (
                    onboarding.hasConfiguredBolApi &&
                    onboarding.hasCompletedShopSync &&
                    onboarding.hasCompletedVatSetup &&
                    onboarding.hasCompletedInvoiceSetup
                ) {
                    // Only check VAT if onboarding is complete
                    const productsResp = await callApi('/shop/api/shop/products?limit=10', 'GET');
                    if (productsResp && Array.isArray(productsResp.products)) {
                        const needsVat = productsResp.products.some(p => p.vatRate === null || p.vatRate === undefined);
                        setShowVatReminder(needsVat);
                    }
                }
            } catch (e) {
                // Ignore errors for banner
            }
        }
        checkVat();
    }, [authenticated]);

    if (authIsLoading) {
        return (
            <Layout>
                <div className="text-center py-10">
                    <div className="text-lg">Loading...</div>
                </div>
            </Layout>
        );
    }

    if (!authenticated) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-10 text-center">
                    <div className="wg-box">
                        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            Please log in to access your account and manage your settings.
                        </p>
                        <button onClick={login} className="tf-button">
                            Login to Continue
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <Layout>
                {showVatReminder && (
                    <div className="p-4 mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
                        <b>Reminder:</b> Some of your products do not have VAT rates configured. Please go to <b>Settings &gt; VAT</b> to complete your VAT setup.
                    </div>
                )}
                <div className="tf-section-4 mb-30">
                    <ChartDefault1 />
                </div>
                <div className="tf-section-5 mb-30">
                    <RecentOrder1 />
                    <TopProduct1 />
                    <TopCountries1 />
                </div>
                <div className="tf-section-6 mb-30">
                    <BestShopSellers1 />
                    <ProductOverview1 />
                </div>
                <div className="tf-section-3">
                    <Orders1 />
                    <Earnings1 />
                    <NewComment1 />
                </div>
            </Layout>
        </>
    )
}