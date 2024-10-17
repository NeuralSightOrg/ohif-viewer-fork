import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Entry = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const url = window.config.apiBaseURL;

  const queryParams = new URLSearchParams(location.search);

  const label = queryParams.get('label');
  const token = queryParams.get('token');

  useEffect(() => {
    const authenticateAndNavigate = async () => {
      if (label && token) {
        try {
          const response = await fetch(`${url}/hospital/entry`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to authenticate');
          }

          if (localStorage.getItem('x-orthanc-label')) {
            localStorage.removeItem('x-orthanc-label');
          }

          // Save the new label and token if needed
          localStorage.setItem('x-orthanc-label', label);
          localStorage.setItem('authToken', token);

          // Redirect back to the dashboard
          navigate('/');
        } catch (error) {
          console.error('Error during authentication:', error);
          alert('Authentication Error. Please try again !');
          window.location.href = window.config?.dashboardURL;
        }
      }
    };

    authenticateAndNavigate();
  }, [label, token]);

  return <></>;
};

export default Entry;
