const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
