'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { callApi } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useOnboarding } from '@/contexts/OnboardingContext';

// Add CSS for the fadeIn animation
const fadeInKeyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

// Inject the CSS globally
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = fadeInKeyframes;
  document.head.appendChild(style);
}

const TABS = [
  { key: 'general', label: 'General', icon: 'icon-settings' },
  { key: 'security', label: 'Security', icon: 'icon-lock' },
  { key: 'couplingBol', label: 'Coupling Bol', icon: 'icon-link' },
  { key: 'productsVat', label: 'Products & VAT', icon: 'icon-box' },
  { key: 'invoice', label: 'Invoice Settings', icon: 'icon-file-text' },
];

function SectionWrapper({ title, children }) {
  return (
    <div className="settings-section">
      <h5 className="text-xl font-semibold text-gray-800 mb-4">{title}</h5>
      <div>{children}</div>
    </div>
  );
}

function GeneralSection() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await callApi('/settings/settings/general', 'GET');
        setForm(data || {});
      } catch (err) {
        setError('Failed to load general settings.');
      }
    }
    fetchSettings();
  }, []);

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

  if (loading) return <div className="wg-box flex justify-center items-center p-10"><div className="spinner"></div></div>;
  return (
    <form onSubmit={handleSubmit} className="form-style-2">
      <div className="wg-box mb-24">
        <h6 className="mb-6 text-lg font-medium text-gray-700">Personal Information</h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="firstname">First Name</label>
            <input
              id="firstname"
              name="firstname"
              value={form?.firstname || ''}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="form-control"
            />
            
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              name="surname"
              value={form?.surname || ''}
              onChange={handleChange}
              placeholder="Surname"
              required
              className="form-control"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={form?.address || ''}
              onChange={handleChange}
              placeholder="Address"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="postcode">Postcode</label>
            <input
              id="postcode"
              name="postcode"
              value={form?.postcode || ''}
              onChange={handleChange}
              placeholder="Postcode"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              value={form?.city || ''}
              onChange={handleChange}
              placeholder="City"
              required
              className="form-control"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="accountEmail">Account Email</label>
            <input
              id="accountEmail"
              name="accountEmail"
              type="email"
              value={form?.accountEmail || ''}
              onChange={handleChange}
              placeholder="Account Email"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              value={form?.phoneNumber || ''}
              onChange={handleChange}
              placeholder="Phone Number"
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="wg-box mb-24">
        <h6 className="mb-6 text-lg font-medium text-gray-700">Company Details</h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              name="companyName"
              value={form?.companyName || ''}
              onChange={handleChange}
              placeholder="Company Name"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyAddress">Company Address</label>
            <input
              id="companyAddress"
              name="companyAddress"
              value={form?.companyAddress || ''}
              onChange={handleChange}
              placeholder="Company Address"
              required
              className="form-control"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="companyPostcode">Company Postcode</label>
            <input
              id="companyPostcode"
              name="companyPostcode"
              value={form?.companyPostcode || ''}
              onChange={handleChange}
              placeholder="Company Postcode"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyCity">Company City</label>
            <input
              id="companyCity"
              name="companyCity"
              value={form?.companyCity || ''}
              onChange={handleChange}
              placeholder="Company City"
              required
              className="form-control"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="customerEmail">Customer Email</label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={form?.customerEmail || ''}
              onChange={handleChange}
              placeholder="Customer Email"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyPhoneNumber">Company Phone Number</label>
            <input
              id="companyPhoneNumber"
              name="companyPhoneNumber"
              value={form?.companyPhoneNumber || ''}
              onChange={handleChange}
              placeholder="Company Phone Number"
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="wg-box">
        <h6 className="mb-6 text-lg font-medium text-gray-700">Additional Company Details</h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="chamberOfCommerce">Chamber of Commerce</label>
            <input
              id="chamberOfCommerce"
              name="chamberOfCommerce"
              value={form?.chamberOfCommerce || ''}
              onChange={handleChange}
              placeholder="Chamber of Commerce"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="vatNumber">VAT Number</label>
            <input
              id="vatNumber"
              name="vatNumber"
              value={form?.vatNumber || ''}
              onChange={handleChange}
              placeholder="VAT Number"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="iban">IBAN</label>
            <input
              id="iban"
              name="iban"
              value={form?.iban || ''}
              onChange={handleChange}
              placeholder="IBAN"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="optionalVatNumber">Optional VAT Number</label>
            <input
              id="optionalVatNumber"
              name="optionalVatNumber"
              value={form?.optionalVatNumber || ''}
              onChange={handleChange}
              placeholder="Optional VAT Number"
              className="form-control"
            />
          </div>
        </div>
        <div className="action-bar">
          <button type="submit" className="tf-button">Save General Settings</button>
        </div>
        {success && <div className="alert alert-success">{success} <button onClick={() => setSuccess('')} className="close-btn">&times;</button></div>}
        {error && <div className="alert alert-error">{error} <button onClick={() => setError('')} className="close-btn">&times;</button></div>}
      </div>
    </form>
  );
}

