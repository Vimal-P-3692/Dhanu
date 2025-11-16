import React, { useState } from "react";
import {
  FaHeartbeat,
  FaBrain,
  FaBone,
  FaChild,
  FaUserMd,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import { LuHospital } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Cardiology",
    color: "linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)",
    icon: <FaHeartbeat style={{ marginRight: 8, color: "#e17055" }} />,
  },
  {
    name: "Neurology",
    color: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    icon: <FaBrain style={{ marginRight: 8, color: "#0984e3" }} />,
  },
  {
    name: "Orthopedics",
    color: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    icon: <FaBone style={{ marginRight: 8, color: "#636e72" }} />,
  },
  {
    name: "Pediatrics",
    color: "linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)",
    icon: <FaChild style={{ marginRight: 8, color: "#fdcb6e" }} />,
  },
  {
    name: "Dermatology",
    color: "linear-gradient(135deg, #fbc2eb 0%, #f9d423 100%)",
    icon: <FaUserMd style={{ marginRight: 8, color: "#00b894" }} />,
  },
];

const hospitals = [
  {
    name: "City Hospital",
    location: "Ashok Nagar, Moolapalayam, Erode - 638002",
  },
  {
    name: "Sunrise Medical Center",
    location: "Gandhipuram, Coimbatore - 641012",
  },
  { name: "Green Valley Clinic", location: "Anna Nagar, Madurai - 625020" },
  { name: "Apollo Hospital", location: "Greams Road, Chennai - 600006" },
  {
    name: "Rainbow Children's Hospital",
    location: "Cantonment, Trichy - 620001",
  },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(search.toLowerCase()) ||
      hospital.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        {/* Search Bar */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 position-relative">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm ps-5"
              placeholder="Search hospitals by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: "2rem",
                background: "#fff",
                border: "none",
              }}
            />
            <FaSearch
              style={{
                position: "absolute",
                top: "50%",
                left: "1.5rem",
                transform: "translateY(-50%)",
                color: "#636e72",
              }}
            />
          </div>
        </div>

        {/* Categories */}
        <h4 className="mb-3">Categories</h4>
        <div className="row g-3 mb-5">
          {categories.map((cat) => (
            <div key={cat.name} className="col-6 col-md-4 col-lg-2">
              <div
                className="category-tile shadow-sm d-flex align-items-center justify-content-center mb-2"
                style={{
                  background: cat.color,
                  borderRadius: "1.2rem",
                  height: "90px",
                  color: "#333",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(0,0,0,0.10)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.06)";
                }}
              >
                {cat.icon} {cat.name}
              </div>
            </div>
          ))}
        </div>

        {/* Hospitals List */}
        <h4 className="mb-3">Hospitals</h4>
        <div className="row g-3">
          {filteredHospitals.length === 0 && (
            <div className="col-12 text-center text-muted">
              No hospitals found.
            </div>
          )}
          {filteredHospitals.map((hospital, idx) => (
            <div key={hospital.name + idx} className="col-12 col-md-6 col-lg-4">
              <div
                className="hospital-card shadow-sm p-3 mb-2 bg-white d-flex align-items-start"
                style={{
                  borderRadius: "1rem",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0,0,0,0.15)";
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(1.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "none";
                }}
                onClick={() =>
                  navigate(`/hospital/${encodeURIComponent(hospital.name)}`)
                }
              >
                <LuHospital
                  size={28}
                  style={{ marginRight: 12, marginTop: 2, color: "#000" }}
                />
                <div>
                  <div className="fw-bold" style={{ color: "#43c6ac" }}>
                    {hospital.name}
                  </div>
                  <div className="text-muted small d-flex align-items-center">
                    <FaMapMarkerAlt
                      style={{ marginRight: 5, color: "#636e72" }}
                    />
                    {hospital.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
