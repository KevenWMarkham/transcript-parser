# Sprint 04: AI Expert Commentary & Social Media

**Sprint ID**: EPIC-07-S04
**Roadmap Sprint**: 19
**Status**: Planned
**Duration**: 12 weeks
**Story Points**: 89 total

---

## Overview

Transform travel media (photos, videos, audio) into rich experiences with AI expert commentary and social media-ready content.

### Key Features
1. **AI Expert Commentary** - AI experts analyze travel media and provide contextual insights
2. **GPS/Location Identification** - Auto-detect landmarks from media metadata
3. **Contextual Enrichment** - Weather, holidays, events add depth to commentary
4. **Social Media Generation** - Create platform-optimized posts with AI assistance

---

## User Stories

### 1. Photo Expert Commentary (13 points)

**US-04-01: Photo Upload & Analysis**
> As a traveler, I want to upload photos from my trip so that AI experts can explain what I captured.

**Acceptance Criteria:**
- [ ] Accept JPG, PNG, HEIC, WebP formats
- [ ] Extract EXIF metadata (GPS, timestamp, camera info)
- [ ] Display loading state during analysis
- [ ] Handle photos up to 50MB

**Story Points**: 3 | **Priority**: Must Have

---

**US-04-02: GPS-Based Landmark Detection**
> As a traveler, I want the app to automatically identify the landmark in my photo using GPS so that I don't have to manually enter location.

**Acceptance Criteria:**
- [ ] Extract GPS coordinates from photo EXIF
- [ ] Query Google Places API for nearby landmarks
- [ ] Display identified location with confidence score
- [ ] Allow user to confirm or correct identification
- [ ] Support manual location pinning as fallback

**Story Points**: 5 | **Priority**: Must Have

---

**US-04-03: Photo Expert Panel**
> As a traveler, I want multiple AI experts to provide different perspectives on my photo so that I learn more about what I captured.

**Acceptance Criteria:**
- [ ] Display 2-4 relevant experts based on photo content
- [ ] Each expert provides title + description + key facts
- [ ] Expandable cards for detailed commentary
- [ ] User can request different experts

**Story Points**: 5 | **Priority**: Must Have

---

### 2. Video Expert Commentary (21 points)

**US-04-04: Silent Video Commentary**
> As a traveler, I want AI experts to provide narration for my silent videos so that I can understand what I filmed.

**Acceptance Criteria:**
- [ ] Accept MP4, MOV, WebM formats
- [ ] Extract key frames at 3-5 second intervals
- [ ] Analyze frames with Gemini Vision
- [ ] Generate timestamped commentary entries
- [ ] Display as synced subtitles during playback

**Story Points**: 8 | **Priority**: Must Have

---

**US-04-05: Scene Detection**
> As a traveler, I want the system to detect scene changes in my video so that commentary is relevant to each part.

**Acceptance Criteria:**
- [ ] Detect significant visual changes between frames
- [ ] Group related frames into scenes
- [ ] Generate scene-specific commentary
- [ ] Show scene markers on video timeline

**Story Points**: 5 | **Priority**: Should Have

---

**US-04-06: Commentary Timeline**
> As a traveler, I want to see expert commentary markers on the video seek bar so that I can navigate to specific insights.

**Acceptance Criteria:**
- [ ] Display colored markers for each expert
- [ ] Click marker to jump to that timestamp
- [ ] Show expert icon/name on hover
- [ ] Markers don't overlap (smart positioning)

**Story Points**: 3 | **Priority**: Should Have

---

**US-04-07: Video Export with Captions**
> As a traveler, I want to export my video with burned-in commentary captions so that I can share it with context.

**Acceptance Criteria:**
- [ ] Generate SRT/VTT subtitle file
- [ ] Export video with embedded captions (FFmpeg)
- [ ] Choose caption style (font, size, position)
- [ ] Progress indicator during export

**Story Points**: 5 | **Priority**: Should Have

---

