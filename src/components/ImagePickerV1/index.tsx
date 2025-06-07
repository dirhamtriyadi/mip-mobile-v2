import React, {useCallback} from 'react';
import {
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

export interface ImageFile {
  uri: string;
  type: string;
  fileName: string;
  fileSize: number;
}

interface ImagePickerFieldProps {
  label: string;
  value?: ImageFile | null;
  onImageChange: (image: ImageFile | null) => void;
  onBlur?: () => void; // Optional onBlur handler
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  quality?: number;
  disabled?: boolean;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  label,
  value,
  onImageChange,
  onBlur = () => {}, // Default to no-op if not provided
  placeholder = 'Pilih atau ambil foto',
  required = false,
  error,
  maxSizeInMB = 2,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
  quality = 0.8,
  disabled = false,
}) => {
  // ===== PERMISSION HANDLERS =====
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const cameraPermission = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      });

      if (!cameraPermission) return false;

      const result = await check(cameraPermission);

      if (result === RESULTS.GRANTED) {
        return true;
      }

      if (result === RESULTS.DENIED) {
        const requestResult = await request(cameraPermission);
        return requestResult === RESULTS.GRANTED;
      }

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Izin Kamera Dibutuhkan',
          'Silakan aktifkan izin kamera di pengaturan aplikasi untuk menggunakan fitur ini.',
          [
            {text: 'Batal', style: 'cancel'},
            {
              text: 'Buka Pengaturan',
              onPress: () => {
                /* Open settings */
              },
            },
          ],
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }, []);

  const requestGalleryPermission = useCallback(async (): Promise<boolean> => {
    try {
      const galleryPermission = Platform.select({
        android:
          // ✅ Fix: Better Android permission handling
          (Platform.Version as number) >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      });

      if (!galleryPermission) {
        console.log('No permission required for this platform');
        return true;
      } // Some platforms don't need permission

      const result = await check(galleryPermission);
      console.log('Gallery permission result:', result);

      if (result === RESULTS.GRANTED) {
        return true;
      }

      if (result === RESULTS.DENIED) {
        const requestResult = await request(galleryPermission);
        return requestResult === RESULTS.GRANTED;
      }

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Izin Galeri Dibutuhkan',
          'Silakan aktifkan izin galeri di pengaturan aplikasi untuk menggunakan fitur ini.',
          [
            {text: 'Batal', style: 'cancel'},
            {
              text: 'Buka Pengaturan',
              onPress: () => {
                /* Open settings */
                import('react-native').then(({Linking}) => {
                  Linking.openSettings();
                });
              },
            },
          ],
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error requesting gallery permission:', error);
      return false;
    }
  }, []);

  // ===== IMAGE PROCESSING =====
  const processImageResponse = useCallback(
    (response: ImagePickerResponse): ImageFile | null => {
      console.log('Processing image response:', {
        didCancel: response.didCancel,
        errorMessage: response.errorMessage,
        assetsCount: response.assets?.length,
      }); // ✅ Debug

      if (response.didCancel) {
        console.log('User cancelled image selection');
        return null;
      }

      if (response.errorMessage) {
        console.error('Image picker error:', response.errorMessage);
        Alert.alert('Error', response.errorMessage);
        return null;
      }

      if (!response.assets?.[0]) {
        console.log('No assets in response');
        Alert.alert('Error', 'Tidak ada gambar yang dipilih');
        return null;
      }

      const asset = response.assets[0];
      console.log('Asset details:', {
        uri: asset.uri ? 'present' : 'missing',
        type: asset.type,
        fileName: asset.fileName,
        fileSize: asset.fileSize,
      }); // ✅ Debug

      if (!asset.uri) {
        console.error('Asset URI missing');
        Alert.alert('Error', 'URI gambar tidak valid');
        return null;
      }

      if (!asset.type) {
        console.error('Asset type missing');
        Alert.alert('Error', 'Tipe file tidak valid');
        return null;
      }

      // ✅ Generate fileName if missing
      const fileName = asset.fileName || `image_${Date.now()}.jpg`;

      // Validate file size
      const fileSizeInMB = (asset.fileSize || 0) / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        Alert.alert(
          'File Terlalu Besar',
          `Ukuran file maksimal ${maxSizeInMB}MB. File yang dipilih ${fileSizeInMB.toFixed(
            2,
          )}MB`,
        );
        return null;
      }

      // Validate file type
      if (!allowedTypes.includes(asset.type)) {
        Alert.alert(
          'Format File Tidak Didukung',
          `Format yang didukung: ${allowedTypes.join(', ')}`,
        );
        return null;
      }

      const result = {
        uri: asset.uri,
        type: asset.type,
        fileName,
        fileSize: asset.fileSize || 0,
      };

      console.log('Successfully processed image:', result); // ✅ Debug
      return result;
    },
    [maxSizeInMB, allowedTypes],
  );

  // ===== CAMERA HANDLER =====
  const handleTakePhoto = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const options: CameraOptions = {
      mediaType: 'photo' as MediaType,
      //   quality: quality,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
      // ✅ Add these options
      presentationStyle: 'pageSheet', // iOS only
    };

    launchCamera(options, response => {
      const processedImage = processImageResponse(response);
      if (processedImage) {
        onImageChange(processedImage);
      }
    });
  }, [requestCameraPermission, quality, processImageResponse, onImageChange]);

  // ===== GALLERY HANDLER =====
  const handleSelectFromGallery = useCallback(async () => {
    console.log('Starting gallery selection...'); // ✅ Debug
    const hasPermission = await requestGalleryPermission();
    console.log('Gallery permission granted:', hasPermission); // ✅ Debug
    if (!hasPermission) {
      console.log('Gallery permission denied, aborting...'); // ✅ Debug
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      //   quality: quality,
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      console.log('Gallery response:', {
        didCancel: response.didCancel,
        errorCode: response.errorCode,
        errorMessage: response.errorMessage,
        assets: response.assets?.length,
      }); // ✅ Debug

      // ✅ Enhanced error handling
      if (response.didCancel) {
        console.log('User cancelled gallery selection');
        return;
      }

      if (response.errorMessage) {
        console.error('Gallery error:', response.errorMessage);
        Alert.alert('Error', `Gagal membuka galeri: ${response.errorMessage}`);
        return;
      }

      if (!response.assets || response.assets.length === 0) {
        console.log('No assets returned from gallery');
        Alert.alert('Error', 'Tidak ada gambar yang dipilih');
        return;
      }

      const processedImage = processImageResponse(response);
      if (processedImage) {
        onImageChange(processedImage);
      }
    });
  }, [requestGalleryPermission, quality, processImageResponse, onImageChange]);

  // ===== SHOW OPTIONS =====
  const showImagePickerOptions = useCallback(() => {
    Alert.alert(
      'Pilih Foto',
      'Pilih sumber foto yang ingin digunakan',
      [
        {text: 'Batal', style: 'cancel'},
        {text: 'Kamera', onPress: handleTakePhoto},
        {text: 'Galeri', onPress: handleSelectFromGallery},
      ],
      {cancelable: true},
    );
  }, [handleTakePhoto, handleSelectFromGallery]);

  // ===== REMOVE IMAGE =====
  const handleRemoveImage = useCallback(() => {
    Alert.alert('Hapus Foto', 'Apakah Anda yakin ingin menghapus foto ini?', [
      {text: 'Batal', style: 'cancel'},
      {text: 'Hapus', style: 'destructive', onPress: () => onImageChange(null)},
    ]);
  }, [onImageChange]);

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      {/* Image Display or Picker Button */}
      {value ? (
        <View style={styles.imageContainer}>
          <Image source={{uri: value.uri}} style={styles.image} />
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.changeButton]}
              onPress={showImagePickerOptions}
              disabled={disabled}>
              <Icon name="edit" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Ubah</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={handleRemoveImage}
              disabled={disabled}>
              <Icon name="delete" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.pickerButton,
            error && styles.pickerButtonError,
            disabled && styles.pickerButtonDisabled,
          ]}
          onPress={showImagePickerOptions}
          disabled={disabled}
          onBlur={onBlur}>
          <Icon
            name="add-a-photo"
            size={48}
            color={disabled ? '#ccc' : '#666'}
          />
          <Text
            style={[
              styles.placeholderText,
              disabled && styles.placeholderTextDisabled,
            ]}>
            {placeholder}
          </Text>
        </TouchableOpacity>
      )}

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* File Info */}
      {value && (
        <View style={styles.fileInfo}>
          <Text style={styles.fileInfoText}>📁 {value.fileName}</Text>
          <Text style={styles.fileInfoText}>
            📏 {(value.fileSize / (1024 * 1024)).toFixed(2)} MB
          </Text>
        </View>
      )}
    </View>
  );
};

export default ImagePickerField;
