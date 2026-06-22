import express from "express";
import pool from "../config/database.js";
import { databaseQueryCounter } from "../services/metrics.js";

const router = express.Router();

function getStockStatus(inventory) {
  if (inventory <= 4) {
    return "Critical";
  }

  if (inventory <= 8) {
    return "Low Stock";
  }

  return "Healthy";
}

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        category,
        price,
        inventory,
        created_at,
        updated_at
      FROM products
      ORDER BY id
    `);

    databaseQueryCounter.inc({
      operation: "select_products",
      status: "success",
    });

    const products = result.rows.map((product) => ({
      ...product,
      price: Number(product.price),
      status: getStockStatus(product.inventory),
    }));

    res.json(products);
  } catch (error) {
    databaseQueryCounter.inc({
      operation: "select_products",
      status: "error",
    });

    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          category,
          price,
          inventory,
          created_at,
          updated_at
        FROM products
        WHERE id = $1
      `,
      [req.params.id]
    );

    databaseQueryCounter.inc({
      operation: "select_product",
      status: "success",
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const product = result.rows[0];

    res.json({
      ...product,
      price: Number(product.price),
      status: getStockStatus(product.inventory),
    });
  } catch (error) {
    databaseQueryCounter.inc({
      operation: "select_product",
      status: "error",
    });

    next(error);
  }
});

export default router;