### 3. Audio Expert Commentary (18 points)

**US-04-08: Audio Transcription**
> As a traveler, I want my audio recordings transcribed so that I can read what was said.

**Acceptance Criteria:**
- [ ] Accept MP3, WAV, M4A, OGG formats
- [ ] Transcribe with Gemini API
- [ ] Speaker diarization when multiple voices
- [ ] Display transcript with timestamps

**Story Points**: 5 | **Priority**: Must Have

---

**US-04-09: Expert Transcript Annotations**
> As a traveler, I want AI experts to annotate my transcript with context and corrections so that I get accurate information.

**Acceptance Criteria:**
- [ ] Inline annotations (fact-check, translation, context)
- [ ] Color-coded by expert
- [ ] Click annotation to see full explanation
- [ ] Expert summary at end of transcript

**Story Points**: 5 | **Priority**: Must Have

---

**US-04-10: Ambient Sound Detection**
> As a traveler, I want the system to identify ambient sounds so that I know the context of my recording.

**Acceptance Criteria:**
- [ ] Detect common travel sounds (market, church bells, traffic)
- [ ] Add context notes to transcript ("Background: busy market")
- [ ] Identify music and language spoken
- [ ] Low-confidence indicators for uncertain detection

**Story Points**: 3 | **Priority**: Could Have

---

**US-04-11: Multi-Language Support**
> As a traveler, I want recordings in other languages translated so that I can understand what was said.

**Acceptance Criteria:**
- [ ] Detect language automatically
- [ ] Translation Expert provides translations inline
- [ ] Show original + translated text
- [ ] Support 11 languages minimum

**Story Points**: 5 | **Priority**: Should Have

---

### 4. Expert System (13 points)

**US-04-12: Expert Detection**
> As a traveler, I want relevant AI experts automatically suggested based on my content so that I get specialized insights.

**Acceptance Criteria:**
- [ ] Pattern matching on visual/audio content
- [ ] Location-based expert suggestions
- [ ] Show top 3-4 experts with confidence scores
- [ ] User can confirm or change selection

**Story Points**: 5 | **Priority**: Must Have

---

**US-04-13: Expert Registry**
> As a system administrator, I want a registry of AI expert personas so that the system can provide diverse perspectives.

**Acceptance Criteria:**
- [ ] 6 built-in travel experts (Historian, Cultural, Translation, Architecture, Nature, Culinary)
- [ ] Expert profiles with detection triggers
- [ ] Unique voice/personality per expert
- [ ] Extensible for future experts

**Story Points**: 3 | **Priority**: Must Have

---

**US-04-14: Expert Confirmation UI**
> As a traveler, I want to confirm or adjust expert selection before generating commentary so that I get relevant perspectives.

**Acceptance Criteria:**
- [ ] Show suggested experts with reasons
- [ ] Checkbox to include/exclude experts
- [ ] Search/filter available experts
- [ ] "Generate Commentary" button

**Story Points**: 5 | **Priority**: Must Have

---

### 5. Contextual Enrichment (8 points)

**US-04-15: Weather Context**
> As a traveler, I want the weather at capture time included so that commentary references conditions.

**Acceptance Criteria:**
- [ ] Query OpenWeather API with GPS + timestamp
- [ ] Display weather summary (sunny, 24C, light breeze)
- [ ] Experts reference weather when relevant
- [ ] Graceful fallback when data unavailable

**Story Points**: 3 | **Priority**: Should Have

---

**US-04-16: Holiday & Event Context**
> As a traveler, I want holidays and events at the location included so that experts explain significance.

**Acceptance Criteria:**
- [ ] Query Calendarific for holidays
- [ ] Check local events (Eventbrite, Predicthq)
- [ ] Experts reference relevant celebrations
- [ ] Show event info in context panel

**Story Points**: 5 | **Priority**: Could Have

---

### 6. TTS Voice-Over (13 points)

