import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface AuthResponse {
  token: string;
  email: string;
  role: 'USER' | 'ADMIN';
  fullName: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/register`, { email, password, fullName });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN';
  },

  updateProfile: async (fullName: string, currentPassword?: string, newPassword?: string): Promise<AuthResponse> => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Usuario no identificado');

    const response = await axios.put(`${API_URL}/profile`, 
      { fullName, currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }
};
