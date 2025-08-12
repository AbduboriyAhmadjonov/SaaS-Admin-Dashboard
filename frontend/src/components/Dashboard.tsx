import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Overview from './Overview';
import Users from './Users';
import Revenue from './Revenue';
import Analytics from './Analytics';
import Settings from './Settings';
import Profile from './Profile';
// import Help from './Help';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <Users />;
      case 'revenue':
        return <Revenue />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      // case 'help':
      //   return <Help />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
