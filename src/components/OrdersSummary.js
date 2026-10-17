import { useEffect, useState } from "react";

export default function HarvestSummary() {
  const [crops, setCrops] = useState([]);
  const [buyers, setBuyers] = useState([]);

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

  useEffect(() => {
    loadData();
    window.addEventListener("focus", loadData);

    return () => window.removeEventListener("focus", loadData);
  }, []);

  const totalHarvested = crops.reduce(
    (total, crop) =>
      total + (Number(crop.harvestQty ?? crop.expectedQuantity) || 0),
    0
  );

  const totalSold = buyers.reduce(
    (total, buyer) => total + (Number(buyer.quantity) || 0),
    0
  );

  const remainingStock = Math.max(0, totalHarvested - totalSold);

  const stats = [
    {
      title: "Total Harvested",
      value: totalHarvested,
      unit: "kg",
      color: "success",
    },
    {
      title: "Total Sold",
      value: totalSold,
      unit: "kg",
      color: "primary",
    },
    {
      title: "Remaining Stock",
      value: remainingStock,
      unit: "kg",
      color: "warning",
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((stat) => (
        <div className="col-12 col-md-4" key={stat.title}>
          <div className="dashboard-card h-100">
            <p className="text-muted mb-2">{stat.title}</p>
            <h3 className={`text-${stat.color} mb-0`}>
              {stat.value.toLocaleString()} {stat.unit}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}