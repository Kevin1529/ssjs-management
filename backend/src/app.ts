
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import type { ErrorRequestHandler } from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import csrfMiddleware from "./middleware/csrf.middleware";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const allowedOrigins = (
  process.env.FRONTEND_ORIGINS ||
  process.env.FRONTEND_ORIGIN ||
  "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware MUST come before routes
app.use(helmet());

app.use(cors({
  origin: (origin, callback) => {
    // Requests without Origin (e.g. server-to-server health checks) are allowed.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enforce CSRF validation on all state-changing API requests.
app.use(csrfMiddleware);

// Uploaded files are displayed by the frontend on a different origin.
app.use(
  "/uploads",
  (_req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.resolve(process.cwd(), "uploads")),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running"
  });
});

// Return upload validation errors as JSON instead of Express HTML errors.
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const message =
    error instanceof Error ? error.message : "Unexpected server error";

  const statusCode =
    message.includes("File too large") ||
    message.includes("must be") ||
    message.includes("Upload type") ||
    message.includes("file content does not match")
      ? 400
      : 500;

  res.status(statusCode).json({
    success: false,
    message
  });
};

app.use(errorHandler);

export default app;
