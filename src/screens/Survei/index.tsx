import { NavigationProp, useNavigation } from '@react-navigation/native';
import Divider from '@src/components/Divider';
import RefreshableScrollView from '@src/components/RefreshableScrollView';
import instance from '@src/configs/axios';
import globalStyles from '@src/styles/styles';
import { SurveiFormData } from '@src/types/survei';
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
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

function DetailSurveiScreen() {
  const [data, setData] = useState<SurveiFormData[]>([]);
  const [search, setSearch] = useState<string>('');
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
        params: search ? {search} : {},
      });
      setData(response.data.data);
      console.log(response.data.data);
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
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
          List Survei
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

export default DetailSurveiScreen;
