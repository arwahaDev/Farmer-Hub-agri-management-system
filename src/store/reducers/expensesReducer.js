import { createSlice } from "@reduxjs/toolkit";

const expensesSlice = createSlice({
  name: "expenses",
  initialState: [],
  reducers: {
    addExpense: (state, action) => {
      state.push(action.payload);
    },

    updateExpense: (state, action) => {
      const { id, updates } = action.payload;
      const expense = state.find((item) => item.id === id);

      if (expense) {
        Object.assign(expense, updates);
      }
    },

    deleteExpense: (state, action) => {
      return state.filter((expense) => expense.id !== action.payload);
    },

    setExpenses: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  addExpense,
  updateExpense,
  deleteExpense,
  setExpenses,
} = expensesSlice.actions;

export default expensesSlice.reducer;