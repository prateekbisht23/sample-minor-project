import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { DEFAULT_LOCATION } from '../config/constants';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if location services are enabled
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
        maximumAge: 60000,
      });

      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocode to get address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0];
      const formattedAddress = address
        ? `${address.street || ''} ${address.name || ''}, ${address.city || ''}`.trim()
        : 'Unknown location';

      const locationData = {
        latitude,
        longitude,
        address: formattedAddress,
        city: address?.city || 'Unknown',
        timestamp: new Date().toISOString(),
      };

      setLocation(locationData);
      return locationData;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get location';
      setError(errorMessage);
      
      // Fallback to default location
      const fallbackLocation = {
        ...DEFAULT_LOCATION,
        timestamp: new Date().toISOString(),
      };
      setLocation(fallbackLocation);
      
      return fallbackLocation;
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationFromCoords = async (latitude, longitude) => {
    try {
      setIsLoading(true);
      setError(null);

      // Reverse geocode to get address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0];
      const formattedAddress = address
        ? `${address.street || ''} ${address.name || ''}, ${address.city || ''}`.trim()
        : 'Unknown location';

      const locationData = {
        latitude,
        longitude,
        address: formattedAddress,
        city: address?.city || 'Unknown',
        timestamp: new Date().toISOString(),
      };

      setLocation(locationData);
      return locationData;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get address';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  // Get location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    error,
    isLoading,
    getCurrentLocation,
    getLocationFromCoords,
    clearLocation,
  };
};
