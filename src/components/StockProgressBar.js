export default function StockProgressBar({
  harvested = 0,
  sold = 0,
}) {
  const total = Math.max(0, Number(harvested) || 0);
  const soldQuantity = Math.max(0, Number(sold) || 0);

  const percentage =
    total > 0
      ? Math.min(100, (soldQuantity / total) * 100)
      : 0;

  const remaining = Math.max(0, total - soldQuantity);

  return (
    <div>
      <div className="d-flex justify-content-between mb-1">
        <small>Sold: {soldQuantity} kg</small>
        <small>Remaining: {remaining} kg</small>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-label="Crop stock sold"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-bar bg-success"
          style={{ width: `${percentage}%` }}
        >
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  );
}