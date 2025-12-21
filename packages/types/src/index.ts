// ============================================================================
// Core Transcript Types
// ============================================================================

/**
 * Individual transcript entry (a single utterance/segment)
 */
export interface TranscriptEntry {
  id: string;
  speaker: string;
  speakerNumber: number;
  startTime: number; // seconds (decimal)
  endTime: number; // seconds (decimal)
  text: string;
  confidence?: number;
}

/**
 * Speaker information
 */
export interface Speaker {
  id: number;
  name: string;
  color: string;
}

/**
 * Base metadata that all transcripts have
 */
export interface BaseTranscriptMetadata {
  fileName: string;
  fileSize: number;
  duration: number; // seconds
  createdAt: string;
  processedAt: string;
  videoFormat: string;
  model: string;
}

/**
 * Extended metadata with module-specific fields
 */
export interface ExtendedTranscriptMetadata extends BaseTranscriptMetadata {
  /** Which module this transcript belongs to */
  moduleId?: string;

  /** Module-specific custom fields */
  moduleData?: Record<string, any>;

  /** Tags for organization */
  tags?: string[];

  /** User-defined rating (1-5 stars) */
  rating?: number;

  /** User notes/comments */
  notes?: string;

  /** GPS location (for travel, property viewings, etc.) */
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  /** Related media (photos, videos, documents) */
  attachments?: Attachment[];
}

/**
 * Attachment (photos, documents, etc.)
 */
export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'other';
  fileName: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  /** Link to specific transcript timestamp */
  timestamp?: number;
}

/**
 * Complete transcript data structure
 */
export interface TranscriptData {
  id: string;
  entries: TranscriptEntry[];
  speakers: Speaker[];
  metadata: ExtendedTranscriptMetadata;
}

// ============================================================================
// User Profile & Preferences
// ============================================================================

/**
 * User profile with preferences
 */
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;

  /** Active modules */
  activeModules: string[];

  /** User preferences */
  preferences: UserPreferences;

  /** Module-specific settings */
  moduleSettings?: Record<string, any>;
}

/**
 * User preferences
 */
export interface UserPreferences {
  /** Budget range for major purchases */
  budget?: {
    min: number;
    max: number;
    currency: string;
  };

  /** Lifestyle preferences */
  lifestyle?: 'urban' | 'suburban' | 'rural' | 'mixed';

  /** Decision-making style */
  decisionStyle?: 'analytical' | 'intuitive' | 'collaborative' | 'balanced';

  /** Priorities */
  priorities?: string[];

  /** Collaboration mode */
  collaborationMode?: 'solo' | 'partner' | 'family' | 'team';

  /** Theme preference */
  theme?: 'light' | 'dark' | 'auto';

  /** Language preference */
  language?: string;

  /** Timezone */
  timezone?: string;
}

// ============================================================================
// Filter & Search Types
// ============================================================================

/**
 * Transcript filter options
 */
export interface TranscriptFilter {
  /** Search query (full-text search) */
  searchQuery?: string;

  /** Filter by module */
  moduleId?: string | string[];

  /** Filter by speaker */
  speakers?: string[];

  /** Filter by time range */
  timeRange?: {
    start: number;
    end: number;
  };

  /** Filter by date range */
  dateRange?: {
    start: string;
    end: string;
  };

  /** Filter by tags */
  tags?: string[];

  /** Filter by rating */
  rating?: number | number[];

  /** Filter by custom module fields */
  moduleFilters?: Record<string, any>;

  /** Sort options */
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

// ============================================================================
// Export Types
// ============================================================================

/**
 * Export options
 */
export interface ExportOptions {
  /** Export format */
  format: 'txt' | 'srt' | 'vtt' | 'json' | 'csv' | 'docx' | 'pdf' | 'custom';

  /** Include timestamps */
  includeTimestamps?: boolean;

  /** Include speaker names */
  includeSpeakers?: boolean;

  /** Include confidence scores */
  includeConfidence?: boolean;

  /** Time format */
  timeFormat?: 'MM:SS' | 'HH:MM:SS' | 'seconds';

