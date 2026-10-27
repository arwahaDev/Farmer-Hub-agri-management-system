import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CropHealthChart() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    function loadCrops() {
      try {
        const savedCrops = JSON.parse(
          localStorage.getItem("agri_crops") || "[]"
        );

        setCrops(Array.isArray(savedCrops) ? savedCrops : []);
      } catch {
        setCrops([]);
      }
    }

    loadCrops();

    window.addEventListener("focus", loadCrops);

    return () => {
      window.removeEventListener("focus", loadCrops);
    };
  }, []);

  const healthy = crops.filter(
    (crop) => Number(crop.healthScore ?? 80) >= 70
  ).length;

  const needsAttention = crops.filter((crop) => {
    const score = Number(crop.healthScore ?? 80);
    return score >= 40 && score < 70;
  }).length;

  const critical = crops.filter(
    (crop) => Number(crop.healthScore ?? 80) < 40
  ).length;

  const chartData = {
    labels: ["Healthy", "Needs Attention", "Critical"],
    datasets: [
      {
        data: [healthy, needsAttention, critical],
        backgroundColor: ["#198754", "#ffc107", "#dc3545"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">Crop Health Overview</h4>

      {crops.length === 0 ? (
        <p className="text-muted">
          Add crops to view their health chart.
        </p>
      ) : (
        <>
          <div style={{ maxWidth: "350px", margin: "0 auto" }}>
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>

          <p className="text-muted text-center mt-3 mb-0">
            Total crops: {crops.length}
          </p>
        </>
      )}
    </div>
  );
}