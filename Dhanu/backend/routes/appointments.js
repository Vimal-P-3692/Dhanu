const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    // Find or create patient
    let patient = await Patient.findOne({ email: req.body.email });
    if (!patient) {
      patient = new Patient({ email: req.body.email });
      await patient.save();
    }

    // Check slot availability
    const doctor = await Doctor.findOne({ name: req.body.doctor });
    const timeSlot = doctor.timeSlots.find(slot => slot.time === req.body.slot);
    
    if (!timeSlot) {
      return res.status(400).json({ message: 'Invalid time slot' });
    }

    if (timeSlot.currentBookings >= timeSlot.maxBookings) {
      return res.status(400).json({ message: 'Slot is full' });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId: patient.patientId,
      doctor: req.body.doctor,
      hospital: req.body.hospital,
      email: req.body.email,
      slot: req.body.slot,
      date: req.body.date
    });

    // Save appointment
    const newAppointment = await appointment.save();

    // Update doctor's slot booking count
    timeSlot.currentBookings += 1;
    await doctor.save();

    // Add appointment to patient's appointments
    patient.appointments = patient.appointments || [];
    patient.appointments.push(newAppointment._id);
    await patient.save();

    res.status(201).json({
      ...newAppointment.toObject(),
      patientId: patient.patientId
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
