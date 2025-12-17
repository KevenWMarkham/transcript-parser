// Database connection setup
// Uncomment and configure based on your database choice:

// For SQLite with better-sqlite3:
// import Database from 'better-sqlite3'
// import { drizzle } from 'drizzle-orm/better-sqlite3'
// import * as schema from './schema'
//
// const sqlite = new Database('sqlite.db')
// export const db = drizzle(sqlite, { schema })

// For PostgreSQL:
// import { drizzle } from 'drizzle-orm/node-postgres'
// import { Pool } from 'pg'
// import * as schema from './schema'
//
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// })
// export const db = drizzle(pool, { schema })

export {}
