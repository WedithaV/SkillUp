import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const themes = {
  light: {
    mode: 'light',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    primary: '#3498db',
    danger: '#e74c3c',
    success: '#27ae60',
    border: '#ddd',
  },
  dark: {
    mode: 'dark',
    background: '#121212',
    card: '#1e1e1e',
    text: '#e0e0e0',
    textSecondary: '#b0b0b0',
    primary: '#5fa8d3',
    danger: '#e74c3c',
    success: '#4ade80',
    border: '#333',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);

  const toggleTheme = async () => {
    const newTheme = theme.mode === 'light' ? themes.dark : themes.light;
    setTheme(newTheme);
    await AsyncStorage.setItem('appTheme', newTheme.mode);
  };

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('appTheme');
      if (saved === 'dark') {
        setTheme(themes.dark);
      }
    })();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};