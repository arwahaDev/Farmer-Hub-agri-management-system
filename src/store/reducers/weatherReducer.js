import { createSlice } from "@reduxjs/toolkit";
import { fetchWeather } from "../thunks/fetchWeather";

const weatherSlice = createSlice({
  name: "weather",

  initialState: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })

      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch weather data.";
      });
  },
});

export default weatherSlice.reducer;