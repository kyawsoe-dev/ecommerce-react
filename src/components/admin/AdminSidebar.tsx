import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Merchants', href: '/admin/merchants', icon: Store },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div
      className={`bg-gray-900 text-white ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen p-4 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EC</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold whitespace-nowrap">Admin Panel</span>
          )}
        </div>
        <button
          className="text-gray-300 hover:text-white"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center ${
                isCollapsed ? 'justify-center' : ''
              } space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
