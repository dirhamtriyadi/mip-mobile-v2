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
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
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
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <RefreshableScrollView
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 100}}>
          <View style={styles.formGroup}>
            <Text style={styles.title}>Edit Profil</Text>
          </View>
          <View style={styles.formGroup}>
            <Controller
              control={controlProfil}
              name="name"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={{width: '100%'}}>
                  <Text
                    style={[
                      {fontSize: 16, marginBottom: 10, fontWeight: 'bold'},
                      errorsProfil.name && {color: 'red'},
                    ]}>
                    Nama
                  </Text>
                  <TextInput
                    placeholderTextColor={errorsProfil.name ? 'red' : 'black'}
                    placeholder="Nama"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={[
                      {
                        color: 'black',
                        width: '100%',
                        height: 45,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                        marginBottom: 15,
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                      },
                      errorsProfil.name && {borderColor: 'red', color: 'red'},
                    ]}
                    autoCorrect={false}
                    value={value}
                  />
                </View>
              )}
            />
            {errorsProfil.name && (
              <Text
                style={{
                  color: 'red',
                  marginTop: -10,
                  marginBottom: 10,
                  width: '100%',
                }}>
                {errorsProfil.name.message}
              </Text>
            )}

            <Controller
              control={controlProfil}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={{width: '100%'}}>
                  <Text
                    style={[
                      {fontSize: 16, marginBottom: 10, fontWeight: 'bold'},
                      errorsProfil.email && {color: 'red'},
                    ]}>
                    Email
                  </Text>
                  <TextInput
                    placeholderTextColor={errorsProfil.email ? 'red' : 'black'}
                    placeholder="Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={[
                      {
                        color: 'black',
                        width: '100%',
                        height: 45,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                        marginBottom: 15,
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                      },
                      errorsProfil.email && {borderColor: 'red', color: 'red'},
                    ]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                  />
                </View>
              )}
            />
            {errorsProfil.email && (
              <Text
                style={{
                  color: 'red',
                  marginTop: -10,
                  marginBottom: 10,
                  width: '100%',
                }}>
                {errorsProfil.email.message}
              </Text>
            )}

            <Controller
              control={controlProfil}
              name="nik"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={{width: '100%'}}>
                  <Text
                    style={[
                      {fontSize: 16, marginBottom: 10, fontWeight: 'bold'},
                      errorsProfil.nik && {color: 'red'},
                    ]}>
                    NIK
                  </Text>
                  <TextInput
                    placeholderTextColor={errorsProfil.nik ? 'red' : 'black'}
                    placeholder="NIK"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={[
                      {
                        color: 'black',
                        width: '100%',
                        height: 45,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                        marginBottom: 15,
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                      },
                      errorsProfil.nik && {borderColor: 'red', color: 'red'},
                    ]}
                    keyboardType="numeric"
                    autoCorrect={false}
                    value={value}
                  />
                </View>
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
      </KeyboardAvoidingView>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
}

export default ProfilScreen;
