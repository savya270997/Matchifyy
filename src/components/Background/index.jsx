// src/components/Background.js
import React from "react";
import "./Background.css";

const Background = ({ children }) => {
  return (
    <div className="background-wrapper">
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="content-wrapper">{children}</div>
    </div>
  );
};

export default Background;
