import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import React, { useContext } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AbsenScreen from '@screens/Absen';
import AbsenMasukScreen from '@screens/AbsenMasuk';
import AbsenPulangScreen from '@screens/AbsenPulang';
import LoginScreen from '@screens/Auth/Login.tsx';
import CutiScreen from '@screens/Cuti';
import DetailPenagihanScreen from '@screens/DetailPenagihan';
import HomeScreen from '@screens/Home';
import IzinScreen from '@screens/Izin';
import PenagihanScreen from '@screens/Penagihan';
import SakitScreen from '@screens/Sakit';
import CalonNasabahScreen from '@src/screens/CalonNasabah';
import DetailSurveiScreen from '@src/screens/DetailSurvei';
import LaporanPenagihanScreen from '@src/screens/LaporanPenagihan';
import DetailLaporanPenagihanScreen from '@src/screens/DetailLaporanPenagihan';
import ProfilScreen from '@src/screens/Profil';
import SurveiScreen from '@src/screens/Survei';
import { AuthContext, AuthProvider } from './src/contexts/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Absen: undefined;
  AbsenMasuk: undefined;
  AbsenPulang: undefined;
  Sakit: undefined;
  Izin: undefined;
  Cuti: undefined;
  Penagihan: undefined;
  DetailPenagihan: {id: string};
  LaporanPenagihan: undefined;
  DetailLaporanPenagihan: {id: string};
  CalonNasabah: undefined;
  Survei: undefined;
  DetailSurvei: {id: string};
  Profil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

function HomeStackScreen() {
  dayjs.locale('id');
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={() => ({title: 'Home'})}
        />
        <Stack.Screen
          name="Absen"
          component={AbsenScreen}
          options={{title: 'Absen'}}
        />
        <Stack.Screen
          name="AbsenMasuk"
          component={AbsenMasukScreen}
          options={{title: 'Absen Masuk'}}
        />
        <Stack.Screen
          name="AbsenPulang"
          component={AbsenPulangScreen}
          options={{title: 'Absen Pulang'}}
        />
        <Stack.Screen
          name="Sakit"
          component={SakitScreen}
          options={{title: 'Sakit'}}
        />
        <Stack.Screen
          name="Izin"
          component={IzinScreen}
          options={{title: 'Izin'}}
        />
        <Stack.Screen
          name="Cuti"
          component={CutiScreen}
          options={{title: 'Cuti'}}
        />
        <Stack.Screen
          name="Penagihan"
          component={PenagihanScreen}
          options={{title: 'Penagihan'}}
        />
        <Stack.Screen
          name="DetailPenagihan"
          component={DetailPenagihanScreen}
          options={{title: 'Detail Penagihan'}}
        />
        <Stack.Screen
          name="LaporanPenagihan"
          component={LaporanPenagihanScreen}
          options={{title: 'Laporan Penagihan'}}
        />
        <Stack.Screen
          name="DetailLaporanPenagihan"
          component={DetailLaporanPenagihanScreen}
          options={{title: 'Detail Laporan Penagihan'}}
        />
        <Stack.Screen
          name="CalonNasabah"
          component={CalonNasabahScreen}
          options={{title: 'Calon Nasabah'}}
        />
        <Stack.Screen
          name="Survei"
          component={SurveiScreen}
          options={{title: 'Survei'}}
        />
        <Stack.Screen
          name="DetailSurvei"
          component={DetailSurveiScreen}
          options={{title: 'Detail Survei'}}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function ProfilStackScreen() {
  const {logout} = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profil"
        component={ProfilScreen}
        options={{
          title: 'Profil',
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 10,
                padding: 10,
                backgroundColor: '#da4a4a',
                borderRadius: 5,
              }}
              onPress={() => handleLogout()}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Logout
              </Text>
            </TouchableOpacity>
          ),
          // remove header back button
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function Layout() {
  const {isAuthenticated, isLoading} = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator>
          <Tab.Screen
            name="HomeStackScreen"
            component={HomeStackScreen}
            options={{
              headerShown: false,
              tabBarLabel: 'Home',
              tabBarIcon: ({color}) => (
                <Ionicons name="home-outline" size={24} color={color} />
              ),
              tabBarActiveTintColor: '#000',
            }}
          />
          <Tab.Screen
            name="ProfilStackScreen"
            component={ProfilStackScreen}
            options={{
              headerShown: false,
              tabBarLabel: 'Profil',
              tabBarIcon: ({color}) => (
                <Ionicons name="person-outline" size={24} color={color} />
              ),
              tabBarActiveTintColor: '#000',
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Login',
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
