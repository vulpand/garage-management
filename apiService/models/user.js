const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's name
  email: { type: String, required: true, unique: true }, // User's email address (unique)
  password: { type: String, required: true }, // User's password (hashed)
  role: { type: String, enum: ['admin', 'mechanic', 'client'], required: true }, // User's role
  googleId: { type: String },
  facebookId: { type: String },
  phoneNumber: { type: String }, // User's phone number
  address: { type: String } // User's address
});

const User = mongoose.model('User', userSchema);

module.exports = User;
