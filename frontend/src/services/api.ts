import { Stats, User, ChartDataPoint, PlanDistribution } from '@/types';
import { authStore } from './authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const buildHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authStore.getToken() && { Authorization: `Bearer ${authStore.getToken()}` }),
});

export const api = {
  async fetchWithAuth(url: string, options?: RequestInit): Promise<Response> {
    let attempt = 0;
    const maxAttempts = 5;

    while (attempt < maxAttempts) {
      const headers = buildHeaders();

      try {
        const response = await fetch(url, {
          ...options,
          headers: { ...headers, ...options?.headers },
          credentials: 'include',
        });

        if (response.status === 401 && attempt === 0) {
          attempt++;

          try {
            await authStore.refreshAccessToken();
            continue;
          } catch (refreshError) {
            authStore.clearToken();
            window.location.href = '/login';
            throw new Error('Session expired. Please log in again.');
          }
        }

        return response;
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        attempt++;
      }
    }

    throw new Error('Max retry attempts exceeded');
  },

  /** Login */
  async postLogin(
    email: string,
    password: string
  ): Promise<{ accessToken: string; csrfToken: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      console.log(`Login failed with status ${response.status}`);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed with status ${response.status}`);
    }

    return response.json();
  },

  /** Register */
  async postRegister(name: string, email: string, password: string): Promise<User> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Registration failed with status ${response.status}`);
    }

    return response.json();
  },

  async refreshAccessToken(): Promise<{ accessToken: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status}`);
    }

    return response.json();
  },

  async getStats(): Promise<Stats> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }
    return response.json();
  },

  async getUsers(page: number): Promise<{ users: User[]; total: number }> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/users?page=${page}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    return response.json();
  },

  async getChartData(): Promise<ChartDataPoint[]> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/chart-data`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.status}`);
    }
    return response.json();
  },

  async getRevenueData(): Promise<ChartDataPoint[]> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/revenue`);
    if (!response.ok) {
      throw new Error(`Failed to fetch revenue data: ${response.status}`);
    }
    return response.json();
  },

  async getPlanDistribution(): Promise<PlanDistribution[]> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/plan-distribution`);
    if (!response.ok) {
      throw new Error(`Failed to fetch plan distribution: ${response.status}`);
    }
    return response.json();
  },
};
