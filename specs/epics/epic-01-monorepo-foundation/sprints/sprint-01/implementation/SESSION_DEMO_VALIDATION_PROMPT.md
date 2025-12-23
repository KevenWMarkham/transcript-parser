# Session 2: Demo & Validation

**Sprint**: Epic 01 - Sprint 01 (Final Validation)
**Session**: Demo & Validation
**Interface**: Claude Code CLI
**Recommended Model**: Sonnet
**Date Created**: December 23, 2024
**Created By**: Orchestrator (Claude Web - Opus)

---

## Session Objective

Validate sprint deliverables in both Development and Production environments:

- Deploy to Development environment
- Run smoke tests
- Demo all sprint features
- Deploy to Production (PromptSource.live)
- Verify production functionality

---

## Pre-Session Status

### From Session 1 (Testing Completion):

| Metric             | Result           |
| ------------------ | ---------------- |
| Unit Tests         | 56 passing       |
| Unit Tests Skipped | 14               |
| E2E Desktop        | ~45 passing      |
| E2E Mobile         | 17 passing       |
| Docker Integration | ✅ Complete      |
| Branch             | master @ b7339fd |

---

## Task Breakdown

### Phase 1: Development Deployment (30 min)

**Objective**: Deploy application to local development environment using Docker

#### 1.1 Pre-flight Checks

```bash
# Ensure clean working directory
git status

# Pull latest changes
git pull origin master

# Verify Docker is running
docker info

# Check existing containers
docker ps -a
```

#### 1.2 Build and Deploy

```bash
# Build all services
docker-compose build

# Start in detached mode
docker-compose up -d

# Verify all services are healthy
docker-compose ps

# Check logs for any startup issues
docker-compose logs --tail=50
```

#### 1.3 Service Health Verification

| Service          | Port | Health Check URL              |
| ---------------- | ---- | ----------------------------- |
| App              | 3000 | http://localhost:3000         |
| Audio Server     | 3001 | http://localhost:3001/health  |
| PostgreSQL       | 5432 | Internal healthcheck          |
| N8N (if enabled) | 5678 | http://localhost:5678/healthz |

```bash
# Test each endpoint
curl -s http://localhost:3000 | head -20
curl -s http://localhost:3001/health
```

---

### Phase 2: Smoke Tests (30 min)

**Objective**: Quick validation of critical functionality

#### 2.1 Automated Smoke Tests

```bash
# Run E2E tests against local Docker deployment
BASE_URL=http://localhost:3000 pnpm test:e2e --grep "smoke"

# Or run critical flow tests only
pnpm test:e2e tests/e2e/video-upload.spec.ts
pnpm test:e2e tests/e2e/transcription-flow.spec.ts
```

#### 2.2 Manual Smoke Test Checklist

| Test Case               | Expected Result                    | Pass/Fail |
| ----------------------- | ---------------------------------- | --------- |
| App loads in browser    | Home page displays                 | [ ]       |
| Upload zone visible     | "Drop your file here" shown        | [ ]       |
| Video upload works      | File accepted, preview shown       | [ ]       |
| Audio extraction starts | Progress indicator appears         | [ ]       |
| Transcription completes | Transcript displayed with speakers | [ ]       |
| Export dialog opens     | All format options available       | [ ]       |
| Export TXT works        | File downloads correctly           | [ ]       |
| Search functionality    | Matches highlight in transcript    | [ ]       |
| Mobile responsive       | UI adapts to mobile viewport       | [ ]       |
| No console errors       | Browser console clean              | [ ]       |

---

### Phase 3: Sprint Feature Demo (45 min)

**Objective**: Demonstrate all Sprint 01 deliverables

#### 3.1 Monorepo Architecture Demo

```bash
# Show package structure
ls -la packages/

# Demonstrate independent package builds
pnpm --filter @transcript-parser/types build
pnpm --filter @transcript-parser/export build
pnpm --filter @transcript-parser/ai-services build

# Show Turborepo pipeline
pnpm turbo run build --dry-run
```

#### 3.2 Package Demonstrations

| Package            | Demo                                        |
| ------------------ | ------------------------------------------- |
| `types`            | Show TypeScript types in action             |
| `export`           | Export transcript to SRT, VTT, CSV, JSON    |
| `ai-services`      | Gemini transcription with speaker detection |
| `audio-processing` | Audio extraction from video                 |
| `database`         | Drizzle schema and connection               |
| `ui`               | Component library (6 components with tests) |
| `module-sdk`       | Module registration and lifecycle           |
| `config`           | Shared ESLint/TypeScript configurations     |

#### 3.3 Key Feature Demonstrations

1. **Video Upload & Preview**
   - Upload various formats (MP4, MP3, WAV)
   - Show video preview with metadata
   - Demonstrate file removal

2. **Transcription Pipeline**
   - Show audio extraction progress
   - Demonstrate streaming transcription
   - Display speaker diarization

3. **Transcript Interaction**
   - Search functionality with highlighting
   - Speaker filtering
   - Virtual scrolling for long transcripts

4. **Export Capabilities**
   - Export all 5 formats
   - Copy to clipboard
   - Verify file contents

