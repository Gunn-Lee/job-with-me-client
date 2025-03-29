"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiArrowLeft, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error
    setError("");
    
    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call to your backend
      // to initiate the password reset process
      
      // For demonstration purposes, we're simulating the API call:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If successful, show success message
      setIsEmailSent(true);
      
      // In production, you would redirect to verification page:
      // router.push(`/reset-password/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Password reset request error:", err);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Reset Your Password</h2>
        {!isEmailSent && (
          <p className="mt-2 text-sm text-gray-600">
            {`Enter your email address and we'll send a verification code to reset your password`}
          </p>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-800">
          <FiAlertCircle className="mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {isEmailSent ? (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FiCheckCircle className="text-green-500 text-3xl" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">Verification Code Sent!</h3>
          <p className="text-sm text-gray-600 mb-4">{`
            We've sent a 6-digit verification code to <span className="font-medium">{email}</span>. 
            The code will expire in 10 minutes.`}
          </p>
          
          <Link 
            href={`/reset-password/verify?email=${encodeURIComponent(email)}`}
            className="mt-4 inline-block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Enter Verification Code
          </Link>
          
          <p className="mt-4 text-sm text-gray-600">
            {`Didn't receive the code?`}
            <button 
              onClick={() => setIsEmailSent(false)} 
              className="ml-1 text-blue-600 hover:text-blue-800 underline"
            >
              Try again
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center"
        >
          <FiArrowLeft className="mr-1" />
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;