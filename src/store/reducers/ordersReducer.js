import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: [],
  reducers: {
    addOrder: (state, action) => {
      state.push(action.payload);
    },

    updateOrder: (state, action) => {
      const { id, updates } = action.payload;
      const order = state.find((item) => item.id === id);

      if (order) {
        Object.assign(order, updates);
      }
    },

    deleteOrder: (state, action) => {
      return state.filter((order) => order.id !== action.payload);
    },

    setOrders: (state, action) => {
      return action.payload;
    },
  },
});

export const { addOrder, updateOrder, deleteOrder, setOrders } =
  ordersSlice.actions;

export default ordersSlice.reducer;