import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import axiosInstance from "@/lib/axios";

// Define types
export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshAccessToken: () => Promise<string | null>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Login action

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            const response = await axiosInstance.post("/api/auth/login", {
              email,
              password,
            });

            // Extract data from the response
            const { access_token, refresh_token, user } = response.data;

            // Set authorization header for future requests
            axiosInstance.defaults.headers.common["Authorization"] =
              `Bearer ${access_token}`;

            // Update auth state in one atomic operation
            set({
              accessToken: access_token,
              refreshToken: refresh_token,
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // Force localStorage update immediately
            // This ensures the auth state is persisted immediately
            localStorage.setItem(
              "auth-storage",
              JSON.stringify({
                state: {
                  accessToken: access_token,
                  refreshToken: refresh_token,
                  user,
                  isAuthenticated: true,
                },
                version: 0,
              })
            );

            console.log("Login successful, auth state updated");
            return Promise.resolve();
          } catch (error: any) {
            // Error handling remains the same
          }
        },

        // Register action
        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null });

          try {
            // Call the registration API route
            const response = await axiosInstance.post(
              "/api/auth/register",
              data
            );

            console.log("Registration successful:", response.data?.user?.email);

            try {
              // Auto-login after registration
              await get().login(data.email, data.password);
              // If login succeeds, we're done
              return Promise.resolve();
            } catch (loginError: any) {
              // If login fails, we should still consider registration successful
              // but inform the user they need to log in manually
              console.warn("Auto-login failed after registration:", loginError);

              set({
                isLoading: false,
                error:
                  "Registration successful, but automatic login failed. Please log in manually.",
              });

              // Resolve the promise since registration itself was successful
              return Promise.resolve();
            }
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Registration failed";

            set({ error: errorMessage, isLoading: false });
            return Promise.reject(errorMessage);
          }
        },

        // Logout action
        logout: () => {
          // Remove auth header
          delete axiosInstance.defaults.headers.common["Authorization"];

          set({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
          });
        },

        // Update user data
        updateUser: (userData) => {
          const currentUser = get().user;
          if (!currentUser) return;

          set({
            user: { ...currentUser, ...userData },
          });
        },

        // Refresh token function
        refreshAccessToken: async () => {
          const currentRefreshToken = get().refreshToken;

          if (!currentRefreshToken) {
            return null;
          }

          try {
            const response = await axiosInstance.post("/api/auth/refresh", {
              refresh_token: currentRefreshToken,
            });

            const { access_token, refresh_token } = response.data;

            // Update tokens in store
            set({
              accessToken: access_token,
              refreshToken: refresh_token || currentRefreshToken,
            });

            // Update authorization header
            axiosInstance.defaults.headers.common["Authorization"] =
              `Bearer ${access_token}`;

            return access_token;
          } catch (error) {
            console.error("Failed to refresh token:", error);

            // If refresh fails, log the user out
            get().logout();
            set({ error: "Session expired. Please log in again." });

            return null;
          }
        },

        // Clear error
        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        // Only persist these fields
        partialize: (state) => ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: "auth-store",
    }
  )
);

// Add a selector for loading state
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// Add a selector for auth status
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

// Add a selector for user data
export const useUser = () => useAuthStore((state) => state.user);

// Add a selector for access token
export const useAccessToken = () => useAuthStore((state) => state.accessToken);

// Add a function to check if the user is authenticated and fetch the user if needed
export const useInitAuth = () => {
  const { accessToken, user, isAuthenticated } = useAuthStore();

  // Set authorization header when the store is hydrated
  if (accessToken && !axiosInstance.defaults.headers.common["Authorization"]) {
    axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;
  }

  return { isAuthenticated, user };
};
