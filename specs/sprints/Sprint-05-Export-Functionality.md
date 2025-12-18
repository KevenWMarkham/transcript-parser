# Sprint 5: Export Functionality (JSON, SRT, VTT)

**Duration**: 2 weeks (Weeks 9-10)
**Sprint Goal**: Implement robust export functionality for JSON, SRT, and VTT formats with validation.

---

## Sprint Objectives

1. Implement JSON export with complete data
2. Implement SRT export with proper formatting
3. Implement VTT export with speaker tags
4. Add format validation and testing
5. Create working demo with all export formats

---

## User Stories

### Story 1: Export to JSON

**As a** user
**I want to** export my transcript as JSON
**So that** I can process it programmatically or import it later

**Acceptance Criteria**:

- [ ] Export button downloads JSON file
- [ ] JSON includes all transcript data (entries, speakers, metadata)
- [ ] File named with timestamp: `transcript-filename-YYYY-MM-DD.json`
- [ ] Valid JSON format (parseable)
- [ ] Pretty-printed for readability

### Story 2: Export to SRT

**As a** user
**I want to** export my transcript as SRT subtitles
**So that** I can use it with video players

**Acceptance Criteria**:

- [ ] SRT format follows specification
- [ ] Speaker names included in subtitle text
- [ ] Timestamps accurate (HH:MM:SS,mmm format)
- [ ] File validated against SRT parser
- [ ] Works in VLC, YouTube, etc.

### Story 3: Export to VTT

**As a** user
**I want to** export my transcript as WebVTT
**So that** I can use it for web video accessibility

**Acceptance Criteria**:

- [ ] VTT format includes WEBVTT header
- [ ] Speaker voice tags included (`<v Speaker Name>`)
- [ ] Timestamps in VTT format (HH:MM:SS.mmm)
- [ ] Validated against WebVTT specification
- [ ] Works in HTML5 video player

---

## Technical Tasks

### Task 5.1: JSON Exporter

**Estimated Effort**: 1 day

```typescript
// src/services/exporters/jsonExporter.ts

export class JSONExporter {
  export(transcript: TranscriptData): string {
    return JSON.stringify(transcript, null, 2)
  }

  download(transcript: TranscriptData): void {
    const content = this.export(transcript)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = this.generateFilename(transcript, 'json')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  private generateFilename(
    transcript: TranscriptData,
    extension: string
  ): string {
    const baseName = transcript.metadata.fileName.replace(/\.[^/.]+$/, '')
    const date = new Date().toISOString().split('T')[0]
    return `transcript-${baseName}-${date}.${extension}`
  }
}
```

### Task 5.2: SRT Exporter

**Estimated Effort**: 2 days

```typescript
// src/services/exporters/srtExporter.ts

export class SRTExporter {
  export(transcript: TranscriptData): string {
    return transcript.entries
      .map((entry, index) => {
        const startTime = this.formatSRTTime(entry.startTime)
        const endTime = this.formatSRTTime(entry.endTime)

        return `${index + 1}
${startTime} --> ${endTime}
${entry.speaker}: ${entry.text}
`
      })
      .join('\n')
  }

  private formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)

    return `${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(secs, 2)},${this.pad(ms, 3)}`
  }

  private pad(num: number, size: number): string {
    return num.toString().padStart(size, '0')
  }

  download(transcript: TranscriptData): void {
    const content = this.export(transcript)
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = this.generateFilename(transcript, 'srt')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  private generateFilename(
    transcript: TranscriptData,
    extension: string
  ): string {
    const baseName = transcript.metadata.fileName.replace(/\.[^/.]+$/, '')
    const date = new Date().toISOString().split('T')[0]
    return `transcript-${baseName}-${date}.${extension}`
  }
}
```

### Task 5.3: VTT Exporter

**Estimated Effort**: 2 days

```typescript
// src/services/exporters/vttExporter.ts

export class VTTExporter {
  export(transcript: TranscriptData): string {
    const header = 'WEBVTT\n\n'

    const cues = transcript.entries
      .map((entry, index) => {
        const startTime = this.formatVTTTime(entry.startTime)
        const endTime = this.formatVTTTime(entry.endTime)

        return `${index + 1}
