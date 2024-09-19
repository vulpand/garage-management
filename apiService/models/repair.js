const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true }, // Reference to the Car being repaired
  startDate: { type: Date, required: true }, // Repair start date
  endDate: { type: Date }, // Repair end date (optional)
  description: { type: String, required: true }, // Description of the repair work
  cost: { type: Number, required: true }, // Cost of the repair
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    required: true
  }, // Status of the repair
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, // Reference to the mechanic
  orderedParts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderedPart' }] // References to ordered parts for this repair
});

const Repair = mongoose.model('Repair', repairSchema);

module.exports = Repair;
