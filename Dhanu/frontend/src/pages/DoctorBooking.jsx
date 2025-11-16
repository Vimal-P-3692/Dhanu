import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaUserMd,
  FaClock,
  FaDownload,
  FaCheckCircle,
  FaEnvelope,
  FaHospitalAlt,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";
import emailjs from "emailjs-com";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from '../services/api';

// Example doctor timing data
const doctorTimings = {
  "Dr. Priya Kumar": [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
  ],
  "Dr. Arjun Rao": ["10:00 AM", "11:30 AM", "01:00 PM", "04:00 PM"],
  "Dr. Meena Iyer": ["09:30 AM", "12:00 PM", "03:30 PM"],
  "Dr. Suresh Babu": ["08:30 AM", "10:30 AM", "12:30 PM", "05:00 PM"],
  "Dr. Kavitha Reddy": ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"],
  "Dr. Ramesh Kumar": ["10:00 AM", "12:00 PM", "02:00 PM"],
  "Dr. Anitha S": ["09:00 AM", "11:30 AM", "01:30 PM"],
  "Dr. Shalini Menon": ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
  "Dr. Vivek Anand": ["09:30 AM", "11:30 AM", "01:30 PM", "03:30 PM"],
  "Dr. Saira Banu": ["10:00 AM", "12:30 PM", "03:00 PM"],
  "Dr. Karthik Raj": ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"],
  "Dr. Deepa Nair": ["10:30 AM", "12:30 PM", "02:30 PM"],
};

// Simulated booking counts for each slot (for demo)
const bookingCounts = {
  "09:00 AM": 5,
  "10:00 AM": 21,
  "11:00 AM": 8,
  "02:00 PM": 19,
  "03:00 PM": 22,
  "11:30 AM": 3,
  "01:00 PM": 15,
  "04:00 PM": 7,
  "12:00 PM": 18,
  "03:30 PM": 2,
  "08:30 AM": 1,
  "10:30 AM": 20,
  "12:30 PM": 21,
  "05:00 PM": 0,
  "01:30 PM": 4,
  "09:30 AM": 0,
  "02:30 PM": 0,
};

