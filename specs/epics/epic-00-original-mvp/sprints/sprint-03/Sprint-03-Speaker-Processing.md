# Sprint 3: Speaker Diarization & Transcript Processing

**Duration**: 2 weeks (Weeks 5-6)
**Sprint Goal**: Enhance speaker identification, refine transcript data model, and create robust processing pipeline.

---

## Sprint Objectives

1. Improve speaker diarization accuracy and handling
2. Implement speaker merging/deduplication logic
3. Refine transcript data model with complete metadata
4. Add confidence thresholds and quality indicators
5. Create working demo with multi-speaker transcript

---

## User Stories

### Story 1: Improved Speaker Identification

**As a** user
**I want** speakers to be accurately identified and labeled
**So that** I can distinguish who said what in the transcript

**Acceptance Criteria**:

- [ ] Each speaker has unique ID and color
- [ ] Speaker labels are consistent across transcript
- [ ] Minimum 2 speakers supported, maximum 10
- [ ] Speaker transitions are clearly marked

### Story 2: Transcript Quality Indicators

**As a** user
**I want** to see confidence scores for transcript segments
**So that** I can assess the reliability of the transcription

**Acceptance Criteria**:

- [ ] Confidence scores displayed as percentage
- [ ] Low confidence segments highlighted (< 70%)
- [ ] Overall transcript quality score shown
- [ ] Warnings for very low confidence sections

---

## Technical Tasks

### Task 3.1: Speaker Processing Enhancement

**Estimated Effort**: 2 days

**Implementation**:

```typescript
// src/services/speakerProcessor.ts

export class SpeakerProcessor {
  /**
   * Merge speakers that may be duplicates
   */
  mergeSimilarSpeakers(
    entries: TranscriptEntry[],
    threshold: number = 0.85
  ): TranscriptEntry[] {
    // Group by speaker similarity (based on voice patterns, timing, etc.)
    // For now, trust Gemini's speaker IDs
    return entries
  }

  /**
   * Assign colors to speakers
   */
  assignSpeakerColors(speakers: Speaker[]): Speaker[] {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // emerald
      '#A855F7', // purple
      '#F59E0B', // amber
      '#EF4444', // red
      '#06B6D4', // cyan
      '#8B5CF6', // violet
      '#EC4899', // pink
    ]

    return speakers.map((speaker, index) => ({
      ...speaker,
      color: colors[index % colors.length],
    }))
  }

  /**
   * Calculate speaker statistics
   */
  calculateSpeakerStats(transcript: TranscriptData): Speaker[] {
    const speakerStats = new Map<
      number,
      {
        segmentCount: number
        totalDuration: number
      }
    >()

    transcript.entries.forEach(entry => {
      const stats = speakerStats.get(entry.speakerNumber) || {
        segmentCount: 0,
        totalDuration: 0,
      }

      stats.segmentCount++
      stats.totalDuration += entry.endTime - entry.startTime

      speakerStats.set(entry.speakerNumber, stats)
    })

    return transcript.speakers.map(speaker => ({
      ...speaker,
      segmentCount: speakerStats.get(speaker.id)?.segmentCount || 0,
      totalDuration: speakerStats.get(speaker.id)?.totalDuration || 0,
    }))
  }
}
```

### Task 3.2: Transcript Validation & Quality Checks

**Estimated Effort**: 2 days

```typescript
// src/services/transcriptValidator.ts

export class TranscriptValidator {
  validateTranscript(transcript: TranscriptData): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Check for gaps in timeline
    for (let i = 0; i < transcript.entries.length - 1; i++) {
      const current = transcript.entries[i]
      const next = transcript.entries[i + 1]

      const gap = next.startTime - current.endTime

      if (gap > 5) {
        warnings.push(
          `Large gap (${gap.toFixed(1)}s) between segments ${i} and ${i + 1}`
        )
      }

      if (gap < 0) {
        errors.push(`Overlapping segments: ${i} and ${i + 1}`)
      }
    }

    // Check confidence scores
    const lowConfidenceSegments = transcript.entries.filter(
      entry => (entry.confidence || 1) < 0.7
    )

    if (lowConfidenceSegments.length > 0) {
      warnings.push(
        `${lowConfidenceSegments.length} segments have low confidence (< 70%)`
      )
    }

    // Calculate overall quality score
    const avgConfidence =
      transcript.entries.reduce(
        (sum, entry) => sum + (entry.confidence || 1),
        0
      ) / transcript.entries.length

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      qualityScore: avgConfidence,
    }
  }
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  qualityScore: number
}
```

### Task 3.3: Enhanced Metadata Management

**Estimated Effort**: 1 day

```typescript
// src/types/transcript.ts

export interface TranscriptMetadata {
  // File info
  fileName: string
  fileSize: number
  videoFormat: string

  // Timing info
  duration: number
  createdAt: string
  processedAt: string

  // Processing info
  model: string
  language?: string
  processingTime?: number

  // Quality metrics
  overallConfidence: number
  speakerCount: number
  segmentCount: number

  // Validation
  validationErrors?: string[]
  validationWarnings?: string[]
}
```

### Task 3.4: Testing Suite

**Estimated Effort**: 3 days

**Test Coverage**:

- Speaker processing logic
- Validation and quality checks
- Edge cases (single speaker, 10+ speakers, overlapping segments)
- Performance tests with large transcripts (1000+ segments)

---

## Definition of Done

- [ ] All user stories completed
- [ ] Speaker processing robust with multiple speakers
- [ ] Quality validation working
- [ ] Test coverage ≥ 80%
- [ ] **Working demo**: Transcript with 3+ speakers, quality indicators
- [ ] Code reviewed and merged

---

## Demo

**Demo Script**:

1. Upload video with 3+ speakers
2. Show speaker identification with colors
3. Display speaker statistics (segment count, duration)
4. Show confidence scores and quality metrics
5. Demonstrate validation warnings (if any)

---

**Sprint 3 Plan Version**: 1.0
**Created**: 2025-12-17
