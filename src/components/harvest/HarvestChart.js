import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function HarvestChart() {
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

    return () => {
      window.removeEventListener("focus", loadData);
    };
  }, []);

  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);

    months.push({
      key: `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`,
      label: date.toLocaleDateString("en", {
        month: "short",
        year: "2-digit",
      }),
    });
  }

  const estimatedHarvest = months.map((month) =>
    crops
      .filter((crop) => (crop.cuttingDate || "").startsWith(month.key))
      .reduce(
        (total, crop) =>
          total +
          (Number(crop.harvestQty ?? crop.expectedQuantity) || 0),
        0
      )
  );

  const sales = months.map((month) =>
    buyers
      .filter((buyer) => (buyer.date || "").startsWith(month.key))
      .reduce(
        (total, buyer) => total + (Number(buyer.quantity) || 0),
        0
      )
  );

  const chartData = {
    labels: months.map((month) => month.label),
    datasets: [
      {
        label: "Expected Harvest (kg)",
        data: estimatedHarvest,
        backgroundColor: "#198754",
      },
      {
        label: "Buyer Sales (kg)",
        data: sales,
        backgroundColor: "#0d6efd",
      },
    ],
  };

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">
        Harvest and Sales Overview
      </h4>

      <p className="text-muted small">
        Monthly expected crop quantity compared with recorded buyer sales.
      </p>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Quantity (kg)",
              },
            },
          },
        }}
      />
    </div>
  );
}