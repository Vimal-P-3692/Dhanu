import React, { useEffect, useState } from "react";
import {
  FaUserMd,
  FaEnvelope,
  FaHospitalAlt,
  FaCalendarAlt,
  FaDownload,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa";
import jsPDF from "jspdf";
import api from '../services/api';

const Appointments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.getAppointments();
        setBookings(response.data.reverse());
        setLoading(false);
      } catch (err) {
        setError("Failed to load appointments");
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Function to download PDF
  const handleDownloadPDF = (booking) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Appointment E-Card", 14, 20);

    // Table headers
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const headers = ["Field", "Details"];
    let startY = 30;
    doc.text(headers[0], 14, startY);
    doc.text(headers[1], 90, startY);

    // Draw header line
    doc.line(14, startY + 2, 196, startY + 2);

    // Table body
    doc.setFont("helvetica", "normal");
    const rowSpacing = 10;
    const body = [
      ["Doctor", booking.doctor],
      ["Hospital", booking.hospital],
      ["Slot", booking.slot],
      ["Email", booking.email],
      ["Date", booking.date],
    ];

    body.forEach((row, index) => {
      const y = startY + (index + 1) * rowSpacing;
      doc.text(row[0], 14, y);
      doc.text(row[1], 90, y);
    });

    // Draw table borders (optional)
    const tableHeight = rowSpacing * body.length;
    doc.rect(12, startY - 6, 184, tableHeight + 6); // outer border

    // Save PDF
    doc.save("appointment-ecard.pdf");
  };

  // Filter bookings based on search
  const filteredBookings = bookings.filter(booking => 
    booking.doctor.toLowerCase().includes(search.toLowerCase()) ||
    booking.patientId.toLowerCase().includes(search.toLowerCase()) ||
    booking.email.toLowerCase().includes(search.toLowerCase())
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
        <h2 className="mb-4" style={{ color: "#43c6ac" }}>
          My Appointments
        </h2>

        {/* Search Bar */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 position-relative">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm ps-5"
              placeholder="Search by doctor name, patient ID or email..."
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

        {filteredBookings.length === 0 && (
          <div className="text-center text-muted">No bookings found.</div>
        )}

        <div className="row g-4">
          {filteredBookings.map((booking, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-4">
              <div
                className="card shadow position-relative"
                style={{
                  maxWidth: 420,
                  borderRadius: "1.5rem",
                  background:
                    "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
                  border: "2px solid #43c6ac",
                  boxShadow: "0 8px 32px rgba(67,198,172,0.10)",
                }}
              >
                <div className="card-body text-center py-4 px-4">
                  <FaCheckCircle
                    size={32}
                    style={{ color: "#43c6ac", marginBottom: 8 }}
                  />
                  <h5
                    className="card-title mb-3"
                    style={{
                      color: "#43c6ac",
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    Appointment Confirmed
                  </h5>

                  <div className="mb-2">
                    <FaUserMd style={{ color: "#0984e3", marginRight: 6 }} />{" "}
                    <b>{booking.doctor}</b>
                  </div>
                  <div className="mb-2">
                    <FaHospitalAlt
                      style={{ color: "#636e72", marginRight: 6 }}
                    />{" "}
                    <b>{booking.hospital}</b>
                  </div>
                  <div className="mb-2">
                    <FaCalendarAlt
                      style={{ color: "#fdcb6e", marginRight: 6 }}
                    />{" "}
                    <b>{booking.slot}</b>
                  </div>
                  <div className="mb-2">
                    <FaEnvelope style={{ color: "#00b894", marginRight: 6 }} />{" "}
                    <b>{booking.email}</b>
                  </div>
                  <div className="mb-2 text-muted small">{booking.date}</div>

                  <button
                    className="btn btn-outline-primary mt-3"
                    style={{ borderRadius: "2rem" }}
                    onClick={() => handleDownloadPDF(booking)}
                  >
                    <FaDownload style={{ marginRight: 6 }} /> Download E-Card
                    (PDF)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
