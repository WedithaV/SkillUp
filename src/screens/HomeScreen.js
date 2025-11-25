import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import { booksAPI } from '../services/api';
import Icon from 'react-native-vector-icons/Feather';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../redux/favoritesSlice';

export default function HomeScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Fetch computer science books
      const res = await booksAPI.get(
        '/search.json?q=subject:computer+science&limit=20'
      );
      setCourses(res.data.docs);
    } catch (err) {
      console.log('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderCourse = ({ item }) => {
    // Check if favourite
    const isFavorite = favorites.some(f => f.key === item.key);

    // Build cover image URL
    const coverUrl = item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
      : 'https://via.placeholder.com/150x200?text=No+Image';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CourseDetails', { course: item })}
      >
        {/* Course image */}
        <Image source={{ uri: coverUrl }} style={styles.thumbnail} />

        {/* Heart button */}
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => dispatch(toggleFavorite(item))}
        >
          <Icon
            name="heart"
            size={24}
            color={isFavorite ? '#e74c3c' : '#ddd'}
          />
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.author}>
            {item.author_name?.join(', ') || 'Unknown Author'}
          </Text>

          <Text style={styles.year}>
            Year: {item.first_publish_year || 'N/A'}
          </Text>

          <Text style={styles.status}>Status: Available</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Computer Science Courses</Text>

      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={item => item.key || item._version_}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No courses found. Try searching!</Text>
        }
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#7f8c8d' },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#2c3e50',
  },

  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },

  thumbnail: {
    width: '100%',
    height: 180,
  },

  info: {
    padding: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  author: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },

  year: {
    fontSize: 14,
    color: '#27ae60',
    marginTop: 3,
  },

  status: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 3,
  },

  empty: {
    textAlign: 'center',
    padding: 50,
    color: '#7f8c8d',
    fontSize: 16,
  },

  favButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 6,
    borderRadius: 20,
  },
});
