import React, { useState, useEffect } from "react";
import "./MyProfile.css";
import Header from "../Header/index";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebaseconfig";

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    number: "",
    locality: "",
  });

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
    setProfile({
      name: currentUser.name || "",
      email: currentUser.email || "",
      number: currentUser.phoneNumber || "",
      locality: currentUser.locality || "",
    });
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const profile = JSON.parse(sessionStorage.getItem("currentUser")) || {};
    const { email, username, phoneNumber, locality } = profile;

    if (!email) {
      alert("Email is required to update the profile.");
      return;
    }

    try {
      // Reference to the document using email as ID
      const poolDocRef = doc(db, "pools", email); // Assuming "pools" is the collection and email is the document ID

      // Prepare the updated profile data
      const updatedProfile = {
        username,
        phoneNumber,
        locality,
      };

      // Update Firestore document
      await updateDoc(poolDocRef, updatedProfile);

      // Update local storage

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <div className="profile-container ">
        <h2>My Profile</h2>
        <div className="profile-fields gridiy ">
          <div className="profile-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profile-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profile-field">
            <label htmlFor="number">Phone:</label>
            <input
              type="number"
              id="number"
              name="number"
              value={profile.number}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profile-field">
            <label htmlFor="locality">Locality:</label>
            <input
              type="text"
              id="locality"
              name="locality"
              value={profile.locality}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        {!isEditing ? (
          <button
            className="btn-primary small-tn hideit "
            onClick={handleEditClick}
          >
            <i className="fas fa-edit"></i> Edit
          </button>
        ) : (
          <button className="btn-primary small-tn" onClick={handleSaveClick}>
            Save
          </button>
        )}
      </div>
    </>
  );
};

export default MyProfile;
