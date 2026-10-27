import { useEffect, useState } from "react";

export default function HarvestSummary() {
  const [summary, setSummary] = useState({
    harvested: 0,
    orders: 0,
    sold: 0,
  });

  useEffect(() => {
    function loadSummary() {
      try {
        const harvests = JSON.parse(
          localStorage.getItem("agri_harvests") || "[]"
        );

        const orders = JSON.parse(
          localStorage.getItem("agri_orders") || "[]"
        );

        const buyers = JSON.parse(
          localStorage.getItem("agri_buyers") || "[]"
        );

        const harvested = harvests.reduce(
          (total, item) =>
            total + Math.max(0, Number(item.quantity) || 0),
          0
        );

        const sold = buyers.reduce(
          (total, buyer) =>
            total + Math.max(0, Number(buyer.quantity) || 0),
          0
        );

        setSummary({
          harvested,
          orders: orders.length,
          sold,
        });
      } catch (error) {
        console.error("Unable to load harvest summary:", error);
      }
    }

    loadSummary();

    window.addEventListener("focus", loadSummary);

    return () => {
      window.removeEventListener("focus", loadSummary);
    };
  }, []);

  const remaining = summary.harvested - summary.sold;

  const cards = [
    {
      title: "Total Harvested",
      value: `${summary.harvested} kg`,
      description: "Total recorded harvest",
    },
    {
      title: "Total Orders",
      value: summary.orders,
      description: "Orders received",
    },
    {
      title: "Quantity Sold",
      value: `${summary.sold} kg`,
      description: "Recorded buyer sales",
    },
    {
      title: "Remaining Stock",
      value: `${remaining} kg`,
      description:
        remaining < 0
          ? "Check harvest and sales records"
          : "Harvested quantity minus sales",
    },
  ];

  return (
    <div className="mb-4">
      <h4 className="section-heading mb-3">
        Harvest and Orders Summary
      </h4>

      <div className="row g-3">
        {cards.map((card) => (
          <div className="col-12 col-md-6 col-xl-3" key={card.title}>
            <div className="dashboard-card h-100">
              <p className="card-label">{card.title}</p>
              <h3>{card.value}</h3>
              <small className="text-muted">
                {card.description}
              </small>
            </div>
          </div>
        ))}
      </div>

      {remaining < 0 && (
        <div className="alert alert-warning mt-3 mb-0">
          Recorded sales exceed the recorded harvest.
          Please check your records.
        </div>
      )}
    </div>
  );
}