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

function SakitScreen() {
  const {image, handleClickOpenCamera, handleClickReset} = useImagePicker();
  const {
    date: startDate,
    openDatePicker: openStartDate,
    setOpenDatePicker: setOpenStartDate,
    handleDateChange: handleStartDateChange,
  } = useDatePicker(dayjs());
  const {
    date: endDate,
    openDatePicker: openEndDate,
    setOpenDatePicker: setOpenEndDate,
    handleDateChange: handleEndDateChange,
  } = useDatePicker(dayjs());
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
    start_date: startDate,
    end_date: endDate,
    time_check_in: time,
    type: 'sick',
    image_check_in: '',
    location_check_in: '',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (userDetailData.nik) {
      setData(prev => ({
        ...prev,
        code: `${userDetailData.name}_${startDate.format('DDMMYYYY')}`,
        nik: userDetailData.nik,
        name: userDetailData.name,
      }));
    }
  }, [userDetailData, startDate]);

  useEffect(() => {
    setData(prev => ({
      ...prev,
      start_date: startDate,
      end_date: endDate,
      time_check_in: time,
      image_check_in: image?.uri || '',
    }));
  }, [startDate, endDate, time, image]);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setData(prev => ({
        ...prev,
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
      formData.append('start_date', data.start_date.format('YYYY-MM-DD'));
      formData.append('end_date', data.end_date.format('YYYY-MM-DD'));
      formData.append('time_check_in', data.time_check_in.format('HH:mm:ss'));
      formData.append('type', data.type);
      formData.append('location_check_in', data.location_check_in);

      if (image) {
        formData.append('image_check_in', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `sakit_${Date.now()}.jpg`,
        });
      }

      instance.defaults.headers['Content-Type'] = 'multipart/form-data';
      await instance.post('v1/attendances/sick', formData);
      Alert.alert('Sukses', 'Absen sakit berhasil disubmit', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
      showNotification('Sukses', 'Absen sakit berhasil disubmit');
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
            label="Tanggal Awal Sakit"
            value={data.start_date.format('dddd DD/MM/YYYY')}
            onIconPress={() => setOpenStartDate(true)}
            iconName="calendar"
            editable={false}
          />
          <InputField
            label="Tanggal Akhir Sakit"
            value={data.end_date.format('dddd DD/MM/YYYY')}
            onIconPress={() => setOpenEndDate(true)}
            iconName="calendar"
            editable={false}
          />
          <InputField
            label="Jam"
            value={data.time_check_in.format('HH:mm:ss')}
            onIconPress={() => setOpenTimePicker(true)}
            iconName="clock"
            editable={false}
          />
          <ImagePicker
            label="Bukti Sakit / Surat Dokter"
            image={image}
            onOpenCamera={handleClickOpenCamera}
            onResetImage={handleClickReset}
          />
          <LocationPicker
            label="Lokasi Absen Sakit"
            location={location}
            getCurrentLocation={getCurrentLocation}
          />
          <Button label="Simpan" onPress={handleSubmit} />
        </View>
      </ScrollView>
      <DatePicker
        modal
        mode="date"
        open={openStartDate}
        date={data.start_date.toDate()}
        onConfirm={handleStartDateChange}
        onCancel={() => setOpenStartDate(false)}
      />
      <DatePicker
        modal
        mode="date"
        minimumDate={data.start_date.toDate()}
        open={openEndDate}
        date={data.end_date.toDate()}
        onConfirm={handleEndDateChange}
        onCancel={() => setOpenEndDate(false)}
      />
      <DatePicker
        modal
        mode="time"
        minimumDate={dayjs().toDate()}
        maximumDate={dayjs().toDate()}
        open={openTimePicker}
        date={data.time_check_in.toDate()}
        onConfirm={handleTimeChange}
        onCancel={() => setOpenTimePicker(false)}
      />
    </SafeAreaView>
  );
}

export default SakitScreen;
