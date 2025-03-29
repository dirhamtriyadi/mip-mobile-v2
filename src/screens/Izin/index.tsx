import React, {useState, useEffect} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import {useLocation} from '@src/hooks/useLocation';
import instance from '../../configs/axios';
import {useUserData} from '@hooks/useUserData';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../App';
import dayjs from 'dayjs';
import {useNotification} from '@hooks/useNotification';
import useImagePicker from '@hooks/useImagePicker';
import useDatePicker from '@hooks/useDatePicker';
import useTimePicker from '@hooks/useTimePicker';
import InputField from '@components/InputField';
import ImagePicker from '@components/ImagePicker';
import LocationPicker from '@components/LocationPicker';
import globalStyles from '@styles/styles';
import Button from '@src/components/Button';

function IzinScreen() {
  const {image, handleClickOpenCamera, handleClickReset} = useImagePicker();
  const {date, openDatePicker, setOpenDatePicker, handleDateChange} =
    useDatePicker(dayjs());
  const {time, openTimePicker, setOpenTimePicker, handleTimeChange} =
    useTimePicker(dayjs());
  const {userDetailData} = useUserData();
  const {location, getCurrentLocation} = useLocation();
  const {showNotification} = useNotification();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [data, setData] = useState({
    code: '',
    nik: '',
    name: '',
    date: dayjs(),
    time_check_in: dayjs(),
    type: 'permit',
    image_check_in: '',
    location_check_in: '',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (userDetailData.nik) {
      setData(prevData => ({
        ...prevData,
        code: `${userDetailData.name}_${dayjs().format('DDMMYYYY')}`,
        nik: userDetailData.nik,
        name: userDetailData.name,
      }));
    }
  }, [userDetailData]);

  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      date,
      time_check_in: time,
      image_check_in: image?.uri || '',
    }));
  }, [date, time, image]);

  useEffect(() => {
    if (location.latitude !== 0 && location.longitude !== 0) {
      setData(prevData => ({
        ...prevData,
        latitude: location.latitude,
        longitude: location.longitude,
        location_check_in: location.locationString,
      }));
    }
  }, [location]);

  const handleSubmit = async () => {
    if (!data.code || !data.nik || !data.name || !data.location_check_in) {
      return Alert.alert('Error', 'Semua data harus diisi.');
    }

    try {
      const formData = new FormData();
      formData.append('date', data.date.format('YYYY-MM-DD'));
      formData.append('time_check_in', data.time_check_in.format('HH:mm:ss'));
      formData.append('type', data.type);
      formData.append('location_check_in', data.location_check_in);

      if (image) {
        formData.append('image_check_in', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `izin_${Date.now()}.jpg`,
        });
      }

      instance.defaults.headers['Content-Type'] = 'multipart/form-data';

      await instance.post('v1/attendances/permit', formData);
      Alert.alert('Sukses', 'Absen izin berhasil disubmit', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
      showNotification('Sukses', 'Absen izin berhasil disubmit');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Terjadi kesalahan saat mengirim data.';
      Alert.alert('Gagal', errorMessage);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View style={globalStyles.formContainer}>
          <InputField label="Kode Absen" value={data.code} editable={false} />
          <InputField label="NIK" value={data.nik} editable={false} />
          <InputField label="Nama" value={data.name} editable={false} />
          <InputField
            label="Tanggal"
            value={data.date.format('dddd DD/MM/YYYY')}
            editable={false}
            onIconPress={() => setOpenDatePicker(true)}
            iconName="calendar"
          />
          <InputField
            label="Jam"
            value={data.time_check_in.format('HH:mm:ss')}
            editable={false}
            onIconPress={() => setOpenTimePicker(true)}
            iconName="clock"
          />
          <ImagePicker
            label="Foto Izin"
            image={image}
            onOpenCamera={handleClickOpenCamera}
            onResetImage={handleClickReset}
          />
          <LocationPicker
            label="Lokasi Absen Izin"
            location={location}
            getCurrentLocation={getCurrentLocation}
          />
          <Button label="Simpan" onPress={handleSubmit} />
        </View>
      </ScrollView>
      <DatePicker
        modal
        mode="date"
        open={openDatePicker}
        date={data.date.toDate()}
        onConfirm={handleDateChange}
        onCancel={() => setOpenDatePicker(false)}
      />
      <DatePicker
        modal
        mode="time"
        open={openTimePicker}
        date={data.time_check_in.toDate()}
        onConfirm={handleTimeChange}
        onCancel={() => setOpenTimePicker(false)}
      />
    </SafeAreaView>
  );
}

export default IzinScreen;