function SecuritySection() {
  // Password change is handled by Keycloak. Provide a button to redirect to Keycloak account page.
  const { keycloak } = useAuth();
  return (
    <div className="wg-box">
      <p className="mb-6 text-gray-600">Password changes are managed securely via our authentication provider.</p>
      <div className="flex justify-center">
        <button
          className="tf-button px-6 py-3 rounded-lg font-medium"
          onClick={() => keycloak && keycloak.accountManagement()}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

function CouplingBolSection() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await callApi('/settings/settings/coupling-bol', 'GET');
        setForm(data || {});
      } catch (err) {
        setError('Failed to load Coupling Bol settings.');
      }
    }
    fetchSettings();
  }, []);

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
      setSuccess('Bol.com credentials saved!');
    } catch (err) {
      setError('Failed to save Bol.com credentials.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="wg-box flex justify-center items-center p-10"><div className="spinner"></div></div>;
  return (
    <form onSubmit={handleSubmit} className="form-style-2">
      <div className="wg-box mb-24">
        <h6 className="mb-6 text-lg font-medium text-gray-700">Bol.com API Credentials</h6>
        <p className="text-gray-600 mb-6">Update your Bol.com API credentials for this shop.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="bolClientId" className="form-label block text-sm font-medium text-gray-700 mb-2">Client ID</label>
            <input
              id="bolClientId"
              name="bolClientId"
              value={form?.bolClientId || ''}
              onChange={handleChange}
              placeholder="Enter your Bol.com Client ID"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bolClientSecret" className="form-label block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
            <input
              id="bolClientSecret"
              name="bolClientSecret"
              value={form?.bolClientSecret || ''}
              onChange={handleChange}
              placeholder="Enter your Bol.com Client Secret"
              type="password"
              required
              className="form-control"
            />
          </div>
        </div>
        
        <div className="action-bar">
          <button type="submit" className="tf-button">Save Bol.com Credentials</button>
        </div>
        {success && <div className="alert alert-success">{success} <button onClick={() => setSuccess('')} className="close-btn">&times;</button></div>}
        {error && <div className="alert alert-error">{error} <button onClick={() => setError('')} className="close-btn">&times;</button></div>}
      </div>
    </form>
  );
}

function ProductsVatSection() {
  console.log('ProductsVatSection rendering');
  const componentId = React.useRef(Math.random()).current;
  console.log('ProductsVatSection component ID:', componentId);
  console.log('Setting up useEffect hooks');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vatRates, setVatRates] = useState([]); // All VAT rates for selected product
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVatRate, setSelectedVatRate] = useState('');
  const [vatLoading, setVatLoading] = useState(false);
  const [vatSuccess, setVatSuccess] = useState('');
  const [vatError, setVatError] = useState('');
  const [showVatSection, setShowVatSection] = useState(false);

  // VAT rates by country (EU countries)
  const vatRatesByCountry = {
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
  const countries = Object.keys(vatRatesByCountry);

  useEffect(() => {
    console.log('ProductsVatSection mounted or currentPage changed:', currentPage);
    fetchProducts();
    
    // Cleanup function to check if component is unmounted
    return () => {
      console.log('ProductsVatSection unmounting');
    };
  }, [currentPage]);

  useEffect(() => {
    console.log('showVatSection state changed:', showVatSection);
  }, [showVatSection]);

  async function fetchProducts() {
    console.log('Fetching products for page:', currentPage);
    setLoading(true);
    try {
      const response = await callApi(`/shop/api/shop/products?page=${currentPage}&limit=${limit}`, 'GET');
      console.log('Products API response:', response);
      setProducts(response.products || []);
      setTotalPages(Math.ceil(response.total / limit));
      setTotalProducts(response.total);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }

  async function selectProductForVat(product) {
    console.log('Selecting product for VAT editing:', product);
    setSelectedProduct(product);
    setShowVatSection(true);
    setSelectedCountry('');
    setSelectedVatRate('');
    setVatLoading(true);
    setVatSuccess('');
    setVatError('');
    try {
      const rates = await callApi(`/shop/api/shop/products/${product.ean}/vat`, 'GET');
      setVatRates(rates || []);
    } catch (error) {
      console.error('Error fetching VAT rates:', error);
      setVatRates([]);
    } finally {
      setVatLoading(false);
    }
  }

  async function handleVatUpdate() {
    if (!selectedCountry || !selectedVatRate) {
      setError('Please select both country and VAT rate.');
      return;
    }
    setSuccess('');
    setError('');
    setVatLoading(true);
    try {
      await callApi(`/shop/api/shop/products/${selectedProduct.ean}/vat`, 'PUT', {
        country: selectedCountry,
        vatRate: Number(selectedVatRate)
      });
      // Refresh VAT rates
      const rates = await callApi(`/shop/api/shop/products/${selectedProduct.ean}/vat`, 'GET');
      setVatRates(rates || []);
      setSuccess('VAT rate updated!');
      setSelectedCountry('');
      setSelectedVatRate('');
    } catch (err) {
      setError('Failed to update VAT rate.');
    } finally {
      setVatLoading(false);
    }
  }

  async function handleVatDelete(country) {
    setVatLoading(true);
    setSuccess('');
    setError('');
    try {
      await callApi(`/shop/api/shop/products/${selectedProduct.ean}/vat`, 'DELETE', { country });
      // Refresh VAT rates
      const rates = await callApi(`/shop/api/shop/products/${selectedProduct.ean}/vat`, 'GET');
      setVatRates(rates || []);
      setSuccess('VAT rate deleted!');
    } catch (err) {
      setError('Failed to delete VAT rate.');
    } finally {
      setVatLoading(false);
    }
  }

  function handleCountryChange(country) {
    setSelectedCountry(country);
    setSelectedVatRate('');
  }

  if (loading) return <div className="wg-box">Loading...</div>;

  return (
    <div>
      <div className="wg-box mb-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h6 className="text-lg font-medium text-gray-700 mb-0">Product VAT Settings</h6>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600 mb-0">
              Total Products: {totalProducts} | Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={() => setShowVatSection(!showVatSection)}
              className="tf-button style-2 small px-4 py-2 rounded"
            >
              Toggle VAT Section
            </button>
          </div>
        </div>

        <div className="wg-table table-1 mb-6">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 font-medium">EAN</th>
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.ean} className="border-b border-gray-200">
                  <td className="py-3 px-4">{product.ean}</td>
                  <td className="py-3 px-4">{product.title}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => selectProductForVat(product)}
                      className="tf-button style-2 small px-4 py-2 rounded"
                    >
                      Edit VAT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="tf-button style-2 small px-4 py-2 rounded"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`tf-button small px-4 py-2 rounded ${currentPage === pageNum ? 'style-1' : 'style-2'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="tf-button style-2 small px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* VAT Editing Section */}
      {showVatSection && (
        <div className="wg-box mb-24">
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-xl font-semibold text-gray-800">VAT Rates for {selectedProduct?.title}</h5>
            <button
              className="tf-button style-2 small px-4 py-2 rounded"
              onClick={() => setShowVatSection(false)}
            >
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Existing VAT rates */}
            <div className="wg-box">
              <h6 className="text-lg font-medium text-gray-700 mb-4">Existing VAT Rates</h6>
              {vatLoading ? (
                <div className="text-center py-4">Loading VAT rates...</div>
              ) : (
                <div className="wg-table table-2">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Country</th>
                        <th className="text-left py-3 px-4 font-medium">VAT Rate</th>
                        <th className="text-left py-3 px-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vatRates.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center py-4">No VAT rates set yet.</td>
                        </tr>
                      )}
                      {vatRates.map(rate => (
                        <tr key={rate.country} className="border-b border-gray-200">
                          <td className="py-3 px-4">{rate.country}</td>
                          <td className="py-3 px-4 font-medium">{rate.vatRate}%</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleVatDelete(rate.country)}
                              className="tf-button style-2 small px-4 py-2 rounded"
                              disabled={vatLoading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Add/Edit VAT rate */}
            <div className="wg-box">
              <h6 className="text-lg font-medium text-gray-700 mb-4">Add/Edit VAT Rate</h6>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="form-control w-full"
                    disabled={vatLoading}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                
                {selectedCountry && (
                  <div className="form-group">
                    <label className="form-label block text-sm font-medium text-gray-700 mb-2">VAT Rate (%)</label>
                    <select
                      value={selectedVatRate}
                      onChange={(e) => setSelectedVatRate(e.target.value)}
                      className="form-control w-full"
                      disabled={vatLoading}
                    >
                      <option value="">Select VAT Rate</option>
                      {vatRatesByCountry[selectedCountry].map(rate => (
                        <option key={rate} value={rate}>
                          {rate}% {rate === 0 ? '(Zero-rated)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedCountry('');
                    setSelectedVatRate('');
                  }}
                  className="tf-button style-2 px-6 py-3 rounded-lg font-medium"
                  disabled={vatLoading}
                >
                  Clear
                </button>
                <button
                  onClick={handleVatUpdate}
                  disabled={!selectedCountry || !selectedVatRate || vatLoading}
                  className="tf-button px-6 py-3 rounded-lg font-medium"
                >
                  {vatLoading ? 'Saving...' : 'Save VAT'}
                </button>
              </div>
              {vatSuccess && <div className="text-green-600 mt-4 text-center">{vatSuccess}</div>}
              {vatError && <div className="text-red-600 mt-4 text-center">{vatError}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceSettingsSection() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await callApi('/settings/settings/invoice', 'GET');
        setForm(data || {});
      } catch (err) {
        setError('Failed to load invoice settings.');
      }
    }
    fetchSettings();
  }, []);

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

  if (loading) return <div className="wg-box flex justify-center items-center p-10"><div className="spinner"></div></div>;
  return (
    <form onSubmit={handleSubmit} className="form-style-2">
      <div className="wg-box">
        <h6 className="mb-6 text-lg font-medium text-gray-700">Invoice Configuration</h6>
        <p className="text-gray-600 mb-6">Configure how your invoices are generated and numbered.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="invoicePrefix" className="form-label block text-sm font-medium text-gray-700 mb-2">Invoice Prefix</label>
            <input
              id="invoicePrefix"
              name="invoicePrefix"
              value={form?.invoicePrefix || ''}
              onChange={handleChange}
              placeholder="e.g., INV-2024-"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="startNumber" className="form-label block text-sm font-medium text-gray-700 mb-2">Start Number</label>
            <input
              id="startNumber"
              name="startNumber"
              value={form?.startNumber || ''}
              onChange={handleChange}
              placeholder="e.g., 0001"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fileNameBase" className="form-label block text-sm font-medium text-gray-700 mb-2">File Name Base</label>
            <select
              id="fileNameBase"
              name="fileNameBase"
              value={form?.fileNameBase || ''}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select File Name Base</option>
              <option value="invoice_number">Invoice Number</option>
              <option value="order_number">Order Number</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="defaultInvoiceNotes" className="form-label block text-sm font-medium text-gray-700 mb-2">Default Invoice Notes</label>
            <textarea
              id="defaultInvoiceNotes"
              name="defaultInvoiceNotes"
              value={form?.defaultInvoiceNotes || ''}
              onChange={handleChange}
              placeholder="Default notes to include on all invoices"
              className="form-control"
              rows="3"
            />
          </div>
        </div>
        
        <div className="action-bar">
          <button type="submit" className="tf-button">Save Invoice Settings</button>
        </div>
        {success && <div className="alert alert-success">{success} <button onClick={() => setSuccess('')} className="close-btn">&times;</button></div>}
        {error && <div className="alert alert-error">{error} <button onClick={() => setError('')} className="close-btn">&times;</button></div>}
      </div>
    </form>
  );
}

export default function Setting() {
  console.log('Setting component rendering');
  const { authenticated, isLoading: authIsLoading, login } = useAuth();
  const { onboardingStatus, isLoading: onboardingIsLoading } = useOnboarding();
  const [tab, setTab] = useState('general');

  if (authIsLoading || onboardingIsLoading) {
    return (
      <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Settings">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="wg-box">
            <div className="text-lg">Checking authentication status...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!authenticated) {
    return (
      <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Settings">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="wg-box">
            <h2 className="text-2xl font-semibold mb-15">Authentication Required</h2>
            <p className="text-gray-600 mb-20">Please log in to access the settings page.</p>
            <button onClick={() => login()} className="tf-button">
              Login
            </button>
          </div>
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
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="wg-box">
            <h2 className="text-2xl font-semibold mb-15">Complete Onboarding First</h2>
            <p className="text-gray-600 mb-20">You must finish onboarding before accessing settings.</p>
            <Link href="/onboarding" className="tf-button">
              Go to Onboarding
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbTitleParent="Account" breadcrumbTitle="Settings">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="wg-box mb-30">
          <div className="flex flex-wrap gap-3 mb-0">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`tf-button ${tab === t.key ? 'style-1' : 'style-2'} px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md`}
                onClick={() => setTab(t.key)}
                type="button"
                aria-label={`Open ${t.label} settings`}
              >
                <i className={t.icon}></i>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="accordion">
          {tab === 'general' && <SectionWrapper title="General Settings" open><GeneralSection /></SectionWrapper>}
          {tab === 'security' && <SectionWrapper title="Security"><SecuritySection /></SectionWrapper>}
          {tab === 'couplingBol' && <SectionWrapper title="Coupling Bol"><CouplingBolSection /></SectionWrapper>}
          {tab === 'productsVat' && <SectionWrapper title="Products & VAT"><ProductsVatSection /></SectionWrapper>}
          {tab === 'invoice' && <SectionWrapper title="Invoice Settings"><InvoiceSettingsSection /></SectionWrapper>}
        </div>
      </div>
    </Layout>
  );
}