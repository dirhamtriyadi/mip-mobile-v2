import { NavigationProp, useNavigation } from '@react-navigation/native';
import RefreshableScrollView from '@src/components/RefreshableScrollView';
import { PenagihanData } from '@src/types/penagihan';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RootStackParamList } from '../../../App';
import instance from '../../configs/axios';
import styles from './styles';

function PenagihanScreen() {
  const [data, setData] = useState<PenagihanData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchBillings();
  }, [search]); // Pencarian akan otomatis dilakukan saat `search` berubah

  const fetchBillings = async () => {
    try {
      setLoading(true);
      const response = await instance.get('v1/customer-billings', {
        params: search ? {search} : {},
      });
      setData(response.data.data);
    } catch (error: any) {
      Alert.alert(
        'Gagal mengambil data penagihan',
        error.response?.data?.message || 'Terjadi kesalahan',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBillings(); // Memanggil kembali API saat tombol pencarian ditekan
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBillings();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
          List Tagihan
        </Text>
        <View style={styles.groupSearch}>
          <TextInput
            placeholder="Masukan kata pencarian"
            style={{width: '90%'}}
            value={search}
            onChangeText={setSearch}
            keyboardType="default"
            onSubmitEditing={handleSearch} // Jalankan pencarian saat "Enter" ditekan
          />
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={handleSearch}>
            <Icon name="search" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <RefreshableScrollView refreshing={refreshing} onRefresh={onRefresh}>
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : data && data.length > 0 ? (
            data.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.btn,
                  {padding: 10, backgroundColor: '#f8f8f8', borderRadius: 10},
                ]}
                onPress={
                  () => navigation.navigate('DetailPenagihan', {id: item.id})
                  // console.log({id: item.id})
                }>
                <View style={styles.head}>
                  <Text style={styles.textKontrak}>
                    No. Kontrak: {item.customer.no_contract}
                  </Text>
                  <Text style={styles.textDate}>
                    {dayjs(item.created_at).format('DD-MM-YYYY')}
                  </Text>
                </View>
                <Text>No. Tagihan: {item.bill_number}</Text>
                <Text>Nama Nasabah: {item.customer.name_customer}</Text>
                <View style={{flex: 1, flexDirection: 'row', gap: 5}}>
                  {item.latestBillingFollowups?.status?.value ? (
                    <Text
                      style={getStatusStyle(
                        item.latestBillingFollowups.status.value,
                      )}>
                      {item.latestBillingFollowups.status.label}
                    </Text>
                  ) : (
                    <Text style={styles.statusError}>Belum Ada</Text>
                  )}
                  {item.latestBillingFollowups?.date_exec && (
                    <Text>
                      {dayjs(item.latestBillingFollowups.date_exec).format(
                        'DD-MM-YYYY',
                      )}
                    </Text>
                  )}
                </View>
                <View style={{flex: 1, flexDirection: 'row', gap: 5}}>
                  {item.latestBillingFollowups?.status?.value ===
                  'promise_to_pay' ? (
                    <Text>
                      Tanggal janji bayar:{' '}
                      {dayjs(item.latestBillingFollowups.promise_date).format(
                        'DD-MM-YYYY',
                      )}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noData}>
              <Text style={styles.noDataText}>
                Tidak ada data yang ditemukan
              </Text>
            </View>
          )}
        </View>
      </RefreshableScrollView>
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

export default PenagihanScreen;
