import React from "react";

function ToastCarrito({ show, mensaje, onClose }) {
  if (!show) return null;

  return (
    <div
      className="position-fixed"
      style={{
        top: "20px",
        right: "20px",
        zIndex: 2000,
        minWidth: "250px",
      }}
    >
      <div className="toast show bg-dark text-white p-3 rounded shadow">
        <div className="d-flex justify-content-between">
          <strong>{mensaje}</strong>
          <button className="btn-close btn-close-white" onClick={onClose}></button>
        </div>
      </div>
    </div>
  );
}

export default ToastCarrito;
