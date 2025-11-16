import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import HospitalDetails from "./pages/HospitalDetails";
import DoctorBooking from "./pages/DoctorBooking";
import Appointments from "./pages/Appointments";
import AddDoctor from "./pages/AddDoctor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HospitalDetails />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="doctor/:doctorName" element={<DoctorBooking />} />
          <Route path="add-doctor" element={<AddDoctor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
