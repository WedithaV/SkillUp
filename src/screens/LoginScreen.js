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

// Validation schema
const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(6, 'Password too short'),
});

export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await API.post('/auth/login', data);
      await AsyncStorage.setItem('userToken', res.data.accessToken);
      await AsyncStorage.setItem('userName', `${res.data.firstName} ${res.data.lastName}`);
      await AsyncStorage.setItem('userImage', res.data.image || '');
      // Auto switch handled by AppNavigator
    } catch (err) {
      Alert.alert('Login Failed', 'Wrong username or password');
    }
  };

  const Input = ({ name, placeholder, secure = false }) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.card, color: theme.text, borderColor: errors[name] ? 'red' : theme.border }
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry={secure}
        {...control.register(name)}
      />
      {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>UoM Course Finder</Text>

      <Input name="username" placeholder="Username" />
      <Input name="password" placeholder="Password" secure />

      {isSubmitting ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.link, { color: theme.primary }]}>Create new account</Text>
      </TouchableOpacity>

      <Text style={[styles.help, { color: theme.textSecondary }]}>
        Test: emilys / emilyspass
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
  inputContainer: { width: '100%', marginBottom: 10 },
  input: { width: '100%', padding: 15, borderRadius: 10, borderWidth: 1 },
  error: { color: 'red', fontSize: 12, marginTop: 5, alignSelf: 'flex-start', marginLeft: 10 },
  button: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20 },
  help: { marginTop: 30, fontSize: 14 },
});