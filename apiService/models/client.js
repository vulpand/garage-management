const mongoose = require('mongoose');
const User = require('./user'); // Reference to the User model

const clientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  phoneNumber: { type: String }, // Client's phone number
  address: { type: String }, // Client's address
  repairHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repair' }] // Reference to repairs done
});

// Create Client model as a discriminator of User
const Client = User.discriminator('Client', clientSchema);

module.exports = Client;
