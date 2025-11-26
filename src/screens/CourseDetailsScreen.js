import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { booksAPI } from '../services/api';
import { ThemeContext } from '../theme/ThemeContext';

export default function CourseDetailsScreen({ route }) {
  const { theme } = useContext(ThemeContext);
  const { course } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (course.key) {
      booksAPI
        .get(`${course.key}.json`)
        .then((res) => {
          setDetails(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const coverUrl = course.cover_i
    ? `https://covers.openlibrary.org/b/id/${course.cover_i}-L.jpg`
    : 'https://via.placeholder.com/300';

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: theme.background },
        ]}
      >
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: coverUrl }} style={styles.image} />

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>
            {course.title}
          </Text>

          <Text style={[styles.author, { color: theme.textSecondary }]}>
            {course.author_name?.join(', ') || 'Unknown'}
          </Text>

          <Text style={[styles.year, { color: theme.primary }]}>
            Published: {course.first_publish_year || 'N/A'}
          </Text>

          {details?.description && (
            <View style={{ marginTop: 24 }}>
              <Text style={[styles.section, { color: theme.text }]}>
                Description
              </Text>

              <Text
                style={[styles.desc, { color: theme.textSecondary }]}
              >
                {typeof details.description === 'string'
                  ? details.description
                  : details.description?.value}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 12,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: 330,
    backgroundColor: '#ccc',
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },

  author: {
    fontSize: 17,
    marginBottom: 6,
  },

  year: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '600',
  },

  section: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },

  desc: {
    fontSize: 16,
    lineHeight: 24,
  },
});
