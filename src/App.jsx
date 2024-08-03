// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import CreatePool from "./components/CreatePool";
import MyActivities from "./components/MyActivity";
import PoolDetailView from "./components/PoolDetailView";
import JoinPool from "./components/JoinPool";
import MyProfile from "./components/MyProfile";
import { PoolProvider } from "./context/PoolContext";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import Background from "./components/Background";
import AboutUs from "./components/AboutUs";

const App = () => {
  return (
    <AuthProvider>
      <PoolProvider>
        <Router>
          <Background>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-pool" element={<CreatePool />} />
              <Route path="/my-activities" element={<MyActivities />} />
              <Route path="/pool-detail-view" element={<PoolDetailView />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/join-pool/:poolId" element={<JoinPool />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route
                path="/pool-detail-view/:poolId"
                element={<PoolDetailView />}
              />
              <Route path="/about-us" element={<AboutUs />} />
            </Routes>
          </Background>
        </Router>
      </PoolProvider>
    </AuthProvider>
  );
};

export default App;
