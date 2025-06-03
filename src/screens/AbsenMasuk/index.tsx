import ImagePicker from '@components/ImagePicker';
import InputField from '@components/InputField';
import LocationPicker from '@components/LocationPicker';
import ReasonModal from '@components/ReasonModal';
import useDatePicker from '@hooks/useDatePicker';
import useImagePicker from '@hooks/useImagePicker';
import {useNotification} from '@hooks/useNotification';
import useTimePicker from '@hooks/useTimePicker';
import {useUserData} from '@hooks/useUserData';
import useWorkSchedule from '@hooks/useWorkSchedule';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Button from '@src/components/Button';
import LoadingModal from '@src/components/LoadingModal';
import {useLocation} from '@src/hooks/useLocation';
import globalStyles from '@styles/styles';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';
import instance from '../../configs/axios';

function AbsenMasukScreen() {
  const {userDetailData} = useUserData();
  const {location, getCurrentLocation} = useLocation();
  const {showNotification} = useNotification();
  const workSchedule = useWorkSchedule();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {image, handleClickOpenCamera, handleClickReset} = useImagePicker();
  const {date, openDatePicker, setOpenDatePicker, handleDateChange} =
    useDatePicker(dayjs());
  const {time, openTimePicker, setOpenTimePicker, handleTimeChange} =
    useTimePicker(dayjs());

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState({
    code: '',
    nik: '',
    name: '',
    date: dayjs(),
    time_check_in: dayjs(),
    type: 'present',
    reason_late: '',
    image_check_in: '',
    location_check_in: '',
    latitude: 0,
    longitude: 0,
  });

  // Set data pengguna & update state saat ada perubahan
  useEffect(() => {
    if (userDetailData) {
      setData(prevData => ({
        ...prevData,
        code: `${userDetailData.name}_${dayjs().format('DDMMYYYY')}`,
        nik: userDetailData.nik,
        name: userDetailData.name,
        date: date,
        time_check_in: time,
        image_check_in: image?.uri || '',
      }));
    }
  }, [userDetailData, date, time, image]);

  // Update lokasi saat lokasi berubah
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

  const handleSubmit = useCallback(async () => {
    const {
      code,
      nik,
      name,
      time_check_in,
      reason_late,
      image_check_in,
      location_check_in,
    } = data;

    if (!code || !nik || !name) {
      return Alert.alert('Peringatan', 'Kode, NIK, dan Nama wajib diisi!');
    }

    if (
      time_check_in.format('HH:mm:ss') > workSchedule?.work_start_time &&
      !reason_late
    ) {
      return setOpenModal(true);
    }

    if (!image_check_in) {
      return Alert.alert('Peringatan', 'Foto selfie harus diisi!');
    }

    if (!location_check_in) {
      return Alert.alert('Peringatan', 'Lokasi harus diisi!');
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('date', date.format('YYYY-MM-DD'));
      formData.append('time_check_in', time_check_in.format('HH:mm:ss'));
      formData.append('type', 'present');
      formData.append('reason_late', reason_late);
      formData.append('location_check_in', location_check_in);

      if (image) {
        formData.append('image_check_in', {
          uri: image.uri,
          type: image.type,
          name: image.fileName || `selfie_${Date.now()}.jpg`,
        });
      }

      instance.defaults.headers['Content-Type'] = 'multipart/form-data';
      await instance.post('v1/attendances/check-in', formData);

      Alert.alert('Sukses', 'Absen masuk berhasil disubmit', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
      showNotification('Absen Masuk', 'Absen masuk berhasil disubmit');
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || 'Terjadi kesalahan saat absen!';
      Alert.alert('Absen Masuk Gagal', errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [data, date, time]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View style={globalStyles.formContainer}>
          <InputField label="Kode Absen" value={data.code} editable={false} />
          <InputField label="NIK" value={data.nik} editable={false} />
          <InputField label="Nama" value={data.name} editable={false} />
          <InputField
            label="Tanggal"
            value={date.format('dddd DD/MM/YYYY')}
            editable={false}
            onIconPress={() => setOpenDatePicker(true)}
            iconName="calendar"
          />
          <InputField
            label="Jam"
            value={time.format('HH:mm:ss')}
            editable={false}
            onIconPress={() => setOpenTimePicker(true)}
            iconName="clock"
          />
          <ReasonModal
            visible={openModal}
            onClose={() => setOpenModal(false)}
            label="Alasan Terlambat"
            placeholder="Keterangan"
            value={data.reason_late}
            onChangeText={text =>
              setData(prev => ({...prev, reason_late: text}))
            }
          />
          <ImagePicker
            label="Foto Selfie Masuk"
            image={image}
            onOpenCamera={handleClickOpenCamera}
            onResetImage={handleClickReset}
          />
          <LocationPicker
            label="Lokasi Absen Masuk"
            location={location}
            getCurrentLocation={getCurrentLocation}
          />
          <View style={[globalStyles.groupField, {marginBottom: 10}]}>
            <Button
              disabled={isLoading}
              label="Simpan"
              onPress={handleSubmit}
            />
          </View>
        </View>
      </ScrollView>
      <LoadingModal visible={isLoading} />
      <DatePicker
        modal
        mode="date"
        minimumDate={dayjs().startOf('day').toDate()}
        maximumDate={dayjs().endOf('day').toDate()}
        open={openDatePicker}
        date={date.toDate()}
        onConfirm={handleDateChange}
        onCancel={() => setOpenDatePicker(false)}
      />
      <DatePicker
        modal
        mode="time"
        minimumDate={dayjs().toDate()}
        maximumDate={dayjs().toDate()}
        open={openTimePicker}
        date={time.toDate()}
        onConfirm={handleTimeChange}
        onCancel={() => setOpenTimePicker(false)}
      />
    </SafeAreaView>
  );
}

export default AbsenMasukScreen;
