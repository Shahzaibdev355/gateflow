import "dotenv/config";

import express from "express";
import helmet from "helmet";
import cors from "cors";

import proxyRoutes from "./routes/proxyRoutes.js";

import { authenticate } from "./middleware/authenticate";
import { rateLimit } from "./middleware/rateLimiter";
import { requestLogger } from "./middleware/requestLogger";

const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

// 3. HTTP request logging
app.use(requestLogger);

// 4. Public health endpoint
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API Gateway is healthy",
  });
});

// 5. Protected API routes
app.use("/api", authenticate, rateLimit, proxyRoutes);

// 6. Start server
const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

// Graceful shutdown
function shutdown(signal: string): void {
  console.log(`${signal} received. Shutting down...`);

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Shutdown timeout exceeded.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
