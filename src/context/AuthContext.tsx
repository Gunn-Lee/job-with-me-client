"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  // Protect routes when no token is found
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // List of public routes that don't require authentication
      const publicRoutes = ["/login", "/register", "/forgot-password"];

      if (pathname && !publicRoutes.includes(pathname)) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
    setIsAuthenticated(true);
    router.push("/dashboard"); // Redirect to dashboard after login
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
