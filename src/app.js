import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from 'cookie-parser';
import mountRoutes from "./routes/index.js";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Routes
mountRoutes(app);

export default app;
