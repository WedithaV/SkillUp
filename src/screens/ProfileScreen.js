import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';

export default function ProfileScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [userName, setUserName] = useState('Guest');
  const [userImage, setUserImage] = useState(null);

  const loadUser = async () => {
    const name = await AsyncStorage.getItem('userName');
    const image = await AsyncStorage.getItem('userImage');
    if (name) setUserName(name);
    if (image) setUserImage(image);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['userToken', 'userName', 'userImage']);
          // DO NOT use navigation.reset()
          // AppNavigator will automatically detect token removal and go to Login
        },
      },
    ]);
  };

  useEffect(() => {
    loadUser();
    const interval = setInterval(loadUser, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={{ uri: userImage || 'https://via.placeholder.com/120' }}
        style={styles.avatar}
      />
      <Text style={[styles.name, { color: theme.text }]}>{userName}</Text>
      <Text style={[styles.welcome, { color: theme.textSecondary }]}>
        Welcome to UoM Course Finder
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={toggleTheme}
      >
        <Icon name={theme.mode === 'light' ? 'moon' : 'sun'} size={24} color="white" />
        <Text style={styles.buttonText}>
          Switch to {theme.mode === 'light' ? 'Dark' : 'Light'} Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.danger }]}
        onPress={handleLogout}
      >
        <Icon name="log-out" size={20} color="white" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 18,
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    width: 250,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});