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

function SakitScreen() {
  const workSchedule = useWorkSchedule();
  const {image, handleClickOpenCamera, handleClickReset} = useImagePicker();
  const {date, openDatePicker, setOpenDatePicker, handleDateChange} =
    useDatePicker(dayjs());
  const {time, openTimePicker, setOpenTimePicker, handleTimeChange} =
    useTimePicker(dayjs());
  const [openModal, setOpenModal] = useState(false);
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
    time_check_out: dayjs(),
    reason_early_out: '',
    image_check_out: '',
    location_check_out: '',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setData(prevData => ({
        ...prevData,
        latitude: location.latitude,
        longitude: location.longitude,
        location_check_out: location.locationString,
      }));
    }
  }, [location]);

  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      code: `${userDetailData.name}_${dayjs().format('DDMMYYYY')}`,
      nik: userDetailData.nik,
      name: userDetailData.name,
      date,
      time_check_out: time,
      image_check_out: image,
    }));
  }, [userDetailData, date, time, image]);

  const handleSubmit = async () => {
    if (!data.code) return Alert.alert('Kode absen harus diisi');
    if (!data.nik) return Alert.alert('NIK harus diisi');
    if (!data.name) return Alert.alert('Nama harus diisi');
    if (!data.location_check_out) return Alert.alert('Lokasi harus diisi');
    if (!data.image_check_out) return Alert.alert('Foto selfie harus diisi');

    const workEndTime = workSchedule?.work_end_time;
    if (
      workEndTime &&
      data.time_check_out.format('HH:mm:ss') < workEndTime &&
      !data.reason_early_out
    ) {
      return setOpenModal(true);
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('date', data.date.format('YYYY-MM-DD'));
      formData.append('time_check_out', data.time_check_out.format('HH:mm:ss'));
      formData.append('reason_early_out', data.reason_early_out);
      formData.append('location_check_out', data.location_check_out);

      if (image) {
        formData.append('image_check_out', {
          uri: image.uri,
          type: image.type,
          name: image.fileName || `selfie-${Date.now()}.jpg`,
        });
      }

      instance.defaults.headers['Content-Type'] = 'multipart/form-data';
      await instance.post('v1/attendances/check-out', formData);

      Alert.alert('Absen pulang berhasil', 'Absen pulang berhasil disubmit', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
      showNotification('Absen Pulang', 'Absen pulang berhasil disubmit');
    } catch (error: any) {
      console.log('Error:', error.response?.data);
      const errorMessage = formatErrorMessage(error);
      Alert.alert('Absen pulang gagal', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View style={globalStyles.formContainer}>
          <InputField
            label="Kode Absen"
            placeholder="Kode"
            value={data.code}
            editable={false}
          />
          <InputField
            label="NIK"
            placeholder="NIK"
            value={data.nik}
            editable={false}
          />
          <InputField
            label="Nama"
            placeholder="Nama"
            value={data.name}
            editable={false}
          />
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
            label="Alasan Pulang Lebih Awal"
            placeholder="Keterangan"
            value={data.reason_early_out}
            onChangeText={text =>
              setData(prevData => ({...prevData, reason_early_out: text}))
            }
          />
          <ImagePicker
            label="Foto Selfie Pulang"
            image={image}
            onOpenCamera={handleClickOpenCamera}
            onResetImage={handleClickReset}
          />
          <LocationPicker
            label="Lokasi Absen Pulang"
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

export default SakitScreen;
