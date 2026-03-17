import axios from 'axios';

// In production (Docker/Nginx), calls to /api are proxied to the backend container.
// In local dev, update to http://localhost:8080/api or use vite proxy.
const API_BASE_URL = '/api';

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
      const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getPromotions: async (): Promise<Product[]> => {
    try {
      const response = await axios.get<Product[]>(`${API_BASE_URL}/products/promotions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const response = await axios.get<Product>(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }
};
