import { useEffect, useState } from "react";

export default function CropHealthList() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    function loadCrops() {
      try {
        const savedCrops = JSON.parse(
          localStorage.getItem("agri_crops") || "[]"
        );

        setCrops(Array.isArray(savedCrops) ? savedCrops : []);
      } catch (error) {
        console.error("Unable to load crop health:", error);
        setCrops([]);
      }
    }

    loadCrops();
    window.addEventListener("focus", loadCrops);

    return () => {
      window.removeEventListener("focus", loadCrops);
    };
  }, []);

  function getStatus(crop) {
    const score = Number(crop.healthScore);

    if (Number.isFinite(score)) {
      if (score >= 70) return "Healthy";
      if (score >= 40) return "Needs Attention";
      return "Critical";
    }

    return crop.status || "Needs Attention";
  }

  function getBadgeClass(status) {
    if (status === "Healthy") return "text-bg-success";
    if (status === "Critical") return "text-bg-danger";
    return "text-bg-warning";
  }

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">Crop Health</h4>

      <p className="text-muted">
        Monitor crop health scores and conditions.
      </p>

      {crops.length === 0 ? (
        <div className="alert alert-info mb-0">
          No crops available. Add crops from the Crops page.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Crop Name</th>
                <th>Field</th>
                <th>Health Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {crops.map((crop, index) => {
                const score = Number(crop.healthScore);
                const validScore =
                  Number.isFinite(score) &&
                  crop.healthScore !== "" &&
                  score >= 0 &&
                  score <= 100;

                const status = getStatus(crop);

                return (
                  <tr key={crop.id || `${crop.name}-${index}`}>
                    <td>{crop.name || "Unnamed Crop"}</td>
                    <td>{crop.field || "Not specified"}</td>
                    <td>
                      {validScore ? `${score}%` : "Not available"}

                      {validScore && (
                        <div
                          className="progress mt-2"
                          style={{ minWidth: "100px", height: "8px" }}
                        >
                          <div
                            className={`progress-bar ${
                              status === "Healthy"
                                ? "bg-success"
                                : status === "Critical"
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getBadgeClass(status)}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}