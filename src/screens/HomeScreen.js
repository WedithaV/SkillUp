import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { booksAPI } from '../services/api';
import { ThemeContext } from '../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../redux/favoritesSlice';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await booksAPI.get('/search.json?q=subject:computer+science&limit=20');
      setCourses(res.data.docs);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (item) => favorites.some((fav) => fav.key === item.key);

  const renderCourse = ({ item }) => {
    const coverUrl = item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
      : 'https://via.placeholder.com/150x200';

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => navigation.navigate('CourseDetails', { course: item })}
        activeOpacity={0.85}
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
          onPress={() => dispatch(toggleFavorite(item))}
          style={styles.fav}
        >
          <Feather
            name="heart"
            size={26}
            color={isFavorite(item) ? theme.danger : theme.textSecondary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
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
      <Text style={[styles.header, { color: theme.text }]}>UoM Course Finder</Text>

      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 14,
  },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 22,
    elevation: 3,
  },

  thumbnail: {
    width: '100%',
    height: 190,
    backgroundColor: '#ddd',
  },

  info: {
    padding: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  author: {
    fontSize: 15,
    marginTop: 6,
  },

  year: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
  },

  fav: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
});
