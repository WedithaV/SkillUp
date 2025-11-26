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

export default function RegisterScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/users/add', {
        username,
        email,
        password,
      });

      // Auto-login after successful registration
      await AsyncStorage.setItem('userToken', 'dummy-auth-token');
      await AsyncStorage.setItem('userName', `${res.data.firstName || username} ${res.data.lastName || ''}`);
      await AsyncStorage.setItem('userImage', res.data.image || '');

      Alert.alert('Success', 'Account created! Welcome!', [
        { text: 'OK', onPress: () => navigation.replace('MainTabs') }
      ]);
    } catch (err) {
      Alert.alert('Failed', 'Username or email already exists');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Username"
        placeholderTextColor={theme.textSecondary}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Password"
        placeholderTextColor={theme.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.link, { color: theme.primary }]}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
  input: { width: '100%', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1 },
  button: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20, fontSize: 16 },
});