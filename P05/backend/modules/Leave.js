const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    date: String,
    reason: String,
    grant: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Leave", LeaveSchema);
