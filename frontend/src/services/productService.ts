import axios from 'axios';
import { authService } from './authService';

// Base URL configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with interceptor for JWT
const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isPromotion: boolean;
  discountPercentage: number;
  category?: Category;
}

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(`/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getPromotions: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(`/products/promotions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post<Product>(`/products`, product);
    return response.data;
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>(`/categories`);
    return response.data;
  }
};
