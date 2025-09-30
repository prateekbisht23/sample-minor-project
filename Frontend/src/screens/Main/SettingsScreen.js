import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useAuth from '../../hooks/useAuth';

const SettingsScreen = ({ navigation }) => {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    darkMode: true,
  });

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      Alert.alert('Success', 'Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-white mb-2">Settings</Text>
          <Text className="text-gray-400">
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Section */}
        <View className="px-6 mb-6">
          <Card variant="dark" padding="lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-white">Profile</Text>
              <Button
                title={isEditing ? 'Save' : 'Edit'}
                variant={isEditing ? 'primary' : 'outline'}
                size="sm"
                onPress={isEditing ? handleUpdateProfile : () => setIsEditing(true)}
              />
            </View>

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View className="flex-row items-center justify-between mt-4">
              <Text className="text-white">Role</Text>
              <Text className="text-gray-400 capitalize">{user?.role || 'User'}</Text>
            </View>
          </Card>
        </View>

        {/* Password Section */}
        <View className="px-6 mb-6">
          <Card variant="dark" padding="lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-white">Password</Text>
              <Button
                title={isChangingPassword ? 'Save' : 'Change'}
                variant={isChangingPassword ? 'primary' : 'outline'}
                size="sm"
                onPress={isChangingPassword ? handleChangePassword : () => setIsChangingPassword(true)}
              />
            </View>

            {isChangingPassword && (
              <>
                <Input
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChangeText={(value) => setPasswordData(prev => ({ ...prev, currentPassword: value }))}
                  secureTextEntry
                />
                <Input
                  label="New Password"
                  value={passwordData.newPassword}
                  onChangeText={(value) => setPasswordData(prev => ({ ...prev, newPassword: value }))}
                  secureTextEntry
                />
                <Input
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChangeText={(value) => setPasswordData(prev => ({ ...prev, confirmPassword: value }))}
                  secureTextEntry
                />
              </>
            )}
          </Card>
        </View>

        {/* Preferences Section */}
        <View className="px-6 mb-6">
          <Card variant="dark" padding="lg">
            <Text className="text-lg font-semibold text-white mb-4">Preferences</Text>
            
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-1">
                <Text className="text-white font-medium">Push Notifications</Text>
                <Text className="text-gray-400 text-sm">Receive updates about your reports</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => handleSettingChange('notifications', value)}
                trackColor={{ false: '#374151', true: '#7c3aed' }}
                thumbColor={settings.notifications ? '#ffffff' : '#9ca3af'}
              />
            </View>

            <View className="flex-row items-center justify-between py-3 border-t border-gray-700">
              <View className="flex-1">
                <Text className="text-white font-medium">Location Tracking</Text>
                <Text className="text-gray-400 text-sm">Allow location access for reports</Text>
              </View>
              <Switch
                value={settings.locationTracking}
                onValueChange={(value) => handleSettingChange('locationTracking', value)}
                trackColor={{ false: '#374151', true: '#7c3aed' }}
                thumbColor={settings.locationTracking ? '#ffffff' : '#9ca3af'}
              />
            </View>

            <View className="flex-row items-center justify-between py-3 border-t border-gray-700">
              <View className="flex-1">
                <Text className="text-white font-medium">Dark Mode</Text>
                <Text className="text-gray-400 text-sm">Use dark theme</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => handleSettingChange('darkMode', value)}
                trackColor={{ false: '#374151', true: '#7c3aed' }}
                thumbColor={settings.darkMode ? '#ffffff' : '#9ca3af'}
              />
            </View>
          </Card>
        </View>

        {/* App Info Section */}
        <View className="px-6 mb-6">
          <Card variant="dark" padding="lg">
            <Text className="text-lg font-semibold text-white mb-4">App Information</Text>
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-400">Version</Text>
              <Text className="text-white">1.0.0</Text>
            </View>
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-400">Build</Text>
              <Text className="text-white">2024.01.15</Text>
            </View>
          </Card>
        </View>

        {/* Logout Section */}
        <View className="px-6 mb-8">
          <Button
            title="Logout"
            variant="danger"
            onPress={handleLogout}
            icon={<Text className="text-white mr-2">🚪</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
