/**
 * Enhanced API Client with automatic token refresh
 */

import type { Address } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  return data.accessToken;
}

/**
 * Make authenticated API request with automatic token refresh
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(!(fetchOptions.body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add auth token if provided
  if (token && !skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  // Global Timeout Logic
  // If no signal implies, we create one with 5s timeout
  let timeoutId: NodeJS.Timeout | undefined;
  let signal = fetchOptions.signal;

  if (!signal) {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 5000); // 5s global timeout
    signal = controller.signal;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal, // Use the signal (either provided or created)
    });

    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401 && token && !skipAuth) {
      // Get refresh token from storage
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) {
        throw new APIError(401, 'Session expired');
      }

      const { state } = JSON.parse(authStorage);
      const refreshToken = state?.refreshToken;

      if (!refreshToken) {
        throw new APIError(401, 'Session expired');
      }

      // If already refreshing, wait for the new token
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken: string) => {
            // Retry original request with new token
            apiRequest<T>(endpoint, { ...options, token: newToken })
              .then(resolve)
              .catch(reject);
          });
        });
      }

      // Start refresh process
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        
        // Update token in storage
        const updatedStorage = {
          ...JSON.parse(authStorage),
          state: {
            ...state,
            accessToken: newAccessToken,
          },
        };
        localStorage.setItem('auth-storage', JSON.stringify(updatedStorage));

        // Notify all waiting requests
        onRefreshed(newAccessToken);
        isRefreshing = false;

        // Retry original request with new token
        return apiRequest<T>(endpoint, { ...options, token: newAccessToken });
      } catch (refreshError) {
        isRefreshing = false;
        // Clear auth and redirect to login
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        throw new APIError(401, 'Session expired');
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        response.status,
        data.message || 'Request failed',
        data.details
      );
    }

    return data;
  } catch (error: any) {
    // Check if it's an abort error (timeout)
    if (error.name === 'AbortError') {
       // Log warning but throw specific error so callers can handle if needed
       console.warn(`API Request timeout for ${endpoint}`);
       throw new APIError(408, 'Request timed out');
    }

    if (error instanceof APIError) {
      throw error;
    }

    // Network or other errors
    throw new APIError(500, 'Network error or server unavailable');
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * API Client methods
 */
export const api = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      }),
    
    register: (data: { name: string; email: string; password: string; role?: string }) =>
      apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,
      }),
    
    getProfile: (token: string) =>
      apiRequest('/api/auth/me', {
        method: 'GET',
        token,
      }),
    
    refreshToken: (refreshToken: string) =>
      apiRequest('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        skipAuth: true,
      }),
    
    updateProfile: (data: { name?: string; email?: string; phone?: string }) => {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;
      return apiRequest('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
        token,
      });
    },

    changePassword: (data: { currentPassword: string; newPassword: string }) => {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;
      return apiRequest('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      });
    },
  },

  // Categories
  categories: {
    getAll: (options?: RequestInit) => apiRequest('/api/categories', { ...options, skipAuth: true }),
    
    getBySlug: (slug: string) => apiRequest(`/api/categories/${slug}`, { skipAuth: true }),
    
    create: (data: any, token: string) =>
      apiRequest('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any, token: string) =>
      apiRequest(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        token,
      }),
    
    delete: (id: string, token: string) =>
      apiRequest(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }),
    
    reorder: (orders: Array<{ id: string; displayOrder: number }>, token: string) =>
      apiRequest('/api/categories/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orders }),
      }),
  },

  // Products
  products: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiRequest(`/api/products${query}`, { skipAuth: true });
    },
    
    getBySlug: (slug: string) => apiRequest(`/api/products/${slug}`, { skipAuth: true }),
    
    create: (data: any, token: string) =>
      apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    
    update: (id: string, data: any, token: string) =>
      apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    
    delete: (id: string, token: string) =>
      apiRequest(`/api/products/${id}`, {
        method: 'DELETE',
        token,
      }),
  },

  // Orders
  orders: {
    getAll: (params?: Record<string, string> | string) => {
      // Handle both token string (admin) and query params (user)
      if (typeof params === 'string') {
        // Admin mode - token provided
        return apiRequest('/api/orders/admin/all', {
          method: 'GET',
          token: params,
        });
      } else {
        // User mode - get own orders with optional filters
        const authStorage = localStorage.getItem('auth-storage');
        const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiRequest(`/api/orders${query}`, {
          method: 'GET',
          token,
        });
      }
    },
    
    create: (data: any) => {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;
      return apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      });
    },
    
    getById: (id: string, token: string) =>
      apiRequest(`/api/orders/${id}`, {
        method: 'GET',
        token,
      }),
    
    updateStatus: (id: string, data: { orderStatus?: string; paymentStatus?: string }, token: string) =>
      apiRequest(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
  },

  // Upload
  upload: {
    image: (file: File, token: string) => {
      const formData = new FormData();
      formData.append('image', file);
      return apiRequest('/api/upload/image', {
        method: 'POST',
        body: formData,
        token,
      });
    },

    images: (files: File[], token: string) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      return apiRequest('/api/upload/images', {
        method: 'POST',
        body: formData,
        token,
      });
    },

    model3d: (file: File, token: string) => {
      const formData = new FormData();
      formData.append('model', file);
      return apiRequest('/api/upload/model3d', {
        method: 'POST',
        body: formData,
        token,
      });
    },
  },

  // Settings
  settings: {
    get: () => apiRequest('/api/settings', { skipAuth: true }),
    
    update: (data: any, token: string) =>
      apiRequest('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
  },

  // Addresses
  addresses: {
    getAll: () => {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;
      return apiRequest('/api/addresses', { token });
    },
    
    create: (data: Omit<Address, '_id'>) => {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;
      return apiRequest('/api/addresses', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      });
    },
    
    update: (id: string, data: Partial<Address>) => {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;
      return apiRequest(`/api/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      });
    },
    
    delete: (id: string) => {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;
      return apiRequest(`/api/addresses/${id}`, {
        method: 'DELETE',
        token,
      });
    },
    
    setDefault: (id: string) => {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;
      return apiRequest(`/api/addresses/${id}/set-default`, {
        method: 'PUT',
        token,
      });
    },
  },
};
