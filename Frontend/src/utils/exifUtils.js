import * as ImagePicker from 'expo-image-picker';

/**
 * Extract GPS coordinates from image EXIF data
 * @param {string} imageUri - URI of the image
 * @returns {Promise<Object|null>} - Location object with latitude and longitude, or null if not found
 */
export const extractLocationFromImage = async (imageUri) => {
  try {
    // Get image info including EXIF data
    const imageInfo = await ImagePicker.getMediaLibraryPermissionsAsync();
    
    // For now, we'll use a mock implementation since expo-image-picker
    // doesn't directly provide EXIF data extraction
    // In a real implementation, you would use a library like expo-image-manipulator
    // or react-native-image-picker that can extract EXIF data
    
    // Mock implementation - in production, you would extract actual EXIF data
    console.log('Extracting location from image:', imageUri);
    
    // Return null for now - this would be replaced with actual EXIF extraction
    return null;
  } catch (error) {
    console.error('Error extracting location from image:', error);
    return null;
  }
};

/**
 * Convert GPS coordinates from EXIF format to decimal degrees
 * @param {Object} gpsData - GPS data from EXIF
 * @returns {Object} - Latitude and longitude in decimal degrees
 */
export const convertGPSCoordinates = (gpsData) => {
  if (!gpsData || !gpsData.latitude || !gpsData.longitude) {
    return null;
  }

  const { latitude, longitude, latitudeRef, longitudeRef } = gpsData;
  
  // Convert from degrees/minutes/seconds to decimal degrees
  const latDecimal = convertDMSToDD(latitude, latitudeRef);
  const lngDecimal = convertDMSToDD(longitude, longitudeRef);
  
  return {
    latitude: latDecimal,
    longitude: lngDecimal,
    source: 'exif'
  };
};

/**
 * Convert degrees/minutes/seconds to decimal degrees
 * @param {Array} dms - Array of [degrees, minutes, seconds]
 * @param {string} ref - Reference (N, S, E, W)
 * @returns {number} - Decimal degrees
 */
const convertDMSToDD = (dms, ref) => {
  if (!Array.isArray(dms) || dms.length !== 3) {
    return 0;
  }
  
  const [degrees, minutes, seconds] = dms;
  let dd = degrees + minutes / 60 + seconds / 3600;
  
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1;
  }
  
  return dd;
};

/**
 * Get location from image with fallback to current location
 * @param {string} imageUri - URI of the image
 * @param {Function} getCurrentLocation - Function to get current location
 * @returns {Promise<Object>} - Location object
 */
export const getLocationFromImageOrCurrent = async (imageUri, getCurrentLocation) => {
  try {
    // Try to extract location from image EXIF data
    const exifLocation = await extractLocationFromImage(imageUri);
    
    if (exifLocation) {
      console.log('Location extracted from image EXIF data:', exifLocation);
      return exifLocation;
    }
    
    // Fallback to current location
    console.log('No EXIF location found, using current location');
    const currentLocation = await getCurrentLocation();
    return currentLocation;
  } catch (error) {
    console.error('Error getting location:', error);
    // Final fallback to current location
    try {
      return await getCurrentLocation();
    } catch (fallbackError) {
      console.error('Fallback location also failed:', fallbackError);
      return null;
    }
  }
};
