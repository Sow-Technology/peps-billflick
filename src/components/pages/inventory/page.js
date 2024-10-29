'use client';
import React, { useState, useEffect } from 'react';
import ProductTable from './ProductTable';
import ProductDialog from './ProductDialog';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowDialog(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowDialog(true);
  };

  const handleSave = (updatedProduct) => {
    setProducts((prevProducts) => {
      const existingProductIndex = prevProducts.findIndex(p => p._id === updatedProduct._id);
      if (existingProductIndex >= 0) {
        // Update existing product
        const newProducts = [...prevProducts];
        newProducts[existingProductIndex] = updatedProduct;
        return newProducts;
      } else {
        // Add new product
        return [...prevProducts, updatedProduct];
      }
    });
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <div>
      <button onClick={handleAdd}></button>
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={(deletedProductId) => {
          setProducts(products.filter(product => product._id !== deletedProductId));
        }}
      />
      {showDialog && (
        <ProductDialog
          product={selectedProduct}
          onClose={handleCloseDialog}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default InventoryPage;
