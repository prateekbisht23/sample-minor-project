import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from '../screens/Main/HomeScreen';
import MyReportsScreen from '../screens/Main/MyReportsScreen';
import MapScreen from '../screens/Main/MapScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';

// Import reporting screens
import CameraScreen from '../screens/Reporting/CameraScreen';
import ReportFormScreen from '../screens/Reporting/ReportFormScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar with floating camera button
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarStyle?.display === 'none') {
    return null;
  }

  const tabIcons = {
    Home: '🏠',
    MyReports: '📋',
  };

  const tabLabels = {
    Home: 'Home',
    MyReports: 'My Reports',
  };

  return (
    <SafeAreaView className="bg-dark-800">
      <View className="flex-row items-center justify-around px-4 py-2 bg-dark-800 relative">
        {state.routes.map((route, index) => {
          if (!route || !route.key) return null;
          const { options } = descriptors[route.key] || {};
          const label = tabLabels[route.name] || route.name || 'Unknown';
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center py-2"
            >
              <Text className="text-2xl mb-1">
                {tabIcons[route.name] || '❓'}
              </Text>
              <Text 
                className={`text-xs font-medium ${
                  isFocused ? 'text-primary-400' : 'text-text-muted'
                }`}
              >
                {label}
              </Text>
              {isFocused && (
                <View className="w-1 h-1 bg-primary-500 rounded-full mt-1" />
              )}
            </TouchableOpacity>
          );
        })}
        
        {/* Floating Camera Button */}
        <TouchableOpacity
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg"
          onPress={() => navigation.navigate('Camera')}
          style={{
            shadowColor: '#a855f7',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text className="text-white text-2xl">📷</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#1e1e2d' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyReports" component={MyReportsScreen} />
      
      {/* Reporting screens (not shown in tabs) */}
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{ 
          tabBarStyle: { display: 'none' }
        }}
      />
      <Tab.Screen 
        name="ReportForm" 
        component={ReportFormScreen}
        options={{ 
          tabBarStyle: { display: 'none' }
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{ 
          tabBarStyle: { display: 'none' }
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;