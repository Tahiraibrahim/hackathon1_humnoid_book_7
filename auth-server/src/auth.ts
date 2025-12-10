// File: auth-server/src/lib/auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      software_background: { type: "string", required: false, defaultValue: "Beginner" },
      hardware_background: { type: "string", required: false, defaultValue: "None" },
    },
  },
});