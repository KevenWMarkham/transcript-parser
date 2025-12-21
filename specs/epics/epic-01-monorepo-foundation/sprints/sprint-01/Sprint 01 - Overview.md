# Sprint 01: Monorepo Setup & Package Extraction

**Epic**: Epic 01 - Monorepo Foundation
**Sprint Number**: 01
**Duration**: 1 week
**Status**: In Progress
**Sprint Goal**: Extract shared packages and create Module SDK

---

## 🎯 Sprint Goal

Set up Turborepo monorepo infrastructure and extract all shared code into reusable packages, establishing the foundation for modular development.

## 📦 Sprint Backlog

### High Priority (Must Have)

#### Story 1: Set up Turborepo Workspace
**Story Points**: 3
**Status**: ✅ Completed

**Acceptance Criteria**:
- [x] turbo.json configured with build pipeline
- [x] pnpm-workspace.yaml created
- [x] pnpm install successful
- [x] Basic folder structure created (apps/, packages/, modules/)

**Tasks**:
- [x] Install Turborepo
- [x] Create turbo.json configuration
- [x] Set up pnpm workspace
- [x] Create folder structure
- [x] Install dependencies

---

#### Story 2: Create Shared Types Package
**Story Points**: 2
**Status**: ✅ Completed

**Acceptance Criteria**:
- [x] `packages/types` package created
- [x] All core TypeScript interfaces extracted
- [x] Package builds successfully
- [x] Exports are correct

**Tasks**:
- [x] Create package.json for @transcript-parser/types
- [x] Extract transcript types (TranscriptEntry, TranscriptData, Speaker)
- [x] Add extended types (UserProfile, AIInsights, Comparison)
- [x] Add database types (DBUser, DBTranscript, LLMUsage)
- [x] Configure tsconfig.json
- [x] Test package builds

---

#### Story 3: Create Module SDK Package
**Story Points**: 5
**Status**: ✅ Completed

**Acceptance Criteria**:
- [x] `packages/module-sdk` package created
- [x] ModuleDefinition interface complete
- [x] ModuleRegistry implementation
- [x] Lifecycle hooks defined
- [x] Documentation written

**Tasks**:
- [x] Create package.json for @transcript-parser/module-sdk
- [x] Define ModuleDefinition interface
- [x] Define ModuleMetadata, ModuleFieldSchema types
- [x] Define ModuleTemplate, ModuleAction types
- [x] Define ModuleExportFormat, ModuleAnalytics types
- [x] Define ModuleComponents, ModuleAIEnhancement types
- [x] Implement ModuleRegistry class
- [x] Create helper functions (createModule)
- [x] Write documentation

---

#### Story 4: Extract UI Components Package
**Story Points**: 5
**Status**: ⏳ To Do

**Acceptance Criteria**:
- [ ] `packages/ui` package created
- [ ] All shadcn/ui components moved
- [ ] Custom components moved (TranscriptList, VideoPreview, etc.)
- [ ] Framer Motion animations preserved
- [ ] Package builds successfully
- [ ] Storybook setup (optional)

**Tasks**:
- [ ] Create package.json for @transcript-parser/ui
- [ ] Move shadcn/ui components
  - [ ] Button, Card, Dialog, Input, Select, etc.
- [ ] Move custom components
  - [ ] TranscriptList (with virtual scrolling)
  - [ ] VideoPreview
  - [ ] SpeakerAnalytics
  - [ ] ExportDialog
  - [ ] UploadVideo
- [ ] Move utility functions (cn, utils)
- [ ] Configure Tailwind CSS for package
- [ ] Test all components render correctly
- [ ] Write component documentation

---

#### Story 5: Extract AI Services Package
**Story Points**: 5
**Status**: ⏳ To Do

**Acceptance Criteria**:
- [ ] `packages/ai-services` package created
- [ ] Gemini client moved
- [ ] Transcription service moved
- [ ] Speaker name detection moved
- [ ] Usage tracking moved
- [ ] Package builds successfully
- [ ] Tests pass

**Tasks**:
- [ ] Create package.json for @transcript-parser/ai-services
- [ ] Move geminiClient.ts
- [ ] Move transcription logic
- [ ] Move speakerNameDetection.ts
- [ ] Move usageTracker.ts
- [ ] Update imports and dependencies
- [ ] Write unit tests for services
- [ ] Document API usage

---

### Medium Priority (Should Have)

#### Story 6: Extract Audio Processing Package
**Story Points**: 3
**Status**: ⏳ To Do

**Acceptance Criteria**:
- [ ] `packages/audio-processing` package created
- [ ] Browser audio extractor moved
- [ ] FFmpeg.wasm extractor moved
- [ ] Package builds successfully
- [ ] Tests pass

**Tasks**:
- [ ] Create package.json for @transcript-parser/audio-processing
- [ ] Move audioExtractor.ts (browser-based)
- [ ] Move ffmpegExtractor.ts (FFmpeg.wasm)
- [ ] Handle FFmpeg.wasm dependencies
- [ ] Write tests for extractors
- [ ] Document usage

---

#### Story 7: Extract Export Utilities Package
**Story Points**: 3
**Status**: ⏳ To Do

