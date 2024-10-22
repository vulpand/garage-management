const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String },
  phoneNumber: {
    type: String,
    match: [/^\+?[1-9]\d{1,10}$/, 'Please enter a valid phone number']
  },
  email: { type: String },
  vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    }
  ]
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
