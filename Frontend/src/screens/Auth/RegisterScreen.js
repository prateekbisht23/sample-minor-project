import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import useAuth from '../../hooks/useAuth';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      // Navigation will be handled by the auth state change
    } catch (error) {
      // Error is already handled by the context and displayed in UI
      console.error('Registration error:', error);
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
              Join CivicSight-AI
            </Text>
            <Text className="text-gray-400 text-center">
              Create an account to start reporting issues
            </Text>
          </View>

          {/* Registration Form */}
          <Card variant="dark" padding="lg" style={{ marginBottom: 24 }}>
            <Text className="text-2xl font-bold text-white mb-6 text-center">
              Create Account
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
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
              error={errors.confirmPassword}
            />

            {error && (
              <View className="bg-error-500/20 border border-error-500 rounded-lg p-3 mb-4">
                <Text className="text-error-500 text-sm text-center">
                  {error}
                </Text>
              </View>
            )}

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              style={{ marginTop: 8 }}
            />

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">Already have an account? </Text>
              <Button
                title="Sign In"
                variant="ghost"
                onPress={() => navigation.navigate('Login')}
                textStyle={{ color: '#7c3aed' }}
              />
            </View>
          </Card>

          {/* Password Requirements */}
          <Card variant="primary" padding="md">
            <Text className="text-white font-semibold mb-2 text-center">
              Password Requirements
            </Text>
            <Text className="text-primary-100 text-sm text-center">
              • At least 6 characters{'\n'}
              • One uppercase letter{'\n'}
              • One lowercase letter{'\n'}
              • One number
            </Text>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
