import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "../types/auth";

class AuthService {
  private baseURL = "http://localhost:3000/api/v1";

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data: AuthResponse = await response.json();
    return data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const responseData: AuthResponse = await response.json();
    return responseData;
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user");
    }

    const user: User = await response.json();
    return user;
  }
}

export const authService = new AuthService();
