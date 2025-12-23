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

## Available Skills

Claude has access to specialized skills. Invoke with `/skill-name` or use the Skill tool.

### Superpowers Skills (Development Workflow)

| Skill                                         | When to Use                                                        |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `/superpowers:brainstorming`                  | **BEFORE any creative work** - features, components, modifications |
| `/superpowers:write-plan`                     | Create detailed implementation plans with bite-sized tasks         |
| `/superpowers:execute-plan`                   | Execute plans in batches with review checkpoints                   |
| `/superpowers:test-driven-development`        | Before writing implementation code                                 |
| `/superpowers:systematic-debugging`           | When encountering bugs, test failures, unexpected behavior         |
| `/superpowers:verification-before-completion` | Before claiming work is complete or creating PRs                   |
| `/superpowers:requesting-code-review`         | After completing tasks or major features                           |
| `/superpowers:receiving-code-review`          | When receiving feedback, before implementing suggestions           |
| `/superpowers:finishing-a-development-branch` | When implementation complete, deciding merge/PR/cleanup            |
| `/superpowers:using-git-worktrees`            | Starting feature work needing isolation                            |
| `/superpowers:dispatching-parallel-agents`    | When facing 2+ independent tasks                                   |
| `/superpowers:writing-skills`                 | Creating or editing skills                                         |

### Document Skills

| Skill                   | When to Use                                      |
| ----------------------- | ------------------------------------------------ |
| `/document-skills:xlsx` | Create, edit, analyze spreadsheets (.xlsx, .csv) |
| `/document-skills:docx` | Create, edit Word documents with tracked changes |
| `/document-skills:pptx` | Create, edit PowerPoint presentations            |
| `/document-skills:pdf`  | Extract text, fill forms, merge/split PDFs       |

### Creative Skills

| Skill                               | When to Use                                      |
| ----------------------------------- | ------------------------------------------------ |
| `/example-skills:canvas-design`     | Create visual art, posters, designs (.png, .pdf) |
| `/example-skills:algorithmic-art`   | Generative art using p5.js                       |
| `/example-skills:artifacts-builder` | Complex multi-component HTML artifacts           |
| `/example-skills:slack-gif-creator` | Animated GIFs for Slack                          |
| `/example-skills:theme-factory`     | Style artifacts with themes                      |
| `/example-skills:brand-guidelines`  | Apply Anthropic brand colors/typography          |

### Builder Skills

| Skill                            | When to Use                            |
| -------------------------------- | -------------------------------------- |
| `/example-skills:skill-creator`  | Create new skills for Claude           |
| `/example-skills:mcp-builder`    | Build MCP servers for LLM integrations |
| `/example-skills:webapp-testing` | Test web apps with Playwright          |
| `/example-skills:internal-comms` | Write internal communications          |

### Skill Usage Rules

1. **Check for applicable skills BEFORE any response**
2. **Invoke skill if even 1% chance it applies**
3. **Brainstorming skill required before creative/feature work**
4. **TDD skill before implementation**
5. **Verification skill before claiming completion**

### Skill Priority Order

When multiple skills apply:

1. **Process skills first** (brainstorming, debugging)
2. **Implementation skills second** (frontend, mcp-builder)

Example: "Build feature X" → brainstorming first, then implementation skills

---

## Parallel Agents

Claude can spawn specialized agents for parallel execution. Use Task tool with `subagent_type`.

### Built-in Agents

| Agent                       | Use Case                                     | Model       |
| --------------------------- | -------------------------------------------- | ----------- |
| `general-purpose`           | Complex multi-step tasks, research           | sonnet/opus |
| `Explore`                   | Codebase exploration, file search            | haiku       |
| `Plan`                      | Architecture design, implementation planning | sonnet/opus |
| `claude-code-guide`         | Questions about Claude Code features         | sonnet      |
| `testing-agent`             | Run tests after file updates                 | sonnet      |
| `superpowers:code-reviewer` | Code review after implementation             | opus        |

### Project-Specific Agents

Use these for SmartHaven parallel orchestration:

| Agent                   | Purpose                             | When to Spawn             |
| ----------------------- | ----------------------------------- | ------------------------- |
| **Architecture Agent**  | Review design patterns, scalability | New features, refactoring |
| **Security Agent**      | Audit auth, OWASP, data protection  | Auth changes, API work    |
| **Testing Agent**       | Run unit/E2E tests, coverage        | After code changes        |
| **Deployment Agent**    | Build, deploy, verify               | Sprint completion         |
| **Documentation Agent** | Update docs, session summaries      | After sessions            |
| **Expert Panel Agent**  | Collect expert feedback             | Every session             |

### Parallel Execution Patterns

**Pattern 1: Multi-Package Updates**

```
Launch in parallel:
├── Agent 1: Update packages/ui
├── Agent 2: Update packages/ai-services
└── Agent 3: Update packages/export
```

**Pattern 2: Test + Deploy**

```
Launch in parallel:
├── Agent 1: Run unit tests
├── Agent 2: Run E2E tests
└── Agent 3: Build production bundle
Then: Deploy Agent (after all pass)
```

**Pattern 3: Expert Review**

```
Launch in parallel:
├── Architecture Expert Agent
├── Security Expert Agent
├── Testing Expert Agent
└── Performance Expert Agent
Collect: All feedback into SESSION_SUMMARY.md
```

**Pattern 4: Multi-Epic Planning**

```
Launch in parallel:
├── Agent 1: Plan Epic 02 Sprint 01
├── Agent 2: Plan Epic 03 Sprint 01
└── Agent 3: Research dependencies
```

### Agent Spawning Rules

1. **Independent tasks only** - No shared state between parallel agents
2. **Use haiku for exploration** - Fast, cost-effective searches
3. **Use opus for architecture** - Complex reasoning needed
4. **Collect results** - Use TaskOutput to gather agent responses
5. **Max parallel agents** - Keep to 3-5 for manageability

### Example: Spawn Testing Agent

```
Task tool:
  subagent_type: "testing-agent"
  prompt: "Run unit tests for packages/ui and report coverage"
  model: "sonnet"
  run_in_background: true
```

### Example: Parallel Expert Review

```
Task tool (send all in one message):
  1. subagent_type: "general-purpose"
     prompt: "Act as Architecture Expert. Review [code] for patterns..."

  2. subagent_type: "general-purpose"
     prompt: "Act as Security Expert. Audit [code] for vulnerabilities..."

  3. subagent_type: "general-purpose"
     prompt: "Act as Testing Expert. Review test coverage for [code]..."
```

---

## Remember

1. **NO CODE** when orchestrating
2. **Commit after every session**
3. **Expert feedback required**
4. **Version tracking mandatory**
5. **Deployment files in sprint folders only**
6. **Demo before sign-off**
