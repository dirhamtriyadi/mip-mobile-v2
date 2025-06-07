import {zodResolver} from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import LoadingModal from '@src/components/LoadingModal';
import instance from '@src/configs/axios';
import {formatErrorMessage} from '@src/helpers/errror';
import useImagePicker from '@src/hooks/useImagePicker';
import {useNotification} from '@src/hooks/useNotification';
import {calonNasabahCreateSchema, CalonNasabahCreateSchema} from '@src/schema';
import globalStyles from '@src/styles/styles';
import {CalonNasabahFormData} from '@src/types/calonNasabah';
import {RootStackParamList} from 'App';
import {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
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

  const form = useForm<CalonNasabahCreateSchema>({
    resolver: zodResolver(calonNasabahCreateSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      no_ktp: undefined,
      ktp: undefined,
      kk: undefined,
      status: null,
      status_message: null,
      user_id: undefined,
      bank_id: undefined,
    },
  });

  const {
    control,
    handleSubmit: handleSubmitForm,
    setValue,
    watch,
    formState: {errors, isValid, isSubmitting},
  } = form;

  const [data, setData] = useState<CalonNasabahFormData>({
    name: '',
    no_ktp: '',
    bank: '',
    ktp: '',
    kk: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [banks, setBanks] = useState<{label: string; value: string}[]>([]);

  const fetchBankList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('v1/banks/all');

      if (response.data.status === 'success') {
        const banks = response.data.data.map((bank: any) => ({
          label: bank.name,
          value: bank.id,
        }));
        setBanks(banks);
      }
    } catch (error: any) {
      console.log('Error:', error.response?.data);
      const errorMessage = formatErrorMessage(error);
      Alert.alert('Gagal', errorMessage);
    } finally {
      setIsLoading(false);
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

  const handleSubmit = useCallback(
    async (data: CalonNasabahCreateSchema) => {
      try {
        setIsLoading(true);

        const userString = await AsyncStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        const formData = new FormData();
        const appendIfExists = (key: string, value: any) => {
          if (value) formData.append(key, value);
        };

        appendIfExists('name', data.name);
        appendIfExists('no_ktp', data.no_ktp);
        appendIfExists('bank_id', data.bank_id);
        appendIfExists('user_id', user?.id);

        // Handle image files
        [
          {key: 'ktp', image: data.ktp},
          {key: 'kk', image: data.kk},
        ].forEach(({key, image}) => {
          if (image?.uri) {
            formData.append(key, {
              uri: image.uri,
              type: image.type,
              name: image.fileName,
            });
          }
        });

        await instance.post('v1/prospective-customers', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });

        Alert.alert(
          'Berhasil!',
          'Data calon nasabah telah berhasil disimpan ke dalam sistem. Terima kasih atas informasi yang telah diberikan.',
          [{text: 'OK', onPress: () => navigation.navigate('Home')}],
        );
        showNotification(
          'Data Tersimpan',
          'Calon nasabah baru berhasil ditambahkan ke dalam sistem',
        );
      } catch (error: any) {
        console.log('Error:', error.response?.data);
        const errorMessage = formatErrorMessage(error);
        Alert.alert('Gagal upload data calon nasabah', errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [imageKtp, imageKk, navigation, showNotification],
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View style={globalStyles.formContainer}>
          <FormCalonNasabah
            control={control}
            errors={errors}
            setValue={setValue}
            isValid={isValid}
            isSubmitting={isSubmitting}
            banks={banks}
            loading={isLoading}
            onSubmit={handleSubmitForm(handleSubmit)}
            watchedValues={watch()}
          />
          {/* <FormCalonNasabah
            loading={isLoading}
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
          /> */}
        </View>
      </ScrollView>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
}

export default CalonNasabahScreen;
