import React, { useState, useEffect } from 'react';

const ProductDialog = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    storeName: '',
    phoneNumber: 1,
    address: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code || '',
        storeName: product.storeName || '',
        phoneNumber: product.phoneNumber || 1,
        address: product.address || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = product ? 'PUT' : 'POST';
      const url = '/api/store2';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product ? { _id: product._id, ...formData } : formData),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        onSave(updatedProduct);
        onClose();
      } else {
        console.error('Error saving product:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div style={dialogOverlayStyle}>
      <div style={dialogContentStyle}>
        <h2>{product ? 'Edit Product' : 'Add New Store'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Code:
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>
          <label>
            Store Name:
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              min="1"
              required
              style={inputStyle}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              step="0.01"
              style={inputStyle}
            />
          </label>
          <div style={dialogButtonsStyle}>
            <button type="submit" style={buttonStyle}>Save</button>
            <button type="button" onClick={onClose} style={buttonStyle}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const dialogOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dialogContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  maxWidth: '100%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '4px',
  border: '1px solid #ddd',
  borderRadius: '4px',
};

const dialogButtonsStyle = {
  marginTop: '20px',
  textAlign: 'right',
};

const buttonStyle = {
  padding: '8px 16px',
  marginLeft: '8px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: '#0070f3',
  color: 'white',
};

export default ProductDialog;
