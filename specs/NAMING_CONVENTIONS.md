# SmartHaven AI Platform - Naming Conventions

**Last Updated**: December 23, 2024
**Version**: 1.0

---

## Overview

This document defines naming standards for the SmartHaven AI Platform. All contributors must follow these conventions to maintain consistency across the codebase.

---

## Directory Structure

### Epic Folders

```
specs/epics/epic-XX-kebab-case-name/
```

| Pattern                            | Example                  |
| ---------------------------------- | ------------------------ |
| `epic-00-original-mvp/`            | Original MVP (completed) |
| `epic-01-monorepo-foundation/`     | Monorepo infrastructure  |
| `epic-02-user-profiles/`           | User profiles & persona  |
| `epic-03-ai-interaction-platform/` | AI interaction methods   |
| `epic-04-agent-orchestration/`     | Agent framework          |
| `epic-05-guest-module/`            | Guest persona module     |
| `epic-06-property-manager-module/` | Property manager module  |

### Sprint Folders

```
specs/epics/epic-XX-name/sprints/sprint-XX/
├── planning/
│   ├── Sprint XX - Overview.md
│   ├── ORCHESTRATION_PROMPT.md
│   └── expert-feedback/
├── implementation/
│   ├── SESSION_01_PROMPT.md
│   ├── SESSION_02_PROMPT.md
│   └── SESSION_SUMMARY.md
├── deployment/
│   ├── README.md
│   ├── DEPLOYMENT_SESSION_PROMPT.md
│   ├── *.tar.gz          # Deployment archives
│   ├── *.zip             # Deployment packages
│   └── configs/          # Environment configs
└── demo/
    ├── DEMO_CHECKLIST.md
    └── SIGN_OFF.md
```

**IMPORTANT**: All deployment artifacts (.tar, .tar.gz, .zip) must be placed in the sprint's `deployment/` folder. DO NOT place deployment files in the project root.

### Package Folders

```
packages/
├── ai-services/      # AI/LLM integrations
├── api-client/       # API client library
├── core/             # Core business logic
├── db/               # Database schemas
├── module-sdk/       # Module SDK
├── types/            # Shared TypeScript types
├── ui/               # React components
└── utils/            # Utility functions
```

---

## File Naming

### Documentation Files

| Type              | Convention                     | Example                                           |
| ----------------- | ------------------------------ | ------------------------------------------------- |
| Epic overview     | `Epic XX - Name - Overview.md` | `Epic 03 - AI Interaction Platform - Overview.md` |
| Sprint overview   | `Sprint XX - Name.md`          | `Sprint 01 - API Foundation.md`                   |
| Session prompt    | `SESSION_XX_PROMPT.md`         | `SESSION_01_PROMPT.md`                            |
| Session summary   | `SESSION_SUMMARY.md`           | Single file per sprint                            |
| Orchestration     | `ORCHESTRATION_PROMPT.md`      | Per sprint                                        |
| Deployment prompt | `DEPLOYMENT_SESSION_PROMPT.md` | Per sprint                                        |
| Demo checklist    | `DEMO_CHECKLIST.md`            | Per sprint                                        |
| Sign-off          | `SIGN_OFF.md`                  | Per sprint                                        |

### Root-Level Files (Project-Wide Only)

Only these files belong in the project root:

| File             | Purpose             |
| ---------------- | ------------------- |
| `README.md`      | Project overview    |
| `package.json`   | Root package config |
| `tsconfig.json`  | TypeScript config   |
| `vite.config.ts` | Build config        |
| `.env*`          | Environment files   |

**All other documentation must go in `specs/` folder.**

### Source Code Files

| Type             | Convention                | Example                |
| ---------------- | ------------------------- | ---------------------- |
| React components | `PascalCase.tsx`          | `TranscriptView.tsx`   |
| Hooks            | `useCamelCase.ts`         | `useTranscription.ts`  |
| Utilities        | `camelCase.ts`            | `fileUtils.ts`         |
| Tests            | `*.test.ts` / `*.spec.ts` | `fileUtils.test.ts`    |
| E2E tests        | `*.spec.ts`               | `sprint01-api.spec.ts` |
| Types            | `camelCase.ts`            | `transcript.ts`        |
| Constants        | `SCREAMING_SNAKE_CASE`    | `API_ENDPOINTS.ts`     |
| Configs          | `kebab-case.config.ts`    | `vite.config.ts`       |

### Database Files

| Type       | Convention             | Example                 |
| ---------- | ---------------------- | ----------------------- |
| Schema     | `schema.ts`            | Single source of truth  |
| Migrations | `XXXX_description.sql` | `0001_create_users.sql` |
| Seeds      | `XX_description.ts`    | `01_seed_modules.ts`    |

---

## Git Conventions

### Branch Naming

```
epic-XX/sprint-XX/task-description
```

| Pattern | Example                            |
| ------- | ---------------------------------- |
| Feature | `epic-03/sprint-01/api-foundation` |
| Bug fix | `epic-03/sprint-01/fix-auth-token` |
| Hotfix  | `hotfix/critical-bug-description`  |
| Release | `release/v1.2.0`                   |

### Commit Message Format

