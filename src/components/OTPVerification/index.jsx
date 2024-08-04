import React from "react";

const OTPVerification = ({ otp, setOtp, handleOTPSubmit }) => {
  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <form onSubmit={handleOTPSubmit}>
        <div className="form-group">
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
