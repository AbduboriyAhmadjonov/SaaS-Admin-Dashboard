import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/** Login */
export const useLogin = (email: string, password: string) => {
  return useQuery({
    queryKey: ['login'],
    queryFn: () => api.postLogin(email, password),
  });
};

/** Register */
export const useRegister = (name: string, password: string, email: string) => {
  return useQuery({
    queryKey: ['login'],
    queryFn: () => api.postRegister(name, email, password),
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
