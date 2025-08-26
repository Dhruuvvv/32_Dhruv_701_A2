const express = require("express");
const jwt = require("jsonwebtoken");
const Leave = require("../modules/Leave");
const router = express.Router();

// Middleware for JWT auth
function authMiddleware(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ msg: "Invalid token" });
        req.userId = decoded.id;
        next();
    });
}

// Apply leave
router.post("/apply", authMiddleware, async (req, res) => {
    try {
        const { date, reason } = req.body;
        const leave = new Leave({ employeeId: req.userId, date, reason });
        await leave.save();
        res.json({ msg: "Leave applied successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// List leaves
router.get("/list", authMiddleware, async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.userId });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
