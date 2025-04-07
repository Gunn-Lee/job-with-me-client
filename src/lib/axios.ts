import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

// Define base URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Timeout after 30 seconds
  timeout: 30000,
});

// Request interceptor to add authentication token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if token refresh is in progress to prevent multiple simultaneous refreshes
let isRefreshing = false;

// Queue of requests that should be retried after token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}> = [];

// Process the queue of failed requests
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      // Retry the request with new token
      if (token && request.config.headers) {
        request.config.headers.Authorization = `Bearer ${token}`;
      }
      request.resolve(axiosInstance(request.config));
    }
  });

  // Reset the queue
  failedQueue = [];
};

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401 errors (Unauthorized)
    if (error.response?.status === 401) {
      // If we already tried to refresh for this request, don't try again
      if (originalRequest._retry) {
        // Token refresh failed, logout user
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      // Mark this request as retried
      originalRequest._retry = true;

      // If we're already refreshing the token, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      // Start refreshing
      isRefreshing = true;

      try {
        // Try to refresh the token
        const refreshAccessToken = useAuthStore.getState().refreshAccessToken;
        const newToken = await refreshAccessToken();

        if (newToken) {
          // Update the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Process any queued requests with the new token
          processQueue(null, newToken);

          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          // Refresh failed - reject all queued requests
          processQueue(new Error("Token refresh failed"));

          // Logout user
          useAuthStore.getState().logout();

          // Reject the original request
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Handle refresh error
        processQueue(refreshError as Error);

        // Logout user on refresh failure
        useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      } finally {
        // Reset refreshing state
        isRefreshing = false;
      }
    }

    // For errors other than 401, just reject normally
    return Promise.reject(error);
  }
);

// Add request/response logging in development
if (process.env.NODE_ENV === "development") {
  axiosInstance.interceptors.request.use((config) => {
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      config
    );
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log(
        `[API Response] ${response.status} ${response.config.url}`,
        response.data
      );
      return response;
    },
    (error) => {
      console.error(
        `[API Error] ${error.response?.status || "Network Error"}`,
        error
      );
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
