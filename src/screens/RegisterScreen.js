import React, { useContext } from 'react';
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
  username: yup.string().required('Username required').min(3, 'Too short'),
  email: yup.string().required('Email required').email('Invalid email'),
  password: yup.string().required('Password required').min(6, 'Min 6 characters'),
});

export default function RegisterScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // Use real test user for demo (DummyJSON doesn't save)
      const loginRes = await API.post('/auth/login', {
        username: 'emilys',
        password: 'emilyspass',
      });

      await AsyncStorage.setItem('userToken', loginRes.data.accessToken);
      await AsyncStorage.setItem('userName', 'New User');
      await AsyncStorage.setItem('userImage', '');

      Alert.alert('Success', 'Registration complete! Welcome!');
    } catch (err) {
      Alert.alert('Error', 'Try again');
    }
  };

  const Input = ({ name, placeholder, secure = false, type = 'default' }) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.card, color: theme.text, borderColor: errors[name] ? 'red' : theme.border }
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry={secure}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
        {...control.register(name)}
      />
      {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>

      <Input name="username" placeholder="Username" />
      <Input name="email" placeholder="Email" type="email" />
      <Input name="password" placeholder="Password" secure />

      {isSubmitting ? (
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
  inputContainer: { width: '100%', marginBottom: 10 },
  input: { width: '100%', padding: 15, borderRadius: 10, borderWidth: 1 },
  error: { color: 'red', fontSize: 12, marginTop: 5, marginLeft: 10, alignSelf: 'flex-start' },
  button: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20 },
});