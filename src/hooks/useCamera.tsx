import {useState} from 'react';
import {Alert, Platform, PermissionsAndroid} from 'react-native';
import {launchCamera} from 'react-native-image-picker';

const useCamera = () => {
  const [image, setImage] = useState<any>(null);

  const handleClickOpenCamera = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('Permission to access your camera was denied');
          Alert.alert(
            'Permission Denied',
            'Permission to access your camera was denied. Please enable it in the app settings.',
            [
              { text: 'OK' },
            ],
          );
        }
      } else {
        // For iOS, you can use a different library like react-native-permissions
        console.log("Location permission is not required for iOS in this example.");
      }
  
      await launchCamera(
        {
          mediaType: 'photo',
          quality: 0.5,
          cameraType: 'front',
        },
        (response: any) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorCode) {
            console.error('ImagePicker Error:', response.errorMessage);
          } else {
            setImage(response.assets[0]);
          }
        },
      );
    } catch (error) {
      console.warn(error);
    }
    
  };

  const handleClickResetCamera = () => {
    setImage(null);
  };

  return {image, handleClickOpenCamera, handleClickResetCamera};
};

export default useCamera;
