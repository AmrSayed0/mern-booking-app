import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(cookieParser()); // f) checking user cookie login state
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // b) Checking user cookie login state
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// serve frontend
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

const port = process.env.PORT || 7000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any, promise) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
