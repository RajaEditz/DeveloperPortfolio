const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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