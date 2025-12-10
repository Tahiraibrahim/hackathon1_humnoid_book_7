/**
 * Database initialization and schema management, including Kysely types.
 */
// Ye line add ki hai taake 'ColumnType' ki definition mil jaye
import { ColumnType } from 'kysely'; 

// Kysely mein TIMESTAMP ko use karne ke liye type
type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

// ---- Individual Table Types ----

export interface UserTable {
  id: string;
  name: string | null;
  email: string;
  password_hash: string | null;
  email_verified: boolean;
  image: string | null;
  software_background: string;
  hardware_background: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

// ... (Baaki saari tables: SessionTable, AccountTable, VerificationTable)

export interface SessionTable {
  id: string;
  user_id: string;
  expires_at: Date;
  created_at: Generated<Date>;
}

export interface AccountTable {
  id: string;
  user_id: string;
  account_type: string;
  provider_id: string;
  provider_account_id: string;
  created_at: Generated<Date>;
}

export interface VerificationTable {
  id: string;
  identifier: string;
  value: string;
  expires_at: Date;
  created_at: Generated<Date>;
}


// ---- Master Database Type (Zaroori Export) ----

export interface Database { 
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
}

// ---- Database Initialization Function ----

export async function initializeDatabase(db: any) {
  try {
    // Ye SQL commands aapki tables banaengi (jinko aapne pehle diya tha)
    await db`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        image TEXT,
        software_background TEXT NOT NULL DEFAULT 'Beginner',
        hardware_background TEXT NOT NULL DEFAULT 'None',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    // ... (Baaki CREATE TABLE commands dobara daal dein jinko aapne diya tha)
    await db`
      CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
      )
    `;
    
    await db`
      CREATE TABLE IF NOT EXISTS "account" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        account_type TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
        UNIQUE(provider_id, provider_account_id)
      )
    `;
    
    await db`
      CREATE TABLE IF NOT EXISTS "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await db`CREATE INDEX IF NOT EXISTS idx_session_user_id ON "session"(user_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_account_user_id ON "account"(user_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_verification_identifier ON "verification"(identifier)`;

    console.log('✓ Database schema ready');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}