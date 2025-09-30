import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthLoader = () => {
  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center">
          <ActivityIndicator size="large" color="#a855f7" />
          <Text className="text-text-primary text-lg font-semibold mt-4">
            Loading CivicSight-AI
          </Text>
          <Text className="text-text-tertiary text-sm mt-2 text-center">
            Initializing your experience...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthLoader;
