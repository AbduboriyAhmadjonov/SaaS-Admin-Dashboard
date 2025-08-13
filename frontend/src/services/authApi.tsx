import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password });

export const refreshToken = () => api.post('/auth/refresh');
