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

const allowedOrigins = [
  "http://localhost:5173",
  "https://mesmerizer-admin-2025.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicitly allow OPTIONS preflight requests (important for some browsers)
app.options("*", cors());
app.use(cookieParser());

// Routes
mountRoutes(app);

export default app;
