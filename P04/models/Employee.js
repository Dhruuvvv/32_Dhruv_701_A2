const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  empid: String,
  name: String,
  email: String,
  password: String,
  baseSalary: Number,
  hra: Number,
  da: Number,
  totalSalary: Number
});
module.exports = mongoose.model('Employee', employeeSchema);
