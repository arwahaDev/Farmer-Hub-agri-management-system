import { exportCsv } from "../utils/exportCsv";
import { useState } from "react";
import OrderForm from "../components/harvest/OrderForm";
import OrdersTable from "../components/harvest/OrdersTable";
import OrdersSummary from "../components/harvest/OrdersSummary";

import { addOrder } from "../store/actions/orderActions";
export default function HarvestOrders() {
  const [editingOrder, setEditingOrder] = useState(null);

  function handleCancelEdit() {
    setEditingOrder(null);
  }

  function handleExportOrders() {
    const orders = JSON.parse(
      localStorage.getItem("agri_orders") || "[]"
    );

    exportCsv(orders, "Farmer Hub.csv");
  }

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="page-heading">Harvest and Orders</h2>
        <p className="text-muted">
          Create orders and track their delivery status.
        </p>
      </div>

      <button
        type="button"
        className="btn btn-success mb-3"
        onClick={handleExportOrders}
      >
        Export Orders CSV
      </button>

      <OrdersSummary />

      
          
      <OrderForm
        editingOrder={editingOrder}
        onCancelEdit={handleCancelEdit}
      />

      <OrdersTable onEdit={setEditingOrder} />
    </div>
  );
}