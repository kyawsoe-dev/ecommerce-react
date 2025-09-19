import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product, ProductVariant } from "../types/product";
import { cartApi } from "../services/cartApiService";

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    variant?: ProductVariant | null
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = localStorage.getItem("cart");
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];

        if (parsedCart.length > 0) {
          setItems(parsedCart);
        } else {
          const res = await cartApi.getCart();
          setItems(res.data.items || []);
          localStorage.setItem("cart", JSON.stringify(res.data.items || []));
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = async (
    product: Product,
    quantity = 1,
    variant: ProductVariant | null = null
  ) => {
    const existingItem = items.find(
      (item) =>
        item.product.id === product.id &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const res = await cartApi.addItem({ productId: product.id, quantity });
      const backendCartItemId = res.data.id;

      const newItem: CartItem = {
        id: `${product.id}-${variant?.id ?? "default"}-${Date.now()}`,
        cartItemId: backendCartItemId,
        product,
        quantity,
        variant,
        price: variant?.price ?? product.price,
      };
      setItems((prev) => [...prev, newItem]);
    }
  };

  const removeItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await cartApi.removeItem(item.product.id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    await cartApi.updateItem(item.product.id, quantity);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
