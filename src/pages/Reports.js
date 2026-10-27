import ActivityLog from "../components/reports/ActivityLog";
import ReportBuilder from "../components/reports/ReportBuilder";

export default function Reports() {
  return (
    <main className="reports-page">
      <h2>Farm Reports</h2>
      <p>View farm activity and generate reports.</p>

      <section className="report-section">
        <ReportBuilder />
      </section>

      <section className="report-section">
        <ActivityLog />
      </section>
    </main>
  );
}