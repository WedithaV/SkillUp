import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

export default function RegisterScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Register</Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        Registration coming soon...
      </Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 40 },
  button: { padding: 15, borderRadius: 10, width: 200, alignItems: 'center' },
  btnText: { color: 'white', fontSize: 18 },
});