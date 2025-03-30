import instance from '@src/configs/axios';
import {useNotification} from '@src/hooks/useNotification';
import {DetailLaporanPenagihan} from '@src/types/detailLaporanPenagihan';
import {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import globalStyles from '@src/styles/styles';
import Divider from '@src/components/Divider';

interface DetailLaporanPenagihanScreenProps {
  route: any;
}

function DetailLaporanPenagihanScreen({
  route,
}: DetailLaporanPenagihanScreenProps) {
  const {id} = route.params;

  const [data, setData] = useState<DetailLaporanPenagihan>({
    id: 0,
    bill_number: '',
    customer_id: 0,
    customer: {
      id: 0,
      no_contract: 0,
      bank_account_number: 0,
      phone_number: '',
      status: null,
      bank_id: 0,
      margin_start: 0,
      os_start: 0,
      margin_remaining: 0,
      arrears: 0,
      name_customer: '',
      name_mother: '',
      installments: 0,
      month_arrears: 0,
      due_date: '',
      customer_address: {
        id: 0,
        customer_id: 0,
        address: '',
        village: '',
        subdistrict: '',
        created_at: '',
        updated_at: '',
      },
      description: '',
      created_at: '',
      updated_at: '',
      created_by: null,
      updated_by: null,
      deleted_by: null,
      deleted_at: null,
    },
    user_id: 0,
    user: {
      id: 0,
      name: '',
      email: '',
      email_verified_at: null,
      bank_id: 0,
      created_at: '',
      updated_at: '',
    },
    latestBillingFollowups: {
      id: 0,
      customer_billing_id: 0,
      status: {
        label: '',
        value: '',
      },
      date_exec: '',
      description: '',
      proof: '',
      promise_date: null,
      payment_amount: null,
      signature_officer: '',
      signature_customer: null,
    },
    billingFollowups: [
      {
        id: 0,
        customer_billing_id: 0,
        status: {
          label: '',
          value: '',
        },
        date_exec: '',
        description: '',
        proof: '',
        promise_date: null,
        payment_amount: null,
        signature_officer: '',
        signature_customer: null,
      },
    ],
    created_at: '',
  });

  const fetchBillingReport = useCallback(async () => {
    try {
      const response = await instance.get(`v1/customer-billing-reports/${id}`);
      setData(prevData => ({
        ...prevData,
        id: response.data.data.id,
        bill_number: response.data.data.bill_number,
        customer_id: response.data.data.customer_id,
        customer: {
          ...prevData.customer,
          name_customer: response.data.data.customer.name_customer,
          name_mother: response.data.data.customer.name_mother,
          installments: response.data.data.customer.installments.toString(),
          month_arrears: response.data.data.customer.month_arrears.toString(),
          due_date: response.data.data.customer.due_date,
          customer_address: {
            ...prevData.customer.customer_address,
            address: response.data.data.customer.customer_address.address,
            village: response.data.data.customer.customer_address.village,
            subdistrict:
              response.data.data.customer.customer_address.subdistrict,
          },
        },
        billingFollowups: response.data.data.billingFollowups.map(
          (item: any) => ({
            ...item,
            status: {
              label: item.status.label,
              value: item.status.value,
            },
            date_exec: item.date_exec,
            description: item.description,
            proof: item.proof,
            promise_date: item.promise_date,
            payment_amount: item.payment_amount,
            signature_officer: item.signature_officer,
            signature_customer: item.signature_customer,
          }),
        ),
        latestBillingFollowups: {
          ...response.data.data.latestBillingFollowups,
          status: {
            label: response.data.data.latestBillingFollowups.status.label,
            value: response.data.data.latestBillingFollowups.status.value,
          },
          date_exec: response.data.data.latestBillingFollowups.date_exec,
          description: response.data.data.latestBillingFollowups.description,
          proof: response.data.data.latestBillingFollowups.proof,
          promise_date: response.data.data.latestBillingFollowups.promise_date,
          payment_amount:
            response.data.data.latestBillingFollowups.payment_amount,
          signature_officer:
            response.data.data.latestBillingFollowups.signature_officer,
          signature_customer:
            response.data.data.latestBillingFollowups.signature_customer,
        },
        created_at: response.data.data.created_at,
        updated_at: response.data.data.updated_at,
        created_by: response.data.data.created_by,
        updated_by: response.data.data.updated_by,
        deleted_by: response.data.data.deleted_by,
        deleted_at: response.data.data.deleted_at,
      }));
      console.log('Data fetched successfully:', response.data.data);
    } catch (error: any) {
      console.error(error);
      return Alert.alert(
        'Error',
        error.response?.data?.message || 'Terjadi kesalahan',
      );
    }
  }, []);

  useEffect(() => {
    fetchBillingReport();
  }, [fetchBillingReport]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View style={{flex: 1, padding: 10}}>
          <View
            style={{padding: 10, backgroundColor: '#fff', borderRadius: 10}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', margin: 10}}>
              Detail Laporan Penagihan
            </Text>
            <Text style={{margin: 5}}>
              Nama Nasabah: {data.customer.name_customer}
            </Text>
            <Text style={{margin: 5}}>
              Alamat: {data.customer.customer_address.address}
            </Text>
            <Text style={{margin: 5}}>
              Desa: {data.customer.customer_address.village}
            </Text>
            <Text style={{margin: 5}}>
              Kecamatan: {data.customer.customer_address.subdistrict}
            </Text>
          </View>
          {data.billingFollowups.length > 0 && (
            <View
              style={{
                padding: 10,
                backgroundColor: '#fff',
                borderRadius: 10,
                marginTop: 10,
              }}>
              <Text style={{fontSize: 20, fontWeight: 'bold', margin: 10}}>
                Riwayat Penagihan
              </Text>
              {data.billingFollowups.map((item, index) => {
                return (
                  <View key={index} style={{marginBottom: 10}}>
                    <Text style={{margin: 5}}>
                      Tanggal Penagihan: {item.date_exec}
                    </Text>
                    <Text style={{margin: 5}}>Status: <Text style={[getStatusStyle(item.status.value)]}>{item.status.label}</Text></Text>
                    <Text style={{margin: 5}}>
                      Deskripsi: {item.description}
                    </Text>
                    <Divider />
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'visit':
      return styles.statusVisit;
    case 'promise_to_pay':
      return styles.statusPromiseToPay;
    case 'pay':
      return styles.statusPay;
    default:
      return styles.statusError;
  }
};

export default DetailLaporanPenagihanScreen;
