'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { callApi } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useOnboarding } from '@/contexts/OnboardingContext';

const TABS = [
  { key: 'general', label: 'General' },
  { key: 'security', label: 'Security' },
  { key: 'couplingBol', label: 'Coupling Bol' },
  { key: 'productsVat', label: 'Products & VAT' },
  { key: 'invoice', label: 'Invoice Settings' },
];

function SectionWrapper({ title, children }) {
    return (
    <div className="wg-box mb-8">
                        <div className="left">
        <h5 className="mb-4">{title}</h5>
                        </div>
      <div className="right flex-grow">{children}</div>
                            </div>
  );
}

function GeneralSection() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(''); 
    setError('');
    try {
      await callApi('/settings/settings/general', 'POST', form);
      setSuccess('General settings saved!');
    } catch (err) {
      setError('Failed to save general settings.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  return (
    <form onSubmit={handleSubmit} className="form-setting form-style-2">
      <h6 className="mb-2">Personal Information</h6>
      <div className="flex gap-4 mb-4">
        <input name="firstname" value={form?.firstname || ''} onChange={handleChange} placeholder="First Name" required className="flex-grow" />
        <input name="surname" value={form?.surname || ''} onChange={handleChange} placeholder="Surname" required className="flex-grow" />
                                </div>
      <div className="flex gap-4 mb-4">
        <input name="address" value={form?.address || ''} onChange={handleChange} placeholder="Address" required className="flex-grow" />
        <input name="postcode" value={form?.postcode || ''} onChange={handleChange} placeholder="Postcode" required className="flex-grow" />
        <input name="city" value={form?.city || ''} onChange={handleChange} placeholder="City" required className="flex-grow" />
                            </div>
      <div className="flex gap-4 mb-4">
        <input name="accountEmail" value={form?.accountEmail || ''} onChange={handleChange} placeholder="Account Email" required className="flex-grow" />
        <input name="phoneNumber" value={form?.phoneNumber || ''} onChange={handleChange} placeholder="Phone Number" className="flex-grow" />
                            </div>
      <h6 className="mb-2 mt-6">Company Details</h6>
      <div className="flex gap-4 mb-4">
        <input name="companyName" value={form?.companyName || ''} onChange={handleChange} placeholder="Company Name" required className="flex-grow" />
        <input name="companyAddress" value={form?.companyAddress || ''} onChange={handleChange} placeholder="Company Address" required className="flex-grow" />
                        </div>
      <div className="flex gap-4 mb-4">
        <input name="companyPostcode" value={form?.companyPostcode || ''} onChange={handleChange} placeholder="Company Postcode" required className="flex-grow" />
        <input name="companyCity" value={form?.companyCity || ''} onChange={handleChange} placeholder="Company City" required className="flex-grow" />
                    </div>
      <div className="flex gap-4 mb-4">
        <input name="customerEmail" value={form?.customerEmail || ''} onChange={handleChange} placeholder="Customer Email" required className="flex-grow" />
        <input name="companyPhoneNumber" value={form?.companyPhoneNumber || ''} onChange={handleChange} placeholder="Company Phone Number" className="flex-grow" />
                        </div>
      <h6 className="mb-2 mt-6">Additional Company Details</h6>
      <div className="flex gap-4 mb-4">
        <input name="chamberOfCommerce" value={form?.chamberOfCommerce || ''} onChange={handleChange} placeholder="Chamber of Commerce" required className="flex-grow" />
        <input name="vatNumber" value={form?.vatNumber || ''} onChange={handleChange} placeholder="VAT Number" required className="flex-grow" />
        <input name="iban" value={form?.iban || ''} onChange={handleChange} placeholder="IBAN" className="flex-grow" />
        <input name="optionalVatNumber" value={form?.optionalVatNumber || ''} onChange={handleChange} placeholder="Optional VAT Number" className="flex-grow" />
                            </div>
      <button type="submit" className="tf-button w180 m-auto">Save General</button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}

function SecuritySection() {
  // Password change is handled by Keycloak. Provide a button to redirect to Keycloak account page.
  const { keycloak } = useAuth();
  return (
    <div>
      <p className="mb-4">Password changes are managed securely via our authentication provider.</p>
      <button
        className="tf-button"
        onClick={() => keycloak && keycloak.accountManagement()}
      >
        Change Password
      </button>
                                </div>
  );
}

function CouplingBolSection() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(''); 
    setError('');
    try {
      await callApi('/settings/settings/coupling-bol', 'POST', form);
      setSuccess('Coupling Bol settings saved!');
    } catch (err) {
      setError('Failed to save Coupling Bol settings.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  return (
    <form onSubmit={handleSubmit} className="form-setting form-style-2">
      <div className="flex gap-4 mb-4">
        <input name="salesNumber" value={form?.salesNumber || ''} onChange={handleChange} placeholder="Sales Number" required className="flex-grow" />
        <input name="status" value={form?.status || ''} onChange={handleChange} placeholder="Status" required className="flex-grow" />
                                </div>
      <div className="flex gap-4 mb-4">
        <input name="bolClientId" value={form?.bolClientId || ''} onChange={handleChange} placeholder="Bol.com Client ID" className="flex-grow" />
        <input name="bolClientSecret" value={form?.bolClientSecret || ''} onChange={handleChange} placeholder="Bol.com Client Secret" className="flex-grow" />
                                    </div>
      <div className="flex gap-4 mb-4">
        <textarea name="apiCredentials" value={form?.apiCredentials ? JSON.stringify(form.apiCredentials) : ''} onChange={e => setForm(f => ({ ...f, apiCredentials: e.target.value }))} placeholder="API Credentials (JSON)" className="flex-grow" />
                                    </div>
      <button type="submit" className="tf-button w180 m-auto">Save Coupling Bol</button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}

function ProductsVatSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit] = useState(10);
  const [showVatPopup, setShowVatPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVatRate, setSelectedVatRate] = useState('');

  // VAT rates by country (EU countries)
  const vatRates = {
    'Netherlands': [21, 9, 0],
    'Belgium': [21, 12, 6, 0],
    'Germany': [19, 7, 0],
    'France': [20, 10, 5.5, 2.1, 0],
    'Italy': [22, 10, 5, 0],
    'Spain': [21, 10, 4, 0],
    'Poland': [23, 8, 5, 0],
    'Romania': [19, 9, 5, 0],
    'Czech Republic': [21, 15, 10, 0],
    'Greece': [24, 13, 6, 0],
    'Hungary': [27, 18, 5, 0],
    'Portugal': [23, 13, 6, 0],
    'Sweden': [25, 12, 6, 0],
    'Austria': [20, 13, 10, 0],
    'Bulgaria': [20, 9, 0],
    'Croatia': [25, 13, 5, 0],
    'Denmark': [25, 0],
    'Estonia': [20, 9, 0],
    'Finland': [24, 14, 10, 0],
    'Ireland': [23, 13.5, 9, 4.8, 0],
    'Latvia': [21, 12, 5, 0],
    'Lithuania': [21, 9, 5, 0],
    'Luxembourg': [17, 14, 8, 3, 0],
    'Malta': [18, 7, 5, 0],
    'Slovakia': [20, 10, 0],
    'Slovenia': [22, 9.5, 0],
    'Cyprus': [19, 9, 5, 0]
  };

  const countries = Object.keys(vatRates);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const response = await callApi(`/shop/api/shop/products?page=${currentPage}&limit=${limit}`, 'GET');
      setProducts(response.products || []);
      setTotalPages(Math.ceil(response.total / limit));
      setTotalProducts(response.total);
    } catch (err) {
      setProducts([]);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }

  function openVatPopup(product) {
    console.log('Opening VAT popup for product:', product);
    setSelectedProduct(product);
    setSelectedCountry('');
    setSelectedVatRate('');
    setShowVatPopup(true);
    console.log('showVatPopup set to true');
  }

  function closeVatPopup() {
    setShowVatPopup(false);
    setSelectedProduct(null);
    setSelectedCountry('');
    setSelectedVatRate('');
  }

  async function handleVatUpdate() {
    if (!selectedCountry || !selectedVatRate) {
      setError('Please select both country and VAT rate.');
      return;
    }

    setSuccess(''); 
    setError('');
    try {
      await callApi(`/shop/api/shop/products/${selectedProduct.ean}/vat`, 'PUT', { 
        vatRate: Number(selectedVatRate),
        country: selectedCountry 
      });
      setProducts(ps => ps.map(p => 
        p.ean === selectedProduct.ean 
          ? { ...p, vatRate: Number(selectedVatRate), country: selectedCountry } 
          : p
      ));
      setSuccess('VAT rate updated!');
      closeVatPopup();
    } catch (err) {
      setError('Failed to update VAT rate.');
    }
  }

  function handleCountryChange(country) {
    setSelectedCountry(country);
    setSelectedVatRate(''); // Reset VAT rate when country changes
  }

  if (loading) return <div>Loading...</div>;

  console.log('ProductsVatSection render - showVatPopup:', showVatPopup, 'selectedProduct:', selectedProduct);

  return (
    <div>
      <div className="mb-4">
        <h6 className="mb-2">Product VAT Settings</h6>
        <p className="text-sm text-gray-600 mb-4">
          Total Products: {totalProducts} | Page {currentPage} of {totalPages}
        </p>
                                </div>

      <table className="table-auto w-full mb-4">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">EAN</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Current VAT Rate (%)</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.ean} className="border-b">
              <td className="px-4 py-2">{product.ean}</td>
              <td className="px-4 py-2">{product.title}</td>
              <td className="px-4 py-2">
                {product.vatRate ? `${product.vatRate}%` : 'Not set'}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => openVatPopup(product)}
                  className="tf-button tf-button-sm"
                >
                  Edit VAT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="tf-button tf-button-sm"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`tf-button tf-button-sm ${currentPage === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="tf-button tf-button-sm"
          >
            Next
          </button>
                            </div>
      )}

      {/* VAT Popup */}
      {showVatPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl"
            style={{ maxWidth: '500px', zIndex: 1000 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Set VAT Rate for {selectedProduct?.title}
              </h3>
              <button 
                onClick={closeVatPopup}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
                        </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Country:</label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
                    </div>

            {selectedCountry && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">VAT Rate (%):</label>
                <select
                  value={selectedVatRate}
                  onChange={(e) => setSelectedVatRate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select VAT Rate</option>
                  {vatRates[selectedCountry].map(rate => (
                    <option key={rate} value={rate}>
                      {rate}% {rate === 0 ? '(Zero-rated)' : ''}
                    </option>
                  ))}
                </select>
                        </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeVatPopup}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVatUpdate}
                disabled={!selectedCountry || !selectedVatRate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Update VAT
              </button>
                            </div>
                        </div>
                    </div>
      )}

      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
                        </div>
  );
}

function InvoiceSettingsSection() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(''); 
    setError('');
    try {
      await callApi('/settings/settings/invoice', 'POST', form);
      setSuccess('Invoice settings saved!');
    } catch (err) {
      setError('Failed to save invoice settings.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  return (
    <form onSubmit={handleSubmit} className="form-setting form-style-2">
      <div className="flex gap-4 mb-4">
        <input name="invoicePrefix" value={form?.invoicePrefix || ''} onChange={handleChange} placeholder="Prefix (e.g., BOL-{year}-)" required className="flex-grow" />
        <input name="startNumber" value={form?.startNumber || ''} onChange={handleChange} placeholder="Start Number (e.g., 0001)" required className="flex-grow" />
        <select name="fileNameBase" value={form?.fileNameBase || ''} onChange={handleChange} required className="flex-grow">
          <option value="">Select File Name Base</option>
          <option value="invoice_number">Invoice Number</option>
          <option value="order_number">Order Number</option>
                                    </select>
                                </div>
      <button type="submit" className="tf-button w180 m-auto">Save Invoice Settings</button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}

export default function Setting() {
  const { authenticated, isLoading: authIsLoading, login } = useAuth();
  const { onboardingStatus, isLoading: onboardingIsLoading } = useOnboarding();
  const [tab, setTab] = useState('general');

  if (authIsLoading || onboardingIsLoading) {
    return (
      <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Settings">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="text-lg">Checking authentication status...</div>
                        </div>
      </Layout>
    );
  }

  if (!authenticated) {
    return (
      <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Settings">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center wg-box">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the settings page.</p>
          <button onClick={() => login()} className="tf-button">
            Login
          </button>
                    </div>
      </Layout>
    );
  }

  // Check if onboarding is complete (VAT is optional, so exclude it from the check)
  const isOnboardingComplete = onboardingStatus && 
    onboardingStatus.hasConfiguredBolApi === true && 
    onboardingStatus.hasCompletedShopSync === true && 
    onboardingStatus.hasCompletedInvoiceSetup === true;

  if (!isOnboardingComplete) {
    return (
      <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Settings">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center wg-box">
          <h2 className="text-2xl font-semibold mb-4">Complete Onboarding First</h2>
          <p className="text-gray-600 mb-6">You must finish onboarding before accessing settings.</p>
          <a href="/onboarding" className="tf-button">Go to Onboarding</a>
                        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Settings">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex gap-4 mb-8 border-b pb-2">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`tf-button ${tab === t.key ? 'style-1' : ''}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
            </button>
          ))}
                                    </div>
        {tab === 'general' && <SectionWrapper title="General"><GeneralSection /></SectionWrapper>}
        {tab === 'security' && <SectionWrapper title="Security"><SecuritySection /></SectionWrapper>}
        {tab === 'couplingBol' && <SectionWrapper title="Coupling Bol"><CouplingBolSection /></SectionWrapper>}
        {tab === 'productsVat' && <SectionWrapper title="Products & VAT"><ProductsVatSection /></SectionWrapper>}
        {tab === 'invoice' && <SectionWrapper title="Invoice Settings"><InvoiceSettingsSection /></SectionWrapper>}
                    </div>
            </Layout>
  );
}