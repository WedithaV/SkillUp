import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import API from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/login', {
        username: username,
        password: password,
      });

      // Save token and user info
      await AsyncStorage.setItem('userToken', response.data.accessToken);
      await AsyncStorage.setItem('userName', response.data.firstName + ' ' + response.data.lastName);
      await AsyncStorage.setItem('userImage', response.data.image || '');

      Alert.alert('Success', `Welcome back ${response.data.firstName}!`);
      navigation.replace('MainApp');
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert('Login Failed', 'Wrong username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UoM Course Finder</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>

      {/* Working test accounts */}
      <View style={styles.helpBox}>
        <Text style={styles.helpTitle}>Test Accounts (100% working):</Text>
        <Text style={styles.help}>• username: emilys      password: emilyspass</Text>
        <Text style={styles.help}>• username: michaelw    password: michaelwpass</Text>
        <Text style={styles.help}>• username: sophiai     password: sophiapass</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#7f8c8d', marginBottom: 40 },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#3498db', marginTop: 20, fontSize: 16 },
  helpBox: { marginTop: 30, padding: 15, backgroundColor: '#ecf0f1', borderRadius: 10 },
  helpTitle: { fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  help: { color: '#7f8c8d', fontSize: 14 },
});