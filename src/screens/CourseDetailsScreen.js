import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { booksAPI } from '../services/api';

export default function CourseDetailsScreen({ route }) {
  const { course } = route.params;
  const [fullDetails, setFullDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (course.key) {
      fetchFullDetails();
    } else {
      setLoading(false);
    }
  }, [course.key]);

  const fetchFullDetails = async () => {
    try {
      const res = await booksAPI.get(`${course.key}.json`);
      setFullDetails(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const coverUrl = course.cover_i 
    ? `https://covers.openlibrary.org/b/id/${course.cover_i}-L.jpg`  // L = large size
    : 'https://via.placeholder.com/300?text=No+Image';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: coverUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{course.title || 'Untitled Course'}</Text>
        <Text style={styles.author}>Author: {course.author_name?.join(', ') || 'Unknown'}</Text>
        <Text style={styles.year}>Published: {course.first_publish_year || 'N/A'}</Text>
        
        {fullDetails && fullDetails.description && (
          <>
            <Text style={styles.section}>Description</Text>
            <Text style={styles.description}>{fullDetails.description.value || fullDetails.description}</Text>
          </>
        )}
        
        {course.subjects && course.subjects.length > 0 && (
          <>
            <Text style={styles.section}>Subjects</Text>
            <Text style={styles.subjects}>{course.subjects.join(', ')}</Text>
          </>
        )}
        
        <Text style={styles.status}>Status: Ready to Study</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  author: { fontSize: 18, color: '#7f8c8d', marginBottom: 5 },
  year: { fontSize: 16, color: '#27ae60', marginBottom: 20 },
  section: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginTop: 20, marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 24, color: '#34495e' },
  subjects: { fontSize: 16, color: '#3498db', marginBottom: 20 },
  status: { fontSize: 16, color: '#27ae60', fontWeight: 'bold' },
});