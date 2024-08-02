import React from "react";
import "./ConfirmationModal.css"; // Add your styles here

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you really sure you want to leave?</h2>
        <button onClick={onClose} className="btn-asic">
          No
        </button>
        <button onClick={onConfirm} className="btn-primary">
          Yes
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
