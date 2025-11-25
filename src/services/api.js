import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For DummyJSON (auth only)
const authAPI = axios.create({
  baseURL: 'https://dummyjson.com',
});

// For Open Library (books as courses)
const booksAPI = axios.create({
  baseURL: 'https://openlibrary.org',
  headers: {
    'User-Agent': 'UoM-Course-Finder-App/1.0 (contact: your-email@example.com)',  // Replace with your email
  },
});

// Add token for auth API only
authAPI.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { authAPI as API, booksAPI };