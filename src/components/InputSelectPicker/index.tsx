import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {Text, View} from 'react-native';
import styles from './styles';

interface Option {
  label: string;
  value: string;
}

interface InputSelectPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  editable?: boolean;
  required?: boolean;
  onBlur?: () => void;
  error?: string;
}

function InputSelectPicker({
  label,
  value,
  onChange,
  options,
  editable = true,
  required = false,
  onBlur,
  error,
}: InputSelectPickerProps) {
  return (
    <View style={styles.groupField}>
      {label && (
        <Text style={styles.fieldLabel}>
          {label}
          {required && <Text style={{color: 'red'}}> *</Text>}
        </Text>
      )}
      <View
        style={[
          styles.pickerContainer,
          error && {borderColor: 'red', borderWidth: 1},
        ]}>
        <Picker
          style={styles.picker}
          selectedValue={value}
          enabled={editable}
          onBlur={onBlur}
          onValueChange={itemValue => onChange(itemValue)}>
          <Picker.Item label="-- Pilih --" value="" />
          {options.map(option => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      {error && (
        <Text style={{color: 'red', fontSize: 12, marginTop: 4}}>{error}</Text>
      )}
    </View>
  );
}

export default InputSelectPicker;
