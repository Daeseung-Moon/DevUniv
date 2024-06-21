import { configureStore } from '@reduxjs/toolkit';
import selectedItemReducer from './features/select-item';

export const store = configureStore({
  reducer: {
    selectedItem: selectedItemReducer,
  },
});
