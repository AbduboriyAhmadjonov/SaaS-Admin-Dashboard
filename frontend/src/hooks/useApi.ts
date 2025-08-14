import { useQuery, useMutation } from '@tanstack/react-query';
import { authStore } from '../services/authStore';
import { api } from '@/services/api';

/** Login */
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.postLogin(email, password),
    onSuccess: (data) => {
      authStore.setToken(data.accessToken);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/** Register */
export const useRegister = () => {
  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      api.postRegister(name, email, password),
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
  });
};

export const useUsers = (page: number) => {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => api.getUsers(page),
  });
};

export const useChartData = () => {
  return useQuery({
    queryKey: ['chartData'],
    queryFn: api.getChartData,
  });
};

export const useRevenueData = () => {
  return useQuery({
    queryKey: ['revenueData'],
    queryFn: api.getRevenueData,
  });
};

export const usePlanDistribution = () => {
  return useQuery({
    queryKey: ['planDistribution'],
    queryFn: api.getPlanDistribution,
  });
};
