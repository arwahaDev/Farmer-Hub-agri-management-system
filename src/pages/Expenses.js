import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ProfitLossChart from "../components/expenses/ProfitLossChart";

function Expenses() {
  return (
    <main className="expenses-page">
      <h2>Farm Expenses & Financial Report</h2>

      <ExpenseForm />
      <ExpenseTable />
      <ProfitLossChart />
    </main>
  );
}

export default Expenses;