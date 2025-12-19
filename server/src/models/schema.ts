import { pgTable, serial, varchar, text, timestamp, integer, decimal } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const transcripts = pgTable('transcripts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  videoFileName: varchar('video_file_name', { length: 255 }),
  videoUrl: text('video_url'),
  audioUrl: text('audio_url'),
  duration: decimal('duration', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 50 }).default('pending'), // pending, processing, complete, failed
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const transcriptEntries = pgTable('transcript_entries', {
  id: serial('id').primaryKey(),
  transcriptId: integer('transcript_id').references(() => transcripts.id),
  speakerNumber: integer('speaker_number').notNull(),
  speaker: varchar('speaker', { length: 100 }),
  text: text('text').notNull(),
  startTime: decimal('start_time', { precision: 10, scale: 2 }).notNull(),
  endTime: decimal('end_time', { precision: 10, scale: 2 }).notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 4 }),
  createdAt: timestamp('created_at').defaultNow()
})

export const speakers = pgTable('speakers', {
  id: serial('id').primaryKey(),
  transcriptId: integer('transcript_id').references(() => transcripts.id),
  speakerNumber: integer('speaker_number').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

export const usageTracking = pgTable('usage_tracking', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  model: varchar('model', { length: 100 }).notNull(),
  operation: varchar('operation', { length: 255 }).notNull(),
  inputTokens: integer('input_tokens').notNull(),
  outputTokens: integer('output_tokens').notNull(),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 6 }).notNull(),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow()
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transcripts: many(transcripts),
  usage: many(usageTracking)
}))

export const transcriptsRelations = relations(transcripts, ({ one, many }) => ({
  user: one(users, {
    fields: [transcripts.userId],
    references: [users.id]
  }),
  entries: many(transcriptEntries),
  speakers: many(speakers)
}))

export const transcriptEntriesRelations = relations(transcriptEntries, ({ one }) => ({
  transcript: one(transcripts, {
    fields: [transcriptEntries.transcriptId],
    references: [transcripts.id]
  })
}))

export const speakersRelations = relations(speakers, ({ one }) => ({
  transcript: one(transcripts, {
    fields: [speakers.transcriptId],
    references: [transcripts.id]
  })
}))

export const usageTrackingRelations = relations(usageTracking, ({ one }) => ({
  user: one(users, {
    fields: [usageTracking.userId],
    references: [users.id]
  })
}))
