import "./Header.css";
import { useNavigate } from "react-router-dom";
import logo from "../images/Cricket_logo.png";
import React, { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [prof, setProf] = useState({
    name: "",
  });

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (currentUser) {
      setProf({
        name: currentUser.name || "",
      });
    }
  }, []);

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate("/my-profile");
  };

  const handleAboutUsClick = () => {
    navigate("/about-us");
  };

  const handleTitleClick = () => {
    navigate("/dashboard");
  };

  const handleMyActivitiesClick = (e) => {
    e.preventDefault();
    navigate("/my-activities");
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1
          className="app-title"
          onClick={handleTitleClick}
          style={{ cursor: "pointer" }}
        >
          <img className="logo" src={logo} alt="logo" />
          MatchiFY!
        </h1>
      </div>
      <div className="header-center">
        <div className="text-anime">
          <h2>Hello, {prof.name}!</h2>
        </div>
      </div>
      <nav className="header-right">
        <a href onClick={handleMyActivitiesClick}>
          My Activities
        </a>
        <a href onClick={handleAboutUsClick}>
          About us
        </a>
        <div className="user-menu" onClick={toggleDropdown}>
          <i className="fa fa-user-circle user-icon"></i>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <a href onClick={handleProfileClick}>
                My Profile
              </a>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
