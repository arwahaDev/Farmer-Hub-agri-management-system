import { createSlice } from "@reduxjs/toolkit";

const activitySlice = createSlice({
  name: "activity",
  initialState: [],
  reducers: {
    addActivity: (state, action) => {
      state.unshift(action.payload);
    },

    setActivities: (state, action) => {
      return action.payload;
    },

    clearActivities: () => {
      return [];
    },
  },
});

export const { addActivity, setActivities, clearActivities } =
  activitySlice.actions;

export default activitySlice.reducer;