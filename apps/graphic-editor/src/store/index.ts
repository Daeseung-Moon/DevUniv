import { configureStore } from '@reduxjs/toolkit';
import selectedItemReducer from './features/select-item';
import createItemReducer from './features/create-item';

export const store = configureStore({
  reducer: {
    selectedItem: selectedItemReducer,
    createItem: createItemReducer,
    /**
     * @todo: show settings 코드를 event-manager -> reducer로 변경해야함.
     */
  },
});
