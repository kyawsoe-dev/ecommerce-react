import { ApiService } from "./apiService";

type CartItem = {
  productId: string;
  quantity: number;
};

class CartApiService extends ApiService<CartItem> {
  constructor() {
    super("cart");
  }

  addItem(data: CartItem) {
    return this.api.post(`/cart/items`, data);
  }

  updateItem(id: string, quantity: number) {
    return this.api.put(`/cart/items/${id}`, { quantity });
  }

  removeItem(id: string) {
    return this.api.delete(`/cart/items/${id}`);
  }

  getCart() {
    return this.api.get(`/cart`);
  }

  clearCart() {
    return this.api.delete(`/cart`);
  }
}

export const cartApi = new CartApiService();
