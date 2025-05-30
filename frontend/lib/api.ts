const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Types for API responses
export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  phone: string;
  email: string;
  website?: string;
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  rating: {
    average: number;
    count: number;
  };
  priceRange: string;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  _id: string;
  restaurant: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: number;
  preparationTime: number;
  isAvailable: boolean;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'restaurant' | 'admin';
  addresses: Array<{
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    isDefault: boolean;
  }>;
  preferences: {
    cuisine: string[];
    dietaryRestrictions: string[];
    spiceLevel: number;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  customer: string;
  restaurant: string;
  items: Array<{
    menuItem: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
  }>;
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  specialInstructions?: string;
  rating?: {
    food: number;
    delivery: number;
    overall: number;
    comment?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// API utility functions
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error or server unavailable');
  }
}

// Authentication API
export const authApi = {
  async login(email: string, password: string) {
    return apiRequest<{ success: boolean; token: string; data: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
  }) {
    return apiRequest<{ success: boolean; token: string; data: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getProfile() {
    return apiRequest<{ success: boolean; data: User }>('/auth/me');
  },

  async updateProfile(userData: Partial<User>) {
    return apiRequest<{ success: boolean; data: User }>('/auth/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    return apiRequest<{ success: boolean; message: string }>('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  async forgotPassword(email: string) {
    return apiRequest<{ success: boolean; message: string }>('/auth/forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Restaurant API
export const restaurantApi = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    cuisine?: string;
    location?: string;
    rating?: number;
    priceRange?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/restaurants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest<{
      success: boolean;
      count: number;
      pagination: any;
      data: Restaurant[];
    }>(endpoint);
  },

  async getById(id: string) {
    return apiRequest<{ success: boolean; data: Restaurant }>(`/restaurants/${id}`);
  },

  async search(query: string, filters?: {
    cuisine?: string;
    location?: string;
    rating?: number;
  }) {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return apiRequest<{
      success: boolean;
      count: number;
      data: Restaurant[];
    }>(`/restaurants/search?${params.toString()}`);
  },

  async rate(id: string, rating: number, comment?: string) {
    return apiRequest<{ success: boolean; data: Restaurant }>(`/restaurants/${id}/rating`, {
      method: 'PUT',
      body: JSON.stringify({ rating, comment }),
    });
  },
};

// Menu API
export const menuApi = {
  async getByRestaurant(restaurantId: string) {
    return apiRequest<{
      success: boolean;
      count: number;
      data: MenuItem[];
    }>(`/menus/restaurant/${restaurantId}`);
  },

  async getById(id: string) {
    return apiRequest<{ success: boolean; data: MenuItem }>(`/menus/${id}`);
  },

  async search(query: string, filters?: {
    restaurant?: string;
    category?: string;
    isVegetarian?: boolean;
    maxPrice?: number;
  }) {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return apiRequest<{
      success: boolean;
      count: number;
      data: MenuItem[];
    }>(`/menus/search?${params.toString()}`);
  },
};

// Order API
export const orderApi = {
  async create(orderData: {
    restaurant: string;
    items: Array<{
      menuItem: string;
      quantity: number;
      specialInstructions?: string;
    }>;
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    paymentMethod: string;
    specialInstructions?: string;
  }) {
    return apiRequest<{ success: boolean; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getMyOrders(params?: { page?: number; limit?: number; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/orders/my-orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest<{
      success: boolean;
      count: number;
      pagination: any;
      data: Order[];
    }>(endpoint);
  },

  async getById(id: string) {
    return apiRequest<{ success: boolean; data: Order }>(`/orders/${id}`);
  },

  async updateStatus(id: string, status: string) {
    return apiRequest<{ success: boolean; data: Order }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async cancel(id: string, reason?: string) {
    return apiRequest<{ success: boolean; data: Order }>(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },

  async rate(id: string, rating: {
    food: number;
    delivery: number;
    overall: number;
    comment?: string;
  }) {
    return apiRequest<{ success: boolean; data: Order }>(`/orders/${id}/rate`, {
      method: 'PUT',
      body: JSON.stringify(rating),
    });
  },
};

// Health check
export const healthApi = {
  async check() {
    return apiRequest<{
      status: string;
      message: string;
      timestamp: string;
      version: string;
    }>('/health', { method: 'GET' });
  },
};

export { ApiError };
