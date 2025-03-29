import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';
import globalStyles from '@styles/styles';

interface Option {
  label: string;
  value: string;
}

interface InputStatusPickerProps {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
}

function InputStatusPicker({ value, onChange, options, label = 'Pilih Status' }: InputStatusPickerProps) {
  return (
    <View style={globalStyles.groupField}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue)}
        >
          <Picker.Item label="-- Pilih --" value="" />
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

export default InputStatusPicker;