**US-04-17: Text-to-Speech Narration**
> As a traveler, I want expert commentary read aloud so that I can listen like a documentary.

**Acceptance Criteria:**
- [ ] Web Speech API for offline capability
- [ ] Azure Cognitive Services for high quality
- [ ] Unique voice per expert persona
- [ ] Synced with video playback

**Story Points**: 5 | **Priority**: Should Have

---

**US-04-18: Voice Settings**
> As a traveler, I want to choose voice settings for narration so that I can customize the experience.

**Acceptance Criteria:**
- [ ] Select voice per expert
- [ ] Adjust speech rate
- [ ] Toggle narrator on/off
- [ ] Preview voice before applying

**Story Points**: 3 | **Priority**: Should Have

---

**US-04-19: Video Export with Narration**
> As a traveler, I want to export my video with AI narration audio track so that I can share a complete documentary-style video.

**Acceptance Criteria:**
- [ ] Mix narration audio with original (duck existing audio)
- [ ] Export as MP4 with embedded audio
- [ ] Choose audio balance (narration vs original)
- [ ] Progress indicator during export

**Story Points**: 5 | **Priority**: Could Have

---

### 7. Social Media Generation (13 points)

**US-04-20: Platform Selection**
> As a traveler, I want to choose a social media platform so that content is optimized for that platform.

**Acceptance Criteria:**
- [ ] Support Instagram Reel/Post, TikTok, YouTube Shorts, Facebook, Twitter
- [ ] Show platform constraints (duration, aspect ratio, character limits)
- [ ] Platform-specific templates
- [ ] Remember last used platform

**Story Points**: 3 | **Priority**: Should Have

---

**US-04-21: AI Caption Generation**
> As a traveler, I want AI-generated captions in multiple styles so that I can choose what fits my voice.

**Acceptance Criteria:**
- [ ] Generate 3-5 caption options per post
- [ ] Styles: informative, casual, inspirational, funny, storytelling
- [ ] Platform-appropriate length
- [ ] Include/exclude emojis option

**Story Points**: 3 | **Priority**: Should Have

---

**US-04-22: Hashtag Recommendations**
> As a traveler, I want relevant hashtag suggestions so that my posts get discovered.

**Acceptance Criteria:**
- [ ] Location-based hashtags
- [ ] Topic-based hashtags
- [ ] Show popularity indicators
- [ ] Drag to add/remove

**Story Points**: 2 | **Priority**: Should Have

---

**US-04-23: Music Suggestions**
> As a traveler, I want music suggestions matching my content mood so that my videos have appropriate audio.

**Acceptance Criteria:**
- [ ] Mood-based matching from content analysis
- [ ] Show trending audio options
- [ ] Preview audio before selecting
- [ ] Copyright-safe recommendations

**Story Points**: 3 | **Priority**: Could Have

---

**US-04-24: Scene Sequencer**
> As a traveler, I want to arrange my best moments into a story sequence so that my post tells a narrative.

**Acceptance Criteria:**
- [ ] AI suggests optimal order
- [ ] Drag-and-drop to reorder
- [ ] Trim clips to key moments
- [ ] Add transitions between scenes

**Story Points**: 2 | **Priority**: Could Have

---

## Story Point Summary

| Category | Story Points |
|----------|-------------|
| Photo Commentary | 13 |
| Video Commentary | 21 |
| Audio Commentary | 18 |
| Expert System | 13 |
| Context Enrichment | 8 |
| TTS Voice-Over | 13 |
| Social Media | 13 |
| **Total** | **89** |

---

## Sprint Breakdown

### Phase 1: Core Infrastructure (Weeks 1-2)
- US-04-02: GPS-Based Landmark Detection (5 pts)
- US-04-12: Expert Detection (5 pts)
- US-04-13: Expert Registry (3 pts)
- US-04-14: Expert Confirmation UI (5 pts)
**Total: 18 points**

### Phase 2: Photo Commentary (Week 3)
- US-04-01: Photo Upload & Analysis (3 pts)
- US-04-03: Photo Expert Panel (5 pts)
**Total: 8 points**

