import mongoose from "mongoose";

export async function connectToDatabase() {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task_app";

  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}
