import {useState} from 'react';
import dayjs from 'dayjs';

const useDatePicker = (initialDate = dayjs()) => {
  const [date, setDate] = useState(initialDate);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleDateChange = (selectedDate: Date) => {
    setDate(dayjs(selectedDate));
    setOpenDatePicker(false);
  };

  return {date, openDatePicker, setOpenDatePicker, handleDateChange};
};

export default useDatePicker;
