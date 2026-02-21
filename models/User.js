const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  phone: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  pincode: {
    type: String,
    trim: true,
    required: true
  },
  address1: {
    type: String,
    trim: true,
    required: true
  },
  address2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true,
    required: true
  },
  state: {
    type: String,
    trim: true,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    default: ""
  },

  // 🔥 Multiple addresses
  addresses: {
    type: [addressSchema],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);