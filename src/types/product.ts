export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  brand?: string;
  images?: string[];
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  category?: {
    id: string;
    name: string;
  };
  merchant?: {
    id: string;
    businessName: string;
  };
  createdAt: string;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
  sku?: string;
}

export interface Merchant {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant | null;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
  variant?: ProductVariant;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}
