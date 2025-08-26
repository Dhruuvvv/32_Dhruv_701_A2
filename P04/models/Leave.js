const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema({
  empid: String,
  date: Date,
  reason: String,
  grant: { type: String, default: 'pending' }
});
module.exports = mongoose.model('Leave', leaveSchema);