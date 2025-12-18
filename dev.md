# Transcript Parser - Development Setup

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control and Husky git hooks)
- **Google Gemini API Key** (for transcription functionality)
  - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
  - Create a `.env` file in the project root:
    ```bash
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

## Complete Dependencies List

### Production Dependencies

```json
{
  "@ffmpeg/ffmpeg": "^0.12.15", // Browser-based video processing
  "@ffmpeg/util": "^0.12.2", // FFmpeg utilities
  "@google/genai": "^1.34.0", // Google Gemini API SDK
  "@radix-ui/react-dialog": "^1.1.15", // Accessible dialog component
  "@radix-ui/react-progress": "^1.1.8", // Progress bar component
  "@radix-ui/react-slot": "^1.2.4", // Composition primitive
  "@tanstack/react-virtual": "^3.13.13", // Virtual scrolling (Sprint 4)
  "bcrypt": "^6.0.0", // Password hashing
  "class-variance-authority": "^0.7.1", // CSS class variant management
  "clsx": "^2.1.1", // Conditional class names
  "cors": "^2.8.5", // CORS middleware for Express
  "dotenv": "^17.2.3", // Environment variables
  "drizzle-orm": "^0.45.1", // TypeScript ORM
  "express": "^5.2.1", // Backend server (Sprint 3)
  "jsonwebtoken": "^9.0.3", // JWT authentication
  "lucide-react": "^0.561.0", // Icon library
  "pg": "^8.16.3", // PostgreSQL client
  "react": "^18.3.1", // React library
  "react-dom": "^18.3.1", // React DOM renderer
  "tailwind-merge": "^3.4.0" // Tailwind class merging utility
}
```

### Development Dependencies

```json
{
  "@commitlint/cli": "^20.2.0", // Commit message linting
  "@commitlint/config-conventional": "^20.2.0", // Conventional commits config
  "@eslint/js": "^9.17.0", // ESLint core
  "@playwright/test": "^1.57.0", // E2E testing framework
  "@tailwindcss/postcss": "^4.1.18", // Tailwind PostCSS plugin
  "@testing-library/jest-dom": "^6.9.1", // Jest DOM matchers
  "@testing-library/react": "^16.3.1", // React testing utilities
  "@testing-library/user-event": "^14.6.1", // User event simulation
  "@types/bcrypt": "^6.0.0", // TypeScript types
  "@types/cors": "^2.8.19", // TypeScript types
  "@types/express": "^5.0.6", // TypeScript types
  "@types/jest": "^30.0.0", // TypeScript types
  "@types/jsonwebtoken": "^9.0.10", // TypeScript types
  "@types/node": "^25.0.3", // Node.js types
  "@types/react": "^18.3.18", // React types
  "@types/react-dom": "^18.3.5", // React DOM types
  "@vitejs/plugin-react": "^4.3.4", // Vite React plugin
  "autoprefixer": "^10.4.23", // PostCSS autoprefixer
  "commitizen": "^4.3.1", // Interactive commits
  "cz-conventional-changelog": "^3.3.0", // Commitizen adapter
  "drizzle-kit": "^0.31.8", // Drizzle ORM CLI
  "eslint": "^9.17.0", // ESLint linter
  "eslint-config-prettier": "^10.1.8", // Prettier ESLint config
  "eslint-plugin-prettier": "^5.5.4", // Prettier ESLint plugin
  "eslint-plugin-react-hooks": "^5.0.0", // React Hooks linting
  "eslint-plugin-react-refresh": "^0.4.16", // React Refresh linting
  "globals": "^15.13.0", // Global variables
  "husky": "^9.1.7", // Git hooks
  "identity-obj-proxy": "^3.0.0", // CSS module mocking
  "jest": "^30.2.0", // Testing framework
  "jest-environment-jsdom": "^30.2.0", // JSDOM test environment
  "lint-staged": "^16.2.7", // Staged file linting
  "msw": "^2.12.4", // Mock Service Worker
  "nodemon": "^3.1.11", // Dev server auto-restart
  "postcss": "^8.5.6", // CSS processing
  "prettier": "^3.7.4", // Code formatter
  "tailwindcss": "^4.1.18", // Tailwind CSS
  "ts-jest": "^29.4.6", // Jest TypeScript support
  "tsx": "^4.21.0", // TypeScript execution
  "typescript": "~5.6.2", // TypeScript compiler
  "typescript-eslint": "^8.18.2", // TypeScript ESLint
  "undici": "^7.16.0", // HTTP client
  "vite": "^6.0.5", // Build tool
  "whatwg-fetch": "^3.6.20" // Fetch polyfill
}
```

## Quick Start Guide

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd transcript-parser

# Install dependencies
npm install

# This will also run Husky setup automatically (prepare script)
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Google Gemini API Key (Required for transcription)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Database configuration
DATABASE_URL=postgresql://user:password@localhost:5432/transcript_db
```

