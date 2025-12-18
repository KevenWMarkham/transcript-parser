import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  bigint,
  decimal,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Transcripts table
export const transcripts = pgTable('transcripts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }),
  description: text('description'),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  duration: decimal('duration', { precision: 10, scale: 2 }),
  videoFormat: varchar('video_format', { length: 50 }),
  model: varchar('model', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Speakers table
export const speakers = pgTable('speakers', {
  id: uuid('id').defaultRandom().primaryKey(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' }),
  speakerNumber: varchar('speaker_number', { length: 50 }).notNull(),
  speakerName: varchar('speaker_name', { length: 255 }),
  color: varchar('color', { length: 20 }),
})

// Transcript entries table
export const transcriptEntries = pgTable('transcript_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' }),
  speakerId: uuid('speaker_id').references(() => speakers.id, {
    onDelete: 'set null',
  }),
  startTime: decimal('start_time', { precision: 10, scale: 2 }).notNull(),
  endTime: decimal('end_time', { precision: 10, scale: 2 }).notNull(),
  text: text('text').notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  entryOrder: bigint('entry_order', { mode: 'number' }).notNull(),
})

// Video blobs table (optional - for storing video files)
export const videoBlobs = pgTable('video_blobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' }),
  blobData: text('blob_data').notNull(), // Base64 or bytea
  blobType: varchar('blob_type', { length: 100 }).notNull(),
  blobSize: bigint('blob_size', { mode: 'number' }).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transcripts: many(transcripts),
}))

export const transcriptsRelations = relations(transcripts, ({ one, many }) => ({
  user: one(users, {
    fields: [transcripts.userId],
    references: [users.id],
  }),
  speakers: many(speakers),
  entries: many(transcriptEntries),
  videoBlob: one(videoBlobs),
}))

export const speakersRelations = relations(speakers, ({ one, many }) => ({
  transcript: one(transcripts, {
    fields: [speakers.transcriptId],
    references: [transcripts.id],
  }),
  entries: many(transcriptEntries),
}))

export const transcriptEntriesRelations = relations(
  transcriptEntries,
  ({ one }) => ({
    transcript: one(transcripts, {
      fields: [transcriptEntries.transcriptId],
      references: [transcripts.id],
    }),
    speaker: one(speakers, {
      fields: [transcriptEntries.speakerId],
      references: [speakers.id],
    }),
  })
)
