export default function HumidityGauge({ humidity }) {
  let status = "Optimal";
  let color = "success";

  if (humidity < 30) {
    status = "Low";
    color = "warning";
  } else if (humidity > 70) {
    status = "High";
    color = "danger";
  }

  return (
    <div className="dashboard-card h-100">
      <p className="card-label">Humidity Level</p>

      <h2>{humidity}%</h2>

      <div
        className="progress mt-3 mb-3"
        role="progressbar"
        aria-label="Humidity level"
        aria-valuenow={humidity}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className={`progress-bar bg-${color}`}
          style={{
            width: `${Math.min(100, Math.max(0, humidity))}%`,
          }}
        />
      </div>

      <span className={`badge text-bg-${color}`}>
        {status}
      </span>

      <p className="text-muted small mt-2 mb-0">
        Humidity status based on app thresholds.
      </p>
    </div>
  );
}