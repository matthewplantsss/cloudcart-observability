import "dotenv/config";
import cors from "cors";
import express from "express";
import { checkDatabaseConnection } from "./config/database.js";
import { requestMetrics } from "./middleware/requestMetrics.js";
import dashboardRouter from "./routes/dashboard.js";
import productsRouter from "./routes/products.js";
import metricsRegister from "./services/metrics.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  })
);

app.use(express.json());
app.use(requestMetrics);

app.get("/", (req, res) => {
  res.json({
    name: "CloudCart API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      products: "/api/products",
      dashboard: "/api/dashboard",
      metrics: "/metrics",
    },
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const database = await checkDatabaseConnection();

    res.json({
      status: "healthy",
      service: "cloudcart-api",
      database: {
        status: "connected",
        name: database.database_name,
      },
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      service: "cloudcart-api",
      database: {
        status: "disconnected",
      },
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.get("/metrics", async (req, res, next) => {
  try {
    res.set("Content-Type", metricsRegister.contentType);
    res.end(await metricsRegister.metrics());
  } catch (error) {
    next(error);
  }
});

app.use("/api/products", productsRouter);
app.use("/api/dashboard", dashboardRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error("CloudCart API error:", error);

  res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

const server = app.listen(port, "0.0.0.0", async () => {
  console.log(`CloudCart API running at http://localhost:${port}`);

  try {
    const database = await checkDatabaseConnection();

    console.log(
      `Connected to PostgreSQL database: ${database.database_name}`
    );
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
  }
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down CloudCart API.`);

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
