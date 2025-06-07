import React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  onIconPress?: () => void;
  iconName?: string;
  required?: boolean;
  onBlur?: () => void;
  error?: string;
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  editable = true,
  onIconPress,
  iconName,
  required = false,
  onBlur,
  error,
  secureTextEntry = false,
}) => (
  <View style={styles.groupField}>
    {label && (
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={{color: 'red'}}> *</Text>}
      </Text>
    )}
    <View
      style={[
        styles.fieldInput,
        error && {borderColor: 'red', borderWidth: 1},
      ]}>
      <TextInput
        style={{color: '#242c40'}}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        editable={editable}
        secureTextEntry={secureTextEntry}
      />
      {iconName && (
        <TouchableOpacity
          style={{position: 'absolute', right: 10}}
          onPress={onIconPress}>
          <Icon name={iconName} size={20} color="#000" />
        </TouchableOpacity>
      )}
    </View>
    {error && (
      <Text style={{color: 'red', fontSize: 12, marginTop: 4}}>{error}</Text>
    )}
  </View>
);

export default InputField;
