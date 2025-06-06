import ImagePicker from '@components/ImagePicker';
import InputField from '@components/InputField';
import LocationPicker from '@components/LocationPicker';
import useDatePicker from '@hooks/useDatePicker';
import useImagePicker from '@hooks/useImagePicker';
import {useNotification} from '@hooks/useNotification';
import useTimePicker from '@hooks/useTimePicker';
import {useUserData} from '@hooks/useUserData';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Button from '@src/components/Button';
import LoadingModal from '@src/components/LoadingModal';
import {formatErrorMessage} from '@src/helpers/errror';
import {useLocation} from '@src/hooks/useLocation';
import globalStyles from '@styles/styles';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';
import instance from '../../configs/axios';

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

  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      setIsLoading(true);
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
      console.log('Error:', error.response?.data);
      const errorMessage = formatErrorMessage(error);
      Alert.alert('Izin kehadiran gagal', errorMessage);
    } finally {
      setIsLoading(false);
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
          <Button disabled={isLoading} label="Simpan" onPress={handleSubmit} />
        </View>
      </ScrollView>
      <LoadingModal visible={isLoading} />
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
