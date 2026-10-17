import { exportCsv } from "../utils/exportCsv";
import StockProgressBar from "../components/StockProgressBar";
import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const emptyForm = {
  name: "",
  field: "",
  plantingDate: "",
  cuttingDate: "",
  healthScore: 80,
  expectedQuantity: "",
};

export default function Crops() {
  const [crops, setCrops] = useLocalStorage("agri_crops", []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [buyers, setBuyers] = useState([]);

useEffect(() => {
  function loadBuyers() {
    try {
      const savedBuyers = JSON.parse(
        localStorage.getItem("agri_buyers") || "[]"
      );

      setBuyers(Array.isArray(savedBuyers) ? savedBuyers : []);
    } catch {
      setBuyers([]);
    }
  }

  loadBuyers();

  window.addEventListener("focus", loadBuyers);

  return () => {
    window.removeEventListener("focus", loadBuyers);
  };
}, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function getStatus(score) {
    const health = Number(score);

    if (health >= 70) return "Healthy";
    if (health >= 40) return "Needs Attention";
    return "Critical";
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.field.trim() ||
      !form.plantingDate ||
      !form.cuttingDate ||
      form.expectedQuantity === "" ||
      Number(form.expectedQuantity) < 0 ||
      Number(form.healthScore) < 0 ||
      Number(form.healthScore) > 100
    ) {
      setMessage("Please complete all fields with valid values.");
      return;
    }

    if (form.cuttingDate < form.plantingDate) {
      setMessage("Cutting date cannot be before planting date.");
      return;
    }

    const cropData = {
      ...form,
      name: form.name.trim(),
      field: form.field.trim(),
      healthScore: Number(form.healthScore),
      expectedQuantity: Number(form.expectedQuantity),
      status: getStatus(form.healthScore),
    };

    if (editingId !== null) {
      setCrops((previous) =>
        previous.map((crop) =>
          crop.id === editingId
            ? { ...crop, ...cropData }
            : crop
        )
      );
      setMessage("Crop updated successfully.");
    } else {
      const newCrop = {
        ...cropData,
        id: `${Date.now()}-${Math.random()}`,
      };

      setCrops((previous) => [...previous, newCrop]);
      setMessage("Crop added successfully.");
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(crop) {
    setForm({
      name: crop.name || "",
      field: crop.field || "",
      plantingDate: crop.plantingDate || "",
      cuttingDate: crop.cuttingDate || "",
      healthScore: crop.healthScore ?? 80,
      expectedQuantity: crop.expectedQuantity ?? "",
    });

    setEditingId(crop.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this crop?"
    );

    if (!confirmed) return;

    setCrops((previous) =>
      previous.filter((crop) => crop.id !== id)
    );

    if (editingId === id) {
      setForm(emptyForm);
      setEditingId(null);
    }

    setMessage("Crop deleted successfully.");
  }

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      `${crop.name} ${crop.field}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesHealth =
      healthFilter === "All" ||
      getStatus(crop.healthScore ?? 80) === healthFilter;

    return matchesSearch && matchesHealth;
  });
  function handleExportCrops() {
  const crops = JSON.parse(
    localStorage.getItem("agri_crops") || "[]"
  );

  exportCsv(crops, "Farmer Hub.csv");
}

  return (
    <div className="crops-page">
      <div className="mb-4">
        <h2 className="page-heading">Crop Management</h2>
        <p className="text-muted">
          Manage crop details, health and cutting schedules.
        </p>
      </div>

      {message && (
        <div className="alert alert-info" role="status">
          {message}
        </div>
      )}
        <button
                   type="button"
                className="btn btn-success mb-3"
                 onClick={handleExportCrops}
                >
                 Export Crops CSV
                </button>
      <div className="dashboard-card mb-4">
        <h4 className="section-heading">
          {editingId !== null ? "Edit Crop" : "Add New Crop"}
        </h4>
          
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Crop Name</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wheat"
                required
              />
            </div>
                 
            <div className="col-12 col-md-6">
              <label className="form-label">Field Name</label>
              <input
                className="form-control"
                name="field"
                value={form.field}
                onChange={handleChange}
                placeholder="e.g. Field A"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Planting Date</label>
              <input
                className="form-control"
                type="date"
                name="plantingDate"
                value={form.plantingDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Planned Cutting Date</label>
              <input
                className="form-control"
                type="date"
                name="cuttingDate"
                value={form.cuttingDate}
                onChange={handleChange}
                min={form.plantingDate || undefined}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                Health Score: {form.healthScore}%
              </label>
              <input
                className="form-range"
                type="range"
                name="healthScore"
                min="0"
                max="100"
                value={form.healthScore}
                onChange={handleChange}
              />
              <small className="text-muted">
                70–100: Healthy; 40–69: Needs Attention; 0–39: Critical.
              </small>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                Expected Quantity (kg)
              </label>
              <input
                className="form-control"
                type="number"
                name="expectedQuantity"
                min="0"
                step="any"
                value={form.expectedQuantity}
                onChange={handleChange}
                placeholder="Enter expected quantity"
                required
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button className="btn btn-success" type="submit">
                {editingId !== null ? "Update Crop" : "Add Crop"}
              </button>

              {editingId !== null && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                    setMessage("");
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="dashboard-card">
        <h4 className="section-heading">Crop Records</h4>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-8">
            <input
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by crop or field..."
            />
          </div>

          <div className="col-12 col-md-4">
            <select
              className="form-select"
              value={healthFilter}
              onChange={(event) => setHealthFilter(event.target.value)}
            >
              <option value="All">All Health Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Field</th>
                <th>Health</th>
                <th>Planting Date</th>
                <th>Cutting Date</th>
                <th>Expected Quantity</th>
                <th>Stock progress</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCrops.map((crop) => {
                const status = getStatus(crop.healthScore ?? 80);

                return (
                  <tr key={crop.id}>
                    <td>{crop.name}</td>
                    <td>{crop.field}</td>
                    <td>
                      <span
                        className={`badge ${
                          status === "Healthy"
                            ? "text-bg-success"
                            : status === "Critical"
                            ? "text-bg-danger"
                            : "text-bg-warning"
                        }`}
                      >
                        {status} ({crop.healthScore ?? 80}%)
                      </span>
                    </td>
                    <td>{crop.plantingDate}</td>
                    <td>{crop.cuttingDate}</td>
                    <td>{crop.expectedQuantity} kg</td>
                    <td style={{ minWidth: "180px" }}>
                  <StockProgressBar
                       harvested={crop.harvestQty ?? crop.expectedQuantity ?? 0}
                      sold={buyers
                     .filter(
                     (buyer) => String(buyer.cropId) === String(crop.id)
                             )
                        .reduce(
                        (total, buyer) => total + (Number(buyer.quantity) || 0),
                           0
                          )}
                          />
                         </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(crop)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(crop.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCrops.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No crops found. Add a crop or change your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}