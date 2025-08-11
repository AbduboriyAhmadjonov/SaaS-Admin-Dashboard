export interface User {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  plan: 'Basic' | 'Pro' | 'Enterprise';
}

export interface Stats {
  totalUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  activeSubscriptions: number;
}

export interface ChartDataPoint {
  name: string;
  users?: number;
  revenue?: number;
  sessions?: number;
  conversions?: number;
  bounceRate?: number;
}

export interface PlanDistribution {
  name: string;
  value: number;
  color: string;
}
