import { useState } from "react";
import { useSelector } from "react-redux";

function ReportBuilder() {
  const crops = useSelector((state) => state.crops || []);
  const buyers = useSelector((state) => state.buyers || []);
  const orders = useSelector((state) => state.orders || []);
  const tasks = useSelector((state) => state.tasks || []);

  const [report, setReport] = useState(null);

  const generateReport = () => {
    setReport({
      generatedAt: new Date().toLocaleString(),
      totalCrops: crops.length,
      totalBuyers: buyers.length,
      totalOrders: orders.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task) => task.completed).length,
      pendingTasks: tasks.filter((task) => !task.completed).length,
    });
  };

  return (
    <section className="report-builder">
      <h3>Report Builder</h3>
      <p>Generate a summary of your current farm management data.</p>

      <button type="button" onClick={generateReport}>
        Generate Report
      </button>

      {report && (
        <div className="report-result">
          <h4>Farm Management Report</h4>
          <p>Generated: {report.generatedAt}</p>

          <ul>
            <li>Total Crops: {report.totalCrops}</li>
            <li>Total Buyers: {report.totalBuyers}</li>
            <li>Total Orders: {report.totalOrders}</li>
            <li>Total Tasks: {report.totalTasks}</li>
            <li>Completed Tasks: {report.completedTasks}</li>
            <li>Pending Tasks: {report.pendingTasks}</li>
          </ul>

          <button
            type="button"
            onClick={() =>
              window.print()
            }
          >
            Print Report
          </button>
        </div>
      )}
    </section>
  );
}

export default ReportBuilder;