const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  licensePlate: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  repairHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repair' }]
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
