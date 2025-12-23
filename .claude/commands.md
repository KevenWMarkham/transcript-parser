# SmartHaven AI Platform - Claude Rules & Commands

## Project Context

**Project**: SmartHaven AI Platform (Transcript Parser)
**Version**: 1.1.0
**Current Epic**: Epic 01 - Monorepo Foundation (85% Complete)

---

## Core Rules

### 1. Orchestrator NO CODE Policy

When acting as **Orchestrator**:

- **DO**: Plan, coordinate, create prompts, review, validate, assign experts
- **DO NOT**: Write implementation code directly
- All code implementation happens in separate Claude Code CLI sessions

### 2. File Organization

```
ROOT LEVEL (allowed):
├── README.md
├── package.json, tsconfig.json, vite.config.ts
├── Dockerfile, docker-compose.yml
├── .env* files
└── Config files (eslint, prettier, etc.)

SPECS FOLDER (all documentation):
├── specs/ROADMAP.md
├── specs/ORCHESTRATION.md
├── specs/NAMING_CONVENTIONS.md
├── specs/KICKOFF_ORCHESTRATION_PROMPT.md
└── specs/epics/epic-XX-name/sprints/sprint-XX/
    ├── planning/
    ├── implementation/
    ├── deployment/  ← All .tar.gz, .zip, deploy scripts
    └── demo/
```

**NEVER** place deployment files, .md docs, or .tar archives in root.

### 3. Version Tracking

- Update `src/version.ts` for every release
- Keep `package.json` version in sync
- Version badge displays in bottom-right corner
- Log version banner on app start

### 4. Commit Convention

```
type(scope): short description

- Detail 1
- Detail 2

Expert Feedback:
- Architecture: Approved
- Security: Approved
- Testing: Approved

Session: SESSION_XX
Sprint: epic-XX/sprint-XX

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore

### 5. Branch Naming

```
epic-XX/sprint-XX/task-description
```

Examples:

- `epic-01/sprint-01/testing-completion`
- `epic-02/sprint-01/auth-system`
- `hotfix/critical-bug-fix`

---

## Interface Selection

| Task                   | Interface          | Model  |
| ---------------------- | ------------------ | ------ |
| Planning/Orchestration | Claude Web         | Opus   |
| Code Implementation    | Claude Code CLI    | Sonnet |
| Complex Architecture   | Claude Code CLI    | Opus   |
| Code Review            | Claude Code Client | Opus   |
| Testing                | Claude Code CLI    | Sonnet |
| Documentation          | Claude Web         | Sonnet |

---

## Expert Panel

Every session requires expert feedback:

| Expert           | Focus                        | When Required   |
| ---------------- | ---------------------------- | --------------- |
| **Architecture** | Design patterns, scalability | Always          |
| **Security**     | Auth, OWASP, data protection | Always          |
| **Testing**      | Coverage, edge cases         | Always          |
| **Performance**  | Optimization, caching        | DB/API work     |
| **UX**           | WCAG, usability              | UI components   |
| **Domain**       | Business logic               | Module-specific |

---

## Session Workflow

```
1. Load SESSION_XX_PROMPT.md
2. Execute assigned tasks
3. Get expert feedback
4. Run tests (pnpm test)
5. Commit with convention
6. Update SESSION_SUMMARY.md
```

---

## Quick Commands

### Development

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm test             # Run unit tests
pnpm test:coverage    # Coverage report
pnpm test:e2e         # E2E tests
pnpm lint             # Lint check
```

### Git

```bash
git status
git add .
git commit -m "type(scope): message"
git push
```

### Packages

```bash
pnpm --filter @transcript-parser/ui test
pnpm --filter @transcript-parser/ai-services build
```

---

## Project Structure

```
packages/
├── ai-services/     # Gemini AI integration
├── audio-processing/# Audio extraction
├── config/          # Shared configuration
├── database/        # Drizzle ORM, schemas
├── export/          # Export formatters
├── module-sdk/      # Module SDK
├── types/           # Shared TypeScript types
└── ui/              # React components

src/                 # Main application
specs/               # All documentation
tests/e2e/           # Playwright E2E tests
```

---

## Agent Architecture

```
HAVEN (Local)          NOMI (Cloud)           ARIA (External)
     │                      │                      │
     │◄── Private VPN ────►│                      │
     │                      │───── MCP ──────────►│
```

- **Haven**: Local Ollama, Kiosk, Sonos
- **Nomi**: Multi-LLM, Property Management
- **Aria**: Web search, Travel booking

---

## Sprint Completion Checklist

- [ ] All tasks completed
- [ ] Unit tests passing (≥80% coverage)
- [ ] E2E tests passing
- [ ] Expert feedback collected
- [ ] Demo in Development - WORKING
- [ ] Demo in Production - WORKING
- [ ] SIGN_OFF.md completed
- [ ] ROADMAP.md updated

---

## Deployment

All deployment artifacts go to:

```
specs/epics/epic-XX-name/sprints/sprint-XX/deployment/
```

**Never** deploy from root directory.

---

## Key Documents

- `specs/ROADMAP.md` - Product roadmap
- `specs/ORCHESTRATION.md` - Development workflow
- `specs/NAMING_CONVENTIONS.md` - Standards
- `specs/KICKOFF_ORCHESTRATION_PROMPT.md` - Current kickoff

---

## Remember

1. **NO CODE** when orchestrating
2. **Commit after every session**
3. **Expert feedback required**
4. **Version tracking mandatory**
5. **Deployment files in sprint folders only**
6. **Demo before sign-off**
