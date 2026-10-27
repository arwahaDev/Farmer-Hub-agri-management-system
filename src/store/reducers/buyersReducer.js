import { createSlice } from "@reduxjs/toolkit";

const buyersSlice = createSlice({
  name: "buyers",
  initialState: [],
  reducers: {
    addBuyer: (state, action) => {
      state.push(action.payload);
    },

    updateBuyer: (state, action) => {
      const { id, updates } = action.payload;
      const buyer = state.find((item) => item.id === id);

      if (buyer) {
        Object.assign(buyer, updates);
      }
    },

    deleteBuyer: (state, action) => {
      return state.filter((buyer) => buyer.id !== action.payload);
    },

    setBuyers: (state, action) => {
      return action.payload;
    },
  },
});

export const { addBuyer, updateBuyer, deleteBuyer, setBuyers } =
  buyersSlice.actions;

export default buyersSlice.reducer;