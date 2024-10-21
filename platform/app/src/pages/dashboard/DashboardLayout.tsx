import React from 'react';
import { LeftNavigation } from './DashboardPage';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <LeftNavigation />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
