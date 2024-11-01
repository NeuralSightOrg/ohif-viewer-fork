import React from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import ReportsTable from './ReportsTable';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Reports = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!hasPermission('view_report')) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            You don't have permission to access this page.
          </div>{' '}
          <button
            onClick={() => navigate(-1)}
            className="rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <ReportsTable />
    </DashboardLayout>
  );
};
