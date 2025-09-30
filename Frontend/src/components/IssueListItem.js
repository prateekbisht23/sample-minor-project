import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Card from './Card';
import { ISSUE_CATEGORIES, ISSUE_STATUS, PRIORITY_LEVELS } from '../config/constants';

const IssueListItem = ({
  issue,
  onPress,
  showStatus = true,
  showPriority = true,
  showDistance = false,
  style,
}) => {
  // Safety check for issue
  if (!issue) {
    return null;
  }

  const getCategoryInfo = (category) => {
    if (!category) return ISSUE_CATEGORIES[ISSUE_CATEGORIES.length - 1];
    return ISSUE_CATEGORIES.find(cat => cat.id === category.toLowerCase()) || 
           ISSUE_CATEGORIES[ISSUE_CATEGORIES.length - 1]; // Default to 'Other'
  };

  const getStatusInfo = (status) => {
    if (!status) return ISSUE_STATUS.PENDING;
    return ISSUE_STATUS[status] || ISSUE_STATUS.PENDING;
  };

  const getPriorityInfo = (priority) => {
    if (!priority) return PRIORITY_LEVELS[0];
    return PRIORITY_LEVELS.find(p => p.id === priority.toLowerCase()) || PRIORITY_LEVELS[0];
  };

  const categoryInfo = getCategoryInfo(issue.category);
  const statusInfo = getStatusInfo(issue.status);
  const priorityInfo = getPriorityInfo(issue.priority);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress?.(issue)} style={style}>
      <Card variant="default" padding="md" style={{ marginBottom: 12 }}>
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center mb-1">
              <Text className="text-lg mr-2">{categoryInfo.icon}</Text>
              <Text className="text-base font-semibold text-text-primary flex-1" numberOfLines={1}>
                {issue.title || 'Untitled Issue'}
              </Text>
            </View>
            
            <Text className="text-sm text-text-secondary mb-2" numberOfLines={2}>
              {issue.description || 'No description provided'}
            </Text>
            
            {issue.location && (
              <Text className="text-xs text-text-tertiary" numberOfLines={1}>
                📍 {issue.location}
              </Text>
            )}
          </View>
          
          {showDistance && issue.distance && (
            <Text className="text-xs text-text-tertiary font-medium">
              {issue.distance}
            </Text>
          )}
        </View>

        {/* Issue Image */}
        {issue.mediaUrl && (
          <View className="mb-3">
            <Image
              source={{ 
                uri: issue.mediaUrl.startsWith('http') 
                  ? issue.mediaUrl 
                  : `http://192.168.0.118:3000${issue.mediaUrl}` 
              }}
              className="w-full h-32 rounded-lg"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-2">
            {showStatus && (
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${statusInfo.color}20` }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: statusInfo.color }}
                >
                  {statusInfo.icon} {statusInfo.label}
                </Text>
              </View>
            )}
            
            {showPriority && issue.priority && (
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${priorityInfo.color}20` }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: priorityInfo.color }}
                >
                  {priorityInfo.icon} {priorityInfo.label}
                </Text>
              </View>
            )}
          </View>
          
          <Text className="text-xs text-text-muted">
            {formatDate(issue.createdAt)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default IssueListItem;
