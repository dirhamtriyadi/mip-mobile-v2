import React, { useContext, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  useColorScheme,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { AuthContext } from '../../contexts/AuthContext';
import createStyles from './styles';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchemaType } from '@src/schema/auth';

function LoginScreen() {
  const { isAuthenticated, isLoading, login } = useContext(AuthContext);
  const theme = useColorScheme() || 'light';
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = createStyles(theme);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async ({ email, password }: LoginSchemaType) => {
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login failed', error.response.data.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Home');
    }
  }, [isAuthenticated, navigation]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Email"
                placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
                onBlur={onBlur}
                onChangeText={onChange}
                style={[styles.input, errors.email && { borderColor: 'red' }]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
              {errors.email.message}
            </Text>
          )}

          {/* Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Password"
                placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
                style={[styles.input, errors.password && { borderColor: 'red' }]}
                value={value}
                autoCorrect={false}
              />
            )}
          />
          {errors.password && (
            <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
              {errors.password.message}
            </Text>
          )}

          {/* Submit Button */}
          <Button title="Submit" onPress={handleSubmit(handleLogin)} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
