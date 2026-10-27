import { useCallback, useEffect, useState } from "react";
import {
  getWeather,
  getWeatherDescription,
} from "../services/weatherService";

export default function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const refreshWeather = useCallback(async () => {
    setRefreshing(true);
    setError("");

    try {
      const data = await getWeather();
      setWeather(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load weather data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refreshWeather();
  }, [refreshWeather]);

  const current = weather?.current ?? null;
  const description = current
    ? getWeatherDescription(current.weather_code)
    : "";

  return {
    weather,
    current,
    description,
    loading,
    refreshing,
    error,
    refreshWeather,
  };
}