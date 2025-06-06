import SignatureModal from '@src/components/SignatureModal';
import globalStyles from '@src/styles/styles';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputSignatureV1Props {
  label: string;
  value?: string | null;
  onSignatureChange: (value: string | null) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  showLabel?: boolean;
  imageHeight?: number;
}

const InputSignatureV1: React.FC<InputSignatureV1Props> = ({
  label,
  value,
  onSignatureChange,
  placeholder = 'Tap untuk menandatangani',
  containerStyle,
  showLabel = true,
  imageHeight = 120,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openSignatureModal = () => {
    setIsModalVisible(true);
  };

  const handleSignatureConfirm = (result: string) => {
    onSignatureChange(result);
    setIsModalVisible(false);
  };

  const handleSignatureClear = () => {
    onSignatureChange(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={containerStyle}>
      {/* Label */}
      {showLabel && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 10,
            letterSpacing: 0.5,
          }}>
          {label}
        </Text>
      )}

      {/* Container */}
      <View
        style={{
          marginBottom: 20,
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}>
        <View style={globalStyles.groupField}>
          {value ? (
            <View
              style={{
                position: 'relative',
                backgroundColor: '#f8f9fa',
                borderRadius: 8,
                padding: 16,
                borderWidth: 1,
                borderColor: '#dee2e6',
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: imageHeight,
                }}
                source={{uri: value}}
              />
              {/* Clear button */}
              <TouchableOpacity
                onPress={handleSignatureClear}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 15,
                  padding: 6,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                }}>
                <Icon name="clear" size={16} color="#ff4444" />
              </TouchableOpacity>
              {/* Edit button */}
              <TouchableOpacity
                onPress={openSignatureModal}
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,122,255,0.9)',
                  borderRadius: 15,
                  padding: 6,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                }}>
                <Icon name="edit" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: 8,
                padding: 20,
                borderWidth: 2,
                borderColor: '#007AFF',
                borderStyle: 'dashed',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={openSignatureModal}
              activeOpacity={0.7}>
              <Icon
                name="edit"
                size={20}
                color="#007AFF"
                style={{marginRight: 8}}
              />
              <Text
                style={{
                  color: '#007AFF',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {placeholder}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Signature Modal */}
      <SignatureModal
        label={label}
        visible={isModalVisible}
        onConfirm={handleSignatureConfirm}
        onCancel={handleModalCancel}
      />
    </View>
  );
};

export default InputSignatureV1;
