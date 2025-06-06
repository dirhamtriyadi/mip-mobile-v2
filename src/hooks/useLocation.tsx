import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

interface LocationProps {
  latitude: number;
  longitude: number;
  location_string: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationProps>({
    latitude: 0,
    longitude: 0,
    location_string: '',
  });

  useEffect(() => {
    requestLocationPermission().then(() => {
      getCurrentLocation();
    });
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
        } else {
          console.log('Location permission denied');
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature. Please enable it in the app settings.',
            [{text: 'OK'}],
          );
        }
      } else {
        // For iOS, you can use a different library like react-native-permissions
        console.log(
          'Location permission is not required for iOS in this example.',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({
          latitude,
          longitude,
          location_string: `${latitude}, ${longitude}`,
        });
      },
      error => {
        console.error(error);
        Alert.alert('Error', 'Failed to get current location.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const changeLocationMarker = (latitude: number, longitude: number) => {
    setLocation({
      latitude: latitude,
      longitude: longitude,
      location_string: `${latitude}, ${longitude}`,
    });
    console.log(latitude, longitude);
    console.log(`${latitude}, ${longitude}`);
  };

  return {location, getCurrentLocation, changeLocationMarker};
};
