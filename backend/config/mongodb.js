import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    mongoose.connection.on("error", (err) => {
      console.error("DB connection error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "test",
    });

    console.log("DB connected to:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;