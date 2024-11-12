import React, { useEffect } from "react";

const AlertMessage = ({ type = "info", message, onClose, duration = 3000 }) => {
  // Map alert types to DaisyUI classes
  const alertTypeClass = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  }[type];

  // Automatically close the popup after a specified duration
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className={`alert ${alertTypeClass} shadow-lg relative p-4 m-4`}
        role="alert"
      >
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 btn btn-sm btn-ghost absolute top-2 right-2"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;
