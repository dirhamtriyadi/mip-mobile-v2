import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

interface ImagePickerProps {
  label: string;
  image: {uri: string} | null;
  imageOld?: string | null;
  onOpenCamera?: () => void;
  onImageSelected?: () => void;
  onResetImage?: () => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  label,
  image,
  imageOld,
  onOpenCamera,
  onImageSelected,
  onResetImage,
}) => {
  return (
    <View style={[styles.groupField]}>
      <Text style={[styles.fieldLabel]}>{label}</Text>
      {imageOld && (
        <View style={[styles.imgContainer, {padding: 10}]}>
          <Text>Foto Terakhir Diubah</Text>
          <Image source={{uri: imageOld}} style={[styles.imgStyle]} />
        </View>
      )}
      {image ? (
        <TouchableOpacity
          onPress={onResetImage}
          style={[styles.btn, {width: '100%'}]}>
          <Text style={[styles.btnText]}>Reset Foto</Text>
          <Icon
            name="trash-alt"
            size={20}
            color="#000"
            style={[styles.btnIcon]}
          />
        </TouchableOpacity>
      ) : onOpenCamera && onImageSelected ? (
        <View style={[styles.btnContainer]}>
          <TouchableOpacity onPress={onOpenCamera} style={[styles.btn]}>
            <Text style={[styles.btnText]}>Ambil Foto</Text>
            <Icon
              name="camera"
              size={20}
              color="#000"
              style={[styles.btnIcon]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onImageSelected} style={[styles.btn]}>
            <Text style={[styles.btnText]}>Pilih Foto</Text>
            <Icon name="file" size={20} color="#000" style={[styles.btnIcon]} />
          </TouchableOpacity>
        </View>
      ) : onOpenCamera ? (
        <TouchableOpacity
          onPress={onOpenCamera}
          style={[styles.btn, {width: '100%'}]}>
          <Text style={[styles.btnText]}>Ambil Foto</Text>
          <Icon name="camera" size={20} color="#000" style={[styles.btnIcon]} />
        </TouchableOpacity>
      ) : onImageSelected ? (
        <TouchableOpacity
          onPress={onImageSelected}
          style={[styles.btn, {width: '100%'}]}>
          <Text style={[styles.btnText]}>Pilih Foto</Text>
          <Icon name="file" size={20} color="#000" style={[styles.btnIcon]} />
        </TouchableOpacity>
      ) : null}
      {image && (
        <View style={[styles.imgContainer]}>
          <Image source={{uri: image.uri}} style={[styles.imgStyle]} />
        </View>
      )}
    </View>
  );
};

export default ImagePicker;
