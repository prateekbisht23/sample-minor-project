import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { IssueProvider } from './src/context/IssueContext';
import AuthStack from './src/navigation/AuthStack';
import AppTabs from './src/navigation/AppTabs';
import AuthLoader from './src/components/AuthLoader';
import './global.css';

// Enhanced error reporting
const originalConsoleError = console.error;
console.error = (...args) => {
  // Add stack trace information
  const error = new Error();
  const stack = error.stack;
  
  // Extract file path and line number from stack
  const stackLines = stack.split('\n');
  const relevantLine = stackLines.find(line => 
    line.includes('src/') && !line.includes('node_modules')
  );
  
  if (relevantLine) {
    const match = relevantLine.match(/\((.+):(\d+):(\d+)\)/);
    if (match) {
      const [, filePath, line, column] = match;
      console.log(`\n🔍 Error Location: ${filePath}:${line}:${column}`);
    }
  }
  
  originalConsoleError.apply(console, args);
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while authentication state is being determined
  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Root App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <IssueProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </IssueProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}