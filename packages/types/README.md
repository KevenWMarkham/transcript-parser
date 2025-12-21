# @transcript-parser/types

Shared TypeScript types and interfaces for Transcript Parser monorepo.

## Installation

```bash
pnpm add @transcript-parser/types
```

## Usage

```typescript
import type {
  TranscriptData,
  TranscriptEntry,
  Speaker,
  VideoMetadata,
} from '@transcript-parser/types'

const transcript: TranscriptData = {
  id: '123',
  entries: [],
  speakers: [],
  metadata: {
    fileName: 'video.mp4',
    fileSize: 1024,
    duration: 120,
    createdAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
    videoFormat: 'video/mp4',
  },
}
```

## Exported Types

### Core Types

- `TranscriptData` - Complete transcript with entries, speakers, and metadata
- `TranscriptEntry` - Individual transcript entry with speaker and timing
- `Speaker` - Speaker information with ID, name, and color
- `VideoMetadata` - Video file metadata

### Configuration Types

- `ApiKeyConfig` - API key configuration (own key or access code mode)
- `ExportFormat` - Supported export formats (TXT, SRT, VTT, CSV, JSON)

### Module SDK Types

- `ModuleDefinition` - Module plugin definition interface
- `ModuleContext` - Context passed to module plugins

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check
```

## Notes

- This package has no runtime dependencies
- It provides only TypeScript type definitions
- Set as `"sideEffects": false` for optimal tree-shaking
