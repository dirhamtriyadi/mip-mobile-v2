import React, {useState} from 'react';
import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

interface InputDatePickerProps {
  label: string;
  value: Date;
  iconName?: string;
  onChange: (date: Date) => void;
}

function InputDatePicker({ label, value, iconName, onChange }: InputDatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.groupField]}>
      <Text style={[styles.fieldLabel]}>{label}</Text>
      <View style={[styles.fieldInput]}>
        <TextInput
          style={{color: '#242c40'}}
          value={dayjs(value).format('DD/MM/YYYY')}
          editable={false}
        />
        {iconName && (
          <TouchableOpacity
            style={{position: 'absolute', right: 10}}
            onPress={() => setOpen(true)}>
            <Icon name={iconName} size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      <DatePicker
        modal
        mode="date"
        minimumDate={dayjs().hour(0).minute(0).second(0).toDate()}
        open={open}
        date={value}
        onConfirm={date => {
          setOpen(false);
          onChange(date);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
}

export default InputDatePicker;
