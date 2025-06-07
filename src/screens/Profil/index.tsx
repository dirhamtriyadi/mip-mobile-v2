import {zodResolver} from '@hookform/resolvers/zod';
import Button from '@src/components/Button';
import InputField from '@src/components/InputField';
import LoadingModal from '@src/components/LoadingModal';
import RefreshableScrollView from '@src/components/RefreshableScrollView';
import {formatErrorMessage} from '@src/helpers/errror';
import {
  updatePasswordSchema,
  UpdatePasswordSchema,
  updateProfilSchema,
  UpdateProfilSchema,
} from '@src/schema/profil';
import globalStyles from '@styles/styles';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ActivityIndicator, Alert, SafeAreaView, Text, View} from 'react-native';
import instance from '../../configs/axios';
import styles from './styles';

function ProfilScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    control: controlProfil,
    handleSubmit: handleSubmitProfil,
    setValue: setProfilValue,
    formState: {errors: errorsProfil},
  } = useForm<UpdateProfilSchema>({
    resolver: zodResolver(updateProfilSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      nik: '',
    },
  });

  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    setValue: setPasswordValue,
    formState: {errors: errorsPassword},
  } = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const getProfil = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('v1/profile');
      const {name, email, detail_users} = response.data.data;
      setProfilValue('name', name);
      setProfilValue('email', email);
      setProfilValue('nik', detail_users?.nik || '');
    } catch (error: any) {
      console.log('Error:', error.response?.data);
      const errorMessage = formatErrorMessage(error);
      Alert.alert('Gagal mengambil data', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfil();
  }, []);

  const handleSaveProfil = async (data: UpdateProfilSchema) => {
    try {
      setIsLoading(true);
      instance.defaults.headers['Content-Type'] = 'application/json';
      const response = await instance.put('v1/profile', {
        _method: 'put',
        ...data,
      });
      Alert.alert('Sukses', response.data.message);
    } catch (error: any) {
      console.log('Error:', error.response?.data);
      const errorMessage = formatErrorMessage(error);
      Alert.alert('Gagal update profil', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async (data: UpdatePasswordSchema) => {
    try {
      setIsLoading(true);
      instance.defaults.headers['Content-Type'] = 'application/json';
      const response = await instance.put('v1/profile/update-password', {
        _method: 'put',
        ...data,
      });
      Alert.alert('Sukses', response.data.message);
      setPasswordValue('password', '');
      setPasswordValue('confirm_password', '');
    } catch (error: any) {
      console.log('Error:', error.response?.data);
      const errorMessage = formatErrorMessage(error);
      Alert.alert('Gagal update password', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getProfil();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <RefreshableScrollView refreshing={refreshing} onRefresh={onRefresh}>
        <View style={styles.formGroup}>
          <Text style={styles.title}>Edit Profil</Text>
        </View>
        <View style={styles.formGroup}>
          <Controller
            control={controlProfil}
            name="name"
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                label="Nama Lengkap"
                placeholder="Masukan Nama Lengkap"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errorsProfil.name?.message}
                required
              />
            )}
          />

          <Controller
            control={controlProfil}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                label="Email"
                placeholder="Masukan Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errorsProfil.email?.message}
                required
              />
            )}
          />

          <Controller
            control={controlProfil}
            name="nik"
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                label="NIK"
                placeholder="Masukan NIK"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errorsProfil.nik?.message}
                required
              />
            )}
          />
          {errorsProfil.nik && (
            <Text
              style={{
                color: 'red',
                marginTop: -10,
                marginBottom: 10,
                width: '100%',
              }}>
              {errorsProfil.nik.message}
            </Text>
          )}

          <Button
            label="Simpan"
            onPress={handleSubmitProfil(handleSaveProfil)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.title}>Edit Password</Text>
        </View>
        <View style={styles.formGroup}>
          <Controller
            control={controlPassword}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                label="Password Baru"
                placeholder="Masukan Password Baru"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errorsPassword.password?.message}
                secureTextEntry
                required
              />
            )}
          />

          <Controller
            control={controlPassword}
            name="confirm_password"
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                label="Konfirmasi Password"
                placeholder="Masukan Konfirmasi Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errorsPassword.confirm_password?.message}
                secureTextEntry
                required
              />
            )}
          />

          <Button
            disabled={isLoading}
            label="Simpan"
            onPress={handleSubmitPassword(handleSavePassword)}
          />
        </View>
      </RefreshableScrollView>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
}

export default ProfilScreen;
