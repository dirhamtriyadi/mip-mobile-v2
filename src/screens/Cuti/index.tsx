import InputField from '@components/InputField';
import useDatePicker from '@hooks/useDatePicker';
import { useNotification } from '@hooks/useNotification';
import { useUserData } from '@hooks/useUserData';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Button from '@src/components/Button';
import RefreshableScrollView from '@src/components/RefreshableScrollView';
import { CutiData } from '@src/types/cuti';
import globalStyles from '@styles/styles';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../App';
import instance from '../../configs/axios';
import styles from './styles';

function CutiScreen() {
  const {userDetailData} = useUserData();
  const {showNotification} = useNotification();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    date: startDate,
    openDatePicker: openStartPicker,
    setOpenDatePicker: setOpenStartPicker,
    handleDateChange: handleStartChange,
  } = useDatePicker(dayjs());
  const {
    date: endDate,
    openDatePicker: openEndPicker,
    setOpenDatePicker: setOpenEndPicker,
    handleDateChange: handleEndChange,
  } = useDatePicker(dayjs());

  const [data, setData] = useState({
    nik: '',
    name: '',
    start_date: dayjs(),
    end_date: dayjs(),
  });

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cutiData, setCutiData] = useState<CutiData | null>(null);

  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      nik: userDetailData.nik,
      name: userDetailData.name,
      start_date: startDate,
      end_date: endDate,
    }));
  }, [userDetailData, startDate, endDate]);

  const fetchCutiData = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get('v1/leaves');
      setCutiData(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setCutiData(null);
      } else {
        Alert.alert(
          'Gagal mengambil data cuti',
          error.response?.data?.message || 'Terjadi kesalahan',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCutiData();
  }, []);

  const handleSubmit = async () => {
    if (!data.nik.trim()) return Alert.alert('NIK', 'NIK harus diisi');
    if (!data.name.trim()) return Alert.alert('Nama', 'Nama harus diisi');
    if (data.end_date.isBefore(data.start_date)) {
      return Alert.alert(
        'Tanggal',
        'Tanggal akhir cuti tidak boleh lebih awal dari mulai cuti',
      );
    }

    try {
      const formData = new FormData();
      formData.append('start_date', data.start_date.format('YYYY-MM-DD'));
      formData.append('end_date', data.end_date.format('YYYY-MM-DD'));

      instance.defaults.headers['Content-Type'] = 'multipart/form-data';
      await instance.post('v1/leaves/submission', formData);

      Alert.alert('Cuti berhasil', 'Cuti berhasil diajukan', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
      showNotification('Cuti berhasil', 'Cuti berhasil diajukan');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Terjadi kesalahan saat mengajukan cuti';
      Alert.alert('Cuti Gagal', errorMessage);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCutiData();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <RefreshableScrollView refreshing={refreshing} onRefresh={onRefresh}>
        <View style={globalStyles.formContainer}>
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
            label="Tanggal Mulai Cuti"
            value={data.start_date.format('dddd DD/MM/YYYY')}
            editable={false}
            onIconPress={() => setOpenStartPicker(true)}
            iconName="calendar"
          />
          <InputField
            label="Tanggal Akhir Cuti"
            value={data.end_date.format('dddd DD/MM/YYYY')}
            editable={false}
            onIconPress={() => setOpenEndPicker(true)}
            iconName="calendar"
          />
          <View style={[globalStyles.groupField, {marginBottom: 10}]}>
            <Button label="Ajukan Cuti" onPress={handleSubmit} />
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : cutiData ? (
            <View style={styles.groupDetailCuti}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                Detail Terakhir Cuti
              </Text>
              <View style={[globalStyles.groupField, {marginBottom: 10}]}>
                <Text style={{color: 'black'}}>Nama: {cutiData.user.name}</Text>
                <Text style={{color: 'black'}}>
                  NIK: {cutiData.user.detail_users.nik}
                </Text>
                <Text style={{color: 'black'}}>
                  Tanggal Mulai Cuti:{' '}
                  {dayjs(cutiData.start_date).format('DD MMMM YYYY')}
                </Text>
                <Text style={{color: 'black'}}>
                  Tanggal Selesai Cuti:{' '}
                  {dayjs(cutiData.end_date).format('DD MMMM YYYY')}
                </Text>
                <Text style={{color: 'black'}}>
                  Status Cuti: {cutiData.status}
                </Text>
                <Text style={{color: 'black'}}>
                  Response Cuti: {cutiData.response}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.groupDetailCuti}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                Detail Terakhir Cuti
              </Text>
              <Text style={{color: 'black'}}>Tidak ada data cuti</Text>
            </View>
          )}
        </View>
      </RefreshableScrollView>

      <DatePicker
        modal
        mode="date"
        minimumDate={dayjs().toDate()}
        open={openStartPicker}
        date={data.start_date.toDate()}
        onConfirm={handleStartChange}
        onCancel={() => setOpenStartPicker(false)}
      />
      <DatePicker
        modal
        mode="date"
        minimumDate={data.start_date.toDate()}
        open={openEndPicker}
        date={data.end_date.toDate()}
        onConfirm={handleEndChange}
        onCancel={() => setOpenEndPicker(false)}
      />
    </SafeAreaView>
  );
}

export default CutiScreen;
