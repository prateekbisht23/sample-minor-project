import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import useAuth from '../../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      await login(formData);
      // Navigation will be handled by the auth state change
    } catch (error) {
      // Error is already handled by the context and displayed in UI
      console.error('Login error:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-4xl mb-2">🏛️</Text>
            <Text className="text-3xl font-bold text-white mb-2">
              CivicSight-AI
            </Text>
            <Text className="text-gray-400 text-center">
              Report civic issues and make your city better
            </Text>
          </View>

          {/* Login Form */}
          <Card variant="dark" padding="lg" style={{ marginBottom: 24 }}>
            <Text className="text-2xl font-bold text-white mb-6 text-center">
              Welcome Back
            </Text>

            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              error={errors.password}
            />

            {error && (
              <View className="bg-error-500/20 border border-error-500 rounded-lg p-3 mb-4">
                <Text className="text-error-500 text-sm text-center">
                  {error}
                </Text>
              </View>
            )}

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              style={{ marginTop: 8 }}
            />

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">Don't have an account? </Text>
              <Button
                title="Sign Up"
                variant="ghost"
                onPress={() => navigation.navigate('Register')}
                textStyle={{ color: '#7c3aed' }}
              />
            </View>
          </Card>

          {/* Demo Credentials */}
          <Card variant="primary" padding="md">
            <Text className="text-white font-semibold mb-2 text-center">
              Demo Credentials
            </Text>
            <Text className="text-primary-100 text-sm text-center mb-1">
              Email: demo@civicsight.com
            </Text>
            <Text className="text-primary-100 text-sm text-center">
              Password: demo123
            </Text>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
