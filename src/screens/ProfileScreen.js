import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [userName, setUserName] = useState('Guest');

  const loadUser = async () => {
    const name = await AsyncStorage.getItem('userName');
    if (name) setUserName(name);
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userName']);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      {/* ALWAYS SAME AVATAR */}
      <View
        style={[
          styles.defaultAvatar,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Feather name="user" size={60} color={theme.textSecondary} />
      </View>

      <Text style={[styles.name, { color: theme.text }]}>{userName}</Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Welcome to UoM Course Finder
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={toggleTheme}
        activeOpacity={0.8}
      >
        <Feather
          name={theme.mode === 'light' ? 'moon' : 'sun'}
          size={22}
          color="white"
        />
        <Text style={styles.btnText}>
          Switch to {theme.mode === 'light' ? 'Dark' : 'Light'} Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.danger }]}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Feather name="log-out" size={20} color="white" />
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
  },

  defaultAvatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20,
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 25,
  },

  button: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
    width: 260,
    justifyContent: 'center',
  },

  btnText: {
    color: 'white',
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '600',
  },
});
