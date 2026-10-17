import AlertsPanel from "../components/AlertsPanel";
import CropHealthChart from "../components/CropHealthChart";
import CropHealthList from "../components/CropHealthList";
import HumidityGauge from "../components/HumidityGauge";
import HarvestSummary from"../components/HarvestSummary";
import CuttingSchedule from "../components/CuttingSchedule";
import CropRecommendations from "../components/CropRecommendations";
import { useEffect, useState } from "react";
import {
  getWeather,
  getWeatherDescription,
} from "../services/weatherService";
import HarvestChart from "../components/HarvestChart";
  
export default function Dashboard() {
  const [lastUpdated, setLastUpdated]=useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadWeather() {
    setRefreshing(true);

    try {
      const data = await getWeather();
      setWeather(data);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError("Weather data is unavailable. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

     useEffect(() => {
  loadWeather();

  const intervalId = setInterval(() => {
    loadWeather();
  }, 15 * 60 * 1000);

  return () => {
    clearInterval(intervalId);
  };
}, []);
  
  const current = weather?.current;
  const daily = weather?.daily;
   
  const alerts = [];
 
  if (current && daily) {
    if (current.temperature_2m >= 38) {
      alerts.push(
        "High temperature: Check crops and irrigation needs."
      );
    }

    if (current.wind_speed_10m >= 35) {
      alerts.push(
        "Strong winds: Check crops and farm equipment."
      );
    }

    if ((daily.precipitation_probability_max?.[0] ?? 0) >= 70) {
      alerts.push(
        "High rain probability: Review your farm activities."
      );
    }
  }
   
  return (
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h2 className="page-heading">Farm Dashboard</h2>
          <p className="text-muted">
            Monitor live weather and crop conditions.
          </p>
        </div>

        <span className="badge text-bg-success p-2">
          Farm Status: Active
        </span>
      </div>

      <button
        className="btn btn-success mb-4"
        onClick={loadWeather}
        disabled={refreshing}
      >
        {refreshing ? "Refreshing..." : "Refresh Weather"}
      </button>
         {lastUpdated && (
         <p className="text-muted small mb-4">
          Last updated:{" "}
          {lastUpdated.toLocaleTimeString("en-PK", {
           hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
         })}
        
  </p>
     
    )}
    
      {loading && <p>Loading live weather data...</p>}

      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={loadWeather}
          >
            Try Again
          </button>
        </div>
      )}

      {current && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6 col-xl-4">
            <div className="dashboard-card">
              <p className="card-label">Temperature · Gujranwala</p>
              <h2>{Math.round(current.temperature_2m)}°C</h2>
              <span>
                {getWeatherDescription(current.weather_code)}
              </span>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-4">
  <HumidityGauge
    humidity={current.relative_humidity_2m}
  />
</div>

          <div className="col-12 col-md-6 col-xl-4">
            <div className="dashboard-card">
              <p className="card-label">Wind Speed</p>
              <h2>{current.wind_speed_10m} km/h</h2>
              <span>Current conditions</span>
            </div>
          </div>
        </div>
      )}

      {daily && (
        <div className="dashboard-card mb-4">
          <h4 className="section-heading">
            5-Day Weather Forecast
          </h4>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Conditions</th>
                  <th>Max Temperature</th>
                  <th>Min Temperature</th>
                  <th>Rain Probability</th>
                  <th>Max Wind</th>
                </tr>
              </thead>

              <tbody>
                {daily.time.map((date, index) => (
                  <tr key={date}>
                    <td>
                      {new Date(
                        `${date}T12:00:00`
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td>
                      {getWeatherDescription(
                        daily.weather_code[index]
                      )}
                    </td>
                    <td>
                      {Math.round(
                        daily.temperature_2m_max[index]
                      )}°C
                    </td>
                    <td>
                      {Math.round(
                        daily.temperature_2m_min[index]
                      )}°C
                    </td>
                    <td>
                      {daily.precipitation_probability_max?.[index] ?? 0}%
                    </td>
                    <td>
                      {daily.wind_speed_10m_max[index]} km/h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
         
      )}
       <AlertsPanel humidity={current?.relative_humidity_2m}/>
       <CuttingSchedule/>
        <HarvestSummary/>
        <CropHealthList/>
        <CropHealthChart/>
        <HarvestChart/>
              {current && daily && (
  <CropRecommendations
    temperature={current.temperature_2m}
    humidity={current.relative_humidity_2m}
    rainProbability={
      daily.precipitation_probability_max?.[0] ?? 0
    }
  />
)}
      {current && daily && (
        <div className="dashboard-card mb-4">
          <h4 className="section-heading">Weather Alerts</h4>

          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                className="alert alert-warning mb-2"
                key={alert}
              >
                {alert}
              </div>
            ))
          ) : (
            <div className="alert alert-success mb-0">
              No weather warnings triggered by the current alert rules.
            </div>
          )}

          <p className="text-muted small mt-3 mb-0">
            These are app-generated warnings, not official weather alerts.
          </p>
        </div>
      )}

      <p className="text-muted small">
        Weather data provided by Open-Meteo.
      </p>
    </div>
  );
}