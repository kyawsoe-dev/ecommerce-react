import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign,
  BarChart3,
  Settings
} from 'lucide-react';

const MerchantSidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/merchant', icon: LayoutDashboard },
    { name: 'Products', href: '/merchant/products', icon: Package },
    { name: 'Orders', href: '/merchant/orders', icon: ShoppingCart },
    { name: 'Payouts', href: '/merchant/payouts', icon: DollarSign },
    { name: 'Analytics', href: '/merchant/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/merchant/settings', icon: Settings },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center space-x-2 mb-8">
        <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="text-xl font-bold">Merchant Panel</span>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MerchantSidebar;