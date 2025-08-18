import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  ResponsiveContainer,
} from 'recharts';

const Analytics: React.FC = () => {
  const { data: analyticsData } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: async () => [
      { name: 'Mon', sessions: 2400, conversions: 240, bounceRate: 30 },
      { name: 'Tue', sessions: 1398, conversions: 221, bounceRate: 25 },
      { name: 'Wed', sessions: 9800, conversions: 229, bounceRate: 35 },
      { name: 'Thu', sessions: 3908, conversions: 200, bounceRate: 28 },
      { name: 'Fri', sessions: 4800, conversions: 218, bounceRate: 32 },
      { name: 'Sat', sessions: 3800, conversions: 250, bounceRate: 27 },
      { name: 'Sun', sessions: 4300, conversions: 210, bounceRate: 31 },
    ],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sessions vs Conversions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="sessions" fill="#3b82f6" />
              <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Bounce Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bounceRate" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
