import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// LLM Usage tracking table
export const llmUsage = sqliteTable('llm_usage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  model: text('model').notNull(), // e.g., 'gemini-2.5-flash'
  inputTokens: integer('input_tokens').notNull(),
  outputTokens: integer('output_tokens').notNull(),
  totalTokens: integer('total_tokens').notNull(),
  estimatedCost: real('estimated_cost').notNull(), // USD cost estimate
  operation: text('operation').notNull(), // e.g., 'transcription', 'translation'
  metadata: text('metadata'), // JSON metadata (e.g., audio duration, file size)
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})