```
type(scope): short description

- Detail 1
- Detail 2

Expert Feedback:
- Architecture: Approved
- Security: Approved with conditions
- Testing: Approved

Session: SESSION_XX
Sprint: epic-XX/sprint-XX

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Types

| Type       | Description                 | Example                             |
| ---------- | --------------------------- | ----------------------------------- |
| `feat`     | New feature                 | `feat(api): add JWT authentication` |
| `fix`      | Bug fix                     | `fix(ui): resolve modal z-index`    |
| `docs`     | Documentation only          | `docs: update API reference`        |
| `style`    | Formatting, no code change  | `style: fix linting errors`         |
| `refactor` | Code change, no feature/fix | `refactor(db): optimize queries`    |
| `perf`     | Performance improvement     | `perf(api): add response caching`   |
| `test`     | Adding tests                | `test(auth): add login tests`       |
| `chore`    | Build, config changes       | `chore: update dependencies`        |

### Scope Examples

| Scope    | Usage                             |
| -------- | --------------------------------- |
| `api`    | API-related changes               |
| `ui`     | UI components                     |
| `db`     | Database changes                  |
| `auth`   | Authentication                    |
| `core`   | Core business logic               |
| `ai`     | AI/LLM integrations               |
| `module` | Module SDK                        |
| `agent`  | Agent-related (Haven, Nomi, Aria) |
| `infra`  | Infrastructure changes            |

---

## Code Style

### TypeScript/JavaScript

```typescript
// Components: PascalCase
export function TranscriptView() {}

// Hooks: useCamelCase
export function useTranscription() {}

// Utilities: camelCase
export function formatTimestamp() {}

// Constants: SCREAMING_SNAKE_CASE
export const MAX_FILE_SIZE = 100 * 1024 * 1024

// Types/Interfaces: PascalCase
interface TranscriptEntry {
  id: string
  speaker: string
  text: string
}

// Enums: PascalCase with PascalCase values
enum AgentType {
  Haven = 'haven',
  Nomi = 'nomi',
  Aria = 'aria',
}
```

### CSS/Tailwind

```tsx
// Use Tailwind utility classes
<div className="flex items-center gap-4 p-4">

// Custom CSS: kebab-case
.transcript-entry {}
.speaker-badge {}
```

### Environment Variables

```bash
# Format: SCREAMING_SNAKE_CASE
VITE_API_URL=https://api.smarthaven.ai
VITE_GEMINI_API_KEY=xxx
DATABASE_URL=postgresql://...
```

---

## Agent Naming

### Agent Identifiers

| Agent | ID      | Domain           | Purpose                       |
| ----- | ------- | ---------------- | ----------------------------- |
| Haven | `haven` | Local/Property   | In-home assistant             |
| Nomi  | `nomi`  | SmartHavenAI.com | Property manager orchestrator |
| Aria  | `aria`  | Krowdzing.com    | Travel advisor                |

### Agent Communication

```typescript
// Message routing format
{
  from: 'haven',
  to: 'nomi',
  type: 'request',
  channel: 'vpn',  // vpn | mcp | pwa
}
```

---

## Module Naming

### Module Identifiers

```typescript
// Module IDs: kebab-case
const moduleIds = [
  'guest',
  'property-manager',
  'student',
  'traveler',
  'real-estate',
  'vehicle',
  'business',
]
```

### Module Package Structure

```
packages/modules/
├── guest/
│   ├── package.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── README.md
└── property-manager/
    └── ...
```

---

## API Naming

### Endpoints

```
# REST: kebab-case for resources
GET    /api/v1/transcripts
POST   /api/v1/transcripts
GET    /api/v1/transcripts/:id
DELETE /api/v1/transcripts/:id

# Nested resources
GET    /api/v1/properties/:id/guests
POST   /api/v1/properties/:id/service-requests
```

### API Versioning

```
/api/v1/...  # Current version
/api/v2/...  # Future version
```

---

## Database Naming

### Tables

```sql
-- snake_case for tables
CREATE TABLE users ();
CREATE TABLE transcripts ();
CREATE TABLE property_managers ();
CREATE TABLE service_requests ();
```

### Columns

```sql
-- snake_case for columns
id UUID PRIMARY KEY,
created_at TIMESTAMP,
updated_at TIMESTAMP,
user_id UUID REFERENCES users(id),
property_name TEXT
```

### Indexes

```sql
-- idx_table_column
CREATE INDEX idx_transcripts_user_id ON transcripts(user_id);
CREATE INDEX idx_service_requests_property_id ON service_requests(property_id);
```

---

## Testing Naming

### Test Files

| Type        | Pattern                 | Example                   |
| ----------- | ----------------------- | ------------------------- |
| Unit        | `*.test.ts`             | `fileUtils.test.ts`       |
| Integration | `*.integration.test.ts` | `api.integration.test.ts` |
| E2E         | `*.spec.ts`             | `sprint01-upload.spec.ts` |

### Test Descriptions

```typescript
describe('TranscriptService', () => {
  describe('createTranscript', () => {
    it('should create a transcript with valid input', () => {})
    it('should throw error for invalid file type', () => {})
    it('should handle large files gracefully', () => {})
  })
})
```

---

## Infrastructure Naming

### Docker

```yaml
# Service names: kebab-case
services:
  transcript-parser:
  audio-server:
  postgres-db:
```

### Environment Files

```
.env                 # Default (gitignored)
.env.local           # Local overrides (gitignored)
.env.development     # Development settings
.env.production      # Production settings
.env.test            # Test settings
```

---

## Summary Checklist

- [ ] Epic folders: `epic-XX-kebab-case/`
- [ ] Sprint folders: `sprint-XX/`
- [ ] Session prompts: `SESSION_XX_PROMPT.md`
- [ ] Branches: `epic-XX/sprint-XX/task-description`
- [ ] Commits: `type(scope): description`
- [ ] Components: `PascalCase.tsx`
- [ ] Hooks: `useCamelCase.ts`
- [ ] Utilities: `camelCase.ts`
- [ ] Constants: `SCREAMING_SNAKE_CASE`
- [ ] Tables: `snake_case`
- [ ] API endpoints: `/api/v1/kebab-case`

---

**Next Update**: When new naming patterns are introduced
