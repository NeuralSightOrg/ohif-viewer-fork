import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User, UserPermissions } from '../types/Auth';

const AuthContext = createContext<{
  authState: AuthState;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  hasPermission: (permission: UserPermissions) => boolean;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check localStorage on initial load
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setAuthState({
        token: parsedAuth.token,
        user: parsedAuth.user,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = (data: { token: string; user: User }) => {
    const newAuthState = {
      token: data.token,
      user: data.user,
      isAuthenticated: true,
    };

    // Update state
    setAuthState(newAuthState);

    // Store in localStorage
    localStorage.setItem('auth', JSON.stringify(newAuthState));
  };

  const logout = () => {
    // Clear state
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
    });

    // Clear localStorage
    localStorage.removeItem('auth');
  };

  const hasPermission = (permission: UserPermissions): boolean => {
    return authState.user?.permissions.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
