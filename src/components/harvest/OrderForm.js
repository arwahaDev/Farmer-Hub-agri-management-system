import { useEffect, useState } from "react";

const emptyForm = {
  cropId: "",
  quantity: "",
  orderDate: "",
  status: "Pending",
};

export default function OrderForm({ editingOrder, onCancelEdit }) {
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function loadData() {
    try {
      setCrops(JSON.parse(localStorage.getItem("agri_crops") || "[]"));
      setOrders(JSON.parse(localStorage.getItem("agri_orders") || "[]"));
    } catch {
      setError("Unable to load saved data.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editingOrder) {
      setForm({
        cropId: String(editingOrder.cropId ?? ""),
        quantity: String(editingOrder.quantity ?? ""),
        orderDate: editingOrder.orderDate || "",
        status: editingOrder.status || "Pending",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
    setMessage("");
  }, [editingOrder]);

  function updateField(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setError("");
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const selectedCrop = crops.find(
      (crop) => String(crop.id) === String(form.cropId)
    );

    if (!selectedCrop) {
      setError("Please select a crop.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Enter a quantity greater than zero.");
      return;
    }

    if (!form.orderDate) {
      setError("Please select an order date.");
      return;
    }

    const order = {
      id: editingOrder?.id || `${Date.now()}-${Math.random()}`,
      cropId: form.cropId,
      quantity,
      orderDate: form.orderDate,
      status: form.status,
    };

    const updatedOrders = editingOrder
      ? orders.map((item) =>
          String(item.id) === String(editingOrder.id) ? order : item
        )
      : [...orders, order];

    try {
      localStorage.setItem("agri_orders", JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      setForm(emptyForm);
      setMessage(
        editingOrder ? "Order updated successfully." : "Order added successfully."
      );
      setError("");

      if (editingOrder) onCancelEdit();
    } catch {
      setError("Unable to save the order.");
    }
  }

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">
        {editingOrder ? "Edit Order" : "Create Order"}
      </h4>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {crops.length === 0 && (
        <div className="alert alert-warning">
          Add a crop on the Crops page before creating an order.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="order-crop">Crop</label>
          <select
            id="order-crop"
            name="cropId"
            className="form-select"
            value={form.cropId}
            onChange={updateField}
            required
          >
            <option value="">Select a crop</option>
            {crops.map((crop, index) => (
              <option key={crop.id || index} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="order-quantity">
            Quantity (kg)
          </label>
          <input
            id="order-quantity"
            name="quantity"
            type="number"
            min="0.01"
            step="any"
            className="form-control"
            value={form.quantity}
            onChange={updateField}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="order-date">Order Date</label>
          <input
            id="order-date"
            name="orderDate"
            type="date"
            className="form-control"
            value={form.orderDate}
            onChange={updateField}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="order-status">Status</label>
          <select
            id="order-status"
            name="status"
            className="form-select"
            value={form.status}
            onChange={updateField}
          >
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button
          className="btn btn-success me-2"
          type="submit"
          disabled={crops.length === 0}
        >
          {editingOrder ? "Update Order" : "Add Order"}
        </button>

        {editingOrder && (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}