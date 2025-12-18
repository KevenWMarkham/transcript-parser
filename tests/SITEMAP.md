# Video Transcript Parser - Site Map & Design Specifications

**Based on**: Figma Design - https://www.figma.com/design/G29yeqjCwTWcqAaqmeZHEw/Video-Parser-Utility
**Demo Implementation**: `Demo (NOT SOURCE CODE)/Video Parser Utility`

---

## Design Overview

### Visual Identity

**Color Palette**:

- **Primary Gradient**: Blue (#3B82F6) to Purple (#9333EA)
- **Background**: Gradient from slate-50 via blue-50/30 to purple-50/30
- **Cards**: Backdrop-blur-xl with white/80 opacity, rounded-3xl
- **Borders**: White/20 to white/50 with subtle glow effects
- **Text**: Slate-600 to Slate-900 hierarchy

**Typography**:

- **Font Size Base**: 16px
- **Headings**: Medium weight (500)
- **Body**: Normal weight (400)
- **H1**: 2xl with gradient clip (blue-600 to purple-600)
- **H2**: xl
- **H3**: lg
- **Body**: base
- **Small**: sm

**Design System**:

- **Glassmorphism**: Backdrop-blur with semi-transparent backgrounds
- **Rounded Corners**: 3xl (24px) for cards, 2xl (16px) for buttons, xl for smaller elements
- **Shadows**: Layered with soft glows using blur and opacity
- **Spacing**: 4-unit scale (4px base)
- **Responsive**: Mobile-first with sm, lg breakpoints

---

## Page Structure

### 1. Main Application Layout

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  - Video icon with glow effect                              │
│  - Title: "Video Transcript Parser"                         │
│  - Subtitle: "AI-powered speaker identification..."         │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────┬─────────────────────────────────┐
│  LEFT COLUMN              │  RIGHT COLUMN                   │
│                           │                                 │
│  - Video Uploader Card    │  - Transcript Viewer Card       │
│  - Processing Status Card │    - Speaker Summary            │
│    (conditional)          │    - Transcript Entries         │
│                           │    - Export Buttons             │
└───────────────────────────┴─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  API INTEGRATION GUIDE (conditional - shows after complete) │
│  - Icon + Title                                             │
│  - Integration options (AssemblyAI, Google, AWS, Azure)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Header Component

**Location**: Top of page, full-width card
**Design**: Glassmorphic card with gradient icon

**Elements**:

1. **Icon Container**:
   - Gradient background (blue-500 to purple-600)
   - Blur glow effect behind icon
   - Rounded-2xl (16px)
   - Video camera SVG icon (white, 7x7)

2. **Title**:
   - H1 with gradient text (blue-600 to purple-600)
   - Text: "Video Transcript Parser"

3. **Subtitle**:
   - Slate-600 text
   - Size: sm on mobile, base on desktop
   - Text: "AI-powered speaker identification and transcription"

**Animation**:

- Fade in from top (opacity 0→1, y -20→0)

---

### Video Uploader Component

**Location**: Left column, top card
**Design**: Glassmorphic card with drag-drop zone

**States**:

#### State 1: Empty (Initial)

```
┌─────────────────────────────────┐
│ 🎥 Upload Video                 │
├─────────────────────────────────┤
│                                 │
│   ┌───────────────────────┐    │
│   │    📤 (animated)      │    │
│   │   ✨ sparkle          │    │
│   │                       │    │
│   │ Drop your video here  │    │
│   │ or click to browse    │    │
│   │                       │    │
│   │ MP4, MOV, AVI • 2GB   │    │
│   │                       │    │
│   │  [Choose File]        │    │
│   └───────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Elements**:

- Dashed border (2px, slate-300)
- Gradient background on hover (violet-50 to purple-50)
- Upload icon with rotation animation
- Sparkles icon with pulse effect
- Gradient button (violet-600 to purple-600)

#### State 2: File Selected

```
┌─────────────────────────────────┐
│ 🎥 Upload Video                 │
├─────────────────────────────────┤
│                                 │
│   ┌───────────────────────┐    │
│   │   [Video Preview]     │    │
│   │   <video controls>    │    │
│   └───────────────────────┘    │
│                                 │
│   🟢 Video uploaded             │
│   successfully                  │
│                                 │
└─────────────────────────────────┘
```

**Elements**:

- Video element with controls
- Max height: 320px
- Green success indicator (pulse animation)

---

### Processing Status Component

**Location**: Left column, below uploader (conditional)
**Design**: Glassmorphic card with progress indicators

**States**:

#### State 1: Uploading

```
┌─────────────────────────────────┐
│ 🪄 Processing Status            │
├─────────────────────────────────┤
│                                 │
│  🔄 Uploading video             │
│  ████████░░░░░░░░░  65%        │
│  65% complete                   │
│                                 │
│  ⏳ Transcribing with AI        │
│  Waiting for upload...          │
│                                 │
└─────────────────────────────────┘
```

#### State 2: Processing

```
┌─────────────────────────────────┐
│ 🪄 Processing Status            │
├─────────────────────────────────┤
│                                 │
│  ✅ Uploading video             │
│  Upload successful              │
│                                 │
│  🔄✨ Transcribing with AI      │
│  Detecting speakers and         │
│  generating transcript...       │
│                                 │
│  🤖 AI Processing Pipeline      │
│  ✅ Audio extraction            │
│  ✅ Speaker diarization         │
│  ⏳ Speech-to-text conversion   │
│  ⏳ Timestamp alignment          │
│                                 │
└─────────────────────────────────┘
```

#### State 3: Complete

```
┌─────────────────────────────────┐
│ 🪄 Processing Status            │
├─────────────────────────────────┤
│                                 │
│  ✅ Uploading video             │
│  Upload successful              │
│                                 │
│  ✅ Transcribing with AI        │
│  All speakers identified        │
│  successfully                   │
│                                 │
│  [Process Another Video]        │
│                                 │
└─────────────────────────────────┘
```

**Color Coding**:

- Uploading: Blue gradient (blue-50 to cyan-50)
- Processing: Purple gradient (purple-50 to pink-50)
- Complete: Green gradient (green-50 to emerald-50)
- Error: Red gradient (red-50 to rose-50)

**Icons**:

- Loader2: Rotating for active steps
- CheckCircle2: Completed steps (scale animation)
- XCircle: Error states
- Wand2/Sparkles: Processing with rotation + pulse

---

### Transcript Viewer Component

**Location**: Right column, full height
**Design**: Glassmorphic card with scrollable content

**Structure**:

#### Header Section

```
┌─────────────────────────────────────────┐
│ 📄 Transcript        [Export ▼]         │
├─────────────────────────────────────────┤
│  👥 Identified Speakers: 3              │
│  🔵 Speaker 1  🟢 Speaker 2  🟣 Speaker 3 │
├─────────────────────────────────────────┤
```

**Elements**:

- File icon with emerald gradient background
- Export button (slate gradient, dropdown)
- Speaker summary panel (slate/blue gradient background)
- Color-coded speaker badges

#### Content Section (Empty State)

```
│                                         │
│          📄                             │
│      No transcript yet                  │
│  Upload a video to generate             │
│      a transcript                       │
│                                         │
```

#### Content Section (Processing State)

```
│                                         │
│          📄 (rotating)                  │
│          ✨                             │
│  Processing your video...               │
│  AI is analyzing audio and              │
│  identifying speakers                   │
│          ● ● ●                          │
│                                         │
```

#### Content Section (With Transcript)

```
│ ┌─────────────────────────────────┐   │
│ │ 🔵 Speaker 1    0:00 - 0:06  95%│   │
│ │ Welcome everyone to today's     │   │
│ │ meeting. I'd like to start...   │   │
│ └─────────────────────────────────┘   │
│                                       │
│ ┌─────────────────────────────────┐   │
│ │ 🟢 Speaker 2    0:07 - 0:12  94%│   │
│ │ Thanks for having me. I'm...    │   │
│ └─────────────────────────────────┘   │
│                                       │
│ ┌─────────────────────────────────┐   │
│ │ 🔵 Speaker 1    0:12 - 0:17  97%│   │
│ │ Great! Before we dive...        │   │
│ └─────────────────────────────────┘   │
```

**Transcript Entry Design**:

- White/60 background with hover → white/80
- Rounded-2xl
- Speaker badge (color-coded with icon)
- Timestamp badge (slate background with clock icon)
- Confidence badge (green background with checkmark)
- Left border (slate-300) changes to blue-400 on hover
- Hover: shadow-lg transition

**Speaker Colors** (from sampleTranscript.ts):

- Speaker 1: Blue (#3B82F6)
- Speaker 2: Emerald (#10B981)
- Speaker 3: Purple (#A855F7)
- Speaker 4: Amber (#F59E0B)

---

### API Integration Guide Component

**Location**: Bottom of page (conditional - after complete)
**Design**: Glassmorphic card with gradient background

```
┌─────────────────────────────────────────────────┐
│ 🔌 API Integration Guide                        │
│ This is a demo with mock data. To implement     │
│ real transcription with speaker diarization:    │
│                                                  │
│ • AssemblyAI: Use their API with                │
│   speaker_labels: true                          │
│                                                  │
│ • Google Cloud Speech-to-Text: Enable           │
│   diarization in the API config                 │
│                                                  │
│ • AWS Transcribe: Use StartTranscriptionJob     │
│   with speaker identification                   │
│                                                  │
│ • Azure Speech Services: Configure              │
│   conversation transcription                    │
└─────────────────────────────────────────────────┘
```

**Elements**:

- Plug emoji in blue rounded square
- Blue-900 heading
- Slate-700 body text
- Each option in white/60 rounded card
- Blue bullet points

---

## Animations & Interactions

### Page Load Sequence

1. Header fades in from top (-20px) - 0ms delay
2. Left column slides in from left (-20px) - 100ms delay
3. Right column slides in from right (20px) - 200ms delay

### Component Animations

**VideoUploader**:

- Upload icon: Rotation animation (0→5→-5→0, 2s infinite)
- Sparkles: Scale + opacity pulse (1→1.2→1, 2s infinite)
- Hover: Scale 1.01, gradient background transition

**ProcessingStatus**:

- Loader icons: 360° rotation, 1-2s linear infinite
- Completion checkmark: Scale spring animation (0→1)
- Progress steps: Stagger fade-in (0.1s delay each)

**TranscriptViewer**:

- Empty → Processing: Fade transition
- File icon rotate: On processing state
- Dots pulse: Opacity cycle for loading state
- Entries: Stagger appearance (0.05s delay each)
- Entry hover: Shadow-lg + border color change

**API Guide**:

- Fade in from bottom (20px) on complete
- Exit animation reverse

---

## Responsive Breakpoints

### Mobile (< 640px)

- Single column layout
- Header padding: p-6
- Gap: gap-4
- Font sizes scale down (sm variants)

### Tablet (640px - 1024px)

- Single column layout
- Header padding: p-6
- Gap: gap-6
- Standard font sizes

### Desktop (>= 1024px)

- Two column grid (lg:grid-cols-2)
- Header padding: p-8
- Gap: gap-6
- Full typography scale

---

## Interactive States

### Buttons

**Default**:

- Gradient background
- Shadow-lg
- Rounded-xl
- Medium font weight

**Hover**:

- Darker gradient variant
- Shadow-xl
- 300ms transition

**Disabled**:

- Opacity 60%
- Cursor not-allowed
- Slate background

### Cards

**Default**:

- Backdrop-blur-xl
- White/80 background
- Border white/20-50
- Shadow-xl

**Hover** (where applicable):

- White/80 → White/90
- Shadow increase
- Border glow

### Upload Zone

**Default**:

- Dashed border (slate-300)
- Slate/white gradient background

**Dragging**:

- Solid border (violet-400)
- Violet/purple gradient background
- Scale animation

**Disabled**:

- Opacity 60%
- Slate-50 background
- Not-allowed cursor

---

## Copy & Content

### Header

- **Title**: "Video Transcript Parser"
- **Subtitle**: "AI-powered speaker identification and transcription"

### Upload Card

- **Title**: "Upload Video"
- **Empty State**:
  - "Drop your video here or click to browse"
  - "Supports MP4, MOV, AVI, WebM • Max 2GB"
  - Button: "Choose File"
- **Success**: "Video uploaded successfully"

### Processing Card

- **Title**: "Processing Status"
- **Steps**:
  - "Uploading video" / "Upload successful"
  - "Transcribing with AI" / "Transcription complete" / "Detecting speakers and generating transcript..."
  - "All speakers identified successfully"
- **Button**: "Process Another Video"
- **Pipeline Title**: "AI Processing Pipeline"
- **Pipeline Steps**:
  - "Audio extraction"
  - "Speaker diarization"
  - "Speech-to-text conversion"
  - "Timestamp alignment"

### Transcript Card

- **Title**: "Transcript"
- **Button**: "Export"
- **Summary**: "Identified Speakers" + count badge
- **Empty State**:
  - "No transcript yet"
  - "Upload a video to generate a transcript"
- **Processing State**:
  - "Processing your video..."
  - "AI is analyzing audio and identifying speakers"

### API Guide

- **Title**: "API Integration Guide"
- **Intro**: "This is a demo with mock data. To implement real transcription with speaker diarization:"
- **Options**:
  - "AssemblyAI: Use their API with speaker_labels: true"
  - "Google Cloud Speech-to-Text: Enable diarization in the API config"
  - "AWS Transcribe: Use StartTranscriptionJob with speaker identification"
  - "Azure Speech Services: Configure conversation transcription with speaker recognition"

---

## Technical Implementation Notes

### Required Libraries

- **motion/react** (Framer Motion): All animations
- **lucide-react**: All icons (Upload, Video, Loader2, CheckCircle2, XCircle, Wand2, Sparkles, FileText, User, Clock, Download, Search, X)
- **@radix-ui components**: Dialog, Progress, ScrollArea, Separator, Badge
- **Tailwind CSS**: All styling

### CSS Variables (from theme.css)

```css
--background: #ffffff --foreground: oklch(0.145 0 0) --radius: 0.625rem (10px);
```

### Glassmorphism Effect

```css
backdrop-blur-xl
bg-white/80
border border-white/20-50
shadow-lg/xl
```

### Gradient Patterns

```css
/* Icon backgrounds */
bg-gradient-to-br from-blue-500 to-purple-600

/* Text gradients */
bg-gradient-to-r from-blue-600 to-purple-600
bg-clip-text text-transparent

/* Page background */
bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30

/* Card gradients */
bg-gradient-to-br from-blue-50/80 to-purple-50/80
```

---

**Document Version**: 1.0
**Last Updated**: 2025-12-17
**Source**: Figma Design + Demo Implementation Analysis
