// Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaUserMd, FaCalendarCheck, FaHome, FaUserPlus } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm d-lg-none">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" style={{ color: "#43c6ac" }}>
          <FaUserMd className="me-2" />
          Hospital App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <FaHome className="me-2" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/appointments">
                <FaCalendarCheck className="me-2" />
                Appointments
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-doctor">
                <FaUserPlus className="me-2" />
                Add Doctor
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
