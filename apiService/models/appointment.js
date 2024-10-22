const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  dateTime: { type: Date, required: true },
  serviceType: {
    type: String,
    enum: ['Maintenance', 'Repair'],
    required: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    required: true
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