  /** Custom module export options */
  moduleOptions?: Record<string, any>;
}

// ============================================================================
// AI Analysis Types
// ============================================================================

/**
 * AI-generated insights
 */
export interface AIInsights {
  /** Executive summary (2-3 sentences) */
  summary?: string;

  /** Key points extracted */
  keyPoints?: string[];

  /** Questions detected or generated */
  questions?: AIQuestion[];

  /** Action items extracted */
  actionItems?: ActionItem[];

  /** Decisions made */
  decisions?: Decision[];

  /** Pro/con analysis */
  prosCons?: {
    pros: string[];
    cons: string[];
  };

  /** Sentiment analysis */
  sentiment?: 'positive' | 'neutral' | 'negative' | 'mixed';

  /** Confidence score for this analysis */
  confidence?: number;

  /** When this analysis was generated */
  generatedAt: string;
}

/**
 * AI-detected or generated question
 */
export interface AIQuestion {
  id: string;
  text: string;
  /** Was this question answered in the transcript? */
  answered: boolean;
  /** Timestamp where question was asked */
  timestamp?: number;
  /** Answer text if answered */
  answer?: string;
}

/**
 * Action item extracted from transcript
 */
export interface ActionItem {
  id: string;
  text: string;
  /** Who is responsible */
  assignee?: string;
  /** Due date mentioned */
  dueDate?: string;
  /** Priority level */
  priority?: 'low' | 'medium' | 'high';
  /** Current status */
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  /** Timestamp in transcript */
  timestamp?: number;
}

/**
 * Decision point extracted from transcript
 */
export interface Decision {
  id: string;
  text: string;
  /** Who made the decision */
  decidedBy?: string[];
  /** Rationale/reasoning */
  rationale?: string;
  /** Timestamp in transcript */
  timestamp?: number;
}

// ============================================================================
// Comparison Types
// ============================================================================

/**
 * Comparison between multiple transcripts/options
 */
export interface Comparison {
  id: string;
  name: string;
  /** Transcripts being compared */
  transcriptIds: string[];
  /** Fields to compare */
  fields: string[];
  /** Comparison created at */
  createdAt: string;
  /** User notes about this comparison */
  notes?: string;
  /** AI recommendation */
  recommendation?: {
    transcriptId: string;
    reason: string;
    confidence: number;
  };
}

// ============================================================================
// Collaboration Types
// ============================================================================

/**
 * User comment on a transcript
 */
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  /** Timestamp in transcript this comment refers to */
  timestamp?: number;
  createdAt: string;
  updatedAt?: string;
  /** Replies to this comment */
  replies?: Comment[];
}

/**
 * User rating/vote
 */
export interface UserRating {
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  notes?: string;
  createdAt: string;
}

/**
 * Shared workspace for collaboration
 */
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  /** Owner user ID */
  ownerId: string;
  /** Member user IDs */
  memberIds: string[];
  /** Transcripts in this workspace */
  transcriptIds: string[];
  /** Workspace settings */
  settings: {
    /** Can members edit transcripts? */
    canMembersEdit: boolean;
    /** Can members delete transcripts? */
    canMembersDelete: boolean;
    /** Require approval for new transcripts? */
    requireApproval: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * API Response wrapper
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: PaginationMeta;
}

// ============================================================================
// Database Types (for Drizzle ORM)
// ============================================================================

/**
 * Database user record
 */
export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  profileData?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database transcript record
 */
export interface DBTranscript {
  id: string;
  userId: string;
  moduleId?: string;
  data: TranscriptData;
  aiInsights?: AIInsights;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * LLM usage tracking
 */
export interface LLMUsage {
  id: string;
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  operation: string;
  createdAt: Date;
}

// Export all types
export type {
  TranscriptEntry,
  Speaker,
  BaseTranscriptMetadata,
  ExtendedTranscriptMetadata,
  TranscriptData,
  Attachment,
  UserProfile,
  UserPreferences,
  TranscriptFilter,
  ExportOptions,
  AIInsights,
  AIQuestion,
  ActionItem,
  Decision,
  Comparison,
  Comment,
  UserRating,
  Workspace,
  APIResponse,
  PaginationMeta,
  PaginatedResponse,
  DBUser,
  DBTranscript,
  LLMUsage,
};
