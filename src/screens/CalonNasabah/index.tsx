import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import LoadingModal from '@src/components/LoadingModal';
import instance from '@src/configs/axios';
import useImagePicker from '@src/hooks/useImagePicker';
import {useNotification} from '@src/hooks/useNotification';
import globalStyles from '@src/styles/styles';
import {CalonNasabahFormData} from '@src/types/calonNasabah';
import {RootStackParamList} from 'App';
import {useCallback, useEffect, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, View} from 'react-native';
import FormCalonNasabah from './form';

function CalonNasabahScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {showNotification} = useNotification();
  const {
    image: imageKtp,
    handleClickOpenCamera: handleClickOpenCameraKtp,
    handleImageSelect: handleImageSelectKtp,
    handleClickReset: handleClickResetKtp,
  } = useImagePicker();

  const {
    image: imageKk,
    handleClickOpenCamera: handleClickOpenCameraKk,
    handleImageSelect: handleImageSelectKk,
    handleClickReset: handleClickResetKk,
  } = useImagePicker();

  const [data, setData] = useState<CalonNasabahFormData>({
    name: '',
    no_ktp: '',
    bank: '',
    ktp: '',
    kk: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [banks, setBanks] = useState<{label: string; value: string}[]>([]);

  const fetchBankList = useCallback(async () => {
    try {
      const response = await instance.get('v1/banks/all');
      // console.log('Response bank list:', response.data);

      if (response.data.status === 'success') {
        const banks = response.data.data.map((bank: any) => ({
          label: bank.name,
          value: bank.id,
        }));
        setBanks(banks);
      }
    } catch (error) {
      console.error('Error fetching bank list:', error);
      Alert.alert('Gagal', 'Tidak dapat mengambil daftar bank');
    }
  }, []);

  useEffect(() => {
    fetchBankList();
  }, [fetchBankList]);

  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      ktp: imageKtp,
      kk: imageKk,
    }));
  }, [imageKtp, imageKk]);

  const handleSubmit = useCallback(async () => {
    const userString = await AsyncStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    // if (!user) {
    //   Alert.alert('Login', 'Silahkan login terlebih dahulu');
    //   return;
    // }
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('no_ktp', data.no_ktp);
    // formData.append('bank', data.bank);
    formData.append('bank_id', data.bank);
    formData.append('user_id', user.id);
    formData.append('ktp', {
      uri: data.ktp.uri,
      type: data.ktp.type,
      name: data.ktp.fileName,
    });
    formData.append('kk', {
      uri: data.kk.uri,
      type: data.kk.type,
      name: data.kk.fileName,
    });

    try {
      setLoading(true);
      instance.defaults.headers['Content-Type'] = 'multipart/form-data';
      const response = await instance.post(
        'v1/prospective-customers',
        formData,
      );
      if (response.data.status === 'success') {
        Alert.alert('Berhasil', 'Data berhasil disimpan', [
          {text: 'OK', onPress: () => navigation.navigate('Home')},
        ]);

        showNotification('Penagihan', 'Status penagihan berhasil ditambahkan');
      }
    } catch (error: any) {
      // console.log(error.response.data);
      if (error.response?.data?.status === 'error') {
        if (error.response?.data?.errors) {
          // Mengambil semua pesan error dari setiap field
          let message = Object.entries(error.response.data.errors)
            .map(([field, messages]) => (messages as string[]).join('\n'))
            .join('\n');

          Alert.alert('Gagal', message);
        } else {
          Alert.alert(
            'Gagal',
            `Terjadi kesalahan: ${error?.response?.data?.message}`,
          );
        }
      } else {
        Alert.alert('Gagal', 'Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setLoading(false);
    }
  }, [data]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View style={globalStyles.formContainer}>
          <FormCalonNasabah
            loading={loading}
            data={data}
            banks={banks}
            onDataChange={setData}
            imageKtp={imageKtp}
            imageKk={imageKk}
            handleClickOpenCameraKtp={handleClickOpenCameraKtp}
            handleClickOpenCameraKk={handleClickOpenCameraKk}
            handleImageSelectKtp={handleImageSelectKtp}
            handleImageSelectKk={handleImageSelectKk}
            handleClickResetKtp={handleClickResetKtp}
            handleClickResetKk={handleClickResetKk}
            handleSubmit={handleSubmit}
          />
        </View>
      </ScrollView>
      <LoadingModal visible={loading} />
    </SafeAreaView>
  );
}

export default CalonNasabahScreen;
