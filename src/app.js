console.log("app");

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import mountRoutes from "./routes/index.js";

const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mesmerizer-admin-2025.vercel.app",
      "https://admin.mesmerizernsec.club",
      "https://www.mesmerizernsec.club",
    ], // Explicitly set frontend URL
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // Allow JSON payloads
app.use(cookieParser());

// Routes
mountRoutes(app);

export default app;
