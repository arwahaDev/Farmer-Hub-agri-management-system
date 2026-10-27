import { createSlice } from "@reduxjs/toolkit";

const inventorySlice = createSlice({
  name: "inventory",
  initialState: [],
  reducers: {
    addInventoryItem: (state, action) => {
      state.push(action.payload);
    },

    updateInventoryItem: (state, action) => {
      const { id, updates } = action.payload;
      const item = state.find((entry) => entry.id === id);

      if (item) {
        Object.assign(item, updates);
      }
    },

    deleteInventoryItem: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },

    setInventory: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  setInventory,
} = inventorySlice.actions;

export default inventorySlice.reducer;