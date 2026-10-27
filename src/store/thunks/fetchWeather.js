import { createAsyncThunk } from "@reduxjs/toolkit";
import { getWeather } from "../../services/weatherService";

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getWeather();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Unable to fetch weather data."
      );
    }
  }
);