**Get your Gemini API key**:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste into `.env` file

### 3. Install Playwright Browsers (for E2E tests)

```bash
npx playwright install
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

### 5. Try the Demo

1. Open `http://localhost:5173` in your browser
2. Click the **"🎬 Load Sprint 4 Demo (60 Entries)"** button
3. Explore the features:
   - Smooth virtual scrolling through 60 transcript entries
   - Speaker summary panel with analytics
   - Color-coded speaker badges
   - Export functionality

---

## Setup Tasks (Detailed)

### 1. Install Dependencies

After running `npm install`, you'll have all required dependencies:

**Core Framework** (5 packages):

- React 18.3.1
- TypeScript 5.6.2
- Vite 6.0.5
- Tailwind CSS 4.1.18
- shadcn/ui components

**AI & Media Processing** (3 packages):

- Google Gemini API SDK 1.34.0
- FFmpeg.wasm 0.12.15 (browser-based video processing)
- FFmpeg utilities 0.12.2

**Backend** (6 packages):

- Express 5.2.1 (backend server)
- Drizzle ORM 0.45.1 (database toolkit)
- PostgreSQL client 8.16.3
- bcrypt 6.0.0 (password hashing)
- JWT 9.0.3 (authentication)
- CORS 2.8.5

**UI Components** (6 packages):

- Radix UI Dialog, Progress, Slot
- Lucide React icons
- @tanstack/react-virtual 3.13.13 (virtualization - Sprint 4)

**Testing** (8 packages):

- Jest 30.2.0
- React Testing Library 16.3.1
- Playwright 1.57.0 (E2E)
- Mock Service Worker 2.12.4

**Code Quality** (7 packages):

- ESLint 9 with TypeScript support
- Prettier 3.7.4
- Husky 9.1.7 (git hooks)
- Commitizen & Commitlint (conventional commits)
- lint-staged 16.2.7

### 2. Start Development Server

```bash
npm run dev
```

This starts the Vite development server with Hot Module Replacement (HMR).
The app will be available at `http://localhost:5173` (or the next available port).

### 3. Build for Production

```bash
npm run build
```

This command:

1. Runs TypeScript compiler (`tsc -b`) to check types
2. Creates an optimized production build in the `dist` folder

### 4. Preview Production Build

```bash
npm run preview
```

Locally preview the production build before deploying.

### 5. Run Tests

```bash
npm test
```

Runs Jest test suite. For watch mode or coverage:

```bash
npm run test:watch      # Watch mode for development
npm run test:coverage   # Generate coverage report
```

### 6. Run Linter

```bash
npm run lint
```

Runs ESLint to check for code quality issues and enforce coding standards.

```bash
npm run lint:fix        # Auto-fix linting issues
```

### 7. Format Code

```bash
npm run format
```

Formats all code using Prettier. To check formatting without changing files:

```bash
npm run format:check
```

### 8. Database Operations (Drizzle ORM)

```bash
npm run db:generate     # Generate SQL migrations from schema
npm run db:push         # Push schema changes directly to DB
npm run db:studio       # Open Drizzle Studio (visual DB editor)
```

## Project Structure

