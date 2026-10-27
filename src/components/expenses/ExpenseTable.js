import { useDispatch, useSelector } from "react-redux";
import { deleteExpense } from "../../store/actions/expenseActions";

function ExpenseTable() {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses || []);

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  return (
    <section className="expense-table-section">
      <h3>Expense Records</h3>

      <p className="expense-total">
        Total Expenses: PKR {totalExpenses.toLocaleString()}
      </p>

      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount (PKR)</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.title}</td>
                  <td>{expense.category}</td>
                  <td>{Number(expense.amount || 0).toLocaleString()}</td>
                  <td>{expense.date || "—"}</td>
                  <td>
                    <button
                      type="button"
                      className="expense-delete-btn"
                      onClick={() => {
                        if (window.confirm("Delete this expense?")) {
                          dispatch(deleteExpense(expense.id));
                        }
                      }}
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
    </section>
  );
}

export default ExpenseTable;