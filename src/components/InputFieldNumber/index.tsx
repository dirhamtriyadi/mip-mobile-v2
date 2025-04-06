import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

interface InputFieldNumberProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  onIconPress?: () => void;
  iconName?: string;
}

const InputFieldNumber: React.FC<InputFieldNumberProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  editable = true,
  onIconPress,
  iconName,
}) => (
  <View style={styles.groupField}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.fieldInput}>
      <TextInput
        style={{color: '#242c40'}}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType="numeric"
      />
      {iconName && (
        <TouchableOpacity
          style={{position: 'absolute', right: 10}}
          onPress={onIconPress}>
          <Icon name={iconName} size={20} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default InputFieldNumber;