```
transcript-parser/
├── .husky/                 # Git hooks configuration
│   ├── pre-commit          # Pre-commit hook (runs lint-staged)
│   └── commit-msg          # Commit-msg hook (validates commit format)
├── src/
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components (button, card, badge, etc.)
│   │   ├── Header.tsx      # App header with title
│   │   ├── UploadVideo.tsx # Video upload with drag-and-drop (Sprint 1)
│   │   ├── VideoPreview.tsx # Video preview with metadata (Sprint 1)
│   │   ├── ProcessingStatus.tsx # Processing state indicator
│   │   ├── TranscriptView.tsx # Main transcript container (Sprint 4)
│   │   ├── TranscriptList.tsx # Virtualized list (Sprint 4)
│   │   ├── TranscriptEntry.tsx # Individual entry (optimized)
│   │   ├── SpeakerSummary.tsx # Speaker analytics panel (Sprint 4)
│   │   ├── Login.tsx       # Authentication component
│   │   ├── Register.tsx    # User registration
│   │   └── TranscriptLibrary.tsx # Saved transcripts
│   ├── hooks/              # Custom React hooks
│   │   ├── useTranscription.ts # Transcription state management
│   │   └── useStreamingTranscript.ts # Real-time updates (Sprint 4)
│   ├── services/           # API clients and services
│   │   ├── geminiClient.ts # Google Gemini API integration (Sprint 3)
│   │   └── apiClient.ts    # Backend API client
│   ├── utils/              # Utility functions
│   │   ├── fileUtils.ts    # Video validation & metadata (Sprint 1)
│   │   ├── exportUtils.ts  # Transcript export functionality
│   │   ├── speakerStats.ts # Speaker statistics calculations (Sprint 4)
│   │   ├── speakerColors.ts # Centralized color management (Sprint 4)
│   │   └── performanceBenchmark.ts # Performance monitoring (Sprint 4)
│   ├── types/              # TypeScript type definitions
│   │   └── transcript.ts   # Transcript data models
│   ├── data/               # Demo and test data
│   │   └── largeTranscriptDemo.ts # 60-entry demo (Sprint 4)
│   ├── lib/                # Third-party utilities
│   │   └── utils.ts        # cn() for class merging
│   ├── db/                 # Database layer
│   │   ├── schema.ts       # Drizzle ORM schema definitions
│   │   └── index.ts        # Database connection setup
│   ├── App.tsx             # Main application component
│   ├── App.test.tsx        # App component tests
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles with Tailwind
├── tests/
│   └── e2e/                # End-to-end tests
│       └── transcript-viewer.spec.ts # Transcript viewer E2E (Sprint 4)
├── specs/                  # Project specifications
│   ├── sprints/            # Sprint planning documents
│   │   ├── sprint-3/       # Backend infrastructure (Sprint 3)
│   │   ├── sprint-4/       # Enhanced viewer (Sprint 4)
│   │   └── sprint-5/       # Advanced features (Sprint 5)
│   └── architecture/       # Architecture documentation
├── server/                 # Backend server (Sprint 3)
│   ├── src/
│   │   ├── index.ts        # Express server entry
│   │   ├── routes/         # API routes
│   │   └── services/       # Backend services
│   └── package.json        # Server dependencies
├── drizzle/                # Generated migrations (auto-created)
├── public/                 # Static assets
├── playwright.config.ts    # Playwright E2E configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── jest.config.ts          # Jest testing configuration
├── commitlint.config.js    # Commit message linting rules
├── tsconfig.json           # TypeScript base config
├── package.json            # Project dependencies and scripts
└── dev.md                  # This file - development guide
```

## Development Workflow

1. Make changes to files in the `src/` directory
2. The dev server will automatically reload with your changes (HMR)
3. TypeScript will provide type checking in your editor
4. Write tests for new components and features
5. Run `npm test` to ensure tests pass
6. Run `npm run lint` periodically to catch code quality issues
7. Run `npm run format` to format your code
8. Stage your changes with `git add`
9. Commit using `npm run commit` (recommended) or `git commit`

## Committing Code

This project enforces **Conventional Commits** to maintain clean git history.

### Option 1: Using Commitizen (Recommended)

```bash
git add .
npm run commit
```

This launches an interactive prompt that guides you through creating a properly formatted commit message.

### Option 2: Manual Commit

```bash
git add .
git commit -m "type(scope): subject"
```

#### Commit Message Format

```
<type>(<optional scope>): <subject>

<optional body>

<optional footer>
```

#### Allowed Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools
- **ci**: CI/CD changes
- **build**: Changes affecting build system or dependencies
- **revert**: Reverts a previous commit

#### Examples

```bash
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(api): resolve null pointer in user endpoint"
git commit -m "docs: update README with installation steps"
git commit -m "test(utils): add unit tests for date formatter"
```

### Automated Checks on Commit

When you commit, Husky runs these hooks automatically:

1. **Pre-commit Hook** (`.husky/pre-commit`):
   - Runs `lint-staged`
   - Lints and auto-fixes TypeScript/TSX files with ESLint
   - Formats all staged files with Prettier
   - Only processes staged files for faster commits

2. **Commit-msg Hook** (`.husky/commit-msg`):
   - Validates commit message format
   - Ensures message follows Conventional Commits standard
   - Rejects commits with invalid format

If any hook fails, the commit will be rejected. Fix the issues and try again.

## Tech Stack

### Core Framework & Build Tools

- **React 18.3**: UI library
- **TypeScript 5.6**: Type-safe JavaScript
- **Vite 6**: Fast build tool and dev server with HMR

### UI & Styling

- **Tailwind CSS 3**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible component library
- **Lucide React**: Icon library
- **@tanstack/react-virtual 3.13**: Virtual scrolling for large lists (Sprint 4)

### AI & Transcription

- **Google Gemini API**: AI-powered speech-to-text with speaker diarization
- **FFmpeg.wasm**: Browser-based video/audio processing (Sprint 3)

### Backend & Database

- **Drizzle ORM 0.45**: TypeScript ORM for SQL databases
- **Better SQLite3**: SQLite database driver
- **Express 4.21**: Backend API server (Sprint 3)

### Testing

- **Jest 30**: Testing framework
- **React Testing Library**: Component testing
- **Playwright 1.49**: End-to-end testing
- **@testing-library/user-event**: User interaction simulation

### Code Quality & DevOps

- **ESLint 9**: Code linting and quality
- **Prettier 3**: Code formatting
- **Husky 9**: Git hooks for pre-commit checks
- **Commitizen**: Interactive commit message tool
- **Commitlint**: Commit message validation
- **lint-staged**: Run linters on staged files only

## Tailwind CSS & shadcn/ui

This project uses Tailwind CSS for styling and shadcn/ui for pre-built, customizable components.

### Tailwind CSS

Tailwind CSS is configured and ready to use. Style your components using utility classes:

```tsx
<div className="flex items-center justify-center p-4 bg-background">
  <h1 className="text-4xl font-bold text-foreground">Hello World</h1>
</div>
```

**Configuration files:**

- [tailwind.config.js](tailwind.config.js) - Tailwind configuration
- [postcss.config.js](postcss.config.js) - PostCSS configuration
- [src/index.css](src/index.css) - Global styles with Tailwind directives

**Theme customization:**
The project uses CSS variables for theming (light/dark mode support). Customize colors in [src/index.css](src/index.css).

### shadcn/ui Components

shadcn/ui components are pre-configured and ready to use. Components are added to your project (not installed as dependencies).

**Adding new components:**

You can manually add components or use the CLI (if available):

```bash
# Example: manually create components in src/components/ui/
# See https://ui.shadcn.com for component code
```

**Available components:**

- Button - [src/components/ui/button.tsx](src/components/ui/button.tsx)

**Using components:**

```tsx
import { Button } from '@/components/ui/button'

function MyComponent() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}
```

**Path aliases:**
The project uses `@/*` aliases for imports:

- `@/components` → `src/components`
- `@/lib` → `src/lib`

**Utility function:**

- [src/lib/utils.ts](src/lib/utils.ts) - `cn()` function for merging Tailwind classes

### Adding More Components

Visit [ui.shadcn.com](https://ui.shadcn.com) and copy component code into `src/components/ui/`.

Popular components to add:

- Card, Dialog, Dropdown Menu, Input, Label, Select, Textarea, Toast, etc.

## Drizzle ORM

Drizzle ORM is configured for SQLite by default. To use it:

### 1. Define Your Schema

Edit [src/db/schema.ts](src/db/schema.ts) to define your database tables:

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
})
```

### 2. Set Up Database Connection

Uncomment and configure the database driver in [src/db/index.ts](src/db/index.ts):

```typescript
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('sqlite.db')
export const db = drizzle(sqlite, { schema })
```

Note: Install the driver first: `npm install better-sqlite3`

### 3. Generate Migrations

```bash
npm run db:generate     # Creates migration files in drizzle/
```

### 4. Push Changes to Database

```bash
npm run db:push         # Applies schema directly (dev mode)
```

### 5. Visual Database Editor

```bash
npm run db:studio       # Opens Drizzle Studio at localhost
```

### Switching Databases

- **PostgreSQL**: Change `dialect` to `'postgresql'` in [drizzle.config.ts](drizzle.config.ts)
- **MySQL**: Change `dialect` to `'mysql'` in [drizzle.config.ts](drizzle.config.ts)

See the [Drizzle ORM docs](https://orm.drizzle.team/docs/overview) for more information.

## Testing

Tests are written using Jest and React Testing Library:

- Test files should be named `*.test.tsx` or `*.test.ts`
- Place tests next to the components they test
- Use `@testing-library/react` for component testing
- Use `@testing-library/user-event` for simulating user interactions
- Example test: [src/App.test.tsx](src/App.test.tsx)

## Code Quality

### ESLint

- Configured with TypeScript support
- React Hooks rules enforced
- Prettier integration to avoid conflicts
- Auto-fix available with `npm run lint:fix`

### Prettier

- Configured in [.prettierrc](.prettierrc)
- Settings: single quotes, no semicolons, 2-space tabs
- Auto-format with `npm run format`

## Sprint Features & Implementation Status

### ✅ Sprint 1: Foundation & Video Upload (Complete)

**Goal**: Deliver a fully functional video upload component with validation and preview.

**Features Implemented**:

- ✅ Drag-and-drop video upload with visual feedback
- ✅ File validation (type, size, format)
  - Supported formats: MP4, MOV, AVI, WebM
  - Max file size: 2GB
  - Clear error messages for invalid files
- ✅ Video preview with HTML5 player
- ✅ Metadata extraction (duration, dimensions, format, size)
- ✅ Remove/clear functionality

**Key Components**:

- [UploadVideo.tsx](src/components/UploadVideo.tsx) - Upload zone with drag-and-drop
- [VideoPreview.tsx](src/components/VideoPreview.tsx) - Video player with metadata
- [fileUtils.ts](src/utils/fileUtils.ts) - Validation and metadata extraction

**Test Coverage**: 80%+ for upload functionality

---

### ✅ Sprint 3: Backend Infrastructure & FFmpeg Integration (Complete)

**Goal**: Implement backend server with audio extraction and Gemini API integration.

**Features Implemented**:

- ✅ Express backend server (Port 3001)
- ✅ FFmpeg.wasm browser-based video processing
- ✅ Audio extraction from video files
- ✅ Google Gemini API integration
  - Speech-to-text transcription
  - Speaker diarization (automatic speaker identification)
  - Confidence scoring
- ✅ Codec support verification (AAC, Opus, MP3)
- ✅ Background audio processing with status updates

**Key Components**:

- [geminiClient.ts](src/services/geminiClient.ts) - Gemini API client
- `server/` - Express backend with FFmpeg integration
- [useTranscription.ts](src/hooks/useTranscription.ts) - Transcription state management
- [ProcessingStatus.tsx](src/components/ProcessingStatus.tsx) - Processing indicator

**Technical Achievements**:

- Browser-based audio extraction (no server upload required)
- Multi-codec support with automatic detection
- Real-time processing status updates

---

### ✅ Sprint 4: Enhanced Transcript Viewer (Complete)

**Goal**: Enhance transcript viewer with virtualization, speaker analytics, and performance optimizations.

**Features Implemented**:

#### 1. Virtualized Scrolling

- ✅ TanStack React Virtual integration
- ✅ Smooth scrolling through 1000+ entries
- ✅ 60 FPS performance
- ✅ Only ~20 DOM nodes rendered at any time

**Implementation**:

- [TranscriptList.tsx](src/components/TranscriptList.tsx) - Virtual scrolling component
  - 600px viewport height
  - 120px estimated entry size
  - 5-item overscan for smooth scrolling

#### 2. Speaker Summary Panel

- ✅ Speaker analytics with accurate statistics
- ✅ Segment count (times each speaker spoke)
- ✅ Total speaking duration
- ✅ Percentage of total time
- ✅ Responsive two-column layout

**Implementation**:

- [SpeakerSummary.tsx](src/components/SpeakerSummary.tsx) - Analytics panel
- [speakerStats.ts](src/utils/speakerStats.ts) - Statistics calculations
- Desktop (≥1024px): Side-by-side layout with 320px sidebar
- Mobile (<1024px): Stacked layout

#### 3. Real-time Updates Infrastructure

- ✅ Streaming transcript hook for future enhancements
- ✅ Callback system for entry-by-entry updates
- ✅ Foundation ready for true streaming

**Implementation**:

- [useStreamingTranscript.ts](src/hooks/useStreamingTranscript.ts) - Real-time hook
- Updated [geminiClient.ts](src/services/geminiClient.ts) with `onEntryComplete` callback

#### 4. Performance Optimizations

- ✅ React.memo for TranscriptEntry components
- ✅ useMemo for speaker statistics
- ✅ useCallback for stable function references
- ✅ Centralized color management
- ✅ Performance monitoring utilities

**Implementation**:

- [speakerColors.ts](src/utils/speakerColors.ts) - Centralized color palette
  - 6 colors: blue, emerald, purple, orange, pink, cyan
  - Consistent across all UI components
- [performanceBenchmark.ts](src/utils/performanceBenchmark.ts) - Performance monitoring
  - Render time tracking
  - FPS monitoring
  - Memory usage analysis

#### 5. Demo & Testing

- ✅ 60-entry demo transcript (5:25 minute meeting simulation)
- ✅ One-click demo button in UI
- ✅ Comprehensive unit tests
- ✅ E2E tests with Playwright

**Implementation**:

- [largeTranscriptDemo.ts](src/data/largeTranscriptDemo.ts) - Demo data
- [TranscriptList.test.tsx](src/components/TranscriptList.test.tsx) - Unit tests
- [SpeakerSummary.test.tsx](src/components/SpeakerSummary.test.tsx) - Unit tests
- [useStreamingTranscript.test.ts](src/hooks/useStreamingTranscript.test.ts) - Hook tests
- [transcript-viewer.spec.ts](tests/e2e/transcript-viewer.spec.ts) - E2E tests

**Performance Benchmarks**:

- ✅ Initial render: < 100ms
- ✅ Scrolling: 60 FPS
- ✅ Virtual items: ~15-20 rendered at any time for 1000 entries
- ✅ No memory leaks

**Documentation**:

- [Sprint 4 Execution Prompt](specs/sprints/sprint-4/Execution-Prompt.md)
- [Sprint 4 Implementation Summary](specs/sprints/sprint-4/Implementation-Summary.md)

---

### 🔄 Sprint 5: Advanced Features (Planned)

**Goal**: Enhance user experience with search/filter, keyboard navigation, editing, and advanced export.

**Planned Features**:

- 🔜 Search with text highlighting
- 🔜 Filter by speaker, time range, confidence
- 🔜 Keyboard navigation (arrow keys, shortcuts)
- 🔜 Inline transcript editing with undo/redo
- 🔜 Advanced export formats (SRT, WebVTT, JSON, CSV)
- 🔜 Accessibility improvements (WCAG 2.1 AA)
- 🔜 Animations and transitions

**Documentation**:

- [Sprint 5 Execution Prompt](specs/sprints/sprint-5/Execution-Prompt.md)

---

## Application Architecture

### Component Hierarchy

```
App
├── Header
├── Auth Flow (Login/Register)
├── TranscriptLibrary (saved transcripts)
└── Main Content
    ├── Left Column
    │   ├── UploadVideo (drag-and-drop)
    │   ├── VideoPreview (player + metadata)
    │   └── ProcessingStatus (transcription progress)
    └── Right Column
        └── TranscriptView
            ├── Header (title + export)
            ├── Desktop Layout (≥1024px)
            │   ├── Main Content (flex-1)
            │   │   ├── Speaker Badges
            │   │   └── TranscriptList (virtualized)
            │   │       └── TranscriptEntry (memoized)
            │   └── SpeakerSummary Sidebar (320px)
            └── Mobile Layout (<1024px)
                ├── SpeakerSummary (stacked)
                └── Main Content
