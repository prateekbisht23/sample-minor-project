import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useIssues } from '../../context/IssueContext';
import issueService from '../../services/issueService';
import { ISSUE_CATEGORIES } from '../../config/constants';

const MapScreen = ({ navigation, route }) => {
  const { location, getCurrentLocation } = useGeolocation();
  const { nearbyIssues, setNearbyIssues } = useIssues();
  const [mapRegion, setMapRegion] = useState({
    latitude: 49.981636,
    longitude: 19.944382,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Check if this is for location selection
  const onLocationSelect = route?.params?.onLocationSelect;

  useEffect(() => {
    if (onLocationSelect) {
      setIsSelectingLocation(true);
      // Set initial map region to current location or default
      if (location) {
        setMapRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } else {
      loadNearbyIssues();
    }
  }, [onLocationSelect, location]);

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location]);

  const loadNearbyIssues = async () => {
    try {
      const issues = await issueService.getNearbyIssues(location);
      setNearbyIssues(issues);
    } catch (error) {
      console.error('Error loading nearby issues:', error);
    }
  };

  const handleLocationPress = () => {
    getCurrentLocation();
  };

  const handleReportPress = () => {
    navigation.navigate('Camera');
  };

  const handleMarkerPress = (issue) => {
    setSelectedIssue(issue);
  };

  const handleMapPress = (event) => {
    if (isSelectingLocation) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setSelectedLocation({ latitude, longitude });
    }
  };

  const handleConfirmLocation = async () => {
    if (selectedLocation && onLocationSelect) {
      try {
        // Reverse geocode to get address
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });

        const address = addressResponse[0];
        const formattedAddress = address
          ? `${address.street || ''} ${address.name || ''}, ${address.city || ''}`.trim()
          : 'Selected location';

        const locationData = {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          address: formattedAddress,
          city: address?.city || 'Unknown',
          timestamp: new Date().toISOString(),
        };

        onLocationSelect(locationData);
        navigation.goBack(); // Go back to the previous screen
      } catch (error) {
        console.error('Error getting address:', error);
        onLocationSelect(selectedLocation);
        navigation.goBack(); // Go back even if address lookup fails
      }
    }
  };

  const getCategoryInfo = (category) => {
    return ISSUE_CATEGORIES.find(cat => cat.id === category.toLowerCase()) || 
           ISSUE_CATEGORIES[ISSUE_CATEGORIES.length - 1];
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'VERIFIED': return '#3b82f6';
      case 'IN_PROGRESS': return '#8b5cf6';
      case 'RESOLVED': return '#10b981';
      case 'REJECTED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <View className="flex-1">
        {/* Map */}
        <MapView
          className="flex-1"
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
          mapType="standard"
        >
          {/* User Location Marker */}
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
              description={location.address}
              pinColor="blue"
            />
          )}

          {/* Selected Location Marker (for location selection) */}
          {isSelectingLocation && selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
              description="Tap to confirm this location"
            >
              <View className="w-8 h-8 rounded-full items-center justify-center border-2 border-white bg-primary-500">
                <Text className="text-white text-xs">📍</Text>
              </View>
            </Marker>
          )}

          {/* Issue Markers */}
          {!isSelectingLocation && (nearbyIssues || []).map((issue, index) => {
            const categoryInfo = getCategoryInfo(issue.category);
            return (
              <Marker
                key={issue._id || index}
                coordinate={{
                  latitude: issue.latitude || location?.latitude || 49.981636,
                  longitude: issue.longitude || location?.longitude || 19.944382,
                }}
                title={issue.title}
                description={issue.description}
                onPress={() => handleMarkerPress(issue)}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center border-2 border-white"
                  style={{ backgroundColor: getMarkerColor(issue.status) }}
                >
                  <Text className="text-white text-xs">
                    {categoryInfo.icon}
                  </Text>
                </View>
              </Marker>
            );
          })}
        </MapView>

        {/* Top Controls */}
        <View className="absolute top-4 left-4 right-4">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              className="bg-white rounded-full p-3 shadow-lg"
              onPress={handleLocationPress}
            >
              <Text className="text-lg">📍</Text>
            </TouchableOpacity>
            
            {isSelectingLocation ? (
              <Card variant="default" padding="sm">
                <Text className="text-sm font-medium text-gray-900">
                  {selectedLocation ? "Location selected" : "Tap to select location"}
                </Text>
              </Card>
            ) : (
              <Card variant="default" padding="sm">
                <Text className="text-sm font-medium text-gray-900">
                  {nearbyIssues.length} issues nearby
                </Text>
              </Card>
            )}
          </View>
        </View>

        {/* Bottom Controls */}
        <View className="absolute bottom-4 left-4 right-4">
          {isSelectingLocation ? (
            <View className="flex-row space-x-3">
              <Button
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <Button
                title={selectedLocation ? "Confirm Location" : "Select Location"}
                onPress={handleConfirmLocation}
                disabled={!selectedLocation}
                style={{ flex: 1 }}
              />
            </View>
          ) : (
            <View className="flex-row space-x-3">
              <Button
                title="Report Issue"
                onPress={handleReportPress}
                icon={<Text className="text-white mr-2">📷</Text>}
                style={{ flex: 1 }}
              />
            </View>
          )}
        </View>

        {/* Selected Issue Info */}
        {selectedIssue && (
          <View className="absolute bottom-20 left-4 right-4">
            <Card variant="default" padding="md">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-lg mr-2">
                      {getCategoryInfo(selectedIssue.category).icon}
                    </Text>
                    <Text className="text-lg font-semibold text-gray-900">
                      {selectedIssue.title}
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                    {selectedIssue.description}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {selectedIssue.location || 'Location not specified'}
                  </Text>
                </View>
                <TouchableOpacity
                  className="ml-3"
                  onPress={() => setSelectedIssue(null)}
                >
                  <Text className="text-gray-400 text-lg">✕</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;
