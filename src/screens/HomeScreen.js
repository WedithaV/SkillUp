import React, { useEffect, useState, useContext } from 'react';
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
import { ThemeContext } from '../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../redux/favoritesSlice';
import Icon from 'react-native-vector-icons/Feather';

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await booksAPI.get('/search.json?q=subject:computer+science&limit=20');
      setCourses(res.data.docs);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (item) => favorites.some(fav => fav.key === item.key);

  const renderCourse = ({ item }) => {
    const coverUrl = item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
      : 'https://via.placeholder.com/150x200?text=No+Image';

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => navigation.navigate('CourseDetails', { course: item })}
      >
        <Image source={{ uri: coverUrl }} style={styles.thumbnail} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.author, { color: theme.textSecondary }]}>
            {item.author_name?.join(', ') || 'Unknown Author'}
          </Text>
          <Text style={[styles.year, { color: theme.primary }]}>
            {item.first_publish_year || 'N/A'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => dispatch(toggleFavorite(item))}
        >
          <Icon
            name="heart"
            size={26}
            color={isFavorite(item) ? '#e74c3c' : theme.textSecondary}
            fill={isFavorite(item) ? '#e74c3c' : 'none'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Computer Science Books</Text>
      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20 },
  card: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    borderWidth: 1,
  },
  thumbnail: { width: '100%', height: 180 },
  info: { padding: 15 },
  title: { fontSize: 18, fontWeight: 'bold' },
  author: { fontSize: 15, marginTop: 4 },
  year: { fontSize: 14, marginTop: 4 },
  favButton: { position: 'absolute', top: 10, right: 10, padding: 8 },
});