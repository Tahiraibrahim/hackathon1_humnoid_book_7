import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Database pool for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Better Auth configuration - this is the auth instance the CLI needs
export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      software_background: {
        type: "string",
        required: false,
        defaultValue: "Beginner",
      },
      hardware_background: {
        type: "string",
        required: false,
        defaultValue: "None",
      },
    },
  },
});

// Default export for CLI compatibility
export default auth;
