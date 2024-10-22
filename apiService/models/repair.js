const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    required: true
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderedParts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderedPart' }]
});

const Repair = mongoose.model('Repair', repairSchema);

module.exports = Repair;
