// src/navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tabs (Home + Favorites + Profile)
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Icon name="book-open" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{ tabBarLabel: 'Favorites', tabBarIcon: ({ color }) => <Icon name="heart" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <Icon name="user" size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

// Root Stack – CourseDetails is here so it's reachable from ANY tab
function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const check = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    check();

    const interval = setInterval(check, 500);
    return () => clearInterval(interval);
  }, []);

  if (isLoggedIn === null) return null;

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <RootStack />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}