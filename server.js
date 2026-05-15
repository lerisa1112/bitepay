const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// ===============================
// LOAD ENV
// ===============================
dotenv.config();

// ===============================
// CONNECT DATABASE
// ===============================
connectDB();

// ===============================
// INIT APP + SERVER
// ===============================
const app = express();
const server = http.createServer(app);

// ===============================
// SOCKET.IO SETUP 🔥
// ===============================
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // register user (userId -> socketId)
  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
  });

  // disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

// make available in controllers
app.set("io", io);
app.set("userSocketMap", userSocketMap);

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/pickup", require("./routes/pickupRoutes"));
app.use("/api/admin/analytics", require("./routes/adminAnalyticsRoutes"));
app.use("/api/admin-dashboard", require("./routes/adminDashboardRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));

app.use("/api/vendor-dashboard", require("./routes/vendorDashboardRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 API Running Successfully",
    status: "OK",
  });
});

// ===============================
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong on server",
  });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});