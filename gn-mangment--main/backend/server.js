import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import equipmentRoutes from "./routes/equipment.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import creditRoutes from "./routes/credit.routes.js";
import realEstateRoutes from "./routes/realestate.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import fuelRoutes from "./routes/fuel.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to GN Management API" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/credits", creditRoutes);
app.use("/api/realestate", realEstateRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
