import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const themes = {
  light: {
    mode: 'light',
    background: '#F4F6F8',
    card: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    primary: '#3B82F6',
    danger: '#EF4444',
    success: '#22C55E',
    border: '#E2E8F0',
  },
  dark: {
    mode: 'dark',
    background: '#0F172A',
    card: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    primary: '#60A5FA',
    danger: '#F87171',
    success: '#4ADE80',
    border: '#334155',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);

  const toggleTheme = async () => {
    const next = theme.mode === 'light' ? themes.dark : themes.light;
    setTheme(next);
    await AsyncStorage.setItem('appTheme', next.mode);
  };

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('appTheme');
      if (saved === 'dark') setTheme(themes.dark);
    })();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
