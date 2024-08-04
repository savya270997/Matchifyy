import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JoinPool.css";
import Header from "../Header/index";
import OTPModal from "../OTPModal";
import { MdOutlineStadium, MdGridOn, MdLibraryAddCheck } from "react-icons/md";
import { FaMapMarkerAlt, FaPhoneAlt, FaQuestionCircle } from "react-icons/fa";
import { db } from "../../Firebase/firebaseconfig"; // Import your Firebase config
import { doc, getDoc, updateDoc } from "firebase/firestore";

const JoinPool = () => {
  const [hasJoined, setHasJoined] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(""); // State to store current user's email
  const { poolId } = useParams(); // Get the poolId from the route parameters
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [poolDetails, setPoolDetails] = useState({
    stadium: "",
    area: "",
    phone: "",
    date: "",
    time: "",
    contactName: "",
    contactPhone: "",
    requirement: { total: "", joined: "", pending: "" },
  });

  useEffect(() => {
    // Fetch pool details from Firestore
    const fetchPoolDetails = async () => {
      try {
        const poolDocRef = doc(db, "pools", poolId);
        const poolSnapshot = await getDoc(poolDocRef);

        if (poolSnapshot.exists()) {
          setPoolDetails(poolSnapshot.data());
          const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
          const loggedInUserEmail = currentUser.email;
          setCurrentUserEmail(loggedInUserEmail);

          // Check if user has already joined
          const joinedMembers = poolSnapshot.data().joinedMembers || [];
          if (joinedMembers.includes(loggedInUserEmail)) {
            setHasJoined(true);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching pool details: ", error);
      }
    };

    fetchPoolDetails();
  }, [poolId]);

  const handleJoinClick = () => {
    setIsOtpModalOpen(true);
  };

  const handleOtpModalClose = () => {
    setIsOtpModalOpen(false);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleOtpModalJoin = async (otp) => {
    if (otp === "042998") {
      try {
        const poolDocRef = doc(db, "pools", poolId);
        const poolSnapshot = await getDoc(poolDocRef);

        if (poolSnapshot.exists()) {
          const poolData = poolSnapshot.data();

          // Update the pool's required and available players
          const updatedRequiredPlayers = Math.max(
            0,
            poolData.requiredPlayers - 1
          );
          const availablePlayers = Number(poolData.availablePlayers) || 0;
          const updatedAvailablePlayers = availablePlayers + 1;

          // Update pool details
          await updateDoc(poolDocRef, {
            requiredPlayers: updatedRequiredPlayers,
            availablePlayers: updatedAvailablePlayers,
            joinedMembers: [
              ...(poolData.joinedMembers || []),
              currentUserEmail,
            ],
          });

          setIsOtpModalOpen(false);
          navigate("/dashboard");
          alert("Successfully joined");
        }
      } catch (error) {
        console.error("Error joining pool: ", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Wrong OTP");
    }
  };

  return (
    <div>
      <Header />
      <div className="containerCreatePool">
        <div className="righty">
          <button className="btn-asic margin-right" onClick={handleCancel}>
            <span>Cancel</span>
          </button>
          <button
            className="btn-primary"
            disabled={hasJoined || poolDetails.email === currentUserEmail}
            onClick={handleJoinClick}
          >
            {hasJoined || poolDetails.email === currentUserEmail
              ? "Joined already"
              : "Join Pool"}
          </button>
        </div>
        <div className="gridy">
          <div>
            <form>
              <div>
                <h4>Pool details</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MdOutlineStadium className="input-icon"></MdOutlineStadium>
                  <div className="span_details">
                    <span>{poolDetails.venue}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaMapMarkerAlt className="input-icon"></FaMapMarkerAlt>
                  <div className="span_details">
                    <span>{poolDetails.area}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaPhoneAlt className="input-icon"></FaPhoneAlt>
                  <div className="span_details" style={{ display: "inline" }}>
                    <span>{poolDetails.phone}</span>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <h4>Date</h4>
                  <div className="span_details" style={{ display: "inline" }}>
                    <span>{poolDetails.date}</span>
                  </div>
                  <h4>Time</h4>
                  <div className="span_details" style={{ display: "inline" }}>
                    <span>{poolDetails.time}</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div>
            <form>
              <div>
                <h4>Contact details</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="input-icon">
                    <i className="fa fa-user"></i>
                  </div>
                  <div className="span_details">
                    <span>{poolDetails.name}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaPhoneAlt className="input-icon"></FaPhoneAlt>
                  <div className="span_details">
                    <span>{poolDetails.contactPhone}</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div>
            <form>
              <div>
                <h4>Requirement details</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MdGridOn className="input-icon"></MdGridOn>
                  <div className="span_details">
                    <span>{poolDetails.totalPoolSize}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MdLibraryAddCheck className="input-icon"></MdLibraryAddCheck>
                  <div className="span_details">
                    <span>{poolDetails.availablePlayers}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaQuestionCircle className="input-icon"></FaQuestionCircle>
                  <div className="span_details">
                    <span>{poolDetails.requiredPlayers}</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={handleOtpModalClose}
        onJoin={handleOtpModalJoin}
      />
    </div>
  );
};

export default JoinPool;
