const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  }, // Reference to the Client making the appointment
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true }, // Reference to the Car for the appointment
  dateTime: { type: Date, required: true }, // Date and time of the appointment
  serviceType: {
    type: String,
    enum: ['Maintenance', 'Repair'],
    required: true
  }, // Type of service
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    required: true
  } // Status of the appointment
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
