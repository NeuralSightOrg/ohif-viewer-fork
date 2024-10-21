import React, { useEffect, useState } from 'react';
import { useUserAuthentication } from '@ohif/ui';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [{ user, enabled }, { setUser, setEnabled }] = useUserAuthentication();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = process.env.REACT_APP_API_BASE;


  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login', { state: { from: location } });
        setLoading(false);
        return;
      }

      try {
        await axios.get(`${baseUrl}/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setEnabled(true);
        } else {
          throw new Error('User data not found');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('x-orthanc-label');
        sessionStorage.removeItem('user');
        setUser(null);
        setEnabled(false);
        navigate('/login', { state: { from: location } });
      } finally {
        setLoading(false);
      }
    };

    if (!user || !enabled) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [navigate, setUser, setEnabled, user, enabled, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate('/login', { state: { from: location } })}>Go to Login</button>
      </div>
    );
  }

  if (!user || !enabled) {
    return null;
  }

  return children;
};

export default PrivateRoute;
