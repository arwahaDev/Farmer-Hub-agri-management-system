import { useDispatch,useSelector } from "react-redux";
import { fetchWeather } from "../store/thunks/fetchWeather";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import CropHealthChart from "../components/dashboard/CropHealthChart";
import CropHealthList from "../components/dashboard/CropHealthList";
import HumidityGauge from "../components/dashboard/HumidityGauge";
import HarvestSummary from"../components/harvest/HarvestSummary";
import CuttingSchedule from "../components/dashboard/CuttingSchedule";
import CropRecommendations from "../components/CropRecommendations";
import StatCard from "../components/common/StatCard";

import { useAppContext } from "../context/AppContext";
import { selectProfitByCrop } from "../store/selectors/selectProfitByCrop";
import { selectLowStock } from "../store/selectors/selectLowStock";
import { selectDueCrops } from "../store/selectors/selectDueCrops";
import { useEffect, useState } from "react";
import {
  getWeather,
  getWeatherDescription,
} from "../services/weatherService";
import HarvestChart from "../components/harvest/HarvestChart";

   
export default function Dashboard() {
    const lowStockCrops=useSelector(selectLowStock);
    const Crops = useSelector((state)=>state.crops||[]);
    const dueCrops=useSelector(selectDueCrops);
     const dispatch = useDispatch();
  const {
   crops=[],
   buyers=[],
   orders =[],
  }=useAppContext();

     const [refreshing, setRefreshing] = useState(false);

    const weather = useSelector((state) => state.weather.data);
   const loading = useSelector((state) => state.weather.loading);
    const error = useSelector((state) => state.weather.error);
     const lastUpdated = useSelector(
     (state) => state.weather.lastUpdated
    );

  async function loadWeather() {
  setRefreshing(true);

  try {
    await dispatch(fetchWeather()).unwrap();
  } catch (err) {
    console.error("Weather fetch failed:", err);
  } finally {
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
          {new Date(lastUpdated).toLocaleTimeString("en-PK", {
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
       
       

      <div className="row g-3 mb-4">
  <div className="col-12 col-md-6 col-xl-3">
    <StatCard
      title="Total Crops"
      value={crops.length}
      icon="🌱"
    />
  </div>

  <div className="col-12 col-md-6 col-xl-3">
    <StatCard
      title="Total Buyers"
      value={buyers.length}
      icon="👥"
    />
  </div>

     <div className="col-12 col-md-6 col-xl-3">
     <StatCard
      title="Total Orders"
      value={orders.length}
      icon="📦"
    />
      </div>

   <div className="col-12 col-md-6 col-xl-3">
    <StatCard
      title="Total Harvested"
      value={`${crops.reduce(
        (total, crop) =>
          total + (Number(crop.harvestQty) || 0),
        0
      )} kg`}
      icon="🌾"
    />
     </div>
    </div>

             <div className="row">
  {crops.map((crop) => (
    <div className="col-md-4 mb-3" key={crop.id}>
      <div className="card p-3">
        <h5>{crop.name}</h5>

        <p>
          Profit: Rs.{" "}
          {useSelector
            ? selectProfitByCrop(
                { orders: [], expenses: [] },
                crop.id
              )
            : 0}
        </p>
      </div>
    </div>
    ))}
       </div>
           
                   <div className="card p-3 mt-3">
         <h5>Crops Due for Harvest</h5>

            {dueCrops.length === 0 ? (
           <p>No crops are due for harvest.</p>
             ) : (
            <ul>
           {dueCrops.map((crop) => (
        <li key={crop.id}>
          {crop.name} — {crop.cuttingDate || crop.harvestDate}
        </li>
      ))}
    </ul>
        )}
     </div>

       
       <CuttingSchedule/>
        <HarvestSummary/>
        <CropHealthList/>
        <CropHealthChart/>
        <HarvestChart/>
              <div className="card p-3 mt-3">
     <h5>Low Stock Crops</h5>

     {lowStockCrops.length === 0 ? (
    <p>All crops have sufficient stock.</p>
     ) : (
      <ul>
      {lowStockCrops.map((crop) => (
        <li key={crop.id}>
          {crop.name || "Unnamed Crop"} — Stock:{" "}
          {crop.quantity ?? crop.stock ?? 0}
        </li>
      ))}
    </ul>
     )}
    </div>


        <AlertsPanel humidity={current?.relative_humidity_2m}/>

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