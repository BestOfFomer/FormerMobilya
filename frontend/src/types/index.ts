/**
 * TypeScript Interfaces for FormerMobilya Admin
 */

// User & Auth
export interface User {
  _id?: string; // MongoDB ID
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
   isDefault: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Category
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | Category;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Product
export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: string | Category;
  basePrice: number;
  discountedPrice?: number;
  images: string[];
  model3D?: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    seatHeight?: number;
    unit: string;
  };
  materials?: string[];
  variants?: ProductVariant[];
  stock?: number;
  featured: boolean;
  active: boolean;
  // Virtuals
  effectivePrice?: number;
  discountPercentage?: number;
  totalStock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  name: string;
  options: {
    name: string;
    values: string[];
  }[];
  stock: number;
  priceModifier?: number;
  priceOverride?: number;
}

// Order
export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'hazırlanıyor' | 'kargolandı' | 'teslim_edildi' | 'iptal';
  orderNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string | Product;
  productName: string;
  productImage: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// API Responses
export interface CategoriesResponse {
  count: number;
  categories: Category[];
}

export interface ProductsResponse {
  count: number;
  page: number;
  totalPages: number;
  products: Product[];
}

export interface OrdersResponse {
  count: number;
  orders: Order[];
}

// Forms
export interface LoginFormData {
  email: string;
  password: string;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  parent?: string;
  image?: string;
}

export interface ProductFormData {
  name: string;
  slug?: string;
  sku?: string;
  description: string;
  category: string;
  basePrice: number;
  discountedPrice?: number;
  images: string[];
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    seatHeight?: number;
    unit?: string;
  };
  materials?: string[];
  variants?: ProductVariant[];
  featured?: boolean;
  active?: boolean;
}
