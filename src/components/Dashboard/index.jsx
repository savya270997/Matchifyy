import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaUsers } from "react-icons/fa";
import Header from "../Header";
import { db } from "../../Firebase/firebaseconfig"; // Import your Firebase config
import { collection, query, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [showTable, setShowTable] = useState(false);
  const [pools, setPools] = useState([]);
  const [joinedPools, setJoinedPools] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState(""); // State to store current user's email
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Function to check if a pool's date and time have passed
  const isPoolPast = (date, time) => {
    const currentDate = new Date();
    const [day, month, year] = date.split("/").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    const poolDate = new Date(year, month - 1, day, hours, minutes);
    return poolDate < currentDate;
  };

  useEffect(() => {
    // Fetch the current user's email
    const loggedInUserEmail = localStorage.getItem("email");
    setCurrentUserEmail(loggedInUserEmail);

    // Fetch pool details
    const fetchPools = async () => {
      try {
        const q = query(collection(db, "pools"));
        const querySnapshot = await getDocs(q);
        const poolData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (!isPoolPast(data.date, data.time)) {
            poolData.push({ id: doc.id, ...data });
          }
        });
        setPools(poolData);
      } catch (error) {
        console.error("Error fetching pools: ", error);
      }
    };

    fetchPools();

    // Fetch joined pools
    const storedJoinedPools =
      JSON.parse(localStorage.getItem("joinedPools")) || [];
    setJoinedPools(storedJoinedPools);
  }, []);

  const handleJoinPoolClick = () => {
    setShowTable(!showTable);
  };

  const navigate = useNavigate();
  const handleCreatePoolClick = (e) => {
    e.preventDefault();
    navigate("/create-pool");
  };

  const handleJoinClick = (poolId) => {
    navigate(`/join-pool/${poolId}`);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentPools = pools.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(pools.length / recordsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <main className="dashboard-main">
          <div className="cards-container">
            <div className="about-little right-align">
              <h2>Create pool</h2>
              <p>
                helps you to set up a new pool for a game and let other players
                seek you.
              </p>
            </div>
            <div className="about-little left-align">
              <h2>Join pool</h2>
              <p>helps you to participate in an existing pool for a game. </p>
            </div>
            <div className="card" onClick={handleCreatePoolClick}>
              <FaPlusCircle className="card-icon" />
              <h1>Create Pool</h1>
            </div>
            <div className="card" onClick={handleJoinPoolClick}>
              <FaUsers className="card-icon" />
              <h1>Join Pool</h1>
            </div>
          </div>

          {showTable && (
            <div className="table-container">
              <table className="fl-table">
                <thead>
                  <tr>
                    <th>Game Name</th>
                    <th>Venue</th>
                    <th>Area</th>
                    <th>Play Date</th>
                    <th>Start Time</th>
                    <th>Available Players</th>
                    <th>Required Players</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPools.map((pool) => (
                    <tr key={pool.id}>
                      <td>{pool.gameName}</td>
                      <td>{pool.venue}</td>
                      <td>{pool.area}</td>
                      <td>{pool.date}</td>
                      <td>{pool.time}</td>
                      <td>{pool.availablePlayers}</td>
                      <td>{pool.requiredPlayers}</td>
                      <td>
                        <button
                          className={
                            pool.requiredPlayers === 0 ||
                            (joinedPools.includes(pool.id) &&
                              pool.email === currentUserEmail)
                              ? "btn-asic"
                              : "btn-primary"
                          }
                          onClick={() => handleJoinClick(pool.id)}
                          disabled={
                            pool.requiredPlayers === 0 ||
                            (joinedPools.includes(pool.id) &&
                              pool.email === currentUserEmail)
                          }
                        >
                          {pool.requiredPlayers === 0 ||
                          (joinedPools.includes(pool.id) &&
                            pool.email === currentUserEmail)
                            ? "Occupied"
                            : "Join Pool"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
