"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Get auth state directly from store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Local state to track if we're redirecting
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Use useEffect for navigation instead of doing it during render
  useEffect(() => {
    // Don't redirect if any of these conditions are true:
    // - Still loading auth state
    // - User is authenticated
    // - Current route is public
    // - Already redirecting
    if (isLoading || isAuthenticated || isPublicRoute || isRedirecting) {
      return;
    }

    // Mark that we're starting a redirect
    setIsRedirecting(true);

    // Use router.push in useEffect, not during render
    router.push("/login");
  }, [
    isLoading,
    isAuthenticated,
    isPublicRoute,
    router,
    pathname,
    isRedirecting,
  ]);

  // Show loading state when redirecting
  if (isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading state when still determining auth status
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on a public route, show a loading state
  // The useEffect above will handle the redirect
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // User is authenticated or on a public route, render children
  return <>{children}</>;
};

export default ProtectedRoute;
