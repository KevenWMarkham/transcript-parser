# Sprint 1: Foundation & Video Upload Component

**Duration**: 2 weeks (Weeks 1-2)
**Sprint Goal**: Deliver a fully functional video upload component with validation, preview, and comprehensive testing.

---

## Sprint Objectives

1. Enhance existing `UploadVideo` component with full drag-and-drop support
2. Implement comprehensive file validation
3. Add video preview with metadata display
4. Create working demo with polished UX
5. Achieve 80%+ test coverage for upload functionality

---

## User Stories

### Story 1: Video File Upload

**As a** user
**I want to** upload a video file by clicking or dragging
**So that** I can generate a transcript from my video

**Acceptance Criteria**:

- [ ] User can click "Choose File" button to browse files
- [ ] User can drag and drop a video file onto the upload zone
- [ ] Visual feedback shows when file is being dragged over zone
- [ ] Only video files (MP4, MOV, AVI, WebM) are accepted
- [ ] Files larger than 2GB are rejected with clear error message
- [ ] Selected file displays name, size, and duration

### Story 2: Video Preview

**As a** user
**I want to** preview my uploaded video
**So that** I can confirm it's the correct file before processing

**Acceptance Criteria**:

- [ ] Video preview player displays after file selection
- [ ] Video controls (play, pause, seek) are functional
- [ ] File metadata is displayed (name, size, format, duration)
- [ ] User can clear/remove the selected video
- [ ] "Remove" button resets to initial upload state

### Story 3: File Validation

**As a** user
**I want to** receive clear error messages for invalid files
**So that** I understand why my file was rejected

**Acceptance Criteria**:

- [ ] Non-video files show error: "Invalid file type. Please select a video file."
- [ ] Oversized files show error: "File too large. Maximum size is 2GB."
- [ ] Corrupted files show error: "Unable to read file. Please try another."
- [ ] Errors are displayed prominently with red styling
- [ ] Errors clear when valid file is selected

---

## Technical Tasks

### Task 1.1: Enhance VideoUploader Component

**Estimated Effort**: 3 days

**Subtasks**:

1. Implement real drag-and-drop handlers (currently stubbed)
2. Add file validation logic (type, size, readability)
3. Extract video metadata (duration, dimensions, codec)
4. Add clear/remove file functionality
5. Improve accessibility (ARIA labels, keyboard support)

**Implementation Notes**:

```typescript
// src/components/UploadVideo.tsx enhancements

interface VideoMetadata {
  duration: number // seconds
  width: number
  height: number
  format: string
  size: number
}

function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        format: file.type,
        size: file.size,
      })
    }

    video.onerror = () => reject(new Error('Unable to read video file'))
    video.src = URL.createObjectURL(file)
  })
}
```

**Testing**:

- Unit tests for validation functions
- Component tests for drag-and-drop interactions
- Integration test for full upload flow
- Accessibility test with jest-axe

---

### Task 1.2: Create Video Preview Component

**Estimated Effort**: 2 days

**Subtasks**:

1. Create `VideoPreview` component
2. Display video with HTML5 video player
3. Show metadata in formatted card
4. Add remove/clear button
5. Style with Tailwind + glassmorphism

**Component Specification**:

```typescript
// src/components/VideoPreview.tsx

interface VideoPreviewProps {
  file: File
  metadata: VideoMetadata
  onRemove: () => void
}

export function VideoPreview({ file, metadata, onRemove }: VideoPreviewProps) {
  const videoUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(videoUrl)
  }, [videoUrl])

  return (
    <div className="video-preview">
      <video src={videoUrl} controls />
      <div className="metadata">
        <p>Name: {file.name}</p>
        <p>Size: {formatFileSize(metadata.size)}</p>
        <p>Duration: {formatDuration(metadata.duration)}</p>
        <p>Resolution: {metadata.width}x{metadata.height}</p>
      </div>
      <button onClick={onRemove}>Remove Video</button>
    </div>
  )
}
```

**Testing**:

- Component renders video correctly
- Metadata displays formatted values
- Remove button calls onRemove callback
- URL cleanup on unmount (no memory leaks)

---

### Task 1.3: Add Utility Functions

**Estimated Effort**: 1 day

**Subtasks**:

1. `formatFileSize(bytes)` - Convert bytes to human-readable (KB, MB, GB)
2. `formatDuration(seconds)` - Convert seconds to MM:SS or HH:MM:SS
3. `validateVideoFile(file)` - Comprehensive validation
4. `getAcceptedFormats()` - Return list of supported MIME types

**Implementation**:

```typescript
// src/utils/fileUtils.ts

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`
  }
  return `${minutes}:${pad(secs)}`
}

function pad(num: number): string {
  return num.toString().padStart(2, '0')
}

export const ACCEPTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/quicktime', // MOV
  'video/x-msvideo', // AVI
  'video/webm',
]

export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024 // 2GB

