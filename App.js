import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { useDispatch } from 'react-redux';
import { loadFromStorage } from './src/redux/favoritesSlice';

function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}