5. **Multi-Device Support** (Bonus from Session 1)
   - Desktop Chrome/Edge
   - Mobile: iPhone 14, Pixel 7
   - Tablet: iPad

---

### Phase 4: Production Deployment (45 min)

**Objective**: Deploy to PromptSource.live production environment

#### 4.1 Production Pre-flight

```bash
# Verify production environment variables
cat .env.production.example

# Ensure production secrets are configured (DO NOT commit!)
# - GEMINI_API_KEY
# - DATABASE_URL
# - JWT_SECRET
# - POSTGRES_PASSWORD
```

#### 4.2 Production Deployment Steps

**Option A: Docker on VPS**

```bash
# SSH to production server
ssh user@promptsource.live

# Pull latest code
cd /opt/transcript-parser
git pull origin master

# Build and deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verify deployment
docker-compose ps
```

**Option B: Vercel (PWA)**

```bash
# Deploy to Vercel
vercel --prod

# Verify deployment
curl -s https://promptsource.live | head -20
```

#### 4.3 Production Verification

| Check                   | URL/Command                          | Status |
| ----------------------- | ------------------------------------ | ------ |
| HTTPS certificate valid | Check browser padlock                | [ ]    |
| App loads               | https://promptsource.live            | [ ]    |
| API responds            | https://api.promptsource.live/health | [ ]    |
| Upload works            | Manual test                          | [ ]    |
| Transcription works     | Manual test with short video         | [ ]    |
| Export works            | Download TXT/SRT                     | [ ]    |
| No console errors       | Browser DevTools                     | [ ]    |
| Performance acceptable  | Lighthouse audit > 80                | [ ]    |

---

### Phase 5: Performance Validation (15 min)

**Objective**: Basic performance sanity checks

#### 5.1 Lighthouse Audit

```bash
# Run Lighthouse CI (if configured)
npx lighthouse https://promptsource.live --output=json --output-path=./lighthouse-report.json

# Or use Chrome DevTools Lighthouse tab
```

**Target Scores**:
| Category | Target |
| -------------- | ------ |
| Performance | > 80 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 80 |

#### 5.2 Bundle Size Check

```bash
# Build and check bundle size
pnpm build

# Review dist folder
du -sh dist/
ls -la dist/assets/
```

---

## Expert Guidance

### Architecture Expert Recommendations:

- Verify all 8 packages build independently
- Confirm Turborepo caching is working
- Check for circular dependencies
- Validate Docker multi-stage build efficiency

### Performance Expert Recommendations:

- Monitor initial page load time (< 3s)
- Check bundle size (< 1MB gzipped)
- Verify lazy loading for FFmpeg (~30MB)
- Test with throttled network (3G)

---

## Acceptance Criteria

Before completing this session, verify:

- [ ] Development deployment working (localhost:3000)
- [ ] All smoke tests passing
- [ ] All 8 packages demonstrated working
- [ ] Production deployment successful
- [ ] Production smoke tests passing
- [ ] Lighthouse Performance > 80
- [ ] No critical console errors

---

## Troubleshooting Guide

### Common Issues

**1. Docker build fails**

```bash
# Clear Docker cache
docker system prune -af
docker-compose build --no-cache
```

**2. Database connection fails**

```bash
# Check PostgreSQL is healthy
docker-compose logs postgres
docker exec -it postgres-db pg_isready
```

**3. Audio extraction fails**

```bash
# Check audio server logs
docker-compose logs audio-server
# Verify FFmpeg is installed
docker exec -it audio-extraction ffmpeg -version
```

**4. Production SSL issues**

```bash
# Renew certificates
docker-compose exec certbot certbot renew --dry-run
```

---

## Commit Guidelines

After successful validation:

```bash
# No code changes expected in this session
# If fixes were needed, commit them:
git add .
git commit -m "fix: address demo validation issues

- [List specific fixes]"

git push origin master
```

---

## Handoff to Orchestrator

Upon completion, report back with:

1. **Deployment Status**:

   ```
   Development: ✅/❌
   Production:  ✅/❌
   ```

2. **Smoke Test Results**:

   ```
   Manual Tests: X/10 passing
   E2E Tests:    X/X passing
   ```

3. **Feature Demo**:

   ```
   ✅/❌ Monorepo builds independently
   ✅/❌ All 8 packages working
   ✅/❌ Full transcription flow
   ✅/❌ All export formats
   ✅/❌ Multi-device responsive
   ```

4. **Performance**:

   ```
   Lighthouse: XX/100
   Bundle Size: XX KB
   Load Time: X.Xs
   ```

5. **Issues Found** (if any):
   - List any blockers requiring orchestrator decision

---

## Next Session

After this session completes successfully, the Orchestrator will kick off:

**Session 3: Sprint Sign-off (Claude Web - Opus)**

- Complete SIGN_OFF.md
- Update ROADMAP.md progress
- Create Epic 02 Sprint 01 planning documents
- Define first sessions for Epic 02

---

**Session Status**: 🟢 Ready for CLI Execution
**Estimated Duration**: 2-3 hours
**Priority**: High (Sprint blocker)

---

_Created by Orchestrator - Claude Web (Opus)_
_For execution by Claude Code CLI (Sonnet)_
