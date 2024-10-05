// src/features/favorites/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dogFavorites: [],
  catFavorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addDogFavorite: (state, action) => {
      state.dogFavorites.push(action.payload);
      localStorage.setItem('dogFavorites', JSON.stringify(state.dogFavorites));
    },
    addCatFavorite: (state, action) => {
      state.catFavorites.push(action.payload);
      localStorage.setItem('catFavorites', JSON.stringify(state.catFavorites));
    },
    removeDogFavorite: (state, action) => {
      state.dogFavorites = state.dogFavorites.filter(dog => dog.id !== action.payload);
      localStorage.setItem('dogFavorites', JSON.stringify(state.dogFavorites));
    },
    removeCatFavorite: (state, action) => {
      state.catFavorites = state.catFavorites.filter(cat => cat.id !== action.payload);
      localStorage.setItem('catFavorites', JSON.stringify(state.catFavorites));
    },
  },
});

export const { addDogFavorite, addCatFavorite, removeDogFavorite, removeCatFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;