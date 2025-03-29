import useImagePicker from '@src/hooks/useImagePicker';
import globalStyles from '@src/styles/styles';
import {useCallback, useEffect, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, View} from 'react-native';
import FormCalonNasabah from './form';
import instance from '@src/configs/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CalonNasabahFormData} from '@src/types/calonNasabah';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'App';
import { useNotification } from '@src/hooks/useNotification';

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
    formData.append('bank', data.bank);
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
    }
  }, [data]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View style={globalStyles.formContainer}>
          <FormCalonNasabah
            data={data}
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
    </SafeAreaView>
  );
}

export default CalonNasabahScreen;
