const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(async (client) => {
    console.log("✅ PostgreSQL Connected");
    try {
      await client.query(`
        ALTER TABLE contact_info 
        ADD COLUMN IF NOT EXISTS profile_photo TEXT;
      `);
      console.log("✅ Database migration: profile_photo column verified/added");
    } catch (err) {
      console.error("❌ Database migration failed:", err);
    } finally {
      client.release();
    }
  })
  .catch((err) => console.log("❌ Database Connection Error:", err));

module.exports = pool;