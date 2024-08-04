import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePool.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaUser, FaEnvelope } from "react-icons/fa";
import Header from "../Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MdOutlineStadium,
  MdOutlineSports,
  MdGridOn,
  MdLibraryAddCheck,
} from "react-icons/md";
import { db } from "../../Firebase/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const CreatePool = () => {
  const [formData, setFormData] = useState({
    venue: "",
    area: "",
    phone: "",
    date: new Date(), // Initialize with a Date object
    time: "",
    name: "",
    email: "",
    contactPhone: "",

    totalPoolSize: "",
    availablePlayers: "",
    requiredPlayers: "", // This will be calculated
    gameName: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values for totalPoolSize and availablePlayers
    if (
      (name === "totalPoolSize" || name === "availablePlayers") &&
      value < 0
    ) {
      return;
    }

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: value,
      };

      // Calculate requiredPlayers
      if (name === "totalPoolSize" || name === "availablePlayers") {
        updatedFormData.requiredPlayers = Math.max(
          0,
          updatedFormData.totalPoolSize - updatedFormData.availablePlayers
        );
      }

      return updatedFormData;
    });
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    let missingFields = [];

    for (let key in formData) {
      if (
        formData[key] === "" ||
        (typeof formData[key] === "object" && !formData[key])
      ) {
        // Special handling for requiredPlayers
        if (key === "requiredPlayers" && formData[key] <= 0) {
          formErrors[key] = "Required Players must be greater than zero.";
        } else {
          formErrors[key] = "This field is required.";
        }
        missingFields.push(key);
      }
    }

    // Check for future date and time
    const currentDate = new Date();
    const selectedDate = new Date(formData.date);
    const selectedTime = formData.time.split(":");
    selectedDate.setHours(selectedTime[0], selectedTime[1]);

    if (selectedDate < currentDate) {
      formErrors.date = "The selected date and time must be in the future.";
      missingFields.push("date");
    }

    setErrors(formErrors);
    return missingFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = validateForm();

    if (missingFields.length > 0) {
      const errorMessages = missingFields
        .map((field) => `- ${field.charAt(0).toUpperCase() + field.slice(1)}`)
        .join("\n");
      alert(`Please correct the following errors:\n${errorMessages}`);
      return;
    }

    // Generate a unique ID
    const generateId = () => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let id = "";
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
      }
      return id;
    };
    const newId = generateId();

    // Get the logged-in user's email
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const loggedInUserEmail = currentUser.email;

    //const loggedInUserEmail = localStorage.getItem("email");

    // Create pool object
    const newPool = {
      ...formData,
      PoolId: newId, // Add generated ID
      date: formData.date.toLocaleDateString("en-GB"),
      time: formData.time,
      type: "created",
      email: loggedInUserEmail, // Add type property
      //email: loggedInUserEmail, // Add email to pool data
    };

    try {
      // Save to Firestore
      await addDoc(collection(db, "pools"), newPool);

      alert("Pool created successfully!");

      // Optionally redirect
      navigate("/dashboard");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handelCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <Header />
      <div className="create-pool-container">
        <div className="SaveEdit">
          <button className="btn-asic" onClick={handelCancel}>
            <span style={{ color: "#fff" }}>Cancel</span>
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            <span style={{ fontSize: "20px" }}>Save</span>
          </button>
        </div>
        <div className="create-pool-form">
          {/* Pool Details */}
          <div className="form-section pool-details">
            <h4>Pool Details</h4>
            <div className="form-group">
              <label>Venue</label>
              <div className="input-group">
                <input
                  type="text"
                  name="venue"
                  placeholder="Venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className={errors.venue ? "error" : ""}
                />
                <MdOutlineStadium className="input-icon" />
              </div>
              {errors.venue && (
                <div className="error-message">{errors.venue}</div>
              )}
            </div>
            <div className="form-group">
              <label>Area</label>
              <div className="input-group">
                <input
                  type="text"
                  name="area"
                  placeholder="Area"
                  value={formData.area}
                  onChange={handleChange}
                  className={errors.area ? "error" : ""}
                />
                <FaMapMarkerAlt className="input-icon" />
              </div>
              {errors.area && (
                <div className="error-message">{errors.area}</div>
              )}
            </div>
            <div className="form-group">
              <label>Alternate Phone Number</label>
              <div className="input-group">
                <input
                  type="number"
                  name="phone"
                  placeholder="Alternate Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                />
                <FaPhoneAlt className="input-icon" />
              </div>
              {errors.phone && (
                <div className="error-message">{errors.phone}</div>
              )}
            </div>
            <div className="form-group">
              <label>Date</label>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()} // Disable past dates
                className={`date-picker ${errors.date ? "error" : ""}`}
                placeholderText="Select date"
              />
              {errors.date && (
                <div className="error-message">{errors.date}</div>
              )}
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={errors.time ? "error" : ""}
              />
              {errors.time && (
                <div className="error-message">{errors.time}</div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="form-section contact-details">
            <h4>Contact Details</h4>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                />
                <FaUser className="input-icon" />
              </div>
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                <FaEnvelope className="input-icon" />
              </div>
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <div className="input-group">
                <input
                  type="number"
                  name="contactPhone"
                  placeholder="Contact Number"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className={errors.contactPhone ? "error" : ""}
                />
                <FaPhoneAlt className="input-icon" />
              </div>
              {errors.contactPhone && (
                <div className="error-message">{errors.contactPhone}</div>
              )}
            </div>
          </div>

          {/* Pool Information */}
          <div className="form-section pool-information">
            <h4>Pool Information</h4>
            <div className="form-group">
              <label>Game Name</label>
              <div className="input-group">
                <input
                  type="text"
                  name="gameName"
                  placeholder="Game Name"
                  value={formData.gameName}
                  onChange={handleChange}
                  className={errors.gameName ? "error" : ""}
                />
                <MdOutlineSports className="input-icon" />
              </div>
              {errors.gameName && (
                <div className="error-message">{errors.gameName}</div>
              )}
            </div>
            <div className="form-group">
              <label>Total Pool Size</label>
              <div className="input-group">
                <input
                  type="number"
                  name="totalPoolSize"
                  placeholder="Total Pool Size"
                  value={formData.totalPoolSize}
                  onChange={handleChange}
                  className={errors.totalPoolSize ? "error" : ""}
                />
                <MdGridOn className="input-icon" />
              </div>
              {errors.totalPoolSize && (
                <div className="error-message">{errors.totalPoolSize}</div>
              )}
            </div>
            <div className="form-group">
              <label>Available Players</label>
              <div className="input-group">
                <input
                  type="number"
                  name="availablePlayers"
                  placeholder="Available Players"
                  value={formData.availablePlayers}
                  onChange={handleChange}
                  className={errors.availablePlayers ? "error" : ""}
                />
                <MdLibraryAddCheck className="input-icon" />
              </div>
              {errors.availablePlayers && (
                <div className="error-message">{errors.availablePlayers}</div>
              )}
            </div>
            <div className="form-group">
              <label>Required Players</label>
              <div className="input-group">
                <input
                  type="number"
                  name="requiredPlayers"
                  placeholder="Required Players"
                  value={formData.requiredPlayers}
                  disabled
                  className={errors.requiredPlayers ? "error" : ""}
                />
                <MdLibraryAddCheck className="input-icon" />
              </div>
              {errors.requiredPlayers && (
                <div className="error-message">{errors.requiredPlayers}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePool;
