import { useState } from "react";
import BuyerForm from "../components/BuyerForm";
import BuyerTable from "../components/BuyerTable";

export default function Buyers() {
  const [editingBuyer, setEditingBuyer] = useState(null);

  function handleEdit(buyer) {
    setEditingBuyer(buyer);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingBuyer(null);
  }

  return (
    <div className="buyers-page">
      <div className="mb-4">
        <h2 className="page-heading">Buyers Management</h2>
        <p className="text-muted">
          Register buyers and manage crop sales.
        </p>
      </div>

      <BuyerForm
        editingBuyer={editingBuyer}
        onCancelEdit={handleCancelEdit}
      />

      <BuyerTable onEdit={handleEdit} />
    </div>
  );
}