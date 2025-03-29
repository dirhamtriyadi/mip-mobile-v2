import { useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const useImagePicker = () => {
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

  const handleImageSelect = async () => {
    // try {
    //   if (Platform.OS === 'android') {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //       {
    //         title: 'Permission to access your library',
    //         message: 'Absensi requires access to your library to work properly.',
    //         buttonNeutral: 'Ask Me Later',
    //         buttonNegative: 'Cancel',
    //         buttonPositive: 'OK',
    //       }
    //     );
    //     console.log("Awal :", granted, "Akhir :", PermissionsAndroid.RESULTS.GRANTED);
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       console.log('You can use the library');
    //     } else {
    //       console.log('Permission to access your library was denied');
    //       Alert.alert(
    //         'Permission Denied',
    //         'Permission to access your library was denied. Please enable it in the app settings.',
    //         [
    //           { text: 'OK' },
    //         ],
    //       );
    //     }
    //   } else {
    //     // For iOS, you can use a different library like react-native-permissions
    //     console.log("Location permission is not required for iOS in this example.");
    //   }
    // } catch (error) {
    //   console.warn(error);
    // }
    
    await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    }, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else {
        setImage(response.assets[0]);
      }
    });
  };

  const handleClickReset = () => {
    setImage(null);
  };

  return {
    image,
    handleClickOpenCamera,
    handleImageSelect,
    handleClickReset,
  };
};

export default useImagePicker;