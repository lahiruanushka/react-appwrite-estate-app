import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <>
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteConfirmationModal;