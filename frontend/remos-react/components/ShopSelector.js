import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';

const ShopSelector = () => {
  const {
    shops,
    selectedShop,
    selectShop,
    createShop,
    loading,
    error
  } = useShop();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newShopDescription, setNewShopDescription] = useState('');

  const handleCreateShop = async (e) => {
    e.preventDefault();
    if (!newShopName.trim()) return;
    
    try {
      await createShop({
        name: newShopName,
        description: newShopDescription
      });
      setNewShopName('');
      setNewShopDescription('');
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create shop:', err);
    }
  };

  if (loading) {
    return <div className="shop-selector">Loading shops...</div>;
  }

  if (error) {
    return <div className="shop-selector error">Error: {error}</div>;
  }

  return (
    <div className="shop-selector">
      <div className="shop-selector-header">
        <h3>Select a Shop</h3>
        <button 
          className="btn btn-secondary"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? 'Cancel' : 'Create New Shop'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateShop} className="create-shop-form">
          <div className="form-group">
            <label htmlFor="shopName">Shop Name</label>
            <input
              type="text"
              id="shopName"
              value={newShopName}
              onChange={(e) => setNewShopName(e.target.value)}
              placeholder="Enter shop name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="shopDescription">Description</label>
            <textarea
              id="shopDescription"
              value={newShopDescription}
              onChange={(e) => setNewShopDescription(e.target.value)}
              placeholder="Enter shop description"
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Shop</button>
        </form>
      )}

      <div className="shop-list">
        {shops.length === 0 ? (
          <p>No shops available. Create your first shop!</p>
        ) : (
          shops.map((shop) => (
            <div 
              key={shop.id}
              className={`shop-item ${selectedShop && selectedShop.id === shop.id ? 'selected' : ''}`}
              onClick={() => selectShop(shop)}
            >
              <h4>{shop.name}</h4>
              {shop.description && <p>{shop.description}</p>}
              <small>Created: {new Date(shop.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopSelector;