# Sprint 01: Package Extraction - Execution Plan

**Epic**: Epic 01 - Monorepo Foundation
**Sprint**: 01
**Created**: 2024-12-20
**Status**: Ready for Execution
**Approved By**: Keven

---

## 🎯 Objective

Extract all shared code from `src/` into reusable packages within the Turborepo monorepo, following clean dependency boundaries and avoiding circular dependencies.

---

## 📋 Pre-Execution Checklist

- [x] Codebase analysis completed
- [x] Dependency graph mapped
- [x] No circular dependencies detected
- [x] Extraction order defined
- [x] Package templates ready
- [x] Turborepo and pnpm workspace configured
- [x] Types package already exists
- [x] Module SDK package already exists

---

## 🔄 Execution Phases

### **Phase 1: AI Services Package**
**Priority**: HIGH | **Estimated Time**: 30-45 min

#### 1.1 Create Package Structure
```bash
# Directory already exists: packages/ai-services/
mkdir -p packages/ai-services/src
```

#### 1.2 Create package.json
**File**: `packages/ai-services/package.json`

```json
{
  "name": "@transcript-parser/ai-services",
  "version": "0.1.0",
  "description": "AI services for transcription and speaker detection",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "keywords": ["ai", "transcription", "gemini"],
  "author": "Keven Markham",
  "license": "ISC",
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "~5.6.2"
  },
  "dependencies": {
    "@google/genai": "^1.34.0",
    "@transcript-parser/types": "workspace:*"
  }
}
```

#### 1.3 Create tsconfig.json
**File**: `packages/ai-services/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### 1.4 Move Files
```bash
# Copy files to package
cp src/services/geminiClient.ts packages/ai-services/src/gemini-client.ts
cp src/services/speakerNameDetection.ts packages/ai-services/src/speaker-detection.ts
cp src/services/usageTracker.ts packages/ai-services/src/usage-tracker.ts
cp src/services/apiClient.ts packages/ai-services/src/api-client.ts

# Copy tests
cp src/services/geminiClient.test.ts packages/ai-services/src/gemini-client.test.ts
```

#### 1.5 Create Index Export
**File**: `packages/ai-services/src/index.ts`

```typescript
// Re-export all services
export * from './gemini-client';
export * from './speaker-detection';
export * from './usage-tracker';
export * from './api-client';
```

#### 1.6 Update Internal Imports
Within package files, update:
- `import { TranscriptEntry } from '../types/transcript'` → `import { TranscriptEntry } from '@transcript-parser/types'`
- Update relative imports to use package structure

#### 1.7 Create README
**File**: `packages/ai-services/README.md`

```markdown
# @transcript-parser/ai-services

AI-powered services for transcription, speaker detection, and usage tracking.

## Features
- **GeminiClient**: AI transcription with speaker diarization
- **SpeakerNameDetection**: AI-powered speaker name detection
- **UsageTracker**: LLM token usage and cost tracking
- **ApiClient**: API communication and authentication

## Installation
\`\`\`bash
pnpm add @transcript-parser/ai-services
\`\`\`

## Usage
\`\`\`typescript
import { GeminiClient, usageTracker } from '@transcript-parser/ai-services';

const client = new GeminiClient(apiKey);
const result = await client.transcribeWithSpeakers(audioBlob);
\`\`\`
```

---

### **Phase 2: Audio Processing Package**
**Priority**: HIGH | **Estimated Time**: 20-30 min

#### 2.1 Create Package Structure
```bash
mkdir -p packages/audio-processing/src
```

#### 2.2 Create package.json
**File**: `packages/audio-processing/package.json`

```json
{
  "name": "@transcript-parser/audio-processing",
  "version": "0.1.0",
  "description": "Audio extraction services for video files",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "keywords": ["audio", "ffmpeg", "extraction"],
  "author": "Keven Markham",
  "license": "ISC",
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "~5.6.2"
  },
  "dependencies": {
    "@ffmpeg/ffmpeg": "^0.12.15",
    "@ffmpeg/util": "^0.12.2"
  }
}
```

#### 2.3 Create tsconfig.json
Same pattern as Phase 1.

#### 2.4 Move Files
```bash
cp src/services/audioExtractor.ts packages/audio-processing/src/audio-extractor.ts
cp src/services/ffmpegExtractor.ts packages/audio-processing/src/ffmpeg-extractor.ts
cp src/services/audioExtractor.test.ts packages/audio-processing/src/audio-extractor.test.ts
```

#### 2.5 Create Index Export
**File**: `packages/audio-processing/src/index.ts`

```typescript
export * from './audio-extractor';
export * from './ffmpeg-extractor';
```

#### 2.6 Create README
Similar pattern to Phase 1.

---

### **Phase 3: Export Package**
**Priority**: MEDIUM | **Estimated Time**: 15-20 min

#### 3.1 Create Package Structure
```bash
mkdir -p packages/export/src
```

#### 3.2 Create package.json
**File**: `packages/export/package.json`

```json
{
  "name": "@transcript-parser/export",
  "version": "0.1.0",
  "description": "Export utilities for various transcript formats",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "keywords": ["export", "srt", "vtt", "csv"],
  "author": "Keven Markham",
  "license": "ISC",
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "~5.6.2"
  },
  "dependencies": {
    "@transcript-parser/types": "workspace:*"
  }
}
```

#### 3.3 Create tsconfig.json
Same pattern as Phase 1.

#### 3.4 Move Files
```bash
cp src/utils/exportFormats.ts packages/export/src/formats.ts
```

#### 3.5 Create Index Export
**File**: `packages/export/src/index.ts`

```typescript
export * from './formats';
```

#### 3.6 Create README
Export formats documentation.

---

### **Phase 4: Database Package**
**Priority**: MEDIUM | **Estimated Time**: 15-20 min

#### 4.1 Create Package Structure
```bash
mkdir -p packages/database/src
```

#### 4.2 Create package.json
**File**: `packages/database/package.json`

```json
{
  "name": "@transcript-parser/database",
  "version": "0.1.0",
  "description": "Database schemas and queries using Drizzle ORM",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "keywords": ["database", "drizzle", "orm"],
  "author": "Keven Markham",
  "license": "ISC",
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "~5.6.2"
  },
  "dependencies": {
    "drizzle-orm": "^0.45.1",
    "@transcript-parser/types": "workspace:*"
  }
}
```

#### 4.3 Create tsconfig.json
Same pattern as Phase 1.

#### 4.4 Move Files
```bash
cp src/db/schema.ts packages/database/src/schema.ts
cp src/db/index.ts packages/database/src/db.ts
```

#### 4.5 Create Index Export
**File**: `packages/database/src/index.ts`

```typescript
export * from './schema';
export * from './db';
```

#### 4.6 Create README
Database usage documentation.

---

### **Phase 5: UI Package Enhancement**
**Priority**: HIGH | **Estimated Time**: 60-90 min

#### 5.1 Update package.json
**File**: `packages/ui/package.json` (update dependencies)

Add:
```json
"dependencies": {
  "@transcript-parser/types": "workspace:*",
  "@transcript-parser/ai-services": "workspace:*",
  "@transcript-parser/audio-processing": "workspace:*",
  "@transcript-parser/export": "workspace:*",
  "idb": "^8.0.3"
}
```

#### 5.2 Create Component Directories
```bash
mkdir -p packages/ui/src/components/transcript
mkdir -p packages/ui/src/components/export
mkdir -p packages/ui/src/components/speakers
mkdir -p packages/ui/src/components/upload
mkdir -p packages/ui/src/components/auth
mkdir -p packages/ui/src/hooks
mkdir -p packages/ui/src/utils
```

#### 5.3 Move Custom Components
```bash
# Transcript components
cp src/components/TranscriptList.tsx packages/ui/src/components/transcript/transcript-list.tsx
cp src/components/TranscriptEntry.tsx packages/ui/src/components/transcript/transcript-entry.tsx
cp src/components/TranscriptView.tsx packages/ui/src/components/transcript/transcript-view.tsx
cp src/components/TranscriptSearch.tsx packages/ui/src/components/transcript/transcript-search.tsx
cp src/components/TranscriptFilters.tsx packages/ui/src/components/transcript/transcript-filters.tsx
cp src/components/TranscriptListSkeleton.tsx packages/ui/src/components/transcript/transcript-list-skeleton.tsx
cp src/components/TranscriptEntrySkeleton.tsx packages/ui/src/components/transcript/transcript-entry-skeleton.tsx

# Export components
cp src/components/ExportDialog.tsx packages/ui/src/components/export/export-dialog.tsx
cp src/components/AdvancedExportPanel.tsx packages/ui/src/components/export/advanced-export-panel.tsx

# Speaker components
cp src/components/SpeakerSummary.tsx packages/ui/src/components/speakers/speaker-summary.tsx
cp src/components/SpeakerAnalytics.tsx packages/ui/src/components/speakers/speaker-analytics.tsx
cp src/components/SpeakerNameSuggestions.tsx packages/ui/src/components/speakers/speaker-name-suggestions.tsx

# Upload components
cp src/components/UploadVideo.tsx packages/ui/src/components/upload/upload-video.tsx
cp src/components/VideoPreview.tsx packages/ui/src/components/upload/video-preview.tsx
cp src/components/VideoPlayerModal.tsx packages/ui/src/components/upload/video-player-modal.tsx
cp src/components/ProcessingStatus.tsx packages/ui/src/components/upload/processing-status.tsx

# Auth components
cp src/components/Login.tsx packages/ui/src/components/auth/login.tsx
cp src/components/Register.tsx packages/ui/src/components/auth/register.tsx
cp src/components/ApiKeySettings.tsx packages/ui/src/components/auth/api-key-settings.tsx

# Other components
cp src/components/Header.tsx packages/ui/src/components/header.tsx
cp src/components/KeyboardShortcuts.tsx packages/ui/src/components/keyboard-shortcuts.tsx
cp src/components/UsageStats.tsx packages/ui/src/components/usage-stats.tsx
cp src/components/CostSummaryModal.tsx packages/ui/src/components/cost-summary-modal.tsx
cp src/components/BalanceAlert.tsx packages/ui/src/components/balance-alert.tsx
cp src/components/TranscriptLibrary.tsx packages/ui/src/components/transcript-library.tsx
cp src/components/PaymentModal.tsx packages/ui/src/components/payment-modal.tsx
```

#### 5.4 Move Hooks
```bash
cp src/hooks/useTranscription.ts packages/ui/src/hooks/use-transcription.ts
cp src/hooks/useDebounce.ts packages/ui/src/hooks/use-debounce.ts
cp src/hooks/useStreamingTranscript.ts packages/ui/src/hooks/use-streaming-transcript.ts
cp src/hooks/useKeyboardNavigation.ts packages/ui/src/hooks/use-keyboard-navigation.ts
cp src/hooks/useEditHistory.ts packages/ui/src/hooks/use-edit-history.ts

# Copy tests
cp src/hooks/useTranscription.test.ts packages/ui/src/hooks/use-transcription.test.ts
cp src/hooks/useDebounce.test.ts packages/ui/src/hooks/use-debounce.test.ts
cp src/hooks/useStreamingTranscript.test.ts packages/ui/src/hooks/use-streaming-transcript.test.ts
```

#### 5.5 Move Utilities
```bash
cp src/utils/fileUtils.ts packages/ui/src/utils/file-utils.ts
cp src/utils/speakerColors.ts packages/ui/src/utils/speaker-colors.ts
cp src/utils/speakerStats.ts packages/ui/src/utils/speaker-stats.ts
cp src/utils/textHighlight.ts packages/ui/src/utils/text-highlight.ts
cp src/utils/performance.ts packages/ui/src/utils/performance.ts

# Copy tests
cp src/utils/fileUtils.test.ts packages/ui/src/utils/file-utils.test.ts
cp src/utils/textHighlight.test.ts packages/ui/src/utils/text-highlight.test.ts
```

#### 5.6 Update UI Package Index
**File**: `packages/ui/src/index.ts`

```typescript
// Base UI components (shadcn)
export * from './components/ui/badge';
export * from './components/ui/button';
export * from './components/ui/card';
export * from './components/ui/checkbox';
export * from './components/ui/dialog';
export * from './components/ui/input';
export * from './components/ui/progress';
export * from './components/ui/skeleton';
export * from './components/ui/slider';
export * from './components/ui/textarea';
export * from './components/ui/toast';

// Transcript components
export * from './components/transcript/transcript-list';
export * from './components/transcript/transcript-entry';
export * from './components/transcript/transcript-view';
export * from './components/transcript/transcript-search';
export * from './components/transcript/transcript-filters';
export * from './components/transcript/transcript-list-skeleton';
export * from './components/transcript/transcript-entry-skeleton';

// Export components
export * from './components/export/export-dialog';
export * from './components/export/advanced-export-panel';

// Speaker components
export * from './components/speakers/speaker-summary';
export * from './components/speakers/speaker-analytics';
export * from './components/speakers/speaker-name-suggestions';

// Upload components
export * from './components/upload/upload-video';
export * from './components/upload/video-preview';
export * from './components/upload/video-player-modal';
export * from './components/upload/processing-status';

// Auth components
export * from './components/auth/login';
export * from './components/auth/register';
export * from './components/auth/api-key-settings';

// Other components
export * from './components/header';
export * from './components/keyboard-shortcuts';
export * from './components/usage-stats';
export * from './components/cost-summary-modal';
export * from './components/balance-alert';
export * from './components/transcript-library';
export * from './components/payment-modal';

// Hooks
export * from './hooks/use-transcription';
export * from './hooks/use-debounce';
export * from './hooks/use-streaming-transcript';
export * from './hooks/use-keyboard-navigation';
export * from './hooks/use-edit-history';

// Utilities
export * from './lib/utils';
export * from './utils/file-utils';
export * from './utils/speaker-colors';
export * from './utils/speaker-stats';
export * from './utils/text-highlight';
export * from './utils/performance';
```

#### 5.7 Update Internal Imports in UI Package
Update all component imports:
- `import { TranscriptEntry } from '@/types/transcript'` → `import { TranscriptEntry } from '@transcript-parser/types'`
- `import { GeminiClient } from '@/services/geminiClient'` → `import { GeminiClient } from '@transcript-parser/ai-services'`
- `import { AudioExtractor } from '@/services/audioExtractor'` → `import { AudioExtractor } from '@transcript-parser/audio-processing'`
- `import { toSRT, toVTT } from '@/utils/exportFormats'` → `import { toSRT, toVTT } from '@transcript-parser/export'`

---

### **Phase 6: Config Package**
**Priority**: LOW | **Estimated Time**: 20-30 min

#### 6.1 Create Package Structure
```bash
mkdir -p packages/config
```

#### 6.2 Create package.json
**File**: `packages/config/package.json`

```json
{
  "name": "@transcript-parser/config",
  "version": "0.1.0",
  "description": "Shared configuration files for Transcript Parser packages",
  "main": "./index.js",
  "files": [
    "tailwind.config.js",
    "tsconfig.base.json",
    "eslint.config.js"
  ],
  "keywords": ["config"],
  "author": "Keven Markham",
  "license": "ISC",
  "devDependencies": {
    "tailwindcss": "^4.1.18",
    "typescript": "~5.6.2",
    "eslint": "^9.17.0"
  }
}
```

#### 6.3 Create Base Configs
**File**: `packages/config/tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

**File**: `packages/config/tailwind.config.base.js`

Extract base Tailwind config for reuse.

#### 6.4 Create README
Config usage documentation.

---

### **Phase 7: Build All Packages**
**Priority**: HIGH | **Estimated Time**: 10-15 min

#### 7.1 Install Dependencies
```bash
# From root directory
pnpm install
```

#### 7.2 Build with Turbo
```bash
turbo build
```

Expected output:
```
✓ @transcript-parser/types built successfully
✓ @transcript-parser/module-sdk built successfully
✓ @transcript-parser/ai-services built successfully
✓ @transcript-parser/audio-processing built successfully
✓ @transcript-parser/export built successfully
✓ @transcript-parser/database built successfully
✓ @transcript-parser/ui built successfully
```

#### 7.3 Verify Output
Check that each package has `dist/` directory with:
- `index.js` (CommonJS)
- `index.mjs` (ES Module)
- `index.d.ts` (TypeScript definitions)

---

### **Phase 8: Update Root App Imports**
**Priority**: CRITICAL | **Estimated Time**: 45-60 min

#### 8.1 Update App.tsx and Main Components
Replace all imports in `src/`:

**Before:**
```typescript
import { TranscriptEntry } from '@/types/transcript';
import { GeminiClient } from '@/services/geminiClient';
import { AudioExtractor } from '@/services/audioExtractor';
import { toSRT } from '@/utils/exportFormats';
import { Button } from '@/components/ui/button';
import { TranscriptList } from '@/components/TranscriptList';
```

**After:**
```typescript
import { TranscriptEntry } from '@transcript-parser/types';
import { GeminiClient } from '@transcript-parser/ai-services';
import { AudioExtractor } from '@transcript-parser/audio-processing';
import { toSRT } from '@transcript-parser/export';
import { Button, TranscriptList } from '@transcript-parser/ui';
```

#### 8.2 Update Path Aliases in tsconfig.json
Remove old `@/` aliases or keep only for app-specific code.

#### 8.3 Files to Update
- `src/App.tsx`
- `src/main.tsx`
- Any remaining files in `src/` that import from services/components/utils

#### 8.4 Automated Find & Replace (Optional)
Use search/replace or codemod:
```bash
# Example using sed (be careful!)
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/@\/types\/transcript/@transcript-parser\/types/g'
```

---

### **Phase 9: Testing & Validation**
**Priority**: CRITICAL | **Estimated Time**: 30-45 min

#### 9.1 Run Type Checking
```bash
turbo type-check
```

#### 9.2 Run Tests
```bash
turbo test
```

Expected: All existing tests pass without errors.

#### 9.3 Run Development Server
```bash
pnpm dev
```

Verify:
- App loads without errors
- Video upload works
- Transcription works
- Export works
- All UI components render

#### 9.4 Run Build
```bash
pnpm build
```

Verify: Production build succeeds.

---

### **Phase 10: Documentation & Cleanup**
**Priority**: MEDIUM | **Estimated Time**: 20-30 min

#### 10.1 Update Root README.md
Add monorepo structure documentation:

```markdown
## Monorepo Structure

This project uses Turborepo and pnpm workspaces.

### Packages
- `@transcript-parser/types` - Shared TypeScript types
- `@transcript-parser/ai-services` - AI transcription services
- `@transcript-parser/audio-processing` - Audio extraction
- `@transcript-parser/export` - Export utilities
- `@transcript-parser/database` - Database schemas
- `@transcript-parser/ui` - UI components and hooks
- `@transcript-parser/module-sdk` - Module development SDK
- `@transcript-parser/config` - Shared configs

### Development
\`\`\`bash
# Install dependencies
pnpm install

# Build all packages
turbo build

# Run development server
pnpm dev

# Run tests
turbo test
\`\`\`
```

#### 10.2 Update ARCHITECTURE.md
Document package dependency graph.

#### 10.3 Delete Old Files (Optional)
After verifying everything works, optionally delete old source files that were moved to packages. **DO NOT delete until 100% confident everything works.**

---

## 📊 Success Criteria Checklist

- [ ] All 7 packages created with proper structure
- [ ] All packages have package.json, tsconfig.json, README.md
- [ ] All packages build successfully with `turbo build`
- [ ] No circular dependencies
- [ ] All source files moved to appropriate packages
- [ ] All imports updated throughout codebase
- [ ] All existing tests passing
- [ ] Development server runs without errors
- [ ] Production build succeeds
- [ ] Documentation updated

---

## ⚠️ Known Risks & Mitigation

### Risk 1: Import Path Issues
**Symptom**: TypeScript errors "Cannot find module '@transcript-parser/...'"
**Solution**:
- Ensure `pnpm install` was run after creating packages
- Check workspace references in root package.json
- Verify tsconfig.json paths

### Risk 2: Build Order Dependencies
**Symptom**: Package fails to build due to missing dependency
**Solution**:
- Check turbo.json has correct `dependsOn: ["^build"]`
- Ensure packages build in correct order (types → services → ui)

### Risk 3: Circular Dependencies
**Symptom**: Build hangs or fails with circular dependency error
**Solution**:
- Review dependency graph
- Refactor to eliminate circular references
- Consider creating shared utilities package

### Risk 4: Tests Failing After Migration
**Symptom**: Tests that previously passed now fail
**Solution**:
- Update test imports to use package names
- Verify mock setup still works with new structure
- Check that test files were moved with source files

---

## 🎯 Post-Execution Tasks

After completing all phases:

1. **Git Commit**
   ```bash
   git add .
   git commit -m "feat: extract shared code into monorepo packages

   - Create @transcript-parser/ai-services package
   - Create @transcript-parser/audio-processing package
   - Create @transcript-parser/export package
   - Create @transcript-parser/database package
   - Enhance @transcript-parser/ui with custom components
   - Create @transcript-parser/config package
   - Update all imports to use workspace packages
   - All tests passing

   Sprint 01 - Stories 4-9 complete"
   ```

2. **Update Sprint 01 Status**
   - Mark Stories 4-9 as ✅ Completed
   - Update metrics in Sprint 01 Overview

3. **Prepare for Sprint 02**
   - Review Sprint 02 goals (Core App Migration)
   - Identify any blockers or technical debt
   - Document lessons learned

---

## 📞 Support & Questions

If you encounter issues during execution:

1. **Check Turborepo docs**: https://turbo.build/repo/docs
2. **Check pnpm workspace docs**: https://pnpm.io/workspaces
3. **Review this plan's Risk section**
4. **Consult Sprint 01 Session Prompt** for additional guidance

---

**Next Steps**: Hand off to orchestrator for phase-by-phase execution.

**Estimated Total Time**: 4-6 hours (including testing and validation)

**Status**: ✅ Ready for Execution
