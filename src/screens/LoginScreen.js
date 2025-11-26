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
import { API } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../theme/ThemeContext';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { register, handleSubmit, setValue, formState: { errors }, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = React.useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  React.useEffect(() => {
    register('username');
    register('password');
  }, [register]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', {
        username: data.username,
        password: data.password,
      });
      await AsyncStorage.setItem('userToken', res.data.accessToken);
      await AsyncStorage.setItem('userName', `${res.data.firstName} ${res.data.lastName}`);
      await AsyncStorage.setItem('userImage', res.data.image || '');
    } catch (err) {
      Alert.alert('Login Failed', 'Wrong username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>UoM Course Finder</Text>

      <TextInput
        ref={usernameRef}
        style={[styles.input, errors.username && styles.errorInput]}
        placeholder="Username"
        placeholderTextColor={theme.textSecondary}
        onChangeText={(text) => setValue('username', text)}
        onBlur={() => trigger('username')}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

      <TextInput
        ref={passwordRef}
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Password"
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
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.link, { color: theme.primary }]}>Create new account</Text>
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
  help: { marginTop: 30, fontSize: 14 },
});