${startTime} --> ${endTime}
<v ${entry.speaker}>${entry.text}
`
      })
      .join('\n')

    return header + cues
  }

  private formatVTTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)

    return `${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(secs, 2)}.${this.pad(ms, 3)}`
  }

  private pad(num: number, size: number): string {
    return num.toString().padStart(size, '0')
  }

  download(transcript: TranscriptData): void {
    const content = this.export(transcript)
    const blob = new Blob([content], { type: 'text/vtt; charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = this.generateFilename(transcript, 'vtt')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  private generateFilename(
    transcript: TranscriptData,
    extension: string
  ): string {
    const baseName = transcript.metadata.fileName.replace(/\.[^/.]+$/, '')
    const date = new Date().toISOString().split('T')[0]
    return `transcript-${baseName}-${date}.${extension}`
  }
}
```

### Task 5.4: Export UI Component

**Estimated Effort**: 1 day

```typescript
// src/components/ExportButtons.tsx

interface ExportButtonsProps {
  transcript: TranscriptData
}

export function ExportButtons({ transcript }: ExportButtonsProps) {
  const jsonExporter = useMemo(() => new JSONExporter(), [])
  const srtExporter = useMemo(() => new SRTExporter(), [])
  const vttExporter = useMemo(() => new VTTExporter(), [])

  return (
    <div className="export-buttons">
      <Button onClick={() => jsonExporter.download(transcript)}>
        <FileJson className="w-4 h-4 mr-2" />
        Export JSON
      </Button>

      <Button onClick={() => srtExporter.download(transcript)}>
        <FileText className="w-4 h-4 mr-2" />
        Export SRT
      </Button>

      <Button onClick={() => vttExporter.download(transcript)}>
        <FileCode className="w-4 h-4 mr-2" />
        Export VTT
      </Button>
    </div>
  )
}
```

### Task 5.5: Format Validation

**Estimated Effort**: 2 days

```typescript
// src/services/validators/srtValidator.ts

export class SRTValidator {
  validate(content: string): ValidationResult {
    const errors: string[] = []
    const blocks = content.split('\n\n').filter(b => b.trim())

    blocks.forEach((block, index) => {
      const lines = block.split('\n')

      // Check sequence number
      if (!/^\d+$/.test(lines[0])) {
        errors.push(`Block ${index + 1}: Invalid sequence number`)
      }

      // Check timestamp format
      if (
        !/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(lines[1])
      ) {
        errors.push(`Block ${index + 1}: Invalid timestamp format`)
      }

      // Check subtitle text exists
      if (lines.length < 3) {
        errors.push(`Block ${index + 1}: Missing subtitle text`)
      }
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

// Similar validators for VTT and JSON
```

### Task 5.6: Testing

**Estimated Effort**: 2 days

**Test Coverage**:

- Unit tests for each exporter
- Time formatting edge cases (0:00, 59:59, 23:59:59)
- Validation tests for each format
- Integration tests for download functionality
- E2E tests for export flow

```typescript
// src/services/exporters/srtExporter.test.ts

describe('SRTExporter', () => {
  it('formats time correctly', () => {
    const exporter = new SRTExporter()

    expect(exporter['formatSRTTime'](0)).toBe('00:00:00,000')
    expect(exporter['formatSRTTime'](65.5)).toBe('00:01:05,500')
    expect(exporter['formatSRTTime'](3665.123)).toBe('01:01:05,123')
  })

  it('exports valid SRT format', () => {
    const exporter = new SRTExporter()
    const transcript = createMockTranscript()

    const srt = exporter.export(transcript)
    const validator = new SRTValidator()
    const result = validator.validate(srt)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('includes speaker names in subtitles', () => {
    const exporter = new SRTExporter()
    const transcript = createMockTranscript()

    const srt = exporter.export(transcript)

    expect(srt).toContain('Speaker 1:')
    expect(srt).toContain('Speaker 2:')
  })
})
```

---

## Definition of Done

- [ ] All three export formats working
- [ ] Format validation passing
- [ ] Exported files validated with external tools
- [ ] Test coverage ≥ 80%
- [ ] **Working demo**: Export transcript in all formats, verify in external players
- [ ] Code reviewed and merged

---

## Demo

1. Generate transcript from video
2. Click "Export JSON" → Open in text editor, verify format
3. Click "Export SRT" → Import into VLC, show subtitles
4. Click "Export VTT" → Load in HTML5 video player, verify
5. Show format validation results

**Demo Assets**:

- Video player (VLC or browser)
- Text editor for JSON inspection
- Sample video for testing

---

**Sprint 5 Plan Version**: 1.0
**Created**: 2025-12-17
