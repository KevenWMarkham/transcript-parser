# @transcript-parser/ai-services

AI services integration for Transcript Parser, including Google Gemini API client and usage tracking.

## Installation

```bash
pnpm add @transcript-parser/ai-services
```

## Usage

### Gemini Client

```typescript
import { GeminiClient } from '@transcript-parser/ai-services'

// Initialize with API key
const client = new GeminiClient({
  apiKey: 'your-api-key',
  model: 'gemini-2.5-flash',
})

// Transcribe audio with speaker diarization
const audioBlob = new Blob([audioData], { type: 'audio/webm' })
const transcript = await client.transcribeWithSpeakers(audioBlob, {
  onEntryComplete: entry => {
    console.log('Entry:', entry)
  },
})
```

### API Client

```typescript
import { apiClient } from '@transcript-parser/ai-services'

// Get current user
const user = apiClient.getCurrentUser()

// Set user
apiClient.setUser({ id: 1, name: 'John Doe', email: 'john@example.com' })
```

### Usage Tracker

```typescript
import { usageTracker } from '@transcript-parser/ai-services'

// Track usage
usageTracker.track({
  userId: 1,
  model: 'gemini-2.5-flash',
  operation: 'Video Transcription',
  inputTokens: 1000,
  outputTokens: 500,
  totalTokens: 1500,
  metadata: { fileSize: '2.5 MB' },
})

// Get usage stats
const stats = usageTracker.getUserUsage(1)
```

## Features

- **Speaker Diarization**: Automatically identifies and separates different speakers
- **Streaming Support**: Process transcript entries as they arrive
- **Usage Tracking**: Monitor API usage and costs
- **Error Handling**: Custom error types for quota, invalid audio, etc.
- **Retry Logic**: Automatic retry with exponential backoff

## Configuration

Set your API key via environment variable:

```bash
# .env
VITE_GEMINI_API_KEY=your_api_key_here
```

Or provide it programmatically when creating the client.

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check
```

## Security

- Never commit API keys to version control
- Use environment variables for sensitive data
- API keys are validated before use
- Errors don't leak sensitive information
