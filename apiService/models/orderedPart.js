const mongoose = require('mongoose');

const orderedPartSchema = new mongoose.Schema({
  partName: { type: String, required: true }, // Name of the part ordered
  partDescription: { type: String }, // Description of the part
  repair: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repair',
    required: true
  }, // Reference to the Repair
  quantity: { type: Number, required: true }, // Quantity of the part ordered
  unitPrice: { type: Number, required: true }, // Price per unit of the part
  totalCost: { type: Number, required: true } // Total cost for the quantity ordered
});

const OrderedPart = mongoose.model('OrderedPart', orderedPartSchema);

module.exports = OrderedPart;
