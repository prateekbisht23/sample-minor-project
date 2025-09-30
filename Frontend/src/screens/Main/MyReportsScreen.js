import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import IssueListItem from '../../components/IssueListItem';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import { useIssues } from '../../context/IssueContext';
import issueService from '../../services/issueService';

const MyReportsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { userIssues, setUserIssues, setLoading, isLoading } = useIssues();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    status: null,
    category: null,
  });

  useEffect(() => {
    loadUserIssues();
  }, []);

  const loadUserIssues = async () => {
    try {
      setLoading(true);
      const response = await issueService.getUserIssues();
      if (response.success) {
        setUserIssues(response.data.issues, response.data.pagination);
      }
    } catch (error) {
      console.error('Error loading user issues:', error);
      Alert.alert('Error', 'Failed to load your reports');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserIssues();
    setRefreshing(false);
  };

  const handleIssuePress = (issue) => {
    // Navigate to issue detail screen
    console.log('Issue pressed:', issue);
  };

  const handleReportPress = () => {
    navigation.navigate('Camera');
  };

  const handleFilterPress = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value,
    }));
  };

  const filteredIssues = (userIssues || []).filter(issue => {
    if (filters.status && issue.status !== filters.status) return false;
    if (filters.category && issue.category !== filters.category) return false;
    return true;
  });

  const getStatusCounts = () => {
    const counts = {
      PENDING: 0,
      VERIFIED: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      REJECTED: 0,
    };
    
    (userIssues || []).forEach(issue => {
      if (issue && issue.status && counts.hasOwnProperty(issue.status)) {
        counts[issue.status] = (counts[issue.status] || 0) + 1;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-text-primary mb-2">My Reports</Text>
          <Text className="text-text-tertiary">
            Track the status of your reported issues
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              <Card variant="primary" padding="md" style={{ minWidth: 100 }}>
                <Text className="text-2xl font-bold text-primary-600 text-center">
                  {userIssues.length}
                </Text>
                <Text className="text-primary-600 text-sm text-center">Total</Text>
              </Card>
              
              <Card variant="default" padding="md" style={{ minWidth: 100 }}>
                <Text className="text-2xl font-bold text-success text-center">
                  {statusCounts.RESOLVED}
                </Text>
                <Text className="text-text-tertiary text-sm text-center">Resolved</Text>
              </Card>
              
              <Card variant="default" padding="md" style={{ minWidth: 100 }}>
                <Text className="text-2xl font-bold text-warning text-center">
                  {statusCounts.IN_PROGRESS}
                </Text>
                <Text className="text-text-tertiary text-sm text-center">In Progress</Text>
              </Card>
              
              <Card variant="default" padding="md" style={{ minWidth: 100 }}>
                <Text className="text-2xl font-bold text-info text-center">
                  {statusCounts.PENDING}
                </Text>
                <Text className="text-text-tertiary text-sm text-center">Pending</Text>
              </Card>
            </View>
          </ScrollView>
        </View>

        {/* Filters */}
        <View className="px-6 mb-4">
          <Text className="text-text-primary font-semibold mb-3">Filter by Status</Text>
          <View className="flex-row flex-wrap">
            {['PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(status => (
              <TouchableOpacity
                key={status}
                className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                  filters.status === status 
                    ? 'bg-primary-500' 
                    : 'bg-dark-700'
                }`}
                onPress={() => handleFilterPress('status', status)}
              >
                <Text className={`text-sm ${
                  filters.status === status ? 'text-white' : 'text-text-secondary'
                }`}>
                  {status.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Issues List */}
        <View className="px-6">
          {isLoading ? (
            <View className="py-8 items-center">
              <Text className="text-text-tertiary">Loading your reports...</Text>
            </View>
          ) : filteredIssues.length === 0 ? (
            <Card variant="default" padding="lg" style={{ alignItems: 'center' }}>
              <Text className="text-4xl mb-4">📋</Text>
              <Text className="text-lg font-semibold text-text-primary mb-2">
                No reports found
              </Text>
              <Text className="text-text-tertiary text-center mb-4">
                {userIssues.length === 0 
                  ? "You haven't reported any issues yet."
                  : "No reports match your current filters."
                }
              </Text>
              <Button
                title="Report New Issue"
                onPress={handleReportPress}
                icon={<Text className="text-white mr-2">📷</Text>}
              />
            </Card>
          ) : (
            filteredIssues.map((issue, index) => (
              <IssueListItem
                key={issue._id || index}
                issue={issue}
                onPress={handleIssuePress}
                showStatus={true}
                showPriority={true}
                style={{ marginBottom: 12 }}
              />
            ))
          )}
        </View>

        {/* Floating Action Button */}
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            className="w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg"
            onPress={handleReportPress}
            style={{
              shadowColor: '#a855f7',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-white text-2xl">+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyReportsScreen;
