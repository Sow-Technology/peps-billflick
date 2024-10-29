import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductDialog from './ProductDialog';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  background-color: #f4f4f4;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  background-color: ${props => props.primary ? '#0070f3' : '#ddd'};
  margin: 0 4px;
  font-size: 14px;

  &:hover {
    background-color: ${props => props.primary ? '#005bb5' : '#ccc'};
  }
`;

const AddButton = styled(Button)`
  background-color: #28a745;
  &:hover {
    background-color: #218838;
  }
`;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowDialog(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowDialog(true);
  };

//   const handleDeleteProduct = async (id) => {
//     try {
//       const response = await fetch(`/api/products/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setProducts(products.filter(product => product._id !== id));
//       } else {
//         console.error('Error deleting product:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error deleting product:', error);
//     }
//   };

const handleDeleteProduct = async (id) => {
        try {
          await fetch('/api/products', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: id }),
          });
          setProducts(products.filter((product) => product._id !== id));
          if (onDelete) onDelete();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      };


  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleSaveProduct = (updatedProduct) => {
    if (selectedProduct) {
      setProducts(products.map(product => (product._id === updatedProduct._id ? updatedProduct : product)));
    } else {
      setProducts([...products, updatedProduct]);
    }
    setShowDialog(false);
  };

  return (
    <div>
      <AddButton onClick={handleAddProduct}>Add Product</AddButton>
      <Table>
        <thead>
          <tr>
            <Th>Code</Th>
            <Th>Product Name</Th>
            <Th>Quantity</Th>
            <Th>Unit Price</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <Tr key={product._id}>
              <Td>{product.code}</Td>
              <Td>{product.productName}</Td>
              <Td>{product.quantity}</Td>
              <Td>{(product.unitPrice || 0).toFixed(2)}</Td>
              <Td>
                <Button onClick={() => handleEditProduct(product)}>Edit</Button>
                <Button onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {showDialog && (
        <ProductDialog
          product={selectedProduct}
          onClose={handleCloseDialog}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ProductTable;
