import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useAuth from '../../hooks/useAuth';
import { useIssues } from '../../context/IssueContext';
import issueService from '../../services/issueService';
import { ISSUE_CATEGORIES, PRIORITY_LEVELS } from '../../config/constants';
import { CATEGORY_PICKER_CONFIG } from '../../config/categories';
import { useGeolocation } from '../../hooks/useGeolocation';

const ReportFormScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { addIssue } = useIssues();
  const { imageUri, location: initialLocation } = route.params || {};
  const { location: currentLocation, getCurrentLocation } = useGeolocation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasError, setHasError] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  useEffect(() => {
    // Reset form data when component mounts
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
    });
    setAiAnalysis(null);
    setErrors({});
    setHasError(false);
    
    if (imageUri) {
      analyzeImage();
    }
  }, [imageUri]);

  // Update selected location when current location changes
  useEffect(() => {
    if (currentLocation && !selectedLocation) {
      setSelectedLocation(currentLocation);
    }
  }, [currentLocation, selectedLocation]);

  const analyzeImage = async () => {
    if (!imageUri) return;

    try {
      setIsAnalyzing(true);
      setHasError(false);
      const response = await issueService.classifyImage(imageUri);
      
      if (response?.success && response?.data) {
        setAiAnalysis(response.data);
        // Pre-fill title and description based on AI analysis
        if (response.data.enhancedTitle) {
          setFormData(prev => ({ ...prev, title: response.data.enhancedTitle }));
        }
        if (response.data.enhancedDescription) {
          setFormData(prev => ({ ...prev, description: response.data.enhancedDescription }));
        }
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      setHasError(true);
      // Continue without AI analysis - don't block the user
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setHasError(false);
      
      const issueData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        latitude: selectedLocation?.latitude || 49.981636,
        longitude: selectedLocation?.longitude || 19.944382,
        imageUri: imageUri,
      };

      const response = await issueService.submitIssueWithAIImage(issueData);
      
      if (response?.success && response?.data?.issue) {
        addIssue(response.data.issue);
        Alert.alert(
          'Success',
          'Issue reported successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('MyReports') }]
        );
      } else {
        throw new Error(response?.message || 'Failed to submit issue');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setHasError(true);
      Alert.alert(
        'Error', 
        error.message || 'Failed to submit issue. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleLocationChange = async () => {
    try {
      setIsUpdatingLocation(true);
      const newLocation = await getCurrentLocation();
      if (newLocation) {
        setSelectedLocation(newLocation);
        Alert.alert('Success', 'Location updated successfully!');
      } else {
        Alert.alert('Error', 'Unable to get current location. Please try again.');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      Alert.alert('Error', 'Failed to update location. Please check your location permissions.');
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const handleMapSelection = () => {
    // Navigate to map screen for location selection
    navigation.navigate('Map', {
      onLocationSelect: (location) => {
        setSelectedLocation(location);
        // Don't call navigation.goBack() here, let the map handle it
      }
    });
  };

  const getCategoryInfo = (categoryId) => {
    return ISSUE_CATEGORIES.find(cat => cat.id === categoryId) || ISSUE_CATEGORIES[0];
  };

  const getPriorityInfo = (priorityId) => {
    return PRIORITY_LEVELS.find(p => p.id === priorityId) || PRIORITY_LEVELS[0];
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-dark-800">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-dark-700 items-center justify-center"
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
          
          <Text className="text-text-primary text-lg font-semibold">Report an issue</Text>
          
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Image Preview */}
          {imageUri && (
            <View className="px-4 py-4">
              <Image
                source={{ uri: imageUri }}
                className="w-full h-48 rounded-2xl"
                resizeMode="cover"
              />
            </View>
          )}

          {/* AI Analysis */}
          {aiAnalysis && (
            <View className="px-4 mb-4">
              <Card variant="primary" padding="md">
                <Text className="text-text-primary font-semibold mb-2">AI Analysis</Text>
                <Text className="text-text-secondary text-sm">
                  {aiAnalysis.description}
                </Text>
                <Text className="text-text-tertiary text-xs mt-1">
                  Confidence: {Math.round((aiAnalysis.confidence || 0) * 100)}%
                </Text>
              </Card>
            </View>
          )}

          {/* AI Analysis Error */}
          {hasError && !aiAnalysis && (
            <View className="px-4 mb-4">
              <Card variant="default" padding="md">
                <Text className="text-warning text-sm text-center">
                  AI analysis failed, but you can still proceed with manual categorization.
                </Text>
              </Card>
            </View>
          )}

          {/* Form */}
          <View className="px-4">
            <Card variant="elevated" padding="lg">

              {/* Issue Location */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-text-primary mb-3">
                  Issue location
                </Text>
                <View className="bg-dark-700 rounded-xl p-4">
                  <Text className="text-text-primary font-medium">
                    {selectedLocation?.address || 'st. Herbowa, Swoszowice'}
                  </Text>
                  <Text className="text-text-tertiary text-sm mt-1">
                    {selectedLocation?.latitude?.toFixed(6) || '49.981636'}, {selectedLocation?.longitude?.toFixed(6) || '19.944382'}
                  </Text>
                  <View className="flex-row mt-2 space-x-4">
                    <TouchableOpacity 
                      onPress={handleLocationChange}
                      disabled={isUpdatingLocation}
                    >
                      <View className="flex-row items-center">
                        <Text className="text-primary-500 font-medium">
                          {isUpdatingLocation ? 'Updating...' : 'Use Current'}
                        </Text>
                        {isUpdatingLocation && (
                          <ActivityIndicator size="small" color="#a855f7" style={{ marginLeft: 8 }} />
                        )}
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      onPress={handleMapSelection}
                      disabled={isUpdatingLocation}
                    >
                      <View className="flex-row items-center">
                        <Text className="text-primary-500 font-medium">📍 Select on Map</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Issue Priority */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-text-primary mb-3">
                  Issue priority
                </Text>
                <View className="flex-row">
                  {PRIORITY_LEVELS.map((priority) => (
                    <TouchableOpacity
                      key={priority.id}
                      className={`flex-1 py-3 rounded-xl mr-2 ${
                        formData.priority === priority.id
                          ? 'bg-primary-500'
                          : 'bg-dark-700'
                      }`}
                      onPress={() => handleInputChange('priority', priority.id)}
                    >
                      <Text className={`text-center font-medium ${
                        formData.priority === priority.id
                          ? 'text-white'
                          : 'text-text-secondary'
                      }`}>
                        {priority.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Title Input */}
              <Input
                label="Issue Title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                error={errors.title}
              />

              {/* Description Input */}
              <Input
                label="Description"
                placeholder="Provide more details about the issue"
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={4}
                error={errors.description}
              />

              {/* Submit Button */}
              <Button
                title={isSubmitting ? 'Submitting...' : 'Submit issue'}
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting || isAnalyzing}
                style={{ marginTop: 8 }}
              />

              {/* Loading States */}
              {isAnalyzing && (
                <View className="items-center mt-4">
                  <ActivityIndicator size="small" color="#a855f7" />
                  <Text className="text-text-tertiary text-sm mt-2">
                    Analyzing image with AI...
                  </Text>
                </View>
              )}

              {isSubmitting && (
                <View className="items-center mt-4">
                  <ActivityIndicator size="small" color="#a855f7" />
                  <Text className="text-text-tertiary text-sm mt-2">
                    Uploading and processing your report...
                  </Text>
                </View>
              )}
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ReportFormScreen;
