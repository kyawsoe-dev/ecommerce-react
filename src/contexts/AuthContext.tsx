import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, LoginCredentials, RegisterData } from "../types/auth";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      setIsLoading(true);
      authService
        .getCurrentUser(token)
        .then((fetchedUser) => {
          const normalizedUser = {
            ...fetchedUser,
            roles: fetchedUser.roles.map((r: any) => r.role.name),
          };
          setUser(normalizedUser);
          localStorage.setItem("user", JSON.stringify(normalizedUser));
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    const { token, user } = response.data;

    localStorage.setItem("token", token);

    const normalizedUser = {
      ...user,
      roles: user.roles.map((r: any) => r.role.name),
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    const { token, user } = response.data;

    localStorage.setItem("token", token);

    const normalizedUser = {
      ...user,
      roles: user.roles.map((r: any) => r.role.name),
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
