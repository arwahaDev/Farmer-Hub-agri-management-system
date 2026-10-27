import InventoryForm from "../components/inventory/InventoryForm";
import InventoryTable from "../components/inventory/InventoryTable";

export default function Inventory() {
  return (
    <main className="inventory-page">
      <h2>Farm Inventory Management</h2>
      <p>Manage seeds, fertilizers, tools, and other farm supplies.</p>

      <InventoryForm />
      <InventoryTable />
    </main>
  );
}