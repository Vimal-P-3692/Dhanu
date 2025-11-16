const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
    required: true,
    default: () => 'P' + String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  },
  email: {
    type: String,
    required: true
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
