import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loadFavorites = async () => {
  try {
    const saved = await AsyncStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveFavorites = async (items) => {
  await AsyncStorage.setItem('favorites', JSON.stringify(items));
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
  },
  reducers: {
    loadFromStorage: (state) => {
      loadFavorites().then(saved => {
        state.items = saved;
      });
    },
    toggleFavorite: (state, action) => {
      const course = action.payload;
      const existingIndex = state.items.findIndex(item => item.key === course.key);
      
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(course);
      }
      saveFavorites(state.items);
    },
  },
});

export const { toggleFavorite, loadFromStorage } = favoritesSlice.actions;
export default favoritesSlice.reducer;