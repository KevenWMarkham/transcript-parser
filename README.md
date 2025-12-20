# Transcript Parser - User Manual

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Authentication & API Configuration](#authentication--api-configuration)
5. [Video Processing](#video-processing)
6. [Transcript Management](#transcript-management)
7. [AI-Powered Features](#ai-powered-features)
8. [Cost Tracking & Billing](#cost-tracking--billing)
9. [Export Options](#export-options)
10. [Keyboard Shortcuts](#keyboard-shortcuts)
11. [Advanced Features](#advanced-features)
12. [Troubleshooting](#troubleshooting)

---

## Overview

**Transcript Parser** is an advanced AI-powered desktop application that converts video/audio files into searchable, editable transcripts with speaker diarization. Built with Electron, React, and Google Gemini AI, it provides professional-grade transcription with intelligent speaker identification and comprehensive editing capabilities.

### Key Capabilities

- **AI-Powered Transcription**: Uses Google Gemini 2.5 Flash for accurate speech-to-text
- **Speaker Diarization**: Automatically identifies and separates different speakers
- **AI Name Detection**: Intelligently detects speaker names from introductions
- **Real-Time Editing**: Edit transcripts with full undo/redo support
- **Advanced Search**: Search across transcripts with highlighting
- **Cost Tracking**: Real-time token usage and monthly billing breakdown
- **Multiple Export Formats**: TXT, JSON, SRT, VTT formats
- **Cross-Platform**: Available for Windows, macOS, and Linux

---

## Getting Started

### Installation

#### For End Users

#### Windows

1. Download `Transcript Parser-Setup-1.0.0.exe` from the releases
2. Run the installer and follow the setup wizard
3. Launch **Transcript Parser** from Start Menu

#### Portable Version

- Download `Transcript Parser-Portable-1.0.0.exe`
- Run directly without installation (no admin rights required)

#### For Developers

If you want to build the application from source:

1. See [Installation Guide](docs/installation-guide.md) for complete setup instructions
2. See [dev.md](dev.md) for development workflow and project structure

### First Launch

1. **Set up API Access**
   - Click the settings icon (⚙️) in the top-right
   - Choose your API configuration method
   - Enter credentials as needed

2. **Load Your First Video**
   - Click "Choose Video File" or drag & drop a video
   - Supported formats: MP4, AVI, MOV, WebM, MP3, WAV
   - Maximum file size: 2GB recommended

---

## Core Features

### 1. Video/Audio Upload

**Upload Methods:**

- **Click Button**: Click "Choose Video File" button
- **Drag & Drop**: Drag video/audio files directly into the upload area
- **Recent Files**: Access recently processed files from history

**Supported Formats:**

- Video: `.mp4`, `.avi`, `.mov`, `.webm`
- Audio: `.mp3`, `.wav`, `.m4a`, `.flac`

**Processing:**

- File size: Up to 2GB (recommended)
- Conversion: Automatically converts to WebM/Opus for optimal processing
- Progress: Real-time progress bar with percentage and status updates

### 2. Automatic Transcription

**How It Works:**

1. Upload your media file
2. Click "Start Transcription"
3. AI processes audio and generates transcript
4. Speakers are automatically identified and separated

**Transcription Features:**

- **Automatic Speaker Detection**: Identifies unique speakers
- **Timestamps**: Precise start/end times for each segment
- **Confidence Scores**: Quality indicators for each segment
- **Real-Time Updates**: See transcript build as processing completes

---

## Authentication & API Configuration

### Configuration Modes

#### 1. Own API Key (Recommended)

**Best for**: Individual users, full control

1. Click Settings (⚙️) → "API Configuration"
2. Select "Use Own API Key"
3. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. Paste key and click "Save"

**Advantages:**

- Full cost control
- No access codes needed
- Direct billing through Google

#### 2. Access Code

**Best for**: Shared access, organizations

1. Select "Use Access Code"
2. Enter 10-digit code: `XXX-XXXX-XXX`
3. Developer's API key is used automatically

**Access Code Validation:**

- Format: 3-4-3 digits
- Example: `123-4567-890`
- Contact admin for codes

#### 3. Paid Service (Future)

**Coming soon**: Pay-as-you-go with monthly billing

---

## Video Processing

### Video Player Features

**Playback Controls:**

- ▶️ Play/Pause: Click video or press `Space`
- ⏩ Fast Forward: Press `→` or `L`
- ⏪ Rewind: Press `←` or `J`
- 🔇 Mute/Unmute: Press `M`
- 📽️ Fullscreen: Press `F`

**Transcript Sync:**

- **Click Entry**: Jump to timestamp in video
- **Auto-Highlight**: Current speaking segment highlighted
- **Seek Bar**: Visual timeline with segment markers

**Advanced Controls:**

- Playback speed: 0.25x to 2x
- Volume control: 0% to 100%
- Frame-by-frame navigation

---

## Transcript Management

### Viewing Transcripts

**Layout:**

- **Left Panel**: Speaker analytics and statistics
- **Center Panel**: Transcript entries with search
- **Right Panel**: (Optional) Video player

**Entry Information:**

- Speaker name/color
- Start and end timestamps
- Confidence percentage
- Full text content

### Editing Transcripts

**Enable Editing:**

- Toggle edit mode in top toolbar
- Double-click any entry to edit
- Modify text, start time, or end time

**Edit Operations:**

1. **Text Editing**:
   - Double-click entry text
   - Make changes in textarea
   - Click "Save" or press `Enter`

2. **Timestamp Editing**:
   - Click edit icon
   - Modify start/end times (in seconds)
   - Format: Decimal (e.g., 12.5)

3. **Undo/Redo**:
   - Undo: `Ctrl+Z` (Windows) / `Cmd+Z` (Mac)
   - Redo: `Ctrl+Shift+Z` / `Cmd+Shift+Z`

**Visual Indicators:**

- 🔄 **Edited Badge**: Shows modified entries
- ✓ **Save Confirmation**: Visual feedback on save
- ❌ **Cancel Option**: Discard changes

### Speaker Management

**Rename Speakers:**

1. Find speaker in left panel
2. Click edit icon (✏️) next to speaker name
3. Type new name
4. Press `Enter` or click ✓
5. Name updates across all entries

**Speaker Colors:**

- Blue, Emerald, Purple, Orange, Pink, Cyan
- Automatically assigned
- Consistent throughout transcript

---

## AI-Powered Features

### AI Speaker Name Detection

**Automatic Detection:**

1. Click "Detect Names" button (✨ Sparkles icon)
2. AI analyzes first 30 entries of each speaker
3. Looks for self-introduction patterns
4. Returns suggestions with confidence levels

**Detection Patterns:**

- "My name is [name]"
- "I'm [name]"
- "This is [name]"
- "Hi, I'm [name]"
- "[name] here"

**Confidence Levels:**

- **High**: Clear, unambiguous introduction (e.g., "My name is John Smith")
- **Medium**: Less formal introduction (e.g., "I'm Sarah")
- **Low**: Ambiguous or indirect reference

**Review Suggestions:**

- **Evidence Quote**: See exact text where name was detected
- **Accept**: Applies name to all speaker entries
- **Reject**: Dismisses suggestion
- **Dismiss All**: Remove all suggestions

### Search & Filter

**Text Search:**

1. Type query in search box
2. Live results with match count
3. Highlighting in transcript entries
4. Case-insensitive matching

**Filters:**

- **Speaker Filter**: Show only specific speakers
- **Time Range**: Filter by start/end timestamps
- **Confidence**: (Future) Filter by confidence score

**Combined Filters:**

- Search + Speaker: Find text from specific speaker
- Search + Time: Find text in time range
- All filters stack together

---

## Cost Tracking & Billing

### Real-Time Cost Tracking

**What's Tracked:**

- Input tokens (prompt + audio analysis)
- Output tokens (generated transcript)
- Total tokens per operation
- Estimated cost in USD

**Cost Calculation:**

- Gemini 2.5 Flash: $0.075/1M input, $0.30/1M output
- Real-time updates from API responses
- Persists across sessions (localStorage)

### Viewing Cost Summary

1. Click "Cost Summary" button (💰)
2. See overview cards:
   - Total Tokens Used
   - Total Cost (USD)
   - Total Operations
   - Average Cost per Operation

### Monthly Billing Breakdown

**Current Month Card:**

- Tokens used this month
- Current month cost
- Operations count
- Highlighted in amber/gold

**Historical Billing:**

- All past months sorted newest first
- Monthly totals: tokens, cost, operations
- Format: "December 2024"

**Usage by Category:**

- **By Model**: Gemini 2.5 Flash, 1.5 Flash, etc.
- **By Operation**: Video Transcription, Name Detection

---

## Export Options

### Export Formats

#### 1. Plain Text (.txt)

- Speaker labels
- Timestamps in `[HH:MM:SS]` format
- Clean, readable format
- Best for: Documentation, notes

**Example:**

```
[00:00:05] Speaker 1: Hello everyone, welcome to the meeting.
[00:00:12] Speaker 2: Thanks for having me.
```

#### 2. JSON (.json)

- Complete structured data
- All metadata preserved
- Speakers, timestamps, confidence
- Best for: Developers, data analysis

**Example:**

```json
{
  "entries": [{
    "id": "1",
    "speaker": "Speaker 1",
    "speakerNumber": 1,
    "startTime": 0.0,
    "endTime": 5.2,
    "text": "Hello everyone",
    "confidence": 0.95
  }],
  "speakers": [...],
  "metadata": {...}
}
```

#### 3. SubRip (.srt)

- Standard subtitle format
- Numbered sequences
- Timestamp format: `HH:MM:SS,mmm`
- Best for: Video subtitles, YouTube

**Example:**

```
1
00:00:00,000 --> 00:00:05,200
Speaker 1: Hello everyone

2
00:00:05,200 --> 00:00:12,000
Speaker 2: Thanks for having me
```

#### 4. WebVTT (.vtt)

- Web video text tracks
- HTML5 compatible
- Metadata support
- Best for: Web players, accessibility

**Example:**

```
WEBVTT

00:00:00.000 --> 00:00:05.200
<v Speaker 1>Hello everyone

00:00:05.200 --> 00:00:12.000
<v Speaker 2>Thanks for having me
```

### Export Process

1. Click "Export" button (📥)
2. Select format from dropdown
3. Choose save location
4. File is generated and downloaded

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut               | Action               |
| ---------------------- | -------------------- |
| `Ctrl/Cmd + O`         | Open video file      |
| `Ctrl/Cmd + S`         | Save transcript      |
| `Ctrl/Cmd + E`         | Export transcript    |
| `Ctrl/Cmd + F`         | Focus search box     |
| `Ctrl/Cmd + Z`         | Undo edit            |
| `Ctrl/Cmd + Shift + Z` | Redo edit            |
| `Escape`               | Clear search/filters |

### Video Player Shortcuts

| Shortcut   | Action            |
| ---------- | ----------------- |
| `Space`    | Play/Pause        |
| `→` or `L` | Skip forward 5s   |
| `←` or `J` | Skip backward 5s  |
| `↑`        | Volume up         |
| `↓`        | Volume down       |
| `M`        | Mute/Unmute       |
| `F`        | Toggle fullscreen |
| `0-9`      | Jump to 0%-90%    |

### Transcript Navigation

| Shortcut           | Action                  |
| ------------------ | ----------------------- |
| `↑/↓`              | Navigate entries        |
| `Enter`            | Play entry timestamp    |
| `Double-Click`     | Edit entry (if enabled) |
| `Ctrl/Cmd + Click` | Multi-select            |

---

## Advanced Features

### Speaker Analytics

**Statistics Displayed:**

- Total speaking time per speaker
- Percentage of total conversation
- Number of segments
- Average segment duration

**Visual Indicators:**

- Progress bars for speaking time
- Color-coded speakers
- Segment count badges

### Transcript History

- Recently processed files
- Quick reload previous transcripts
- Automatic save on process
- Indexed for fast search

### Performance Optimization

**Virtual Scrolling:**

- Handles 10,000+ entries smoothly
- Only renders visible entries
- Smooth 60fps scrolling

**Progressive Loading:**

- Entries load as transcription completes
- No waiting for full completion
- Real-time updates

---

## Troubleshooting

### Common Issues

#### 1. "API Key Invalid" Error

**Solution:**

- Verify API key is correct
- Check key has Gemini API access enabled
- Regenerate key from Google AI Studio
- Ensure billing is enabled on Google Cloud

#### 2. Transcription Fails

**Possible Causes:**

- File too large (>2GB)
- Unsupported format
- Poor audio quality
- API quota exceeded

**Solutions:**

- Compress video/audio file
- Convert to supported format (MP4, WebM)
- Improve audio quality
- Check API quota limits

#### 3. Video Won't Play

**Solutions:**

- Update Electron app to latest version
- Check video codec compatibility
- Convert video to WebM format
- Verify file isn't corrupted

#### 4. Slow Performance

**Solutions:**

- Close unnecessary background apps
- Process smaller files
- Enable hardware acceleration
- Increase available RAM

#### 5. Export Fails

**Solutions:**

- Check disk space
- Verify write permissions
- Choose different save location
- Check file name validity

### Getting Help

**Support Channels:**

- GitHub Issues: [Report bugs](https://github.com/KevenWMarkham/transcript-parser/issues)
- Documentation: Check implementation guides in `docs/implementation/`
- Community: (Future) Discord/Slack channels

**Before Reporting:**

1. Check this manual
2. Review error messages
3. Check console logs (`Ctrl+Shift+I` in app)
4. Note steps to reproduce
5. Include system info (OS, version)

---

## Technical Requirements

**Minimum System Requirements:**

- **OS**: Windows 10+, macOS 10.13+, Ubuntu 18.04+
- **RAM**: 4GB (8GB recommended)
- **Disk**: 500MB for app + space for videos
- **Internet**: Required for transcription API calls

**Recommended:**

- **RAM**: 8GB+ for large files
- **CPU**: Multi-core processor for faster processing
- **SSD**: For better video loading performance
- **Bandwidth**: Stable connection for API calls

---

## Privacy & Security

**Data Handling:**

- **Local Processing**: Videos stay on your device
- **API Transmission**: Only audio data sent to Google
- **No Storage**: Google doesn't store your audio
- **Encryption**: HTTPS for all API calls

**API Key Security:**

- Keys stored in localStorage (encrypted)
- Never transmitted except to Google
- Rotatable at any time
- Access codes don't expose developer keys

**Best Practices:**

- Don't share API keys
- Rotate keys periodically
- Use access codes for teams
- Review cost usage regularly

---

## Updates & Changelog

**Current Version**: 1.0.0

**Recent Features:**

- ✨ AI-powered speaker name detection
- 📊 Monthly billing breakdown
- 💰 Real-time cost tracking
- 🎨 Enhanced UI with speaker colors
- ⌨️ Keyboard shortcuts
- 📝 Inline transcript editing
- 🔍 Advanced search and filters

**Coming Soon:**

- Cloud sync for transcripts
- Team collaboration features
- Custom vocabulary/terminology
- Batch processing multiple files
- AI summarization
- Translation support

---

## FAQ

**Q: How accurate is the transcription?**
A: Accuracy depends on audio quality. Gemini 2.5 Flash provides 85-95% accuracy for clear audio with minimal background noise.

**Q: Can I edit the transcript?**
A: Yes! Enable edit mode and double-click any entry to modify text or timestamps.

**Q: What languages are supported?**
A: Currently supports English. Additional languages coming soon via Gemini multilingual models.

**Q: How much does transcription cost?**
A: Cost varies by audio length. Typical 1-hour meeting: ~$0.05-$0.15. Check Cost Summary for exact usage.

**Q: Can I process multiple files at once?**
A: Not currently. Batch processing is planned for a future release.

**Q: Is my data private?**
A: Yes. Videos never leave your device. Only audio is temporarily sent to Google's Gemini API (not stored).

**Q: Can I use this offline?**
A: No. Internet connection required for AI transcription. Local playback and editing work offline.

**Q: How long does transcription take?**
A: Typically 1-3 minutes per hour of audio, depending on network speed and API response time.

---

## License & Credits

**License**: MIT License
**Developer**: Keven W. Markham
**AI Model**: Google Gemini 2.5 Flash
**Framework**: Electron + React + TypeScript
**UI Library**: shadcn/ui + Tailwind CSS

**Third-Party Licenses:**

- React (MIT)
- Electron (MIT)
- Google Generative AI SDK (Apache 2.0)
- Lucide Icons (ISC)

---

## Contact & Support

**GitHub**: [transcript-parser](https://github.com/KevenWMarkham/transcript-parser)
**Issues**: [Report bugs or request features](https://github.com/KevenWMarkham/transcript-parser/issues)
**Email**: (Contact info)
**Documentation**: See `docs/` folder for technical guides

---

_Last Updated: December 19, 2024 • Version 1.0.0_
