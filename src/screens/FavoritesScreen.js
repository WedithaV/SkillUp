import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../theme/ThemeContext';

export default function FavoritesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const favorites = useSelector(state => state.favorites.items);

  if (favorites.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No favorite books yet
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const coverUrl = item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
      : 'https://via.placeholder.com/150';

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('CourseDetails', { course: item })}
      >
        <Image source={{ uri: coverUrl }} style={styles.img} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.author, { color: theme.textSecondary }]}>
            {item.author_name?.[0] || 'Unknown'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>My Favorites</Text>
      <FlatList data={favorites} renderItem={renderItem} keyExtractor={item => item.key} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18 },
  card: { flexDirection: 'row', margin: 10, padding: 10, borderRadius: 12, elevation: 3 },
  img: { width: 80, height: 110, borderRadius: 8 },
  info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: 'bold' },
  author: { fontSize: 14, marginTop: 4 },
});