import { useEffect, useState } from "react";
export default function OrdersTable({ onEdit }) {
  const [orders, setOrders] = useState([]);
  const [cropNames, setCropNames] = useState({});
  const [message, setMessage] = useState("");

  function loadOrders() {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("agri_orders") || "[]"
      );
      const savedCrops = JSON.parse(
        localStorage.getItem("agri_crops") || "[]"
      );

      setOrders(Array.isArray(savedOrders) ? savedOrders : []);

      const names = {};
      savedCrops.forEach((crop) => {
        names[String(crop.id)] = crop.name;
      });
      setCropNames(names);
    } catch {
      setMessage("Unable to load orders.");
    }
  }

  useEffect(() => {
    loadOrders();
    window.addEventListener("focus", loadOrders);
    return () => window.removeEventListener("focus", loadOrders);
  }, []);

  function changeStatus(order, status) {
    const updated = orders.map((item) =>
      String(item.id) === String(order.id) ? { ...item, status } : item
    );

    try {
      localStorage.setItem("agri_orders", JSON.stringify(updated));
      setOrders(updated);
      setMessage("Order status updated.");
    } catch {
      setMessage("Unable to update order status.");
    }
  }

  function deleteOrder(orderId) {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    const updated = orders.filter(
      (order) => String(order.id) !== String(orderId)
    );

    try {
      localStorage.setItem("agri_orders", JSON.stringify(updated));
      setOrders(updated);
      setMessage("Order deleted successfully.");
    } catch {
      setMessage("Unable to delete this order.");
    }
  }

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">Orders List</h4>

      {message && <div className="alert alert-info">{message}</div>}

      {orders.length === 0 ? (
        <p className="text-muted mb-0">No orders have been added yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id || index}>
                  <td>{cropNames[String(order.cropId)] || "Unknown crop"}</td>
                  <td>{order.quantity} kg</td>
                  <td>{order.orderDate}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status || "Pending"}
                      onChange={(event) =>
                        changeStatus(order, event.target.value)
                      }
                      aria-label={`Status for order ${index + 1}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2 mb-1"
                      onClick={() => onEdit(order)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger mb-1"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Delete
                    </button>
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