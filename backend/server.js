import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import cardRouter from './routes/cardRoutes.js'; // Import the router
import { login, createUser } from './controllers/userController.js';
import { authMiddleware, restrictTo } from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config({ path: './.env' });

console.log("Environment Variables Loaded:", {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
});

// App config
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/cards', cardRouter); // Changed from '/api/card' to '/api/cards' (plural is more RESTful)
app.post('/api/login', login);
app.post('/api/users', authMiddleware, restrictTo('admin'), createUser);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});