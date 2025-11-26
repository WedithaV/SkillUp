import React, { useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../theme/ThemeContext';

const schema = yup.object({
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function RegisterScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { register, handleSubmit, setValue, formState: { errors }, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    register('username');
    register('email');
    register('password');
  }, [register]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('userToken', 'dummy-token');
      await AsyncStorage.setItem('userName', data.username);
      await AsyncStorage.setItem('userImage', '');
      Alert.alert('Success', 'Account created!');
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>

      <TextInput
        style={[styles.input, errors.username && styles.errorInput]}
        placeholder="Username"
        placeholderTextColor={theme.textSecondary}
        onChangeText={(text) => setValue('username', text)}
        onBlur={() => trigger('username')}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

      <TextInput
        style={[styles.input, errors.email && styles.errorInput]}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setValue('email', text)}
        onBlur={() => trigger('email')}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <TextInput
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Password (min 6 chars)"
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        onChangeText={(text) => setValue('password', text)}
        onBlur={() => trigger('password')}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.link, { color: theme.primary }]}>Already have account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
  input: { width: '100%', padding: 15, borderRadius: 10, marginBottom: 5, borderWidth: 1, backgroundColor: '#fff', borderColor: '#ddd' },
  errorInput: { borderColor: '#e74c3c', borderWidth: 2 },
  errorText: { color: '#e74c3c', alignSelf: 'flex-start', marginLeft: 10, marginBottom: 10, fontSize: 14 },
  button: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20, fontSize: 16 },
});