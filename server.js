const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect Database
connectDB();

// Init app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use(
  "/api/notifications",
  require("./routes/notificationRoutes")
);
app.use("/api/pickup", require("./routes/pickupRoutes"));
app.use("/api/admin/analytics", require("./routes/adminAnalyticsRoutes"));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 API Running Successfully",
    status: "OK",
  });
});

app.use(
  "/api/admin-dashboard",
  require("./routes/adminDashboardRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminUserRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminVendorRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminOrderRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminWalletRoutes")
);

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong on server",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});