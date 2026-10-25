import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "BookLeaf API is running" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`BookLeaf API running on port ${port}`));
  } catch (error) {
    console.error("Server could not start:", error.message);
    process.exit(1);
  }
};
startServer();
