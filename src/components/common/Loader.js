import React from "react";

function Loader({ message = "Loading..." }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center gap-2 p-4"
      role="status"
    >
      <div className="spinner-border text-success" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export default Loader;