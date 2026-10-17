export default function CropRecommendations({
  temperature,
  humidity,
  rainProbability,
}) {
  const recommendations = [];

  if (temperature >= 35) {
    recommendations.push({
      title: "High Temperature",
      message:
        "Monitor soil moisture regularly and check whether crops need irrigation.",
    });
  } else if (temperature <= 10) {
    recommendations.push({
      title: "Low Temperature",
      message:
        "Monitor crops for cold stress and check local crop protection guidance.",
    });
  } else {
    recommendations.push({
      title: "Temperature",
      message:
        "Continue monitoring crop growth and local weather conditions.",
    });
  }

  if (humidity >= 80) {
    recommendations.push({
      title: "High Humidity",
      message:
        "Inspect crops regularly for signs of fungal disease.",
    });
  }

  if (rainProbability >= 70) {
    recommendations.push({
      title: "Possible Rain",
      message:
        "Check the local forecast before irrigation, spraying, or field work.",
    });
  }

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">
        Crop Recommendations
      </h4>

      {recommendations.map((item) => (
        <div className="alert alert-info mb-3" key={item.title}>
          <strong>{item.title}</strong>
          <p className="mb-0 mt-1">{item.message}</p>
        </div>
      ))}
    </div>
  );
}