const DoctorBooking = () => {
  const { name, doctorName } = useParams();
  const hospitalName = "City Hospital";
  const doctor = decodeURIComponent(doctorName);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [email, setEmail] = useState("");
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await api.getDoctorByName(doctor);
        setDoctorDetails(response.data);
      } catch (error) {
        setError('Failed to fetch doctor details');
      }
    };
    fetchDoctorDetails();
  }, [doctor]);

  // Replace the static slots with dynamic slots from doctor details
  const slots = doctorDetails?.timeSlots?.map(slot => slot.time) || [];

  const handleBook = async () => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await api.createAppointment({
        doctor,
        hospital: hospitalName,
        email,
        slot: selectedSlot,
        date: new Date()
      });

      setPatientId(response.data.patientId);
      
      // EmailJS integration with patient ID
      await emailjs.send(
        "service_77sii9i",
        "template_95gbaxt",
        {
          to_email: email,
          from_name: "Dhanu Hospital Booking",
          message: `Patient ID: ${response.data.patientId}\nDoctor: ${doctor}\nHospital: ${hospitalName}\nSlot: ${selectedSlot}`,
        },
        "0XT3EITyVp9iv4EPf"
      );

      setBooked(true);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to book appointment.");
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
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
      ["Doctor", doctor],
      ["Hospital", hospitalName],
      ["Slot", selectedSlot],
      ["Email", email],
      ["Date", new Date().toLocaleString()],
    ];

    body.forEach((row, index) => {
      const y = startY + (index + 1) * rowSpacing;
      doc.text(row[0], 14, y);
      doc.text(row[1], 90, y);
    });

    // Draw outer table border
    const tableHeight = rowSpacing * body.length;
    doc.rect(12, startY - 6, 184, tableHeight + 6);

    // Save PDF
    doc.save("appointment-ecard.pdf");
  };

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
          <FaUserMd style={{ marginRight: 10 }} /> {doctor}
        </h2>
        <h5 className="mb-3" style={{ color: "#636e72" }}>
          {hospitalName}
        </h5>
        <h4 className="mb-3">Available Slots</h4>
        <div className="row g-3 mb-4">
          {slots.length === 0 && (
            <div className="col-12 text-center text-muted">
              No slots available.
            </div>
          )}
          {slots.map((slot, idx) => {
            const timeSlot = doctorDetails.timeSlots.find(ts => ts.time === slot);
            const isFull = timeSlot.currentBookings >= timeSlot.maxBookings;
            return (
              <div
                key={slot + idx}
                className={`shadow-sm p-3 mb-2 bg-white d-flex align-items-center justify-content-center ${
                  selectedSlot === slot ? "border border-success" : ""
                }`}
                style={{
                  borderRadius: "1rem",
                  transition: "box-shadow 0.2s, transform 0.2s, border 0.2s",
                  cursor: isFull ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  color: isFull
                    ? "#aaa"
                    : selectedSlot === slot
                    ? "#43c6ac"
                    : "#333",
                  background: isFull ? "#f1f2f6" : "#fff",
                  boxShadow:
                    selectedSlot === slot && !isFull
                      ? "0 8px 32px rgba(67,198,172,0.15)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                  opacity: isFull ? 0.6 : 1,
                  pointerEvents: isFull ? "none" : "auto",
                }}
                onClick={() => !isFull && setSelectedSlot(slot)}
                onMouseOver={(e) => {
                  if (!isFull) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(67,198,172,0.15)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isFull) {
                    if (selectedSlot !== slot) {
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.06)";
                    }
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                <FaClock
                  style={{ marginRight: 8, color: isFull ? "#aaa" : "#43c6ac" }}
                />{" "}
                {slot}
                {isFull && <span className="ms-2 small">(Full)</span>}
              </div>
            );
          })}
        </div>
        {selectedSlot && !booked && (
          <div className="text-center mb-3">
            <input
              type="email"
              className="form-control mb-2 d-inline-block"
              style={{
                maxWidth: 320,
                borderRadius: "2rem",
                display: "inline-block",
              }}
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <button
              className="btn btn-success mt-1"
              style={{ borderRadius: "2rem", minWidth: 120 }}
              onClick={handleBook}
              disabled={loading}
            >
              {loading ? "Sending..." : "Book"}
            </button>
            {error && <div className="text-danger mt-2 small">{error}</div>}
          </div>
        )}
        {booked && (
          <div
            className="card mx-auto mt-4 shadow position-relative"
            style={{
              maxWidth: 420,
              borderRadius: "1.5rem",
              background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
              border: "2px solid #43c6ac",
              boxShadow: "0 8px 32px rgba(67,198,172,0.10)",
            }}
          >
            <div className="card-body text-center py-4 px-4">
              <FaCheckCircle
                size={40}
                style={{ color: "#43c6ac", marginBottom: 10 }}
              />
              <h5
                className="card-title mb-3"
                style={{ color: "#43c6ac", fontWeight: 700, letterSpacing: 1 }}
              >
                Appointment Confirmed
              </h5>
              <div className="mb-2">
                <FaUserMd style={{ color: "#0984e3", marginRight: 6 }} />{" "}
                <b>{doctor}</b>
              </div>
              <div className="mb-2">
                <FaHospitalAlt style={{ color: "#636e72", marginRight: 6 }} />{" "}
                <b>{hospitalName}</b>
              </div>
              <div className="mb-2">
                <FaCalendarAlt style={{ color: "#fdcb6e", marginRight: 6 }} />{" "}
                <b>{selectedSlot}</b>
              </div>
              <div className="mb-2">
                <FaEnvelope style={{ color: "#00b894", marginRight: 6 }} />{" "}
                <b>{email}</b>
              </div>
              <div className="mb-2">
                <FaIdCard style={{ color: "#e17055", marginRight: 6 }} />
                <b>Patient ID: {patientId}</b>
              </div>
              <div className="mb-2 text-muted small">
                {new Date().toLocaleString()}
              </div>
              <button
                className="btn btn-outline-primary mt-3"
                style={{ borderRadius: "2rem" }}
                onClick={handleDownloadPDF}
              >
                <FaDownload style={{ marginRight: 6 }} /> Download E-Card (PDF)
              </button>
              <div
                className="alert alert-success mt-3"
                style={{ borderRadius: "1rem" }}
              >
                Your appointment e-card has been sent to <b>{email}</b>!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default DoctorBooking;
