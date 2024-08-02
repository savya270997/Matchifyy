import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseconfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import OTPVerification from "./OTPVerification";
import "./LoginPage.css";
import "../variables.css";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    locality: "",
    phoneNumber: "",
    email: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      const { username, password, confirmPassword, phoneNumber, email } =
        formData;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const emailQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const emailSnapshot = await getDocs(emailQuery);

      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const usernameSnapshot = await getDocs(usernameQuery);

      const phoneQuery = query(
        collection(db, "users"),
        where("phoneNumber", "==", phoneNumber)
      );
      const phoneSnapshot = await getDocs(phoneQuery);

      if (!emailSnapshot.empty) {
        alert("Email already exists");
        return;
      }

      if (!usernameSnapshot.empty) {
        alert("Username already exists");
        return;
      }

      if (!phoneSnapshot.empty) {
        alert("Phone number already exists");
        return;
      }

      setIsVerifyingOTP(true);
      setIsRegistered(true);
    } else {
      const { username, password } = formData;
      try {
        const userQuery = query(
          collection(db, "users"),
          where("username", "==", username),
          where("password", "==", password)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          alert("Invalid username or password");
        } else {
          // Retrieve user data
          const userData = userSnapshot.docs[0].data();

          // Store user data in session storage
          sessionStorage.setItem("currentUser", JSON.stringify(userData));

          navigate("/dashboard");
        }
      } catch (error) {
        alert("Error during login: " + error.message);
      }
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (otp === "042998") {
      if (isRegistered) {
        const { username, password, phoneNumber, email, name, locality } =
          formData;

        try {
          const userData = {
            username,
            password,
            phoneNumber,
            email,
            name,
            locality,
          };
          await setDoc(doc(collection(db, "users"), username), userData);
          alert("Registration successful");
          setIsVerifyingOTP(false);
          setIsRegistering(false);
          setFormData({
            username: "",

            name: "",
            locality: "",
            phoneNumber: "",
            email: "",
            confirmPassword: "",
          });

          // Store user data in session storage
          sessionStorage.setItem("currentUser", JSON.stringify(userData));

          navigate("/dashboard");
        } catch (error) {
          alert("Error during registration: " + error.message);
        }
      }
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="login-container">
      <div className="brand-logo">
        <img src="../Cricket_logo.png" alt="Cricket Logo" />
      </div>
      <h2 className="brand-title">
        {isRegistering ? "Register" : "MatchiFY! Login"}
      </h2>
      {isVerifyingOTP ? (
        <OTPVerification
          otp={otp}
          setOtp={setOtp}
          handleOTPSubmit={handleOTPSubmit}
        />
      ) : (
        <form onSubmit={handleSubmit}>
          {isRegistering ? (
            <>
              <div className="grid--50-50">
                <div className="field margin-right">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="locality">Locality</label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid--50-50">
                <div className="field margin-right">
                  <label htmlFor="phoneNumber">Phone number</label>
                  <input
                    type="number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="button_reg">
                Register
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button className="btn-primary hovery" type="submit">
                Login
              </button>
            </>
          )}
        </form>
      )}
      {!isRegistering && (
        <button className="btn-secondary" onClick={handleRegisterClick}>
          Register
        </button>
      )}
    </div>
  );
};

export default LoginPage;
