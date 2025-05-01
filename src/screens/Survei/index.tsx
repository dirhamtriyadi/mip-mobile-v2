import {NavigationProp, useNavigation} from '@react-navigation/native';
import Button from '@src/components/Button';
import Divider from '@src/components/Divider';
import InputField from '@src/components/InputField';
import RefreshableScrollView from '@src/components/RefreshableScrollView';
import instance from '@src/configs/axios';
import globalStyles from '@src/styles/styles';
import {SurveiFormData} from '@src/types/survei';
import {RootStackParamList} from 'App';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
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

function DetailSurveiScreen() {
  const [data, setData] = useState<SurveiFormData[]>([]);
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

  useEffect(() => {
    fetchProspectiveCustomerSurveys();
  }, [search]);

  const fetchProspectiveCustomerSurveys = async () => {
    try {
      setLoading(true);
      const response = await instance.get('v1/prospective-customer-surveys', {
        params: {
          search: search || undefined,
          start_date: startDate,
          end_date: endDate,
        },
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
    fetchProspectiveCustomerSurveys();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProspectiveCustomerSurveys();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.headContainer}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Filter Tanggal</Text>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            gap: 10,
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
          <View style={{flex: 2}}>
            {/* <View style={{flex: 2, alignSelf: 'center'}}> */}
            <Button
              label="Filter"
              onPress={() => fetchProspectiveCustomerSurveys()}
            />
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
                  () => navigation.navigate('DetailSurvei', {id: item.id})
                  // console.log({id: item.id})
                }>
                <View style={styles.head}>
                  <Text style={{fontWeight: 'bold', fontSize: 20}}>
                    {item.name}
                  </Text>
                  <Text>{dayjs(item.created_at).format('DD-MM-YYYY')}</Text>
                </View>
                <Divider orientation="horizontal" color="black" width={1} />
                <Text>
                  <Text style={{fontWeight: 'bold'}}>No. KTP:</Text>{' '}
                  {item.number_ktp}
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Alamata:</Text>{' '}
                  {item.address}
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Status Alamat:</Text>{' '}
                  {item.address_status}
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>No. HP:</Text>{' '}
                  {item.phone_number}
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Status:</Text>{' '}
                  {item.status === 'done'
                    ? 'Selesai'
                    : item.status === 'ongoing'
                    ? 'Belum Selesai'
                    : 'Menunggu'}
                </Text>
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

export default DetailSurveiScreen;
