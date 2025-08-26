require('dotenv').config();  // Must be at the top

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Admin = require("./models/Admin");
const Employee = require("./models/Employee");
const Leave = require("./models/Leave");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false })
);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register
app.get("/register", (req, res) => {
  res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const existing = await Admin.findOne({ username });
  if (existing) {
    return res.render("register", { error: "Username already exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ username, password: hashed });
  res.redirect("/login");
});

// Login
app.get("/login", (req, res) => res.render("login", { error: null }));
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    req.session.admin = admin._id;
    res.redirect("/dashboard");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

// Dashboard
app.get("/dashboard", async (req, res) => {
  if (!req.session.admin) return res.redirect("/login");
  const employees = await Employee.find();
  const leaves = await Leave.find().sort({ date: -1 });
  res.render("dashboard", { employees, leaves });
});

// Add Employee
app.get("/add", (req, res) => {
  if (!req.session.admin) return res.redirect("/login");
  res.render("add");
});

app.post("/add", async (req, res) => {
  const { name, email } = req.body;
  const empid = "EMP" + Date.now();
  const rawPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  const baseSalary = Number(req.body.baseSalary); // or parseFloat()
  const hra = baseSalary * 0.2;
  const da = baseSalary * 0.1;
  const totalSalary = baseSalary + hra + da;

  const employee = new Employee({
    empid,
    name,
    email,
    password: hashedPassword,
    baseSalary,
    hra,
    da,
    totalSalary,
  });
  await employee.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to ERP",
    text: `Hello ${name},\nYour Employee ID: ${empid}\nPassword: ${rawPassword}`,
  });

  res.redirect("/dashboard");
});

// Edit Employee
app.get("/edit/:id", async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  res.render("edit", { emp });
});

app.post("/edit/:id", async (req, res) => {
  const { name, email } = req.body;
  const baseSalary = Number(req.body.baseSalary); // or parseFloat()
  const hra = baseSalary * 0.2;
  const da = baseSalary * 0.1;
  const totalSalary = baseSalary + hra + da;

  await Employee.findByIdAndUpdate(req.params.id, {
    name,
    email,
    baseSalary,
    hra,
    da,
    totalSalary,
  });
  res.redirect("/dashboard");
});

// Delete
app.get("/delete/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});

// Approve/Reject Leave
app.get("/leave/:id/:action", async (req, res) => {
  const { id, action } = req.params;
  await Leave.findByIdAndUpdate(id, { grant: action });
  res.redirect("/dashboard");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`ERP Admin running on http://localhost:${PORT}`)
);
