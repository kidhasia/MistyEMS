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

// Load environment variables
dotenv.config({ path: "./.env" });

// Log environment variables for debugging
console.log("Environment Variables Loaded:", {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
});

// Validate MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined. Check your .env file.");
  process.exit(1);
}

// App config
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Included for compatibility with second file
app.use("/uploads", express.static("uploads")); // Serve static files

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/cards", cardRouter); // RESTful route for cards
app.use("/client", clientRouter);
app.use("/task", taskRouter);
app.use("/auth/client", clientAuthRouter);
app.use("/auth/employee", employeeAuthRouter);
app.use("/api/gmtopmtask", gmtopmRouter);

// Root route for API testing
app.get("/", (req, res) => {
  res.send("API working");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});