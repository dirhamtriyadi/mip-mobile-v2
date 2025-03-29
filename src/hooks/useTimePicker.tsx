import {useState} from 'react';
import dayjs from 'dayjs';

const useTimePicker = (initialTime = dayjs()) => {
  const [time, setTime] = useState(initialTime);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const handleTimeChange = (selectedTime: Date) => {
    setTime(dayjs(selectedTime));
    setOpenTimePicker(false);
  };

  return {time, openTimePicker, setOpenTimePicker, handleTimeChange};
};

export default useTimePicker;
