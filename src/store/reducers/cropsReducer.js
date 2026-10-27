import { createSlice } from "@reduxjs/toolkit";

const cropsSlice = createSlice({
  name: "crops",
  initialState: [],
  reducers: {
    addCrop: (state, action) => {
      state.push(action.payload);
    },

    updateCrop: (state, action) => {
      const { id, updates } = action.payload;
      const crop = state.find((item) => item.id === id);

      if (crop) {
        Object.assign(crop, updates);
      }
    },

    deleteCrop: (state, action) => {
      return state.filter((crop) => crop.id !== action.payload);
    },

    setCrops: (state, action) => {
      return action.payload;
    },
  },
});

export const { addCrop, updateCrop, deleteCrop, setCrops } =
  cropsSlice.actions;

export default cropsSlice.reducer;