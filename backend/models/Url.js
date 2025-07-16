const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: Date,
  source: String,
  location: String,
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  clicks: [clickSchema],
});

module.exports = mongoose.model('Url', urlSchema);
