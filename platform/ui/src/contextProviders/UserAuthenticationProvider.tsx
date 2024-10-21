import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_STATE = {
  user: null,
  enabled: false,
};

export const UserAuthenticationContext = createContext(DEFAULT_STATE);

export function UserAuthenticationProvider({ children, service }) {
  const userAuthenticationReducer = (state, action) => {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.payload.user };
      case 'RESET':
        return DEFAULT_STATE;
      case 'SET_ENABLED':
        return { ...state, enabled: action.payload.enabled };
      case 'SET':
        return { ...state, ...action.payload };
      default:
        return state;
    }
  };

  const [userAuthenticationState, dispatch] = useReducer(userAuthenticationReducer, DEFAULT_STATE);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: { user } });
        dispatch({ type: 'SET_ENABLED', payload: { enabled: true } });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  const getState = useCallback(() => userAuthenticationState, [userAuthenticationState]);

  const setUser = useCallback(user => {
    sessionStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'SET_USER', payload: { user } });
  }, []);

  const getUser = useCallback(() => userAuthenticationState.user, [userAuthenticationState.user]);

  const reset = useCallback(() => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('x-orthanc-label');
    dispatch({ type: 'RESET' });
  }, []);

  const setEnabled = useCallback(enabled => {
    dispatch({ type: 'SET_ENABLED', payload: { enabled } });
  }, []);

  const set = useCallback(payload => {
    dispatch({ type: 'SET', payload });
  }, []);

  useEffect(() => {
    if (service) {
      const api = {
        getState,
        setUser,
        getUser,
        reset,
        setEnabled,
        set,
      };
      service.setServiceImplementation(api);
    }
  }, [getState, service, setUser, getUser, reset, set, setEnabled]);

  const api = {
    getState,
    setUser,
    getUser,
    setEnabled,
    getAuthorizationHeader: service.getAuthorizationHeader,
    handleUnauthenticated: service.handleUnauthenticated,
    reset,
    set,
  };

  return (
    <UserAuthenticationContext.Provider value={[userAuthenticationState, api]}>
      {children}
    </UserAuthenticationContext.Provider>
  );
}

UserAuthenticationProvider.propTypes = {
  children: PropTypes.any,
  service: PropTypes.shape({
    setServiceImplementation: PropTypes.func.isRequired,
    getAuthorizationHeader: PropTypes.func.isRequired,
    handleUnauthenticated: PropTypes.func.isRequired,
  }).isRequired,
};

export const useUserAuthentication = () => useContext(UserAuthenticationContext);
export default UserAuthenticationProvider;