```

### Data Flow

```
1. User uploads video → UploadVideo → VideoPreview
2. Auto-start transcription → useTranscription hook
3. Extract audio → FFmpeg (browser-based)
4. Send to Gemini API → geminiClient
5. Receive transcript → TranscriptData
6. Display → TranscriptView → TranscriptList (virtualized)
7. Calculate stats → SpeakerSummary
8. Export → exportUtils (plain text, future: SRT, VTT, JSON)
```

### Key Hooks

- **useTranscription**: Manages transcription state (idle, uploading, processing, completed, error)
- **useStreamingTranscript**: Foundation for real-time entry updates (future enhancement)

### Performance Patterns

| Pattern           | Usage                         | Benefit                                   |
| ----------------- | ----------------------------- | ----------------------------------------- |
| React.memo        | TranscriptEntry               | Prevents re-renders for unchanged entries |
| useMemo           | Speaker stats, color maps     | Avoids expensive recalculations           |
| useCallback       | Event handlers, color getter  | Stable function references                |
| Virtual Scrolling | TranscriptList                | Renders only visible items                |
| Debouncing        | Planned for search (Sprint 5) | Reduces excessive re-renders              |

---

## Demo Mode

The application includes a **Sprint 4 Demo Button** for quickly showcasing features:

**How to Use**:

1. Start the dev server: `npm run dev`
2. Open the app in browser (usually `http://localhost:5173`)
3. Click the **"🎬 Load Sprint 4 Demo (60 Entries)"** button
4. Explore:
   - Smooth scrolling through 60 transcript entries
   - Speaker summary with 3 speakers and accurate statistics
   - Color-coded speaker badges
   - Responsive layout (resize window to see mobile/desktop views)
   - Export functionality

