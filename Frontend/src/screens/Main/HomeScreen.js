import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import IssueListItem from '../../components/IssueListItem';
import useAuth from '../../hooks/useAuth';
import { useIssues } from '../../context/IssueContext';
import issueService from '../../services/issueService';
import { ISSUE_STATUS } from '../../config/constants';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    userIssues, 
    setUserIssues, 
    nearbyIssues, 
    setNearbyIssues, 
    setLoading, 
    isLoading 
  } = useIssues();
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setHasError(false);
      
      console.log('Loading data, user authenticated:', !!user);
      
      // Always load public issues
      try {
        const publicIssuesResponse = await issueService.getPublicIssues({ 
          limit: 10, 
          sort: 'createdAt', 
          order: 'desc' 
        });
        
        console.log('Public issues response:', publicIssuesResponse);
        
        // Set public issues (for "Reports from others" section)
        if (publicIssuesResponse?.issues?.length > 0) {
          setNearbyIssues(publicIssuesResponse.issues);
        } else {
          console.log('No public issues found');
          setNearbyIssues([]);
        }
      } catch (publicError) {
        console.error('Error loading public issues:', publicError);
        setNearbyIssues([]);
      }
      
      // Load user's issues only if authenticated
      if (user) {
        try {
          const userIssuesResponse = await issueService.getUserIssues({ 
            limit: 1, 
            sort: 'createdAt', 
            order: 'desc' 
          });
          
          console.log('User issues response:', userIssuesResponse);
          
          // Set user's latest issue (for status card)
          if (userIssuesResponse?.issues?.length > 0) {
            setUserIssues(userIssuesResponse.issues);
          }
        } catch (userError) {
          console.log('User issues failed (not authenticated):', userError.message);
          // Don't set hasError for user issues failure
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleIssuePress = (issue) => {
    // Navigate to issue detail screen
    console.log('Issue pressed:', issue);
  };

  const handleReportPress = () => {
    navigation.navigate('Camera');
  };

  // Get the user's latest issue for the status card
  const currentIssue = userIssues?.[0] || null;

  const getStatusProgress = (status) => {
    const statusOrder = ['PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED'];
    const currentIndex = statusOrder.indexOf(status);
    return {
      current: currentIndex + 1,
      total: statusOrder.length,
      percentage: ((currentIndex + 1) / statusOrder.length) * 100,
    };
  };

  const progress = currentIssue ? getStatusProgress(currentIssue.status) : null;

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#a855f7"
            colors={['#a855f7']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-2xl font-bold text-text-primary">Cracow</Text>
              <Text className="text-text-tertiary">
                Hello {user?.email ? user.email.split('@')[0] : 'User'}!
              </Text>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center">
              <Text className="text-white text-lg">👤</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-lg text-text-primary font-semibold">
            Take care of the roads
          </Text>
        </View>

        {/* Main Content Card */}
        <Card variant="elevated" padding="lg" style={{ margin: 24, marginTop: 0 }}>
          {/* Current Issue Status Card */}
          {currentIssue ? (
            <Card variant="primary" padding="md" style={{ marginBottom: 24 }}>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-2">❄️</Text>
                  <Text className="text-lg font-semibold text-text-primary">
                    {currentIssue.title}
                  </Text>
                </View>
                <View className="bg-error-500 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-medium">
                    {currentIssue.priority || 'High'}
                  </Text>
                </View>
              </View>
              
              <Text className="text-text-tertiary text-sm mb-4">
                Issue number: #{currentIssue._id}
              </Text>

              {/* Progress Bar */}
              {progress && (
                <View className="mb-4">
                  <View className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </View>
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-xs text-text-muted">Pending</Text>
                    <Text className="text-xs text-text-muted">In progress</Text>
                    <Text className="text-xs text-text-muted">Completed</Text>
                  </View>
                </View>
              )}
            </Card>
          ) : (
            <Card variant="default" padding="md" style={{ marginBottom: 24 }}>
              <View className="items-center py-8">
                <Text className="text-4xl mb-2">📋</Text>
                <Text className="text-text-primary text-lg font-semibold mb-2">
                  No Active Reports
                </Text>
                <Text className="text-text-tertiary text-center">
                  You haven't reported any issues yet. Tap the camera button to get started!
                </Text>
              </View>
            </Card>
          )}

          {/* Reports from Others */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-text-primary">
                Reports from others
              </Text>
              <TouchableOpacity>
                <Text className="text-primary-500 text-sm font-medium">
                  Show more
                </Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#a855f7" />
                <Text className="text-text-tertiary mt-2">Loading reports...</Text>
              </View>
            ) : hasError ? (
              <View className="py-8 items-center">
                <Text className="text-error-500 text-center mb-2">
                  Failed to load reports
                </Text>
                <TouchableOpacity 
                  className="bg-primary-500 px-4 py-2 rounded-lg"
                  onPress={loadData}
                >
                  <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
              </View>
            ) : nearbyIssues && nearbyIssues.length > 0 ? (
              nearbyIssues.map((issue, index) => (
                <IssueListItem
                  key={issue._id || index}
                  issue={issue}
                  onPress={handleIssuePress}
                  showDistance={true}
                  style={{ marginBottom: 12 }}
                />
              ))
            ) : (
              <View className="py-8 items-center">
                <Text className="text-4xl mb-2">🔍</Text>
                <Text className="text-text-primary text-lg font-semibold mb-2">
                  No Reports Found
                </Text>
                <Text className="text-text-tertiary text-center">
                  No reports from others in your area yet.
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Quick Report Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            className="bg-primary-500 rounded-2xl py-4 items-center shadow-lg"
            onPress={handleReportPress}
            style={{
              shadowColor: '#a855f7',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-white text-lg font-semibold">
              📷 Report New Issue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
