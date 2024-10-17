const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      }
    },
    role: {
      type: String,
      enum: ['admin', 'mechanic', 'client'],
      required: true,
      default: 'client'
    },
    googleId: { type: String }, // Google OAuth ID
    facebookId: { type: String }, // Facebook OAuth ID
    phoneNumber: {
      type: String,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    }, // User's phone number with validation
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String }
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
