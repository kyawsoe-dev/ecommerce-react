import React from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

const MerchantDashboard: React.FC = () => {
  const stats = [
    { name: 'Products', value: '45', icon: Package, color: 'bg-blue-500' },
    { name: 'Orders', value: '123', icon: ShoppingCart, color: 'bg-green-500' },
    { name: 'Revenue', value: '$8,456', icon: DollarSign, color: 'bg-yellow-500' },
    { name: 'Growth', value: '+12%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Merchant Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
        <p className="text-gray-600">Order management interface coming soon...</p>
      </div>
    </div>
  );
};

export default MerchantDashboard;