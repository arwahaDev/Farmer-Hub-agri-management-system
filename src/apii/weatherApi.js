const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const LATITUDE = 32.1877;
const LONGITUDE = 74.1945;

const weatherApi = {
  async getWeather() {
    const params = new URLSearchParams({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      current:
        "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
      forecast_days: "5",
      timezone: "Asia/Karachi",
    });

    const response = await fetch(
      `${WEATHER_API}?${params}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch weather data.");
    }

    return response.json();
  },
};

export default weatherApi;