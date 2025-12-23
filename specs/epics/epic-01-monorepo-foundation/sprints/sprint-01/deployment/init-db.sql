-- Initialize databases for Transcript Parser and N8N
-- This script runs automatically when PostgreSQL container first starts

-- Create N8N database if it doesn't exist
SELECT 'CREATE DATABASE n8n'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'n8n')\gexec

-- Connect to transcript_parser database (created by default)
\c transcript_parser;

-- Create tables for transcript parser (if using PostgreSQL backend)
-- These are based on your Drizzle schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transcripts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    video_url TEXT,
    audio_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transcript_entries (
    id SERIAL PRIMARY KEY,
    transcript_id INTEGER REFERENCES transcripts(id) ON DELETE CASCADE,
    speaker_number INTEGER NOT NULL,
    text TEXT NOT NULL,
    start_time NUMERIC,
    end_time NUMERIC,
    confidence NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS speakers (
    id SERIAL PRIMARY KEY,
    transcript_id INTEGER REFERENCES transcripts(id) ON DELETE CASCADE,
    speaker_number INTEGER NOT NULL,
    name VARCHAR(255),
    color VARCHAR(7),
    UNIQUE(transcript_id, speaker_number)
);

CREATE TABLE IF NOT EXISTS usage_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    model VARCHAR(100),
    tokens_used INTEGER,
    cost NUMERIC(10, 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transcripts_user_id ON transcripts(user_id);
CREATE INDEX IF NOT EXISTS idx_transcript_entries_transcript_id ON transcript_entries(transcript_id);
CREATE INDEX IF NOT EXISTS idx_speakers_transcript_id ON speakers(transcript_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${POSTGRES_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${POSTGRES_USER};