**Acceptance Criteria**:
- [ ] `packages/export` package created
- [ ] All export formats moved (TXT, SRT, VTT, CSV, JSON)
- [ ] Package builds successfully
- [ ] Tests verify export accuracy

**Tasks**:
- [ ] Create package.json for @transcript-parser/export
- [ ] Move exportFormats.ts
- [ ] Split into separate files per format
  - [ ] txt.ts
  - [ ] srt.ts
  - [ ] vtt.ts
  - [ ] csv.ts
  - [ ] json.ts
- [ ] Write tests for each format
- [ ] Document export options

---

#### Story 8: Create Database Package
**Story Points**: 3
**Status**: ⏳ To Do

**Acceptance Criteria**:
- [ ] `packages/database` package created
- [ ] Drizzle schemas moved
- [ ] Common queries exported
- [ ] Database utilities included
- [ ] Package builds successfully

**Tasks**:
- [ ] Create package.json for @transcript-parser/database
- [ ] Move Drizzle schema definitions
- [ ] Move database connection logic
- [ ] Create common query functions
- [ ] Configure Drizzle kit
- [ ] Document database usage

---

### Low Priority (Nice to Have)

#### Story 9: Create Config Package
**Story Points**: 2
**Status**: ⏳ To Do

**Acceptance Criteria**:
- [ ] `packages/config` package created
- [ ] Shared configs for ESLint, TypeScript, Tailwind
- [ ] Configs are reusable across packages

**Tasks**:
- [ ] Create package.json for @transcript-parser/config
- [ ] Extract eslint.config.js
- [ ] Extract tsconfig.json (base)
- [ ] Extract tailwind.config.js (base)
- [ ] Document config usage

---

## 📊 Sprint Metrics

### Velocity
- **Planned Story Points**: 28
- **Completed Story Points**: 10 (Stories 1-3)
- **Remaining Story Points**: 18

### Progress
- **Stories Completed**: 3 / 9 (33%)
- **Tasks Completed**: 26 / 55 (47%)

### Burndown
- **Day 1**: 28 points remaining
- **Day 2**: 25 points remaining (Story 1 done)
- **Day 3**: 18 points remaining (Stories 2-3 done)
- **Day 4-7**: TBD

---

## 🚧 Risks & Issues

### Active Risks
1. **Import path complexity**: Risk: Medium
   - Updating all imports across the codebase may introduce bugs
   - Mitigation: Use find/replace carefully, test thoroughly

2. **Circular dependencies**: Risk: Low
   - Packages may depend on each other circularly
   - Mitigation: Design package boundaries carefully, keep dependencies unidirectional

### Blockers
- None currently

### Issues
- None currently

---

## 👥 Team Capacity

### Sprint Team
- **Developer 1**: Full-time (40 hours)
- **Developer 2**: Part-time (20 hours)
- **QA**: 10 hours for testing

### Availability
- No holidays or planned absences

### Estimated Capacity
- **Total Points Available**: 30-35
- **Planned Points**: 28
- **Buffer**: 2-7 points

---

## 📅 Sprint Schedule

### Sprint Planning (Monday, Week 1)
- **Duration**: 2 hours
- **Attendees**: Full team
- **Outcome**: Backlog refined, stories assigned, capacity confirmed

### Daily Standups (Daily, 15 min)
- **Time**: 9:00 AM
- **Format**: What did you do? What will you do? Any blockers?

### Mid-Sprint Review (Wednesday)
- **Duration**: 30 min
- **Purpose**: Check progress, adjust if needed

### Sprint Review (Friday, Week 1)
- **Duration**: 1 hour
- **Attendees**: Team + stakeholders
- **Demos**:
  - All packages building independently
  - Module SDK with example Real Estate module
  - Turbo build working

### Sprint Retrospective (Friday, Week 1)
- **Duration**: 45 min
- **Format**: Start, Stop, Continue
- **Output**: Action items for next sprint

---

## 📝 Notes

### Technical Decisions
1. **Package naming**: Use `@transcript-parser/*` scope for all packages
2. **Build tool**: Turbo for orchestration, individual package.json scripts
3. **Testing**: Jest for unit tests, run via Turbo
4. **Documentation**: Each package has its own README

### Dependencies
- All packages depend on `packages/types`
- UI package depends on Tailwind CSS
- AI services depend on @google/genai
- Audio processing depends on @ffmpeg/ffmpeg

### Definition of Ready (for stories)
- Acceptance criteria defined
- Dependencies identified
- Story points estimated
- Assigned to developer

### Definition of Done (for stories)
- Code complete and reviewed
- Tests written and passing
- Documentation updated
- Merged to main branch
- No breaking changes to existing functionality

---

## 🔗 Related Documents

- [Epic 01 Overview](../Epic%2001%20-%20Monorepo%20Foundation%20-%20Overview.md)
- [Sprint 01 Session Prompt](./Sprint%2001%20-%20Session%20Prompt.md)
- [Module SDK Documentation](../../../../packages/module-sdk/README.md)
- [Monorepo Architecture](../../../../docs/ARCHITECTURE.md)

---

**Created**: December 20, 2024
**Last Updated**: December 20, 2024
**Next Update**: End of sprint (Sprint Review)
