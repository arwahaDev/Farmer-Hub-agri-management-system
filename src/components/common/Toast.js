import React from "react";

function Toast({
  message,
  type = "success",
  onClose,
}) {
  if (!message) return null;

  const color = type === "error" ? "danger" : type;

  return (
    <div
      className={`alert alert-${color} alert-dismissible`}
      role="alert"
    >
      {message}

      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose}
      />
    </div>
  );
}

export default Toast;