import React from "react";

function EmptyState({
  title = "No records found",
  message = "Add a record to get started.",
}) {
  return (
    <div className="text-center py-5">
      <div className="display-6 mb-2">📋</div>
      <h5>{title}</h5>
      <p className="text-muted mb-0">{message}</p>
    </div>
  );
}

export default EmptyState;