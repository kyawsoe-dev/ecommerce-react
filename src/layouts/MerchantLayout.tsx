import React from 'react';
import { Outlet } from 'react-router-dom';
import MerchantSidebar from '../components/merchant/MerchantSidebar';
import MerchantHeader from '../components/merchant/MerchantHeader';

const MerchantLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MerchantHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MerchantLayout;