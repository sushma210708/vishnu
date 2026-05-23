const mongoose = require('mongoose');

const alertHistorySchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'CMD', 'POWER'
  value: { type: Number, required: true },
  limit: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AlertHistory', alertHistorySchema);
