import { useAuth as useAuthContext } from '../context/AuthContext';
import authService from '../services/authService';

export const useAuth = () => {
  const authContext = useAuthContext();

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        await authContext.login(response.data.user, response.data.token);
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      authContext.setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        await authContext.login(response.data.user, response.data.token);
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      authContext.setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authContext.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const response = await authService.updateProfile(updateData);
      
      if (response.success && response.data) {
        authContext.updateUser(response.data.user);
        return response;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      authContext.setError(error.message);
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      authContext.setError(error.message);
      throw error;
    }
  };

  return {
    ...authContext,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };
};

export default useAuth;