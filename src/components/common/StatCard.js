import React from "react";

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">{title}</p>
            <h3 className="mb-2">{value ?? 0}</h3>
            {trend && <small className="text-muted">{trend}</small>}
          </div>
          <span className="fs-2">{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default StatCard;