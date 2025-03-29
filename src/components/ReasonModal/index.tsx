import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';

interface ReasonModalProps {
  visible: boolean;
  onClose: () => void;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const ReasonModal: React.FC<ReasonModalProps> = ({
  visible,
  onClose,
  label,
  placeholder,
  value,
  onChangeText,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
      <View
        style={{
          width: '80%',
          height: 200,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
          {label}
        </Text>
        <TextInput
          style={[styles.fieldInput]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#242c40',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
              marginRight: 10,
            }}
            onPress={onClose}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#242c40',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
            }}
            onPress={onClose}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default ReasonModal;
