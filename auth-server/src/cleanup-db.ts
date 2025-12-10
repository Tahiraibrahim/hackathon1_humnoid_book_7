import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function cleanup() {
  const client = await pool.connect();
  try {
    console.log("Dropping existing auth tables...");

    // Drop tables in correct order (respecting foreign keys)
    await client.query("DROP TABLE IF EXISTS verification CASCADE");
    await client.query("DROP TABLE IF EXISTS account CASCADE");
    await client.query("DROP TABLE IF EXISTS session CASCADE");
    await client.query("DROP TABLE IF EXISTS \"user\" CASCADE");

    // Drop any leftover indexes
    await client.query("DROP INDEX IF EXISTS session_userId_idx");
    await client.query("DROP INDEX IF EXISTS account_userId_idx");
    await client.query("DROP INDEX IF EXISTS idx_session_user_id");
    await client.query("DROP INDEX IF EXISTS idx_account_user_id");
    await client.query("DROP INDEX IF EXISTS idx_verification_identifier");

    console.log("✅ Database cleaned. Now run: npm run migrate");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();
