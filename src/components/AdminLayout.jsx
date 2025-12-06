import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Courses', path: '/admin/courses', icon: '📚' },
    { name: 'Students', path: '/admin/students', icon: '👨‍🎓' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
              CM
            </div>
            <span className="text-lg font-bold">CourseMaster</span>
          </div>
          <button 
            className="lg:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 border-2 border-dashed rounded-lg w-8 h-8" />
            <div>
              <p className="font-medium text-sm">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                className="lg:hidden text-gray-600 mr-3"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 border-2 border-dashed rounded-lg w-8 h-8" />
                <span className="hidden md:inline text-gray-700 text-sm">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;