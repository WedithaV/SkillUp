import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function FavoritesScreen() {
  const favorites = useSelector(state => state.favorites.items);

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No favorite courses yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={({ item }) => {
        const coverUrl = item.cover_i 
          ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
          : 'https://via.placeholder.com/150';
        return (
          <View style={styles.card}>
            <Image source={{ uri: coverUrl }} style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>{item.author_name?.[0] || 'Unknown'}</Text>
            </View>
          </View>
        );
      }}
      keyExtractor={item => item.key}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#7f8c8d' },
  card: { flexDirection: 'row', padding: 15, backgroundColor: 'white', margin: 10, borderRadius: 10 },
  img: { width: 80, height: 100, borderRadius: 8 },
  info: { marginLeft: 15, justifyContent: 'center' },
  title: { fontWeight: 'bold', fontSize: 16 },
  author: { color: '#7f8c8d' },
});