import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuthentication } from '@ohif/ui';

const Logout = () => {
  const navigate = useNavigate();
  const [, { setUser, setEnabled }] = useUserAuthentication();

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('x-orthanc-label');

      setUser(null);
      setEnabled(false);

      navigate('/login');
    };

    handleLogout();
  }, [navigate, setUser, setEnabled]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
