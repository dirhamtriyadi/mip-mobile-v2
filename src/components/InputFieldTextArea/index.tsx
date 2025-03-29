import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

interface InputFieldTextAreaProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  onIconPress?: () => void;
  iconName?: string;
}

const InputFieldTextArea: React.FC<InputFieldTextAreaProps> = ({
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
    <View style={styles.fieldInputTextArea}>
      <TextInput
        style={{color: '#242c40', height: 200, textAlignVertical: 'top'}}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline={true}
        numberOfLines={10}
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

export default InputFieldTextArea;
