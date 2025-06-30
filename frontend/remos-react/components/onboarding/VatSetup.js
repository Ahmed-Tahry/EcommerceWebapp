'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { callApi } from '@/utils/api';
// Assuming Layout provides general page structure, might need adjustment if it's not suitable here
// For now, let's assume it works or we'll simplify the JSX if Layout isn't appropriate for this component context.
// import Layout from "@/components/layout/Layout";

export default function VatSetup() {
  const { markStepAsComplete, onboardingStatus } = useOnboarding();

  // State for this com ponent
  const [products, setProducts] = useState([]);
  const [vatInputs, setVatInputs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // Configurable items per page

  const [componentLoading, setComponentLoading] = useState(true); // For fetching products
  const [componentError, setComponentError] = useState(null);    // For fetching products error
  const [updateInProgress, setUpdateInProgress] = useState({}); // To track loading state per product update

  // State for the onboarding step completion
  const [isStepCompletionLoading, setIsStepCompletionLoading] = useState(false);
  const [stepCompletionError, setStepCompletionError] = useState(null);


const fetchProducts = useCallback(async (page = 1) => {
  setComponentLoading(true);
  setComponentError(null);
  try {
    const response = await callApi(
      `/shop/api/shop/products?page=${page}&limit=${itemsPerPage}`,
      'GET'
    );
    console.log(response);

    // You no longer need to call response.json() or check response.ok
    setProducts(response.products || []);
    setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
    setCurrentPage(response.page || 1);

    const initialVatInputs = {};
    (response.products || []).forEach(product => {
      initialVatInputs[product.ean] =
        product.vatRate !== null && product.vatRate !== undefined
          ? String(product.vatRate)
          : '';
    });
    setVatInputs(prev => ({ ...prev, ...initialVatInputs }));
  } catch (e) {
    console.error('Failed to fetch products:', e);
    setComponentError(e.message);
    setProducts([]);
  } finally {
    setComponentLoading(false);
  }
}, [itemsPerPage]);

  useEffect(() => {
    if (!(onboardingStatus && onboardingStatus.hasCompletedVatSetup)) {
        fetchProducts(currentPage);
    }
  }, [fetchProducts, currentPage, onboardingStatus]);

  const handleVatInputChange = (ean, value) => {
    setVatInputs(prev => ({ ...prev, [ean]: value }));
  };

const handleUpdateVat = async (ean) => {
  setUpdateInProgress(prev => ({ ...prev, [ean]: true }));

  const rawValue = vatInputs[ean];
  let vatRateToUpdate = null;

  if (rawValue.trim() !== '') {
    const parsedValue = parseFloat(rawValue);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 99.99) {
      alert('Invalid VAT rate. Must be a number between 0.00 and 99.99, or empty for no VAT.');
      setUpdateInProgress(prev => ({ ...prev, [ean]: false }));
      return;
    }
    vatRateToUpdate = parsedValue;
  }

  try {
    const response = await callApi(
      `/shop/api/shop/products/${ean}/vat`,
      'PUT',
      { vatRate: vatRateToUpdate }
    );

    // If callApi returns an error format, you may need to check manually
    if (response.error || response.status === 'error') {
      throw new Error(response.message || 'Unknown error updating VAT.');
    }

    // Update local state to reflect the change
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.ean === ean ? { ...p, vatRate: vatRateToUpdate } : p
      )
    );

  } catch (e) {
    console.error(`Failed to update VAT for EAN ${ean}:`, e);
    alert(`Error updating VAT for EAN ${ean}: ${e.message}`);
  } finally {
    setUpdateInProgress(prev => ({ ...prev, [ean]: false }));
  }
};


  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleCompleteVatSetupStep = async () => {
    setIsStepCompletionLoading(true);
    setStepCompletionError(null);
    try {
      await markStepAsComplete('hasCompletedVatSetup');
      // Optionally re-fetch products or clear list if needed after step completion
    } catch (err) {
      console.error('Failed to mark VAT setup as complete:', err);
      const errorMessage = (err && err.message) ? err.message : String(err);
      setStepCompletionError(errorMessage || 'Failed to save progress.');
    } finally {
      setIsStepCompletionLoading(false);
    }
  };

  // If step is already complete, show completion message
  if (onboardingStatus && onboardingStatus.hasCompletedVatSetup) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Step 3: Configure VAT Settings - Complete</h2>
        <p className="text-gray-600">VAT settings have been marked as complete.</p>
      </div>
    );
  }

  // Main content for VAT setup
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md wg-box">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Step 3: Configure Product VAT Settings</h2>
      <p className="text-gray-600 mb-6">
        Review and set the VAT (Value Added Tax) rates for your products. This can also be managed later in the main application settings.
      </p>

      {componentLoading && <p>Loading products...</p>}
      {componentError && <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-md">Error loading products: {componentError}</div>}

      {!componentLoading && !componentError && products.length === 0 && (
        <p className="text-gray-600 mb-6">No products found to configure. You can proceed or add products first.</p>
      )}

      {!componentLoading && !componentError && products.length > 0 && (
        <div className="table-responsive mb-6" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-striped w-full text-sm">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="p-2 border">EAN</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Current VAT (%)</th>
                <th className="p-2 border w-1/4">Set VAT (%)</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.ean}>
                  <td className="p-2 border">{product.ean}</td>
                  <td className="p-2 border">{product.title || 'N/A'}</td>
                  <td className="p-2 border">{product.vatRate !== null && product.vatRate !== undefined ? `${parseFloat(product.vatRate).toFixed(2)}%` : 'N/A'}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      className="form-control form-control-sm w-full px-2 py-1 border rounded-md"
                      value={vatInputs[product.ean] || ''}
                      onChange={(e) => handleVatInputChange(product.ean, e.target.value)}
                      placeholder="e.g., 21.00"
                      min="0"
                      max="99.99"
                      step="0.01"
                      disabled={updateInProgress[product.ean]}
                    />
                  </td>
                  <td className="p-2 border">
                    <button
                      className="tf-button-primary btn-sm px-3 py-1" // Assuming tf-button-primary exists or use standard btn classes
                      onClick={() => handleUpdateVat(product.ean)}
                      disabled={updateInProgress[product.ean]}
                    >
                      {updateInProgress[product.ean] ? 'Saving...' : 'Update'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {!componentLoading && !componentError && products.length > 0 && totalPages > 1 && (
        <nav className="mt-4 mb-6">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link px-3 py-1 border rounded-l-md" onClick={handlePrevPage}>Previous</button>
            </li>
            <li className="page-item disabled">
              <span className="page-link px-3 py-1 border-t border-b">Page {currentPage} of {totalPages}</span>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link px-3 py-1 border rounded-r-md" onClick={handleNextPage}>Next</button>
            </li>
          </ul>
        </nav>
      )}

      {stepCompletionError && <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-md">{stepCompletionError}</div>}

      <button
        onClick={handleCompleteVatSetupStep}
        className="tf-button w-full sm:w-auto" // Assuming tf-button is a global style
        disabled={isStepCompletionLoading || (onboardingStatus && onboardingStatus.hasCompletedVatSetup)}
      >
        {isStepCompletionLoading ? 'Saving...' : 'Mark This Step as Complete & Continue'}
      </button>
    </div>
  );
}
