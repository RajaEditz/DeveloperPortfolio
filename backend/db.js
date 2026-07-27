const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: (process.env.DATABASE_URL || isProduction) ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(async (client) => {
    console.log("✅ PostgreSQL Connected");
    try {
      // Create tables if they do not exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          technologies VARCHAR(255),
          github_url TEXT,
          live_url TEXT,
          image_url TEXT,
          featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS certificates (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          issuer VARCHAR(255),
          issue_date DATE,
          credential_url TEXT,
          image_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS publications (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          authors TEXT,
          journal VARCHAR(255),
          publication_date DATE,
          doi TEXT,
          citation TEXT,
          abstract TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS experiences (
          id SERIAL PRIMARY KEY,
          role VARCHAR(255) NOT NULL,
          company VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          start_date DATE,
          end_date DATE,
          currently_working BOOLEAN DEFAULT FALSE,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS skills (
          id SERIAL PRIMARY KEY,
          category VARCHAR(100),
          skill_name VARCHAR(100) NOT NULL,
          proficiency INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS contact_info (
          id SERIAL PRIMARY KEY,
          phone VARCHAR(50),
          email VARCHAR(150),
          linkedin TEXT,
          github TEXT,
          portfolio TEXT,
          resume_url TEXT,
          location VARCHAR(255),
          profile_photo TEXT
        );
        
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          email VARCHAR(150) NOT NULL,
          subject VARCHAR(255),
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("✅ Database schema verified/initialized successfully");

      // Verify/migrate profile_photo column just in case contact_info existed without it
      await client.query(`
        ALTER TABLE contact_info 
        ADD COLUMN IF NOT EXISTS profile_photo TEXT;
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS image_urls TEXT[];
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS features TEXT[];
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
        ALTER TABLE certificates 
        ADD COLUMN IF NOT EXISTS image_urls TEXT[];
      `);

      // Seed default admin account if none exists
      const adminCount = await client.query("SELECT COUNT(*) FROM admins");
      if (parseInt(adminCount.rows[0].count) === 0) {
        const username = process.env.ADMIN_USERNAME || "admin@example.com";
        const plainPassword = process.env.ADMIN_PASSWORD || "admin123";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        await client.query(
          "INSERT INTO admins (name, email, password) VALUES ($1, $2, $3)",
          ["Administrator", username, hashedPassword]
        );
        console.log(`👤 Seeded default admin account: ${username}`);
      }
    } catch (err) {
      console.error("❌ Database migration/seed failed:", err);
    } finally {
      client.release();
    }
  })
  .catch((err) => console.log("❌ Database Connection Error:", err));

module.exports = pool;