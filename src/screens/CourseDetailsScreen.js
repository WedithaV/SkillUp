import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { booksAPI } from '../services/api';
import { ThemeContext } from '../theme/ThemeContext';

export default function CourseDetailsScreen({ route }) {
  const { theme } = useContext(ThemeContext);
  const { course } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (course.key) {
      booksAPI.get(`${course.key}.json`).then(res => {
        setDetails(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const coverUrl = course.cover_i
    ? `https://covers.openlibrary.org/b/id/${course.cover_i}-L.jpg`
    : 'https://via.placeholder.com/300';

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <Image source={{ uri: coverUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{course.title}</Text>
        <Text style={[styles.author, { color: theme.textSecondary }]}>
          by {course.author_name?.join(', ') || 'Unknown'}
        </Text>
        <Text style={[styles.year, { color: theme.primary }]}>
          Published: {course.first_publish_year || 'N/A'}
        </Text>

        {details?.description && (
          <>
            <Text style={[styles.section, { color: theme.text }]}>Description</Text>
            <Text style={[styles.desc, { color: theme.textSecondary }]}>
              {typeof details.description === 'string' ? details.description : details.description?.value}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 350 },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold' },
  author: { fontSize: 18, marginVertical: 8 },
  year: { fontSize: 16, marginBottom: 20 },
  section: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  desc: { fontSize: 16, lineHeight: 24 },
});