### Phase 3: Video Commentary (Weeks 4-5)
- US-04-04: Silent Video Commentary (8 pts)
- US-04-05: Scene Detection (5 pts)
- US-04-06: Commentary Timeline (3 pts)
- US-04-07: Video Export with Captions (5 pts)
**Total: 21 points**

### Phase 4: Audio Commentary (Weeks 6-7)
- US-04-08: Audio Transcription (5 pts)
- US-04-09: Expert Transcript Annotations (5 pts)
- US-04-10: Ambient Sound Detection (3 pts)
- US-04-11: Multi-Language Support (5 pts)
**Total: 18 points**

### Phase 5: TTS Voice-Over (Weeks 8-9)
- US-04-17: Text-to-Speech Narration (5 pts)
- US-04-18: Voice Settings (3 pts)
- US-04-19: Video Export with Narration (5 pts)
**Total: 13 points**

### Phase 6: Context & Polish (Week 10)
- US-04-15: Weather Context (3 pts)
- US-04-16: Holiday & Event Context (5 pts)
**Total: 8 points**

### Phase 7: Social Media (Weeks 11-12)
- US-04-20: Platform Selection (3 pts)
- US-04-21: AI Caption Generation (3 pts)
- US-04-22: Hashtag Recommendations (2 pts)
- US-04-23: Music Suggestions (3 pts)
- US-04-24: Scene Sequencer (2 pts)
**Total: 13 points**

---

## Technical Dependencies

### APIs Required
- **Google Gemini** - Vision API for photo/video, transcription for audio
- **Google Places** - Landmark identification from GPS
- **OpenWeather** - Historical weather data
- **Calendarific** - Holiday calendar
- **Eventbrite/Predicthq** - Local events
- **Azure Cognitive Services** - High-quality TTS (optional)

### Libraries
- **exifr** - EXIF metadata parsing
- **FFmpeg.wasm** - Video frame extraction, audio mixing
- **music-metadata** - Audio file metadata
- **Web Speech API** - Browser-native TTS

### Packages Modified
- `packages/types` - Add MediaLocation, CommentaryEntry, SocialMediaSession types
- `packages/ai-services` - Add Gemini Vision methods
- `packages/ui` - Add travel/ and social/ component folders

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| GPS not available in media | Reduced landmark accuracy | Manual location pinning fallback |
| Gemini API rate limits | Commentary generation fails | Queue requests, retry logic |
| Large video processing time | Poor UX | Background processing, progress indicators |
| TTS voice quality varies | Inconsistent experience | Multiple provider fallback |
| Music copyright concerns | Legal issues | Use royalty-free sources only |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Landmark identification accuracy | 85%+ |
| Expert relevance (user confirms) | 90%+ |
| Commentary generation time | < 30 sec (photo), < 2 min (video) |
| TTS quality rating | 4/5 average |
| Social post export success | 95%+ |

---

## Personas Served

| Persona | Primary Features |
|---------|-----------------|
| **Emma (Backpacker)** | Photo commentary for landmarks, translation expert |
| **Sofia (Luxury Traveler)** | Video narration, social media generation |
| **Chen (Cultural Immersion)** | Audio transcription, multi-language support |
| **Marco (Tour Guide)** | Video export for client demos, TTS narration |
| **The Robertsons (Family)** | Photo memories with context, easy social sharing |

---

## Expert Feedback Integration

From previous expert reviews:

- **AI & NLP Expert**: Noise reduction for audio, proper noun recognition
- **UX Expert**: Offline-first for analysis results, clear progress indicators
- **Privacy Expert**: Don't upload GPS without consent, anonymize before export
- **Performance Expert**: Cache analysis results, progressive loading for large videos

---

**Created**: December 22, 2024
**Status**: Planned
**Dependencies**: Sprint 01-03 (Travel data model, GPS capture, integrations)
