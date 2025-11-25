import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../theme/ThemeContext';

export default function FavoritesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const favorites = useSelector((state) => state.favorites.items);

  if (favorites.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No favorite books yet ❤️
        </Text>
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          Tap the heart on any book to save it here
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const coverUrl = item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
      : 'https://via.placeholder.com/150x200?text=No+Image';

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => navigation.navigate('CourseDetails', { course: item })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: coverUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.title || 'Untitled Book'}
          </Text>
          <Text style={[styles.author, { color: theme.textSecondary }]}>
            {item.author_name?.join(', ') || 'Unknown Author'}
          </Text>
          <Text style={[styles.year, { color: theme.primary }]}>
            {item.first_publish_year || 'Year N/A'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>My Favorite Books</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hint: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  image: {
    width: 100,
    height: 140,
  },
  info: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    marginTop: 6,
  },
  year: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
  },
});