import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';

export default function ProfileScreen({ navigation }) {
  const [userName, setUserName] = useState('Guest');
  const [userImage, setUserImage] = useState(null);

  const loadUser = async () => {
    const name = await AsyncStorage.getItem('userName');
    const image = await AsyncStorage.getItem('userImage');
    if (name) setUserName(name);
    if (image) setUserImage(image);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['userToken', 'userName', 'userImage']);
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUser);
    loadUser();
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: userImage || 'https://via.placeholder.com/120?text=User',
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{userName}</Text>
      <Text style={styles.welcome}>Welcome to UoM Course Finder</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" size={20} color="white" />
        <Text style={styles.logoutText}> Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  welcome: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 10,
    marginBottom: 50,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});