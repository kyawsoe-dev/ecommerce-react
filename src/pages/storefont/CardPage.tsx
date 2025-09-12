import React from 'react';
import { useCart } from '../../contexts/CartContext';

const CartPage: React.FC = () => {
  const { items, totalPrice, totalItems } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-lg font-semibold mb-4">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
          </p>
          <p className="text-2xl font-bold text-blue-600">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default CartPage;