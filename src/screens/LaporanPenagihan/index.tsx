import { NavigationProp, useNavigation } from '@react-navigation/native';
import Button from '@src/components/Button';
import InputField from '@src/components/InputField';
import RefreshableScrollView from '@src/components/RefreshableScrollView';
import instance from '@src/configs/axios';
import { LaporanPenagihanData } from '@src/types/laporanPenagihan';
import { RootStackParamList } from 'App';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

function LaporanPenagihanScreen() {
  const [data, setData] = useState<LaporanPenagihanData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    dayjs().startOf('month').format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSearch = () => {
    fetchDataBillingReports(); // Memanggil kembali API saat tombol pencarian ditekan
  };

  useEffect(() => {
    fetchDataBillingReports();
  }, [search]); // Pencarian akan otomatis dilakukan saat `search` berubah

  const fetchDataBillingReports = async () => {
    try {
      setLoading(true);
      const response = await instance.get('v1/customer-billing-reports', {
        params: {
          search: search || undefined, // Kirim `search` jika ada
          start_date: startDate, // Kirim `startDate`
          end_date: endDate, // Kirim `endDate`
        },
      });
      setData(response.data.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Terjadi kesalahan',
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataBillingReports();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Filter Tanggal</Text>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            gap: 10,
          }}>
          <View
            style={{
              flex: 6,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View style={{flex: 3}}>
              <InputField
                placeholder="Pilih Tanggal Awal"
                value={startDate}
                editable={false}
                onIconPress={() => setOpenStartDatePicker(true)}
                onChangeText={() => {}}
                iconName="calendar"
              />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text>s/d</Text>
            </View>
            <View style={{flex: 3}}>
              <InputField
                placeholder="Pilih Tanggal Akhir"
                value={endDate}
                editable={false}
                onIconPress={() => setOpenEndDatePicker(true)}
                onChangeText={() => {}}
                iconName="calendar"
              />
            </View>
          </View>
          <View style={{flex: 2}}>
            {/* <View style={{flex: 2, alignSelf: 'center'}}> */}
            <Button label="Filter" onPress={() => fetchDataBillingReports()} />
          </View>
        </View>
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
                  () =>
                    navigation.navigate('DetailLaporanPenagihan', {id: item.id})
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
      <DatePicker
        modal
        mode="date"
        // minimumDate={dayjs(endDate).toDate()}
        maximumDate={dayjs(endDate).toDate()}
        open={openStartDatePicker}
        date={dayjs(startDate).toDate()}
        onConfirm={date => {
          setStartDate(dayjs(date).format('YYYY-MM-DD'));
          setOpenStartDatePicker(false);
        }}
        onCancel={() => setOpenStartDatePicker(false)}
      />
      <DatePicker
        modal
        mode="date"
        minimumDate={dayjs(startDate).toDate()}
        // maximumDate={dayjs(endDate).toDate()}
        open={openEndDatePicker}
        date={dayjs(endDate).toDate()}
        onConfirm={date => {
          setEndDate(dayjs(date).format('YYYY-MM-DD'));
          setOpenEndDatePicker(false);
        }}
        onCancel={() => setOpenEndDatePicker(false)}
      />
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

export default LaporanPenagihanScreen;
