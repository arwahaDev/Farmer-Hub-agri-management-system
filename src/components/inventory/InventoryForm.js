import { useState } from "react";
import { useDispatch } from "react-redux";
import { addInventoryItem } from "../../store/reducers/inventoryReducer";

export default function InventoryForm() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    category: "Seeds",
    quantity: "",
    unit: "kg",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || Number(formData.quantity) <= 0) {
      alert("Please enter a valid item name and quantity.");
      return;
    }

    dispatch(
      addInventoryItem({
        id: Date.now(),
        name: formData.name.trim(),
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
      })
    );

    setFormData({
      name: "",
      category: "Seeds",
      quantity: "",
      unit: "kg",
    });
  };

  return (
    <section className="inventory-form-section">
      <h3>Add Inventory Item</h3>

      <form className="inventory-form" onSubmit={handleSubmit}>
        <label>
          Item Name
          <input
            type="text"
            name="name"
            placeholder="e.g. Wheat Seeds"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Seeds">Seeds</option>
            <option value="Fertilizer">Fertilizer</option>
            <option value="Pesticides">Pesticides</option>
            <option value="Tools">Tools</option>
            <option value="Equipment">Equipment</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Quantity
          <input
            type="number"
            name="quantity"
            min="0.01"
            step="any"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Unit
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="bags">Bags</option>
            <option value="liters">Liters</option>
            <option value="pieces">Pieces</option>
          </select>
        </label>

        <button type="submit">Add Item</button>
      </form>
    </section>
  );
}