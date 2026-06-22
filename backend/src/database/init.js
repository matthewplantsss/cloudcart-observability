import "dotenv/config";
import pool from "../config/database.js";

const starterProducts = [
  ["Wireless Headphones", "Electronics", 129.99, 18],
  ["Mechanical Keyboard", "Electronics", 94.99, 7],
  ["Canvas Backpack", "Accessories", 64.99, 24],
  ["Ceramic Coffee Set", "Home", 48.5, 4],
  ["LED Desk Lamp", "Home", 59.99, 12],
  ["Smart Fitness Watch", "Electronics", 179.99, 9],
  ["Minimalist Wallet", "Accessories", 39.99, 28],
  ["Stainless Water Bottle", "Home", 29.99, 3],
];

async function initializeDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        inventory INTEGER NOT NULL DEFAULT 0 CHECK (inventory >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const countResult = await client.query(`
      SELECT COUNT(*)::INTEGER AS count
      FROM products
    `);

    if (countResult.rows[0].count === 0) {
      for (const product of starterProducts) {
        await client.query(
          `
            INSERT INTO products (
              name,
              category,
              price,
              inventory
            )
            VALUES ($1, $2, $3, $4)
          `,
          product
        );
      }

      console.log(`Inserted ${starterProducts.length} starter products.`);
    } else {
      console.log(
        `Products already exist. Current count: ${countResult.rows[0].count}`
      );
    }

    await client.query("COMMIT");
    console.log("CloudCart database initialization completed.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("CloudCart database initialization failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

initializeDatabase();
