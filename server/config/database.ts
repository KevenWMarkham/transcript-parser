import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema.js'

const pool = new Pool({
  host: 'localhost',
  port: 5435,
  database: 'transcript_parser',
  user: 'postgres',
  password: 'postgres',
})

export const db = drizzle(pool, { schema })

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack)
  } else {
    console.log('✅ Database connected successfully')
    release()
  }
})
