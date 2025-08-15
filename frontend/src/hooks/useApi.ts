import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authStore } from '../services/authStore';
import { api } from '../services/api';

/** Login */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.postLogin(email, password),
    onSuccess: (data) => {
      authStore.setToken(data.accessToken);
      // Invalidate and refetch any cached queries
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('Login failed:', error);
      authStore.clearToken();
    },
  });
};

/** Register */
export const useRegister = () => {
  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      api.postRegister(name, email, password),
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

/** Logout */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authStore.logout(),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    enabled: authStore.isAuthenticated(),
  });
};

export const useUsers = (page: number) => {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => api.getUsers(page),
    enabled: authStore.isAuthenticated(),
  });
};

export const useChartData = () => {
  return useQuery({
    queryKey: ['chartData'],
    queryFn: api.getChartData,
    enabled: authStore.isAuthenticated(),
  });
};

export const useRevenueData = () => {
  return useQuery({
    queryKey: ['revenueData'],
    queryFn: api.getRevenueData,
    enabled: authStore.isAuthenticated(),
  });
};

export const usePlanDistribution = () => {
  return useQuery({
    queryKey: ['planDistribution'],
    queryFn: api.getPlanDistribution,
    enabled: authStore.isAuthenticated(),
  });
};
