export const selectProfitByCrop = (state, cropId) => {
  const orders = state.orders || [];
  const expenses = state.expenses || [];

  const cropOrders = orders.filter(
    (order) => String(order.cropId) === String(cropId)
  );

  const cropExpenses = expenses.filter(
    (expense) => String(expense.cropId) === String(cropId)
  );

  const totalIncome = cropOrders.reduce(
    (total, order) => total + Number(order.totalAmount ?? 0),
    0
  );

  const totalExpenses = cropExpenses.reduce(
    (total, expense) => total + Number(expense.amount ?? 0),
    0
  );

  return totalIncome - totalExpenses;
};