import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { orderService } from "../../services/apiService";
import { cartApi } from "../../services/cartApiService";

const CartPage: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const shippingAddress = {
    firstName: "John",
    lastName: "Doe",
    address1: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
  };
  const billingAddress = { ...shippingAddress };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images?.[0] ?? "",
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        variant: item.variant ?? undefined,
      }));

      await orderService.create({
        items: orderItems,
        shippingAddress,
        billingAddress,
        paymentMethod: "CREDIT_CARD",
      });

      setSuccess("Order placed successfully!");
      await cartApi.clearCart();
      clearCart();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingItemId(itemId);
    try {
      await cartApi.updateItem(itemId, newQty);
      updateQuantity(itemId, newQty);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItemId(itemId);
    try {
      await cartApi.removeItem(itemId);
      removeItem(itemId);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove item");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    setLoading(true);
    try {
      await cartApi.clearCart();
      clearCart();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0)
    return <div className="text-center py-12">Your cart is empty</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-6">
        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={
                  item.product.images?.[0] ?? "https://via.placeholder.com/80"
                }
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{item.product.name}</h2>
                {item.variant && (
                  <p className="text-sm text-gray-500">
                    {item.variant.name}: {item.variant.value}
                  </p>
                )}
                <p className="text-gray-500">${item.price.toFixed(2)}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1 || updatingItemId === item.id}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    disabled={updatingItemId === item.id}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={updatingItemId === item.id}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </p>
            <p className="text-2xl font-bold text-blue-600">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearCart}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Clear Cart
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default CartPage;
