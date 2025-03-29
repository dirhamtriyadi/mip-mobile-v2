import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import {Text, View} from 'react-native';
import styles from './styles';
import globalStyles from '@styles/styles';
import React, {useEffect, useState} from 'react';
import instance from '../../configs/axios';
import Button from '@src/components/Button';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

function ProfilScreen() {
  const [loading, setLoading] = useState<boolean>(false);

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
      setLoading(true);
      const response = await instance.get('v1/profile');
      const {name, email, detail_users} = response.data.data;
      setProfilValue('name', name);
      setProfilValue('email', email);
      setProfilValue('nik', detail_users?.nik || '');
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfil();
  }, []);

  const handleSaveProfil = async (data: UpdateProfilSchema) => {
    try {
      setLoading(true);
      instance.defaults.headers['Content-Type'] = 'application/json';
      const response = await instance.put('v1/profile', {
        _method: 'put',
        ...data,
      });
      Alert.alert('Success', response.data.message);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal menyimpan data',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (data: UpdatePasswordSchema) => {
    try {
      setLoading(true);
      instance.defaults.headers['Content-Type'] = 'application/json';
      const response = await instance.put('v1/profile/update-password', {
        _method: 'put',
        ...data,
      });
      Alert.alert('Success', response.data.message);
      setPasswordValue('password', '');
      setPasswordValue('confirm_password', '');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal mengupdate password',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View
          style={[
            globalStyles.formContainer,
            styles.formGroup,
            {marginTop: 10, marginBottom: 5},
          ]}>
          <Text style={styles.title}>Edit Profil</Text>
        </View>
        <View style={[globalStyles.formContainer, styles.formGroup]}>
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
        <View
          style={[
            globalStyles.formContainer,
            styles.formGroup,
            {marginTop: 10, marginBottom: 5},
          ]}>
          <Text style={styles.title}>Edit Password</Text>
        </View>
        <View style={[globalStyles.formContainer, styles.formGroup]}>
          <Controller
            control={controlPassword}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <View style={{width: '100%'}}>
                <Text
                  style={[
                    {fontSize: 16, marginBottom: 10, fontWeight: 'bold'},
                    errorsPassword.password && {color: 'red'},
                  ]}>
                  Password
                </Text>
                <TextInput
                  placeholderTextColor={
                    errorsPassword.password ? 'red' : 'black'
                  }
                  placeholder="Password"
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
                    errorsPassword.password && {
                      borderColor: 'red',
                      color: 'red',
                    },
                  ]}
                  value={value}
                />
              </View>
            )}
          />
          {errorsPassword.password && (
            <Text
              style={{
                color: 'red',
                marginTop: -10,
                marginBottom: 10,
                width: '100%',
              }}>
              {errorsPassword.password.message}
            </Text>
          )}

          <Controller
            control={controlPassword}
            name="confirm_password"
            render={({field: {onChange, onBlur, value}}) => (
              <View style={{width: '100%'}}>
                <Text
                  style={[
                    {fontSize: 16, marginBottom: 10, fontWeight: 'bold'},
                    errorsPassword.confirm_password && {color: 'red'},
                  ]}>
                  Konfirmasi Password
                </Text>
                <TextInput
                  placeholderTextColor={
                    errorsPassword.confirm_password ? 'red' : 'black'
                  }
                  placeholder="Konfirmasi Password"
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
                    errorsPassword.confirm_password && {
                      borderColor: 'red',
                      color: 'red',
                    },
                  ]}
                  value={value}
                />
              </View>
            )}
          />
          {errorsPassword.confirm_password && (
            <Text
              style={{
                color: 'red',
                marginTop: -10,
                marginBottom: 10,
                width: '100%',
              }}>
              {errorsPassword.confirm_password.message}
            </Text>
          )}

          <Button
            label="Simpan"
            onPress={handleSubmitPassword(handleSavePassword)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
import {
  updatePasswordSchema,
  UpdatePasswordSchema,
  updateProfilSchema,
  UpdateProfilSchema,
} from '@src/schema/profil';

export default ProfilScreen;
