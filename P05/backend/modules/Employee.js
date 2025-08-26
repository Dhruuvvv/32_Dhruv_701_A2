const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    position: String,
    salary: Number
});

// Hash password before save
EmployeeSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("Employee", EmployeeSchema);
