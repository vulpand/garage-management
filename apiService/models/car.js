const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  licensePlate: { type: String, required: true, unique: true }, // Car's license plate number
  brand: { type: String, required: true }, // Car's brand
  model: { type: String, required: true }, // Car's model
  year: { type: Number, required: true }, // Car's manufacturing year
  mileage: { type: Number, required: true }, // Car's mileage
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  }, // Reference to the Client who owns the car
  repairHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repair' }] // Reference to repairs done on this car
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
