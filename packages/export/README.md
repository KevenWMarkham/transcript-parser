# @transcript-parser/export

Export utilities for converting transcripts to various formats (TXT, SRT, VTT, CSV, JSON).

## Installation

```bash
pnpm add @transcript-parser/export
```

## Usage

```typescript
import {
  exportToTxt,
  exportToSrt,
  exportToVtt,
  exportToCsv,
  exportToJson,
} from '@transcript-parser/export'
import type { TranscriptData } from '@transcript-parser/types'

const transcript: TranscriptData = {
  /* ... */
}

// Export to different formats
const txtContent = exportToTxt(transcript)
const srtContent = exportToSrt(transcript)
const vttContent = exportToVtt(transcript)
const csvContent = exportToCsv(transcript)
const jsonContent = exportToJson(transcript)
```

## Supported Formats

### Plain Text (.txt)

- Speaker names with timestamps
- Clean, readable format
- Best for sharing and reading

### SubRip (.srt)

- Industry-standard subtitle format
- Compatible with most video players
- Includes timing and text

### WebVTT (.vtt)

- Web Video Text Tracks format
- HTML5 video standard
- Supports styling and positioning

### CSV (.csv)

- Spreadsheet-compatible format
- Columns: ID, Speaker, Start Time, End Time, Text, Confidence
- Great for data analysis

### JSON (.json)

- Complete transcript data export
- Includes all metadata and speakers
- Preserves full structure

## API Reference

All export functions accept a `TranscriptData` object and return a string.

```typescript
function exportToTxt(transcript: TranscriptData): string
function exportToSrt(transcript: TranscriptData): string
function exportToVtt(transcript: TranscriptData): string
function exportToCsv(transcript: TranscriptData): string
function exportToJson(transcript: TranscriptData): string
```

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check
```
