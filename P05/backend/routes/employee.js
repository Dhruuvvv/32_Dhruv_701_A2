const express = require("express");
const jwt = require("jsonwebtoken");
const Employee = require("../modules/Employee");
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

// Get employee profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findById(req.userId).select("-password");
        res.json(employee);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
