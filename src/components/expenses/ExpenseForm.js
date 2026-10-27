import { useState } from "react";
import { useDispatch } from "react-redux";
import { addExpense } from "../../store/actions/expenseActions";

function ExpenseForm() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Seeds");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0 || !date) {
      alert("Please enter a title, valid amount, and date.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      category,
      amount: Number(amount),
      date,
    };

    dispatch(addExpense(newExpense));

    setTitle("");
    setCategory("Seeds");
    setAmount("");
    setDate("");
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Add Expense</h3>

      <label htmlFor="expense-title">Expense Title</label>
      <input
        id="expense-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Wheat seeds"
        required
      />

      <label htmlFor="expense-category">Category</label>
      <select
        id="expense-category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Seeds">Seeds</option>
        <option value="Fertilizer">Fertilizer</option>
        <option value="Labor">Labor</option>
        <option value="Fuel">Fuel</option>
        <option value="Equipment">Equipment</option>
        <option value="Other">Other</option>
      </select>

      <label htmlFor="expense-amount">Amount (PKR)</label>
      <input
        id="expense-amount"
        type="number"
        min="0.01"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />

      <label htmlFor="expense-date">Date</label>
      <input
        id="expense-date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;