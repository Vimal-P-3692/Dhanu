// Sidebar.jsx
import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaUserPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Offcanvas from "bootstrap/js/dist/offcanvas";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  useEffect(() => {
    // Close mobile sidebar when route changes
    const offcanvas = document.getElementById("sidebarOffcanvas");
    if (offcanvas) {
      const bsOffcanvas = Offcanvas.getInstance(offcanvas);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
        // Remove lingering backdrop if it remains
        const backdrop = document.querySelector(".offcanvas-backdrop");
        if (backdrop) backdrop.remove();
      }
    }
  }, [location]);

  const menuItems = [
    { path: "/", icon: <FaHome className="me-2" />, label: "Home" },
    { path: "/appointments", icon: <FaCalendarAlt className="me-2" />, label: "My Appointments" },
    { path: "/add-doctor", icon: <FaUserPlus className="me-2" />, label: "Add Doctor" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="d-none d-md-block bg-primary text-white shadow border-end"
        style={{ width: "220px", minHeight: "100vh" }}
      >
        <div className="p-3">
          <h4 className="text-white">Menu</h4>
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `nav-link text-white d-flex align-items-center hover-link ${
                      isActive ? "active-link" : ""
                    }`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className="offcanvas offcanvas-start bg-primary text-white"
        tabIndex="-1"
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
        style={{ width: "220px" }}
      >
        <div className="offcanvas-body p-3">
          <h4 className="text-white">Menu</h4>
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `nav-link text-white d-flex align-items-center hover-link ${
                      isActive ? "active-link" : ""
                    }`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
