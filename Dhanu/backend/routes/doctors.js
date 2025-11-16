const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor by name
router.get('/:name', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ name: req.params.name });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new doctor
router.post('/', async (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    specialty: req.body.specialty,
    timeSlots: req.body.timeSlots
  });

  try {
    const newDoctor = await doctor.save();
    res.status(201).json({
      message: 'Doctor added successfully',
      doctorId: newDoctor.doctorId,
      doctor: newDoctor
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
