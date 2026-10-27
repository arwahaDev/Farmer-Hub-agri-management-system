import { createSlice } from "@reduxjs/toolkit";

const alertsSlice = createSlice({
  name: "alerts",
  initialState: [],
  reducers: {
    addAlert: (state, action) => {
      state.push(action.payload);
    },

    removeAlert: (state, action) => {
      return state.filter((alert) => alert.id !== action.payload);
    },

    setAlerts: (state, action) => {
      return action.payload;
    },

    clearAlerts: () => {
      return [];
    },
  },
});

export const { addAlert, removeAlert, setAlerts, clearAlerts } =
  alertsSlice.actions;

export default alertsSlice.reducer;