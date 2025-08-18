import React from 'react';
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigation = [
    { name: 'Overview', id: 'overview', icon: HomeIcon },
    { name: 'Users', id: 'users', icon: UsersIcon },
    { name: 'Revenue', id: 'revenue', icon: CurrencyDollarIcon },
    { name: 'Analytics', id: 'analytics', icon: ChartBarIcon },
    { name: 'Settings', id: 'settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 flex-shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">SaaS Admin</h1>
      </div>
      <nav className="mt-6">
        {navigation.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
                isActive ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
