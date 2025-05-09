import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/mongodb.js";
import cardRouter from "./routes/cardRoutes.js";
import clientRouter from "./routes/clients.js";
import taskRouter from "./routes/tasks.js";
import clientAuthRouter from "./routes/clientAuth.js";
import employeeAuthRouter from "./routes/employeeAuth.js";
import gmtopmRouter from "./routes/gmtopmtasks.js";
import qcTaskRoutes from "./routes/QCTaskRoutes.js";
import qcFeedbackRoutes from "./routes/QCFeedbackRoutes.js";
import qcReportRoutes from "./routes/QCReportRoutes.js";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: "./.env" });

// Log environment variables for debugging
console.log("Environment Variables Loaded:", {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  FRONTEND_URL: process.env.FRONTEND_URL,
});

// Validate MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined. Check your .env file.");
  process.exit(1);
}

// App config
const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Updated default to frontend origin
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await connectDB();
    console.log("MongoDB connection successful");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(connectWithRetry, 5000);
  }
};
connectWithRetry();

// Routes
app.use("/api/cards", cardRouter);
app.use("/client", clientRouter);
app.use("/task", taskRouter);
app.use("/auth/client", clientAuthRouter);
app.use("/auth/employee", employeeAuthRouter);
app.use("/api/gmtopmtask", gmtopmRouter);
app.use("/api/qc-tasks", qcTaskRoutes);
app.use("/api/qc-feedback", qcFeedbackRoutes);
app.use("/api/qc-reports", qcReportRoutes);

// Root route for API testing
app.get("/", (req, res) => {
  res.send("API working");
});

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    dbState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date(),
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});