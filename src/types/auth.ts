export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  company?: Company;
  merchantProfile?: MerchantProfile;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  businessType: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface MerchantProfile {
  id: string;
  businessName: string;
  businessType: string;
  taxId: string;
  address: string;
  phone: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  commissionRate: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "MERCHANT";
  company?: Partial<Company>;
  merchantProfile?: Partial<MerchantProfile>;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
  timestamp: string;
  path: string;
}
