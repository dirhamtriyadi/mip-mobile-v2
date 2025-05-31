import {Picker} from '@react-native-picker/picker';
import globalStyles from '@styles/styles';
import React from 'react';
import {Text, View} from 'react-native';
import styles from './styles';

interface Option {
  label: string;
  value: string;
}

interface InputSelectPickerProps {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
}

function InputSelectPicker({
  value,
  onChange,
  options,
  label = 'Pilih Status',
}: InputSelectPickerProps) {
  return (
    <View style={globalStyles.groupField}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={value}
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
    </View>
  );
}

export default InputSelectPicker;
