import { useEffect, useState } from "react";

export default function CuttingSchedule() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    try {
      const savedCrops = localStorage.getItem("agri_crops");

      if (savedCrops) {
        setCrops(JSON.parse(savedCrops));
      }
    } catch (error) {
      console.error("Unable to load crop records:", error);
    }
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduledCrops = crops
    .filter((crop) => crop.cuttingDate)
    .map((crop) => {
      const cuttingDate = new Date(
        `${crop.cuttingDate}T00:00:00`
      );

      const daysRemaining = Math.ceil(
        (cuttingDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return {
        ...crop,
        daysRemaining,
        validDate: !Number.isNaN(cuttingDate.getTime()),
      };
    })
    .filter((crop) => crop.validDate)
    .sort(
      (a, b) =>
        new Date(a.cuttingDate) - new Date(b.cuttingDate)
    );

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">
        Crop Cutting Schedule
      </h4>

      <p className="text-muted">
        View upcoming and overdue crop cutting dates.
      </p>

      {scheduledCrops.length === 0 ? (
        <div className="alert alert-info mb-0">
          No cutting dates available. Add a cutting date
          to your crop records to display the schedule.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Crop Name</th>
                <th>Field</th>
                <th>Cutting Date</th>
                <th>Days Remaining</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {scheduledCrops.map((crop) => (
                <tr key={crop.id ?? crop.name}>
                  <td>{crop.name}</td>
                  <td>{crop.field || "Not specified"}</td>
                  <td>{crop.cuttingDate}</td>
                  <td>
                    {crop.daysRemaining < 0
                      ? `${Math.abs(crop.daysRemaining)} days overdue`
                      : crop.daysRemaining === 0
                      ? "Due today"
                      : `${crop.daysRemaining} days`}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        crop.daysRemaining < 0
                          ? "text-bg-danger"
                          : crop.daysRemaining <= 3
                          ? "text-bg-warning"
                          : "text-bg-success"
                      }`}
                    >
                      {crop.daysRemaining < 0
                        ? "Overdue"
                        : crop.daysRemaining <= 3
                        ? "Due Soon"
                        : "Upcoming"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}