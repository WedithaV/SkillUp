import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { API } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../theme/ThemeContext';

export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
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
      const res = await API.post('/auth/login', { username, password });

      // Save user data
      await AsyncStorage.setItem('userToken', res.data.accessToken);
      await AsyncStorage.setItem('userName', `${res.data.firstName} ${res.data.lastName}`);
      await AsyncStorage.setItem('userImage', res.data.image || '');

      // DO NOT use navigation.reset() or replace()
      // AppNavigator will automatically switch to MainTabs
    } catch (err) {
      Alert.alert('Login Failed', 'Wrong username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>UoM Course Finder</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Sign in to continue
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder="Username"
        placeholderTextColor={theme.textSecondary}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={theme.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.link, { color: theme.primary }]}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>

      <Text style={[styles.help, { color: theme.textSecondary }]}>
        Test account: emilys / emilyspass
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    fontSize: 16,
  },
  help: {
    marginTop: 30,
    fontSize: 14,
    textAlign: 'center',
  },
});