**Demo Data**:

- 60 entries simulating a 5:25 minute team meeting
- 3 speakers: Alice (Product Manager), Bob (Engineer), Carol (Designer)
- Realistic conversation about Sprint 4 planning
- Perfect for demonstrating virtualization performance

---

## Next Steps

### For New Developers

- Read [Sprint 1 Docs](specs/sprints/Sprint-01-Foundation-Upload.md) to understand upload flow
- Read [Sprint 4 Implementation Summary](specs/sprints/sprint-4/Implementation-Summary.md) for transcript viewer
- Explore the demo mode to see features in action
- Review [Full Stack Architecture](specs/architecture/FULL_STACK_ARCHITECTURE.md)

### For Continuing Development

- Check [Sprint 5 Execution Prompt](specs/sprints/sprint-5/Execution-Prompt.md) for next features
- Set up your database schema in [src/db/schema.ts](src/db/schema.ts)
- Add new components with corresponding test files
- Use `npm run commit` for creating conventional commits
- Maintain test coverage ≥ 80%

### For Configuration

- Update [index.html](index.html) to change page title or metadata
- Configure [vite.config.ts](vite.config.ts) for additional build options
- Customize [.prettierrc](.prettierrc) for preferred code style
- Add more ESLint rules in [eslint.config.js](eslint.config.js) as needed
