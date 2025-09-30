import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../config/constants';

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: null,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load stored user data on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });
      
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      
      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
          payload: { user, token },
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE, payload: null });
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE, payload: error.message });
    }
  };

  const login = async (userData, token) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      // Store user data and token securely
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: userData, token },
      });
    } catch (error) {
      console.error('Error during login:', error);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.message });
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still dispatch logout even if clearing storage fails
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const setError = (errorMessage) => {
    dispatch({ 
      type: AUTH_ACTIONS.SET_ERROR, 
      payload: errorMessage 
    });
  };

  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user: userData, token: state.token },
    });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    setError,
    updateUser,
    loadStoredUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
