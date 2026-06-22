import express from "express";
import pool from "../config/database.js";
import {
  databaseQueryCounter,
  inventoryGauge,
  lowStockGauge,
} from "../services/metrics.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::INTEGER AS total_products,
        COALESCE(SUM(inventory), 0)::INTEGER AS total_inventory,
        COUNT(*) FILTER (
          WHERE inventory <= 8
        )::INTEGER AS low_stock_products
      FROM products
    `);

    databaseQueryCounter.inc({
      operation: "dashboard_summary",
      status: "success",
    });

    const summary = result.rows[0];

    inventoryGauge.set(summary.total_inventory);
    lowStockGauge.set(summary.low_stock_products);

    res.json({
      totalProducts: summary.total_products,
      totalInventory: summary.total_inventory,
      lowStockProducts: summary.low_stock_products,
      apiStatus: "Online",
    });
  } catch (error) {
    databaseQueryCounter.inc({
      operation: "dashboard_summary",
      status: "error",
    });

    next(error);
  }
});

export default router;
