const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    unique: true,
    required: true,
    default: () => 'DOC' + Math.random().toString(36).substr(2, 6).toUpperCase()
  },
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  hospital: {
    type: String,
    default: 'City Hospital'
  },
  timeSlots: [{
    time: String,
    maxBookings: {
      type: Number,
      default: 20
    },
    currentBookings: {
      type: Number,
      default: 0
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