export function validateVideoFile(file: File): ValidationResult {
  if (!ACCEPTED_VIDEO_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error:
        'Invalid file type. Please select a video file (MP4, MOV, AVI, WebM).',
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`,
    }
  }

  return { valid: true }
}

interface ValidationResult {
  valid: boolean
  error?: string
}
```

**Testing**:

- Unit test all edge cases (0 bytes, exact limits, etc.)
- Test all supported video formats
- Test file size edge cases (exactly 2GB, 2GB + 1 byte)

---

### Task 1.4: Update App.tsx Integration

**Estimated Effort**: 1 day

**Subtasks**:

1. Add state management for uploaded video
2. Connect VideoUploader to app state
3. Show VideoPreview when file selected
4. Add basic error handling UI

**Implementation**:

```typescript
// src/App.tsx updates

interface AppState {
  videoFile: File | null
  videoMetadata: VideoMetadata | null
  uploadError: string | null
}

export default function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleVideoUpload = async (file: File) => {
    setUploadError(null)

    const validation = validateVideoFile(file)
    if (!validation.valid) {
      setUploadError(validation.error!)
      return
    }

    try {
      const metadata = await extractVideoMetadata(file)
      setVideoFile(file)
      setVideoMetadata(metadata)
    } catch (error) {
      setUploadError((error as Error).message)
    }
  }

  const handleRemoveVideo = () => {
    setVideoFile(null)
    setVideoMetadata(null)
    setUploadError(null)
  }

  return (
    <div className="app">
      <Header />

      {!videoFile ? (
        <UploadVideo onUpload={handleVideoUpload} error={uploadError} />
      ) : (
        <VideoPreview
          file={videoFile}
          metadata={videoMetadata!}
          onRemove={handleRemoveVideo}
        />
      )}
    </div>
  )
}
```

---

### Task 1.5: Testing Suite

**Estimated Effort**: 3 days

**Test Files to Create**:

1. `src/utils/fileUtils.test.ts` - Unit tests for utilities
2. `src/components/UploadVideo.test.tsx` - Component tests
3. `src/components/VideoPreview.test.tsx` - Component tests
4. `src/App.test.tsx` - Integration tests
5. `tests/e2e/video-upload.spec.ts` - E2E tests

**Coverage Goals**:

- [ ] 100% coverage for utility functions
- [ ] 85% coverage for components
- [ ] All happy path scenarios tested
- [ ] All error scenarios tested
- [ ] Accessibility tests passing (no axe violations)

**Key Test Cases**:

```typescript
// Example: src/components/UploadVideo.test.tsx

describe('UploadVideo Component', () => {
  it('accepts drag-and-drop file upload', async () => {
    const user = userEvent.setup()
    const onUpload = jest.fn()

    render(<UploadVideo onUpload={onUpload} />)

    const file = new File(['video'], 'test.mp4', { type: 'video/mp4' })
    const dropZone = screen.getByTestId('upload-drop-zone')

    await user.upload(dropZone, file)

    expect(onUpload).toHaveBeenCalledWith(file)
  })

  it('shows drag-over state when file is dragged', () => {
    render(<UploadVideo onUpload={jest.fn()} />)

    const dropZone = screen.getByTestId('upload-drop-zone')

    fireEvent.dragEnter(dropZone)
    expect(dropZone).toHaveClass('dragging')

    fireEvent.dragLeave(dropZone)
    expect(dropZone).not.toHaveClass('dragging')
  })

  it('displays error for invalid file type', () => {
    render(<UploadVideo onUpload={jest.fn()} error="Invalid file type" />)

    expect(screen.getByText(/invalid file type/i)).toBeInTheDocument()
  })
})
```

---

## Definition of Done

Sprint 1 is complete when:

- [ ] All user stories meet acceptance criteria
- [ ] All technical tasks completed
- [ ] Test coverage ≥ 80% for new code
- [ ] All tests passing (unit, integration, E2E)
- [ ] No linting errors or warnings
- [ ] Code reviewed and approved
- [ ] Accessibility audit passed (jest-axe)
- [ ] Manual testing in Chrome, Firefox, Safari
- [ ] **Working demo ready**: User can upload video, see preview, and remove
- [ ] Sprint demo presented to stakeholders
- [ ] Documentation updated (if needed)

---

## Demo Preparation

### Demo Script

1. **Open application** in browser
2. **Show initial state**: Clean upload interface with drag-and-drop zone
3. **Drag invalid file** (e.g., PDF): Show error message
4. **Drag oversized file** (simulated): Show size error
5. **Upload valid video** (MP4): Show successful upload
6. **Verify preview**: Video plays, metadata displays correctly
7. **Click remove button**: Returns to initial state
8. **Accessibility demo**: Navigate with keyboard (Tab, Enter)

### Demo Assets Needed

- Sample MP4 file (< 2GB)
- Sample invalid file (PDF or text)
- Sample oversized video (or mock for demo)

---

## Risks & Mitigation

| Risk                                            | Impact | Probability | Mitigation                                                            |
| ----------------------------------------------- | ------ | ----------- | --------------------------------------------------------------------- |
| Browser compatibility issues with drag-and-drop | Medium | Low         | Test early in Chrome, Firefox, Safari; use standard File API          |
| Video metadata extraction fails on some formats | Medium | Medium      | Add robust error handling; gracefully degrade (show partial metadata) |
| Large files cause browser lag                   | High   | Medium      | Show loading spinner during metadata extraction; consider Web Workers |
| Accessibility issues discovered late            | Medium | Low         | Run jest-axe tests from day 1; manual testing with screen reader      |

---

## Dependencies

**External**:

- None (all client-side)

**Internal**:

- Existing Header component
- Tailwind CSS configuration
- shadcn/ui Button component

---

## Team Assignments (Example)

- **Developer 1**: Tasks 1.1, 1.4 (Component enhancement, integration)
- **Developer 2**: Tasks 1.2, 1.3 (VideoPreview, utilities)
- **QA Engineer**: Task 1.5 (Testing suite, E2E tests)
- **Designer**: UX review, accessibility consultation

---

## Next Sprint Preview

**Sprint 2** will focus on:

- Gemini AI integration
- Audio extraction from video
- Basic transcription (mocked for demo)
- Processing status updates

**Handoff Requirements**:

- Video file and metadata available in App state
- Clear separation of concerns (upload vs. processing)

---

**Sprint 1 Plan Version**: 1.0
**Created**: 2025-12-17
**Sprint Start Date**: [To be scheduled]
**Sprint End Date**: [To be scheduled]
