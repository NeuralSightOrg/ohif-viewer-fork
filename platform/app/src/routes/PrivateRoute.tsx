import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { LoadingIndicatorProgress } from '@ohif/ui';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { authState, logout } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    const verifyToken = async () => {
      // If no auth state exists, redirect to login
      if (!authState.token) {
        setError('No token found. Please log in.');
        setIsVerifying(false);
        return;
      }

      try {
        // Verify token with backend
        await axios.get(`${baseUrl}/verify`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        // Token is valid, update verification state
        setIsVerifying(false);
        setError(null);
      } catch (error) {
        console.error('Token verification failed:', error);
        setError('Session expired. Please log in again.');

        // Clear auth state and storage
        logout();

        // Clear additional storage items
        localStorage.removeItem('x-orthanc-label');

        setIsVerifying(false);
      }
    };

    if (authState.isAuthenticated) {
      verifyToken();
    } else {
      setIsVerifying(false);
    }
  }, [authState.isAuthenticated, authState.token, logout, baseUrl]);

  // Show loading state
  if (isVerifying) {
    // return (
    //   <div className="flex min-h-screen items-center justify-center">
    //     <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
    //   </div>
    // );
    return (
      <LoadingIndicatorProgress
        className={undefined}
        textBlock={undefined}
        progress={undefined}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">{error}</div>
          <button
            onClick={() => Navigate('/login')}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Render children if all checks pass
  return children;
};

export default PrivateRoute;

export const withPermission = permission => WrappedComponent => {
  return function WithPermissionComponent(props) {
    const { authState, hasPermission } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    if (!authState.isAuthenticated) {
      return (
        <Navigate
          to="/login"
          state={{ from: location }}
          replace
        />
      );
    }

    if (!hasPermission(permission)) {
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

    return <WrappedComponent {...props} />;
  };
};
