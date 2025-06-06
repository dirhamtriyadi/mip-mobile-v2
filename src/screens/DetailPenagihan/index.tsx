import useImagePicker from '@hooks/useImagePicker';
import {useNotification} from '@hooks/useNotification';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import LoadingModal from '@src/components/LoadingModal';
import {DetailPenagihanData} from '@src/types/detailPenagihan';
import globalStyles from '@styles/styles';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';
import instance from '../../configs/axios';
import FormPenagihan from './form';

interface DetailPenagihanScreenProps {
  route: any;
}

function DetailPenagihanScreen({route}: DetailPenagihanScreenProps) {
  const {id} = route.params;
  const {showNotification} = useNotification();
  const {image, handleClickOpenCamera, handleImageSelect, handleClickReset} =
    useImagePicker();
  // const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DetailPenagihanData>({
    id: 0,
    bill_number: '',
    date_exec: dayjs().toDate(),
    customer_id: 0,
    customer: {
      name_customer: '',
      name_mother: '',
      installments: '',
      month_arrears: '',
      due_date: null,
      customer_address: {
        address: '',
        village: '',
        subdistrict: '',
      },
    },
    user_id: 0,
    status: 'visit',
    description: '',
    proof: null,
    promise_date: dayjs().toDate(),
    payment_amount: null,
    signature_officer: null,
    signature_customer: null,
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      proof: image,
    }));
  }, [image]);

  useEffect(() => {
    fetchBillingDetails();
  }, []);

  const fetchBillingDetails = async () => {
    try {
      const response = await instance.get(`v1/customer-billings/${id}`);
      setData(prevData => ({
        ...prevData,
        id: response.data.data.id,
        bill_number: response.data.data.bill_number,
        customer_id: response.data.data.customer_id,
        customer: {
          name_customer: response.data.data.customer.name_customer,
          name_mother: response.data.data.customer.name_mother,
          installments: response.data.data.customer.installments
            ? response.data.data.customer.installments.toString()
            : '',
          month_arrears: response.data.data.customer.month_arrears
            ? response.data.data.customer.month_arrears.toString()
            : '',
          due_date: response.data.data.customer.due_date,
          customer_address: {
            address: response.data.data.customer.customer_address.address,
            village: response.data.data.customer.customer_address.village,
            subdistrict:
              response.data.data.customer.customer_address.subdistrict,
          },
        },
      }));
    } catch (error: any) {
      if (error.response.data.status === 'error') {
        Alert.alert(
          'Gagal mengambil data penagihan',
          error.response.data.message,
        );
      }
      Alert.alert('Gagal mengambil data penagihan', `Gagal terjadi kesalahan.`);
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const {
        id,
        bill_number,
        date_exec,
        status,
        description,
        proof,
        promise_date,
        payment_amount,
        signature_officer,
        signature_customer,
      } = data;

      const formData = new FormData();
      formData.append('id', id);
      formData.append('bill_number', bill_number);
      formData.append('date_exec', dayjs(date_exec).format('YYYY-MM-DD'));
      formData.append('status', status);
      formData.append('description', description || '');

      if (proof) {
        formData.append('proof', {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });
      }

      if (status === 'promise_to_pay') {
        formData.append(
          'promise_date',
          dayjs(promise_date).format('YYYY-MM-DD'),
        );
      } else if (status === 'pay') {
        formData.append('payment_amount', payment_amount ?? null);
      }

      if (signature_officer) {
        formData.append('signature_officer', {
          uri: signature_officer,
          type: 'image/png',
          name: 'signature_officer.png',
        });
      }

      if (signature_customer) {
        formData.append('signature_customer', {
          uri: signature_customer,
          type: 'image/png',
          name: 'signature_customer.png',
        });
      }

      instance.defaults.headers['Content-Type'] = 'multipart/form-data';

      await instance.post('v1/billing-followups', formData);

      Alert.alert(
        'Penagihan berhasil',
        'Status penagihan berhasil ditambahkan',
        [{text: 'OK', onPress: () => navigation.navigate('Home')}],
      );
      showNotification('Penagihan', 'Status penagihan berhasil ditambahkan');
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response.data.status === 'error') {
        Alert.alert(
          'Penagihan Gagal',
          `Gagal terjadi kesalahan karena:\n${error.response.data.message}`,
        );
      }
      Alert.alert('Penagihan Gagal', `Gagal terjadi kesalahan.`);
    } finally {
      setIsLoading(false);
    }
  }, [data, image, navigation, showNotification]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        {/* <ScrollView scrollEnabled={scrollEnabled}> */}
        <FormPenagihan
          isLoading={isLoading}
          data={data}
          onDataChange={setData}
          onOpenCamera={handleClickOpenCamera}
          onImageSelect={handleImageSelect}
          onImageReset={handleClickReset}
          // onScrollEnabledChange={setScrollEnabled}
          onHandleSubmit={handleSubmit}
        />
      </ScrollView>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
}

export default DetailPenagihanScreen;
