const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  repair: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repair',
    required: true
  }, // Reference to the Repair associated with this invoice
  issueDate: { type: Date, required: true }, // Invoice issue date
  totalAmount: { type: Number, required: true }, // Total amount of the invoice
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], required: true } // Payment status of the invoice
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
