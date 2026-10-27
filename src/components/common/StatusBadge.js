import React from "react";

function StatusBadge({ status }) {
  const statusColors = {
    Healthy: "success",
    "Needs Attention": "warning",
    Critical: "danger",
    Pending: "secondary",
    Delivered: "primary",
    Done: "success",
    Overdue: "danger",
    Optimal: "success",
    Low: "warning",
    High: "danger",
  };

  const color = statusColors[status] || "secondary";

  return (
    <span className={`badge text-bg-${color}`}>
      {status || "Unknown"}
    </span>
  );
}

export default StatusBadge;