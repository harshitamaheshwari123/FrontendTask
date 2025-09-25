import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { connectToDatabase } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import taskRoutes from "./routes/tasks.js";

const app = express();


connectToDatabase();



app.use(cors());
app.use(express.json());



app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tasks", taskRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
