require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");
const leaveRoutes = require("./routes/leave");

app.use("/auth", authRoutes);
app.use("/employee", employeeRoutes);
app.use("/leave", leaveRoutes);

// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/erpjwt")
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

// Default Route
app.get("/", (req, res) => {
    res.send("ERP + JWT Server is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
