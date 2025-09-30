import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getLocationFromImageOrCurrent } from '../../utils/exifUtils';

const { width, height } = Dimensions.get('window');

const FLASH_MODES = {
  off: 'off',
  on: 'on',
  auto: 'auto',
};

const CameraScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [flashMode, setFlashMode] = useState(FLASH_MODES.off);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const { location, getCurrentLocation } = useGeolocation();

  // Request permission on component mount
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center">
        <ActivityIndicator size="large" color="#a855f7" />
        <Text className="text-text-primary text-lg mt-4">Loading camera...</Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7, // Reduced quality for faster capture
        base64: false,
        exif: false, // Disable EXIF to speed up capture
      });

      if (photo?.uri) {
        // Navigate immediately with current location, extract location in background
        navigation.navigate('ReportForm', {
          imageUri: photo.uri,
          location: location, // Use current location immediately
        });
        
        // Extract location from image in background (optional)
        try {
          const imageLocation = await getLocationFromImageOrCurrent(photo.uri, getCurrentLocation);
          // You could update the location in the form if needed
        } catch (locationError) {
          console.log('Location extraction failed, using current location:', locationError);
        }
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        exif: false,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        // Extract location from image EXIF data or use current location
        const imageLocation = await getLocationFromImageOrCurrent(result.assets[0].uri, getCurrentLocation);
        
        navigation.navigate('ReportForm', {
          imageUri: result.assets[0].uri,
          location: imageLocation || location,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlashMode = () => {
    setFlashMode(
      flashMode === FLASH_MODES.off
        ? FLASH_MODES.on
        : flashMode === FLASH_MODES.on
        ? FLASH_MODES.auto
        : FLASH_MODES.off
    );
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case FLASH_MODES.on:
        return '💡';
      case FLASH_MODES.auto:
        return '🔆';
      default:
        return '💡';
    }
  };

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center px-6">
        <Text className="text-6xl mb-4">📷</Text>
        <Text className="text-text-primary text-xl font-bold mb-4 text-center">
          Camera Access Required
        </Text>
        <Text className="text-text-tertiary text-center mb-6">
          This app needs camera access to capture civic issues. Please grant permission to continue.
        </Text>
        <TouchableOpacity
          className="bg-primary-500 px-6 py-3 rounded-lg"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flashMode}
      />
      
      {/* Top Controls */}
      <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center p-4 pt-12">
        <TouchableOpacity
          className="w-12 h-12 bg-black/50 rounded-full items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white text-xl">✕</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="w-12 h-12 bg-black/50 rounded-full items-center justify-center"
          onPress={toggleFlashMode}
        >
          <Text className="text-white text-xl">{getFlashIcon()}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View className="absolute bottom-0 left-0 right-0 p-6 pb-12">
        <View className="flex-row items-center justify-between">
          {/* Gallery Button */}
          <TouchableOpacity
            className="w-16 h-16 bg-black/50 rounded-full items-center justify-center"
            onPress={pickImageFromGallery}
          >
            <Text className="text-white text-2xl">🖼️</Text>
          </TouchableOpacity>

          {/* Capture Button */}
          <TouchableOpacity
            className={`w-20 h-20 rounded-full items-center justify-center ${
              isCapturing ? 'bg-gray-600' : 'bg-white'
            }`}
            onPress={takePicture}
            disabled={isCapturing}
          >
            <View className={`w-16 h-16 rounded-full ${
              isCapturing ? 'bg-gray-400' : 'bg-white'
            }`} />
          </TouchableOpacity>

          {/* Switch Camera Button */}
          <TouchableOpacity
            className="w-16 h-16 bg-black/50 rounded-full items-center justify-center"
            onPress={toggleCameraFacing}
          >
            <Text className="text-white text-2xl">🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <Text className="text-white text-center mt-4 text-sm opacity-80">
          {isCapturing ? 'Capturing...' : 'Tap to capture or swipe for gallery'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
});

export default CameraScreen;