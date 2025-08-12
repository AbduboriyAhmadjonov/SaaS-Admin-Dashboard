import React, { useState, useRef, useEffect } from 'react';
import {
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

type HeaderProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-200 rounded-lg">
            <BellIcon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Profile Button + Dropdown */}
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center space-x-3 hover:cursor-pointer hover:border-l-rose-300"
              onClick={() => setIsProfileOpen((prev) => !prev)}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Admin User</span>
            </div>

            {/* Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border rounded-lg shadow-lg py-4 z-50">
                <div className="flex items-center px-4 pb-3 border-b">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-600">Administrator</p>
                  </div>
                </div>
                <ul className="mt-2">
                  <li
                    onClick={() => handleTabClick('profile')}
                    className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <span className="ml-2">My Profile</span>
                  </li>
                  <li
                    onClick={() => handleTabClick('settings')}
                    className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
                    <span className="ml-2">Settings</span>
                  </li>
                  <li
                    onClick={() => handleTabClick('help')}
                    className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5 text-gray-600" />
                    <span className="ml-2">Help</span>
                  </li>
                  <li
                    onClick={() => console.log('Logout clicked')}
                    className="flex items-center justify-center px-4 py-2 bg-red-700 hover:bg-red-800 cursor-pointer text-white"
                  >
                    <span className="mr-2">Log Out</span>
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
