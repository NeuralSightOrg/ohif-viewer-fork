import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Remove Orthanc-specific storage item
        localStorage.removeItem('x-orthanc-label');

        // Call auth context logout (this will clear auth state and storage)
        logout();

        // Navigate to login page
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        // Still navigate to login even if there's an error
        navigate('/login', { replace: true });
      }
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  );
};

export default Logout;
