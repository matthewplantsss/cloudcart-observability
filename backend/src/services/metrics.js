import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: "cloudcart_",
  labels: {
    service: "cloudcart-api",
  },
});

export const httpRequestCounter = new client.Counter({
  name: "cloudcart_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const httpRequestDuration = new client.Histogram({
  name: "cloudcart_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

export const httpErrorCounter = new client.Counter({
  name: "cloudcart_http_errors_total",
  help: "Total number of HTTP errors",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const databaseQueryCounter = new client.Counter({
  name: "cloudcart_database_queries_total",
  help: "Total number of PostgreSQL queries",
  labelNames: ["operation", "status"],
  registers: [register],
});

export const inventoryGauge = new client.Gauge({
  name: "cloudcart_inventory_units",
  help: "Current total inventory units",
  registers: [register],
});

export const lowStockGauge = new client.Gauge({
  name: "cloudcart_low_stock_products",
  help: "Current number of low-stock products",
  registers: [register],
});

export default register;
