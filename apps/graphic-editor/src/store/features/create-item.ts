import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Item } from '../../components/editor/Item';

interface CreateItemState {
  items: Item[];
}

const initialState: CreateItemState = {
  items: [],
};

const createItemSlice = createSlice({
  name: 'createItem',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload); // 새 아이템 추가
    },
  },
});

export const { addItem } = createItemSlice.actions;
export default createItemSlice.reducer;
