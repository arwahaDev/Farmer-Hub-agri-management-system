import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function ProfitLossChart() {
  const expenses = useSelector((state) => state.expenses || []);
  const orders = useSelector((state) => state.orders || []);

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const totalIncome = orders.reduce((total, order) => {
    const amount = Number(order.totalAmount ?? order.amount ?? 0);
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const profitLoss = totalIncome - totalExpenses;

  const chartData = {
    labels: ["Income", "Expenses", "Profit / Loss"],
    datasets: [
      {
        label: "Amount (PKR)",
        data: [totalIncome, totalExpenses, profitLoss],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <section className="profit-loss-section">
      <h3>Profit & Loss Overview</h3>

      <div className="profit-loss-summary">
        <p>
          Total Income: <strong>PKR {totalIncome.toLocaleString()}</strong>
        </p>
        <p>
          Total Expenses: <strong>PKR {totalExpenses.toLocaleString()}</strong>
        </p>
        <p>
          {profitLoss >= 0 ? "Profit" : "Loss"}:{" "}
          <strong>PKR {Math.abs(profitLoss).toLocaleString()}</strong>
        </p>
      </div>

      <div className="profit-loss-chart">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {totalIncome === 0 && (
        <p>
          Income abhi zero hai. Orders mein amount record hone par
          income aur profit/loss update honge.
        </p>
      )}
    </section>
  );
}

export default ProfitLossChart;