import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * API Configuration
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/**
 * Axios Instance
 * Pre-configured HTTP client for all API calls
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Add authentication tokens, logging, etc.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Note: Modern browsers handle HTTP caching correctly with Cache-Control headers
    // No need to add cache-busting timestamps

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle errors globally, transform responses, etc.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      console.error(`❌ ${status} Error:`, {
        url: error.config?.url,
        message: data?.message || error.message,
        data,
      });

      // Handle specific error cases
      switch (status) {
        case 400:
          return Promise.reject(
            new Error(data?.message || 'Bad request. Please check your input.')
          );
        case 401:
          return Promise.reject(new Error('Unauthorized. Please login.'));
        case 403:
          return Promise.reject(
            new Error('Forbidden. You do not have access.')
          );
        case 404:
          return Promise.reject(
            new Error(data?.message || 'Resource not found.')
          );
        case 500:
          return Promise.reject(
            new Error('Server error. Please try again later.')
          );
        default:
          return Promise.reject(
            new Error(data?.message || 'An error occurred.')
          );
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ Network Error:', error.message);
      return Promise.reject(
        new Error('Network error. Please check your connection.')
      );
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
      return Promise.reject(error);
    }
  }
);

/**
 * API Error Handler
 * Centralized error handling utility
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
