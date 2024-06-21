import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Item } from '../../components/editor/Item';

interface SelectedItemState {
  item: Item | null;
}

const initialState: SelectedItemState = {
  item: null, // 초기 상태에서는 아무 아이템도 선택되지 않은 상태
};

const selectedItemSlice = createSlice({
  name: 'selectedItem',
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<Item>) => {
      state.item = action.payload;
    },
    clearSelection: (state) => {
      state.item = null; // 선택 해제
    },
  },
});

export const { selectItem, clearSelection } = selectedItemSlice.actions;
export default selectedItemSlice.reducer;
