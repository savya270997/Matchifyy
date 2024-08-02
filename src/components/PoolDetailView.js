import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PoolDetailView.css";
import Header from "./Header";
import { db } from "../firebaseconfig"; // Ensure this is the correct path to your Firebase configuration
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"; // Import Firestore methods

const PoolDetailView = () => {
  const { poolId } = useParams(); // Extract poolId from the URL
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    stadium: "",
    area: "",
    phone: "",
    date: "",
    time: "",
    contactName: "",
    contactPhone: "",
    requirement: { total: "", joined: "", pending: "" },
  });
  const [joinedPlayers, setJoinedPlayers] = useState([]);

  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        // Fetch pool data from Firestore
        const poolDocRef = doc(db, "pools", poolId);
        const poolDoc = await getDoc(poolDocRef);
        if (poolDoc.exists()) {
          const pool = poolDoc.data();
          setFormData({
            gameName: pool.gameName || "",

            area: pool.area || "",
            contactNumber: pool.contactPhone || "",
            date: pool.date || { day: "", month: "", year: "" },
            time: pool.time || "",
            contactPerson: pool.name || "",
            contactPhone: pool.phone || "",
            total: pool.totalPoolSize || "",
            availablePlayers: pool.availablePlayers || "",
            req: pool.requiredPlayers || "",
          });

          // Fetch joined players details
          fetchJoinedPlayersDetails(pool.joinedMembers || []);
        } else {
          console.log("Pool not found");
        }
      } catch (error) {
        console.error("Error fetching pool data:", error);
      }
    };

    const fetchJoinedPlayersDetails = async (joinedMembers) => {
      try {
        if (!joinedMembers || joinedMembers.length === 0) {
          console.log("No joined members data available.");
          setJoinedPlayers([]);
          return;
        }

        const usersCollectionRef = collection(db, "users");
        const joinedPlayersDetailsPromises = joinedMembers.map((email) => {
          const q = query(usersCollectionRef, where("email", "==", email));
          return getDocs(q);
        });

        const joinedPlayersDetailsSnapshots = await Promise.all(
          joinedPlayersDetailsPromises
        );

        const joinedPlayersDetails = joinedPlayersDetailsSnapshots.flatMap(
          (snapshot) => snapshot.docs.map((doc) => doc.data())
        );

        setJoinedPlayers(
          joinedPlayersDetails.map((user) => ({
            name: user.username,
            contactNumber: user.phoneNumber,
            email: user.email,
            area: user.locality,
          }))
        );
      } catch (error) {
        console.error("Error fetching joined players details:", error);
      }
    };

    fetchPoolData();
  }, [poolId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    try {
      const poolDocRef = doc(db, "pools", poolId);
      await updateDoc(poolDocRef, {
        gameName: formData.gameName,

        area: formData.area,
        contactNumber: formData.contactPhone,
        date: formData.date,
        time: formData.time,
        contactPerson: formData.contactPerson, // Ensure this matches your formData
        contactPhone: formData.contactNumber, // Ensure this matches your formData
        totalPoolSize: formData.total, // Ensure this matches your formData
        availablePlayers: formData.availablePlayers, // Ensure this matches your formData
        requiredPlayers: formData.req, // Ensure this matches your formData
      });
      console.log("Pool data updated successfully");
    } catch (error) {
      console.error("Error updating pool data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Header />
      <div className="pool-detail-container">
        <div className="header">
          <h2>Joined Members</h2>
        </div>
        {/* Table for joined members */}
        <div className="table_card">
          <div className="table-wrapper">
            <table className="fl-table">
              <thead>
                <tr>
                  <th>Joined Members</th>
                  <th>Contact Number</th>
                  <th>Area</th>
                </tr>
              </thead>
              <tbody>
                {joinedPlayers.length > 0 ? (
                  joinedPlayers.map((player, index) => (
                    <tr key={index}>
                      <td>{player.name || ""}</td>
                      <td>{player.contactNumber || ""}</td>
                      <td>{player.area || ""}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No members have joined yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="containerCreatePool">
          <div className="right">
            <button
              className="btn-primary"
              onClick={isEditing ? handleSaveClick : handleEditClick}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
          <div className="gridy">
            {/* Pool Details */}
            <div>
              <h3>Pool details</h3>
              <form>
                <div className="form-group">
                  <label>Game Name</label>
                  <input
                    type="text"
                    name="poolName"
                    value={formData.gameName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Area</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </form>
            </div>
            {/* Contact Details */}
            <div>
              <h3>Contact details</h3>
              <form>
                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Alternate Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </form>
            </div>
            {/* Requirement Details */}
            <div>
              <h3>Requirement details</h3>
              <form>
                <div className="form-group">
                  <label>Total</label>
                  <input
                    type="number"
                    name="total"
                    value={formData.total}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Confirmed</label>
                  <input
                    type="number"
                    name="availablePlayers"
                    value={formData.availablePlayers}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Pending</label>
                  <input
                    type="number"
                    name="req"
                    value={formData.req}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PoolDetailView;
