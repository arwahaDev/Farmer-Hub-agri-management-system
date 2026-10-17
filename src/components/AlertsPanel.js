import { useEffect, useState } from "react";

export default function AlertsPanel({ humidity }) {
  const [crops, setCrops] = useState([]);
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    function loadData() {
      try {
        const savedCrops = JSON.parse(
          localStorage.getItem("agri_crops") || "[]"
        );
        const savedBuyers = JSON.parse(
          localStorage.getItem("agri_buyers") || "[]"
        );

        setCrops(Array.isArray(savedCrops) ? savedCrops : []);
        setBuyers(Array.isArray(savedBuyers) ? savedBuyers : []);
      } catch {
        setCrops([]);
        setBuyers([]);
      }
    }

    loadData();
    window.addEventListener("focus", loadData);

    return () => window.removeEventListener("focus", loadData);
  }, []);

  const alerts = [];

  if (Number(humidity) >= 80) {
    alerts.push({
      message: "High humidity: Check crops for moisture-related problems.",
      type: "warning",
    });
  }

  crops.forEach((crop) => {
    const health = Number(crop.healthScore ?? 80);

    if (health < 40) {
      alerts.push({
        message: `${crop.name}: Critical crop health (${health}%).`,
        type: "danger",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (crop.cuttingDate) {
      const cuttingDate = new Date(`${crop.cuttingDate}T00:00:00`);
      const daysLeft = Math.ceil(
        (cuttingDate - today) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft < 0) {
        alerts.push({
          message: `${crop.name}: Cutting date has passed.`,
          type: "danger",
        });
      } else if (daysLeft <= 3) {
        alerts.push({
          message: `${crop.name}: Cutting is due ${
            daysLeft === 0 ? "today" : `in ${daysLeft} day(s)`
          }.`,
          type: "warning",
        });
      }
    }

    const totalStock = Math.max(
      0,
      Number(crop.harvestQty ?? crop.expectedQuantity) || 0
    );

    const sold = buyers
      .filter((buyer) => String(buyer.cropId) === String(crop.id))
      .reduce(
        (sum, buyer) => sum + (Number(buyer.quantity) || 0),
        0
      );

    const remaining = Math.max(0, totalStock - sold);

    if (totalStock > 0 && remaining / totalStock <= 0.2) {
      alerts.push({
        message: `${crop.name}: Low stock — ${remaining} kg remaining.`,
        type: "warning",
      });
    }
  });

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">Farm Alerts</h4>

      {alerts.length === 0 ? (
        <div className="alert alert-success mb-0">
          No crop or stock alerts at the moment.
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={`${alert.message}-${index}`}
            className={`alert alert-${alert.type} mb-2`}
            role="alert"
          >
            {alert.message}
          </div>
        ))
      )}
    </div>
  );
}