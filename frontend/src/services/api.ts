import { Stats, User, ChartDataPoint, PlanDistribution } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = {
  /** Login */
  async postLogin(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to login');
    }
    return response.json();
  },

  /** Register */
  async postRegister(name: string, email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/createUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to register');
    }
    return response.json();
  },

  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async getUsers(page: number): Promise<{ users: User[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/users?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getChartData(): Promise<ChartDataPoint[]> {
    const response = await fetch(`${API_BASE_URL}/chart-data`);
    if (!response.ok) throw new Error('Failed to fetch chart data');
    return response.json();
  },

  async getRevenueData(): Promise<ChartDataPoint[]> {
    const response = await fetch(`${API_BASE_URL}/revenue`);
    if (!response.ok) throw new Error('Failed to fetch revenue data');
    return response.json();
  },

  async getPlanDistribution(): Promise<PlanDistribution[]> {
    const response = await fetch(`${API_BASE_URL}/plan-distribution`);
    if (!response.ok) throw new Error('Failed to fetch plan distribution');
    return response.json();
  },
};
