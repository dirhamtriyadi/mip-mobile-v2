import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';

interface ButtonProps {
  label: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  style,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.btn, style]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[styles.btnText]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;