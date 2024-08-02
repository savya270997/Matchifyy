import React, { useState, useEffect } from "react";
import "./MyActivities.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import { db } from "../firebaseconfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const MyActivities = () => {
  const [activities, setActivities] = useState([]);
  const [joinedActivities, setJoinedActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("created");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPoolId, setSelectedPoolId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeletePoolId, setSelectedDeletePoolId] = useState(null);

  const [currentCreatedPage, setCurrentCreatedPage] = useState(1);
  const [currentJoinedPage, setCurrentJoinedPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    const loggedInUserEmail = user.email;
    setCurrentUserEmail(loggedInUserEmail);

    const fetchActivities = async () => {
      const poolsCollection = collection(db, "pools");

      // Fetch created pools
      const createdQuery = query(
        poolsCollection,
        where("email", "==", loggedInUserEmail)
      );
      const createdSnapshot = await getDocs(createdQuery);
      const createdPools = createdSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(createdPools);

      // Fetch joined pools
      const joinedQuery = query(
        poolsCollection,
        where("joinedMembers", "array-contains", loggedInUserEmail)
      );
      const joinedSnapshot = await getDocs(joinedQuery);
      const joinedPools = joinedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJoinedActivities(joinedPools);
    };

    fetchActivities();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleViewClick = (pool) => {
    navigate(`/pool-detail-view/${pool.id}`, { state: { pool } });
    console.log(pool.id, pool);
  };

  const handleLeaveClick = (poolId) => {
    setSelectedPoolId(poolId);
    setIsModalOpen(true);
  };

  const handleConfirmLeave = async () => {
    try {
      const poolDocRef = doc(db, "pools", selectedPoolId);
      const poolSnapshot = await getDoc(poolDocRef);
      if (!poolSnapshot.exists()) {
        console.error("No such pool!");
        return;
      }

      const poolData = poolSnapshot.data();

      // Calculate the new available and required players
      const updatedAvailablePlayers = poolData.availablePlayers - 1;
      const updatedRequiredPlayers = poolData.requiredPlayers + 1;

      await updateDoc(poolDocRef, {
        joinedMembers: poolData.joinedMembers.filter(
          (email) => email !== currentUserEmail
        ),
        availablePlayers: updatedAvailablePlayers,
        requiredPlayers: updatedRequiredPlayers,
      });

      console.log("User left the pool successfully");

      setIsModalOpen(false);

      // Refresh data
      const poolsCollection = collection(db, "pools");

      // Fetch created pools
      const createdQuery = query(
        poolsCollection,
        where("email", "==", currentUserEmail)
      );
      const createdSnapshot = await getDocs(createdQuery);
      const createdPools = createdSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(createdPools);

      // Fetch joined pools
      const joinedQuery = query(
        poolsCollection,
        where("joinedMembers", "array-contains", currentUserEmail)
      );
      const joinedSnapshot = await getDocs(joinedQuery);
      const joinedPools = joinedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJoinedActivities(joinedPools);
    } catch (error) {
      console.error("Error leaving the pool:", error);
    }
  };

  const handleCancelLeave = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = (poolId) => {
    setSelectedDeletePoolId(poolId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const poolDocRef = doc(db, "pools", selectedDeletePoolId);
    await deleteDoc(poolDocRef);

    setIsDeleteModalOpen(false);

    // Refresh data
    const poolsCollection = collection(db, "pools");

    // Fetch created pools
    const createdQuery = query(
      poolsCollection,
      where("email", "==", currentUserEmail)
    );
    const createdSnapshot = await getDocs(createdQuery);
    const createdPools = createdSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setActivities(createdPools);

    // Fetch joined pools
    const joinedQuery = query(
      poolsCollection,
      where("joinedMembers", "array-contains", currentUserEmail)
    );
    const joinedSnapshot = await getDocs(joinedQuery);
    const joinedPools = joinedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJoinedActivities(joinedPools);
  };

  const handlePageChange = (type, pageNumber) => {
    if (type === "created") {
      setCurrentCreatedPage(pageNumber);
    } else if (type === "joined") {
      setCurrentJoinedPage(pageNumber);
    }
  };

  const renderPagination = (type, totalRecords) => {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const currentPage =
      type === "created" ? currentCreatedPage : currentJoinedPage;

    return (
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(type, index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  const createdPoolsToDisplay = activities.slice(
    (currentCreatedPage - 1) * recordsPerPage,
    currentCreatedPage * recordsPerPage
  );

  const joinedPoolsToDisplay = joinedActivities.slice(
    (currentJoinedPage - 1) * recordsPerPage,
    currentJoinedPage * recordsPerPage
  );

  return (
    <>
      <Header />
      <div className="cardish">
        <div className="my-activities-container">
          <div className="tabs-header">
            <div
              className={`tab ${activeTab === "created" ? "active" : ""}`}
              onClick={() => handleTabClick("created")}
            >
              Created Pool
            </div>
            <div
              className={`tab ${activeTab === "joined" ? "active" : ""}`}
              onClick={() => handleTabClick("joined")}
            >
              Joined Pool
            </div>
          </div>
          <div className="tabs-content">
            {activeTab === "created" && (
              <div>
                <h1>Created Pool</h1>
                <table className="fl-table ">
                  <thead>
                    <tr>
                      <th>Area</th>
                      <th>Venue</th>
                      <th>Start Time</th>
                      <th>Players</th>
                      <th>Game Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createdPoolsToDisplay.map((pool, index) => (
                      <tr key={index}>
                        <td>{pool.area}</td>
                        <td>{pool.venue}</td>
                        <td>{`${pool.time} on ${pool.date}`}</td>
                        <td>{`${pool.availablePlayers || 0}/${
                          pool.totalPoolSize || 0
                        }`}</td>
                        <td>{pool.gameName}</td>
                        <td>
                          <button
                            onClick={() => handleViewClick(pool)}
                            className="btn-primary"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteClick(pool.id)}
                            className="btn-danger"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination("created", activities.length)}
              </div>
            )}
            {activeTab === "joined" && (
              <div>
                <h1>Joined Pool</h1>
                <table className="fl-table ">
                  <thead>
                    <tr>
                      <th>Area</th>
                      <th>Venue</th>
                      <th>Start Time</th>
                      <th>Contact Name & Phone</th>
                      <th>Still Required Players</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {joinedPoolsToDisplay.length > 0 ? (
                      joinedPoolsToDisplay.map((activity) => (
                        <tr key={activity.id}>
                          <td>{activity.area}</td>
                          <td>{activity.venue}</td>
                          <td>{`${activity.time} on ${activity.date}`}</td>
                          <td>{`${activity.name} & ${activity.contactPhone}`}</td>
                          <td>{`${activity.availablePlayers || 0}/${
                            activity.totalPoolSize || 0
                          }`}</td>
                          <td>
                            <button
                              onClick={() => handleLeaveClick(activity.id)}
                              className="btn-asic"
                              style={{ color: "var(--color-basic)" }}
                            >
                              Leave
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No joined pools found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {renderPagination("joined", joinedActivities.length)}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelLeave}
        onConfirm={handleConfirmLeave}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Pool"
        message="Are you sure you want to delete this pool?"
      />
    </>
  );
};

export default MyActivities;
