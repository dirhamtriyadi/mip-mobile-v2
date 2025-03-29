import React from 'react';
import {Text, View, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../App';
import styles from './styles';

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.colContainer}>
        <View style={styles.absenContainer}>
          <TouchableOpacity
            style={styles.buttonAbsen}
            onPress={() => navigation.navigate('Absen')}>
            <Icon name="sign-in-alt" size={30} color="#000" />
            <Text>Absen</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Penagihan')}>
            <Icon name="money-bill-wave" size={30} color="#000" />
            <Text>Penagihan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LaporanPenagihan')}>
            <Icon name="file-invoice-dollar" size={30} color="#000" />
            <Text>Laporan Penagihan</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CalonNasabah')}>
            <Icon name="user-alt" size={30} color="#000" />
            <Text>Calon Nasabah</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Survei')}>
            <Icon name="clipboard-list" size={30} color="#000" />
            <Text>Survei</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;
