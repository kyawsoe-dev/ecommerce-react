export interface OrderItemType {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface AddressType {
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

export interface UserType {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderType {
  id?: string;
  orderNumber?: string;
  customerName?: string;
  userId?: string;
  user?: UserType;
  shippingAddress: AddressType;
  billingAddress: AddressType;
  paymentMethod: string;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  items?: OrderItemType[];
  status?: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  paymentStatus?: "PENDING" | "PAID" | "FAILED";
  createdAt?: string;
  updatedAt?: string;
}
