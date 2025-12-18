# Test Fixtures

This directory contains test files used for E2E and integration testing.

## Required Files for Sprint 1

To run the complete E2E test suite, you'll need to add the following files:

### Video Files

- **sample.mp4** - A small valid MP4 video file (recommended: 5-10 seconds, < 5MB)
  - Used for testing successful upload and preview
  - Should have clear audio for transcription testing in later sprints

- **large-video.mp4** - A video file > 2GB (for testing size validation)
  - Used to test file size limit error handling
  - Can be mocked in tests if storage is a concern

### Invalid Files

- **document.pdf** - A PDF file for testing invalid file type rejection
  - Used to test file type validation
  - Any small PDF document will work

### Creating Test Video Files

If you need to create test video files, you can:

1. Use a screen recording tool to create a short clip
2. Use FFmpeg to create a minimal test video:

```bash
# Create a 5-second test video
ffmpeg -f lavfi -i testsrc=duration=5:size=1280x720:rate=30 -f lavfi -i sine=frequency=1000:duration=5 -pix_fmt yuv420p sample.mp4
```

3. Download Creative Commons licensed videos from:
   - [Pexels](https://www.pexels.com/videos/)
   - [Pixabay](https://www.pixabay.com/videos/)

## Note

Test fixture files are excluded from git via `.gitignore` to keep the repository size small. Each developer should add their own test files locally.
