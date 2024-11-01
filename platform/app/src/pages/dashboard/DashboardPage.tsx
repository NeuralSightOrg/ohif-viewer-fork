import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, LogOut, ChevronDown } from 'lucide-react';
import { Users, FileText, Share2, Activity, Calendar, UserCheck } from 'lucide-react';

import DashboardLayout from './DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import ReportsTable from '../reports/ReportsTable';

const NavItem = ({ to, label, icon, isOpen, isActive }) => {
  return (
    <Link
      to={to}
      className={`group relative flex items-center rounded py-2.5 px-4 transition duration-200 hover:bg-gray-700 hover:text-white ${
        isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
      }`}
    >
      <span className="mr-3 inline-flex w-6 justify-center">{icon}</span>
      {isOpen && <span>{label}</span>}
      {!isOpen && (
        <span className="absolute left-full ml-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {label}
        </span>
      )}
    </Link>
  );
};

export const LeftNavigation = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { hasPermission, authState } = useAuth();

  const mainNavItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      to: '/',
      label: 'Viewer',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      allowed: true,
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 32 32"
        >
          <g fill="currentColor">
            <path d="M25 5h-.17v2H25a1 1 0 0 1 1 1v20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h.17V5H7a3 3 0 0 0-3 3v20a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3" />
            <path d="M23 3h-3V0h-8v3H9v6h14zm-2 4H11V5h3V2h4v3h3z" />
            <path
              d="M10 13h12v2H10zm0 5h12v2H10zm0 5h12v2H10z"
              className="ouiIcon__fillSecondary"
            />
          </g>
        </svg>
      ),
      allowed: hasPermission('manage_users'),
    },
    {
      to: '/user-management',
      label: 'User Management',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      allowed: hasPermission('manage_users'),
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    // {
    //   to: '/settings',
    //   label: 'Settings',
    //   icon: (
    //     <svg
    //       className="h-5 w-5"
    //       fill="none"
    //       viewBox="0 0 24 24"
    //       stroke="currentColor"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    //       />
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    //       />
    //     </svg>
    //   ),
    // },
  ];

  return (
    <div
      className={`flex h-screen flex-col bg-gray-800 text-white ${
        isOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img
            className="h-8 w-auto"
            src="/assets/logo.gif"
            alt="OHIF Logo"
          />
          {isOpen && <span className="ml-2">NeuralSight</span>}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full p-1 text-white hover:bg-gray-700"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      {/* User info section */}
      {isOpen && (
        <div className="border-b border-gray-700 px-4 py-3">
          <p className="text-sm font-medium text-white">
            {authState.user?.first_name || 'User'} : (
            {authState?.user.role
              ? authState.user.role
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              : 'Test User'}
            )
          </p>
          <p className="text-xs text-gray-400">{authState.user?.email || 'user@example.com'}</p>
        </div>
      )}

      {/* Main navigation */}
      <nav className="mt-4 flex-1">
        {mainNavItems.map((item, index) => (
          <NavItem
            key={index}
            {...item}
            isOpen={isOpen}
            isActive={location.pathname === item.to}
          />
        ))}
      </nav>

      {/* Logout section */}
      <div className="mt-auto border-t border-gray-600">
        <NavItem
          to="/logout"
          label="Logout"
          icon={<LogOut className="h-5 w-5" />}
          isOpen={isOpen}
          isActive={location.pathname === '/logout'}
        />
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <div className="rounded-lg bg-white p-6 shadow transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-primary-dark text-sm font-medium">{title}</p>
        <div className="mt-1 flex items-baseline">
          <p className="text-2xl font-semibold text-black">{value}</p>
          {trend && (
            <span className={`ml-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}
              {trend}%
            </span>
          )}
        </div>
        {subtitle && <p className="text-primary-main mt-1 text-sm">{subtitle}</p>}
      </div>
      <div className="bg-primary-light rounded-full p-3">
        <Icon className="text-primary-main h-6 w-6" />
      </div>
    </div>
  </div>
);

const ActivityFeed = ({ activities }) => {
  const [displayCount, setDisplayCount] = useState(5);
  const hasMore = activities.length > displayCount;

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 5, activities.length));
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-black">Recent Activities</h3>

      {/* Scrollable container */}
      <div className="flex flex-col">
        <div className="custom-scrollbar max-h-[600px] overflow-y-auto pr-2">
          <div className="space-y-4">
            {activities.slice(0, displayCount).map((activity, index) => (
              <div
                key={index}
                className="bg-primary-light/10 hover:bg-primary-light/20 flex items-start space-x-4 rounded-md p-3 transition-all duration-300"
              >
                <div className="bg-primary-light rounded-full p-2">
                  <Activity className="text-primary-main h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-black">{activity.user_name}</p>
                  <p className="text-primary-dark text-sm">{activity.action}</p>
                  <p className="text-primary-light text-xs">
                    {new Date(activity.timestamp).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show More button */}
        {hasMore && (
          <button
            onClick={loadMore}
            className="bg-primary-light/20 text-primary-main hover:bg-primary-light/30 mt-4 flex items-center justify-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            <span>Show More</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style
        jsx
        global
      >{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #666;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default ActivityFeed;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const base_url = process.env.REACT_APP_API_BASE;
  const { authState } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${base_url}/stats/dashboard`, {
          headers: {
            Authorization: `Bearer ${authState?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authState?.token) {
      fetchDashboardData();
    }
  }, [base_url, authState?.token]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="border-primary-main h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</div>;
  }

  const stats = dashboardData?.client_admin_stats;

  return (
    <div className="bg-primary-light/5 min-h-full p-6">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard Overview</h1>
          <p className="text-primary-dark text-sm">
            Monitor your hospital's key metrics and activities
          </p>
        </div>
        <div className="text-primary-main flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="space-y-6 xl:col-span-3">
          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Total Users"
              value={stats?.total_users || 0}
              subtitle="Across all roles"
              icon={Users}
            />
            <StatsCard
              title="Daily Active Users"
              value={stats?.user_activity?.daily_active_users || 0}
              subtitle="Last 24 hours"
              icon={UserCheck}
              trend={15}
            />
            <StatsCard
              title="Total Reports"
              value={stats?.total_reports || 0}
              subtitle="Created reports"
              icon={FileText}
            />
            <StatsCard
              title="Total Shares"
              value={stats?.total_shares || 0}
              subtitle="Shared studies"
              icon={Share2}
            />
            <StatsCard
              title="Weekly Active Users"
              value={stats?.user_activity?.weekly_active_users || 0}
              subtitle="Last 7 days"
              icon={Activity}
            />
            <StatsCard
              title="Monthly Active Users"
              value={stats?.user_activity?.monthly_active_users || 0}
              subtitle="Last 30 days"
              icon={UserCheck}
            />
          </div>

          {/* Reports Section */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-black">Recent Reports</h3>
            <ReportsTable />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="xl:col-span-1">
          <ActivityFeed activities={stats?.recent_activities || []} />
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = () => (
  <DashboardLayout>
    <Dashboard />
  </DashboardLayout>
);
