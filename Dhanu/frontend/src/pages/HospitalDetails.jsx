import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaSearch, FaStethoscope } from "react-icons/fa";
import api from '../services/api';

// Example doctor data for a single hospital
const doctorsData = [
  { name: "Dr. Priya Kumar", specialty: "Cardiologist" },
  { name: "Dr. Arjun Rao", specialty: "Neurologist" },
  { name: "Dr. Meena Iyer", specialty: "Pediatrician" },
  { name: "Dr. Thara", specialty: "Dermatologist"},
  { name: "Dr. Marin Kitagawa", specialty: "Gynacologist" }
];

const HospitalDetails = () => {
  const navigate = useNavigate();
  const hospitalName = "City Hospital"; // Fixed hospital name
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.getDoctors();
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load doctors");
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors by search text
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        {/* Hospital Name */}
        <h2 className="mb-4 d-flex align-items-center" style={{ color: "#43c6ac" }}>
          <FaStethoscope className="me-2" /> {hospitalName}
        </h2>

        {/* Search Bar */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 position-relative">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm ps-5"
              placeholder="Search doctors by name or specialty..."
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

        {/* Doctors List */}
        <h4 className="mb-3">Doctors Available</h4>
        <div className="row g-3">
          {filteredDoctors.length === 0 && (
            <div className="col-12 text-center text-muted">No doctors found.</div>
          )}

          {filteredDoctors.map((doc, idx) => (
            <div key={doc.name + idx} className="col-12 col-md-6 col-lg-4">
              <div
                className="shadow-sm p-3 bg-white d-flex align-items-center"
                style={{
                  borderRadius: "1rem",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(67,198,172,0.15)";
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(1.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "none";
                }}
                onClick={() =>
                  navigate(
                    `/doctor/${encodeURIComponent(doc.name)}`
                  )
                }
              >
                <FaUserMd
                  size={28}
                  style={{ color: "#43c6ac", marginRight: 12 }}
                />
                <div>
                  <div className="fw-bold" style={{ color: "#0984e3" }}>
                    {doc.name}
                  </div>
                  <div className="text-muted small">{doc.specialty}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalDetails;
