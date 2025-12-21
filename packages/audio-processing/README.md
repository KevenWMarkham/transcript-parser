# @transcript-parser/audio-processing

Audio extraction utilities using FFmpeg.wasm for browser-based video processing.

## Installation

```bash
pnpm add @transcript-parser/audio-processing
```

## Usage

### FFmpeg Extractor (Recommended)

```typescript
import { FFmpegExtractor } from '@transcript-parser/audio-processing'

const extractor = FFmpegExtractor.getInstance()

// Load FFmpeg (only needs to be done once)
await extractor.load({
  onProgress: progress => {
    console.log(`Loading: ${Math.round(progress * 100)}%`)
  },
})

// Extract audio from video
const videoFile = new File([videoData], 'video.mp4', { type: 'video/mp4' })
const audioBlob = await extractor.extractAudio(videoFile, {
  onProgress: progress => {
    console.log(`Extracting: ${Math.round(progress * 100)}%`)
  },
})
```

### Browser-based Extractor (Fallback)

```typescript
import { BrowserAudioExtractor } from '@transcript-parser/audio-processing'

const extractor = new BrowserAudioExtractor()
const audioBlob = await extractor.extractAudio(videoFile)
```

## Features

- **FFmpeg.wasm Integration**: Full FFmpeg capabilities in the browser
- **Lazy Loading**: FFmpeg loaded from CDN on-demand (~31MB)
- **Progress Callbacks**: Track loading and extraction progress
- **Format Support**: Handles MP4, WebM, MOV, AVI, and more
- **Singleton Pattern**: Single FFmpeg instance shared across app
- **Audio Optimization**: Converts to WebM/Opus format for best compatibility

## Performance

- FFmpeg WASM is lazy-loaded from CDN (not bundled)
- First load: ~31MB download
- Subsequent uses: Cached in browser
- Extraction speed: Depends on video length and format

## Browser Compatibility

Requires browsers with:

- SharedArrayBuffer support
- WebAssembly support
- Modern JavaScript features (ES2020+)

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

- FFmpeg.wasm requires proper CORS headers
- Large videos may take time to process
- Browser-based extractor is faster but less capable
