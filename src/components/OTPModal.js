import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OTPModal.css";

const OTPModal = ({ isOpen, onClose, onJoin }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleJoinClick = () => {
    navigate("/dashboard");
    onJoin(otp);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="otp-modal">
      <div className="otp-modal-content">
        <h4>Enter OTP</h4>
        <input
          className="width70"
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
        />
        <div className="otp-modal-buttons">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleJoinClick}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
