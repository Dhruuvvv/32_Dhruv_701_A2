const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = require("../modules/Employee");
const router = express.Router();

// Register employee
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, position, salary } = req.body;
        const existing = await Employee.findOne({ email });
        if (existing) return res.status(400).json({ msg: "Employee already exists" });

        const employee = new Employee({ name, email, password, position, salary });
        await employee.save();
        res.json({ msg: "Employee registered successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Login employee
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({ email });
        if (!employee) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
