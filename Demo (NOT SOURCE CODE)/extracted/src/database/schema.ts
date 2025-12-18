/**
 * Database Schema Definitions
 * Supabase table schemas for the Video Parser application
 */

export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface LLMUsage {
  id: string;
  user_id: string;
  timestamp: string;
  model: string;
  operation: string;
  input_tokens: number;
  output_tokens: number;
  cached_tokens: number | null;
  total_cost: number;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  filename: string;
  file_size: number;
  duration: number | null;
  storage_path: string;
  processing_status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}

export interface Transcript {
  id: string;
  video_id: string;
  user_id: string;
  segments: TranscriptSegmentDB[];
  speaker_count: number;
  total_duration: number;
  processing_time: number | null;
  created_at: string;
  updated_at: string;
}

export interface TranscriptSegmentDB {
  id: string;
  speaker: string;
  text: string;
  start_time: number;
  end_time: number;
  confidence: number | null;
}

/**
 * SQL Schema for Supabase
 * 
 * -- Users table (handled by Supabase Auth)
 * -- profiles table extends auth.users
 * create table profiles (
 *   id uuid references auth.users on delete cascade not null primary key,
 *   email text unique not null,
 *   full_name text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- LLM Usage tracking
 * create table llm_usage (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references auth.users on delete cascade not null,
 *   timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
 *   model text not null,
 *   operation text not null,
 *   input_tokens integer not null,
 *   output_tokens integer not null,
 *   cached_tokens integer,
 *   total_cost numeric(10, 6) not null,
 *   metadata jsonb,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- Videos table
 * create table videos (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references auth.users on delete cascade not null,
 *   filename text not null,
 *   file_size bigint not null,
 *   duration integer,
 *   storage_path text not null,
 *   processing_status text not null check (processing_status in ('pending', 'processing', 'completed', 'failed')),
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- Transcripts table
 * create table transcripts (
 *   id uuid default gen_random_uuid() primary key,
 *   video_id uuid references videos on delete cascade not null,
 *   user_id uuid references auth.users on delete cascade not null,
 *   segments jsonb not null,
 *   speaker_count integer not null,
 *   total_duration numeric(10, 2) not null,
 *   processing_time numeric(10, 2),
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- Indexes for performance
 * create index llm_usage_user_id_idx on llm_usage(user_id);
 * create index llm_usage_timestamp_idx on llm_usage(timestamp desc);
 * create index videos_user_id_idx on videos(user_id);
 * create index transcripts_video_id_idx on transcripts(video_id);
 * create index transcripts_user_id_idx on transcripts(user_id);
 * 
 * -- Row Level Security (RLS)
 * alter table llm_usage enable row level security;
 * alter table videos enable row level security;
 * alter table transcripts enable row level security;
 * 
 * -- RLS Policies
 * create policy "Users can view their own usage" on llm_usage for select using (auth.uid() = user_id);
 * create policy "Users can insert their own usage" on llm_usage for insert with check (auth.uid() = user_id);
 * create policy "Users can view their own videos" on videos for select using (auth.uid() = user_id);
 * create policy "Users can insert their own videos" on videos for insert with check (auth.uid() = user_id);
 * create policy "Users can update their own videos" on videos for update using (auth.uid() = user_id);
 * create policy "Users can delete their own videos" on videos for delete using (auth.uid() = user_id);
 * create policy "Users can view their own transcripts" on transcripts for select using (auth.uid() = user_id);
 * create policy "Users can insert their own transcripts" on transcripts for insert with check (auth.uid() = user_id);
 * create policy "Users can update their own transcripts" on transcripts for update using (auth.uid() = user_id);
 * create policy "Users can delete their own transcripts" on transcripts for delete using (auth.uid() = user_id);
 */

// Type guards
export function isLLMUsage(obj: any): obj is LLMUsage {
  return (
    typeof obj === "object" &&
    "user_id" in obj &&
    "model" in obj &&
    "operation" in obj &&
    "input_tokens" in obj &&
    "output_tokens" in obj
  );
}

export function isTranscript(obj: any): obj is Transcript {
  return (
    typeof obj === "object" &&
    "video_id" in obj &&
    "segments" in obj &&
    Array.isArray(obj.segments)
  );
}
