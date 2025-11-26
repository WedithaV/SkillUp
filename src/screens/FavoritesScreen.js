import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeContext } from '../theme/ThemeContext';
import { toggleFavorite } from '../redux/favoritesSlice';
import { Feather } from '@expo/vector-icons';

export default function FavoritesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const favorites = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();

  if (favorites.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: theme.background },
        ]}
      >
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No favorite courses yet
          </Text>

          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Tap the heart on any course to save it here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => {
    const coverUrl = item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
      : 'https://via.placeholder.com/150x200';

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('CourseDetails', { course: item })}
          activeOpacity={0.85}
          style={{ flexDirection: 'row' }}
        >
          <Image source={{ uri: coverUrl }} style={styles.image} />

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
        </TouchableOpacity>

        {/* TOP-RIGHT FLOATING HEART */}
        <TouchableOpacity
          style={styles.favIcon}
          onPress={() => dispatch(toggleFavorite(item))}
        >
          <Feather name="heart" size={26} color={theme.danger} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.header, { color: theme.text }]}>
        My Favorite Courses
      </Text>

      <FlatList
        data={favorites}
        renderItem={renderItem}
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },

  hint: {
    fontSize: 16,
    textAlign: 'center',
  },

  header: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 22,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },

  image: {
    width: 100,
    height: 145,
    backgroundColor: '#ccc',
  },

  info: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
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

  favIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
});
