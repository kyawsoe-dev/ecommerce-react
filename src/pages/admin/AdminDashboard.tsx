import React from 'react';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { name: 'Total Users', value: '2,543', icon: Users, color: 'bg-blue-500' },
    { name: 'Products', value: '1,234', icon: Package, color: 'bg-green-500' },
    { name: 'Orders', value: '856', icon: ShoppingCart, color: 'bg-yellow-500' },
    { name: 'Revenue', value: '$45,678', icon: DollarSign, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-600">Dashboard content coming soon...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;