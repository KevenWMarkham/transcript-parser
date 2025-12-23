# SmartHaven AI Platform - Orchestration & Development Workflow

**Last Updated**: December 23, 2024
**Current Sprint**: Epic 01, Sprint 01 - Monorepo Foundation (85% Complete)
**Project Status**: Active Development

---

## Orchestrator Role & Policies

### NO CODE Policy

The Orchestrator is responsible for planning and coordination. It **NEVER writes code directly**.

**What Orchestrator DOES**:

- Plans sessions and sprints
- Coordinates expert feedback
- Selects Claude interface and model
- Manages workflow execution
- Triggers deployments
- Validates sprint completion

**What Orchestrator DOES NOT DO**:

- Write implementation code
- Execute build commands
- Make code changes
- Deploy directly

---

## Claude Development Workflow

### Session Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR WORKFLOW                                │
│                      (NO CODE POLICY)                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. READ ROADMAP.md                                                     │
│     └── Identify current epic and sprint                               │
│                                                                         │
│  2. CREATE/UPDATE ORCHESTRATOR.md (per sprint)                          │
│     └── Define sessions, tasks, experts                                │
│                                                                         │
│  3. SELECT CLAUDE INTERFACE                                             │
│     ├── Claude Code CLI (local development)                            │
│     ├── Claude Code Client (IDE integration)                           │
│     └── Claude Code Web (remote/collaborative)                         │
│                                                                         │
│  4. SELECT MODEL                                                        │
│     ├── Opus - Complex architecture, planning, critical code           │
│     └── Sonnet - Standard implementation, bug fixes, tests             │
│                                                                         │
│  5. ASSIGN EXPERTS                                                      │
│     ├── Architecture Expert                                            │
│     ├── Security Expert                                                │
│     ├── Performance Expert                                             │
│     ├── UX/Accessibility Expert                                        │
│     ├── Testing Expert                                                 │
│     └── Domain Expert (Real Estate, Travel, etc.)                      │
│                                                                         │
│  6. EXECUTE SESSION                                                     │
│     └── Claude implements assigned tasks                               │
│                                                                         │
│  7. AUTO-COMMIT (after EVERY session)                                   │
│     └── Code committed with naming convention                          │
│                                                                         │
│  8. VALIDATE & REPEAT                                                   │
│     └── Until sprint complete                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Model Selection Guide

| Task Type            | Model      | Interface  | Rationale                |
| -------------------- | ---------- | ---------- | ------------------------ |
| Architecture design  | **Opus**   | CLI/Client | Complex reasoning needed |
| Epic/Sprint planning | **Opus**   | Web        | Collaborative planning   |
| Core infrastructure  | **Opus**   | CLI        | Critical code paths      |
| Standard features    | **Sonnet** | CLI        | Cost-effective           |
| Bug fixes            | **Sonnet** | CLI        | Straightforward          |
| Unit tests           | **Sonnet** | CLI        | Repetitive patterns      |
| Code review          | **Opus**   | Client     | Deep analysis            |
| Documentation        | **Sonnet** | Web        | Content generation       |

---

## Expert Panel

Every session includes feedback from relevant experts:

| Expert               | Focus Area                                            | When Required   |
| -------------------- | ----------------------------------------------------- | --------------- |
| **Architecture**     | Design patterns, scalability, separation of concerns  | Always          |
| **Security**         | Auth, data protection, OWASP top 10, input validation | Always          |
| **Performance**      | Optimization, caching, query efficiency, bundle size  | DB/API work     |
| **UX/Accessibility** | WCAG 2.1, usability, responsive design                | UI components   |
| **Testing**          | Coverage, edge cases, test strategy                   | Always          |
| **Domain**           | Business logic validation, domain-specific rules      | Module-specific |

### Expert Feedback Format

```markdown
## Expert Feedback: [Expert Name]

### Observations

- [Observation 1]
- [Observation 2]

### Recommendations

- [Recommendation 1]
- [Recommendation 2]

### Approval Status

- [ ] Approved
- [ ] Approved with conditions
- [ ] Needs revision
```

---

## Sprint Lifecycle

### Phase 1: Planning (Orchestrator)

1. Read ROADMAP.md to identify next sprint
2. Create sprint folder structure:
   ```
   specs/epics/epic-XX-name/sprints/sprint-XX/
   ├── planning/
   │   ├── Sprint XX - Overview.md
   │   ├── ORCHESTRATOR.md
   │   └── expert-feedback/
   ├── implementation/
   │   ├── SESSION_01_PROMPT.md
   │   └── SESSION_SUMMARY.md
   └── demo/
       ├── DEMO_CHECKLIST.md
       └── SIGN_OFF.md
   ```
3. Define tasks and assign to sessions
4. Select experts for sprint
5. Define acceptance criteria

### Phase 2: Execution (Minimal Human Interaction)

```
Session 1 ──► Session 2 ──► Session 3 ──► ... ──► Session N
    │            │            │                      │
    ▼            ▼            ▼                      ▼
 Commit       Commit       Commit                 Commit
```

Each session:

1. Claude receives SESSION_XX_PROMPT.md
2. Implements assigned tasks
3. Gets Expert feedback
4. Auto-commits code
5. Updates SESSION_SUMMARY.md

### Phase 3: Testing & Deployment

Automated pipeline:

1. All tests run
2. Auto-deploy to Development
3. Smoke tests pass
4. Auto-deploy to Production (PromptSource.live)

### Phase 4: Demo & Sign-off

**REQUIRED before Sprint Sign-off:**

- [ ] Demo in Development environment - WORKING
- [ ] Demo in Production environment - WORKING
- [ ] All acceptance criteria met
- [ ] Expert sign-offs collected
- [ ] SIGN_OFF.md completed

---

## Automation Pipeline

### On Commit

```bash
# Automatically triggered
- pnpm lint
- pnpm type-check
- pnpm test:unit
- security scan
```

### On PR/Merge to Develop

```bash
# Automatically triggered
- pnpm test (full suite)
- pnpm test:e2e
- pnpm build
- deploy to Development
```

### On Sprint Completion

```bash
# Manually triggered by Orchestrator
- pnpm test:regression
- performance benchmarks
- deploy to Production
- health checks
- rollback ready
```

---

## Session Prompt Template

```markdown
# Session [XX] - [Task Name]

## Context

- Epic: [Epic Number and Name]
- Sprint: [Sprint Number]
- Previous Session: [Summary of what was done]

## Objective

[Clear description of what this session should accomplish]

## Tasks

1. [ ] Task 1
2. [ ] Task 2
3. [ ] Task 3

## Files to Modify

- `path/to/file1.ts`
- `path/to/file2.ts`

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Expert Requirements

- Architecture: [Specific concerns]
- Security: [Specific concerns]
- Testing: [Coverage requirements]

## Model Recommendation

- **Opus** / **Sonnet** (with rationale)
```

---

## Commit Requirements

After EVERY session:

1. **Stage changes**: `git add .`
2. **Commit with convention**:

   ```
   type(scope): description

   - Detail 1
   - Detail 2

   Expert Feedback:
   - Architecture: Approved
   - Security: Approved with conditions
   - Testing: Approved

   Session: SESSION_XX
   Sprint: epic-XX/sprint-XX
   ```

3. **Push to branch**: `git push`

### Commit Types

| Type       | Description                 |
| ---------- | --------------------------- |
| `feat`     | New feature                 |
| `fix`      | Bug fix                     |
| `docs`     | Documentation only          |
| `style`    | Formatting, no code change  |
| `refactor` | Code change, no feature/fix |
| `perf`     | Performance improvement     |
| `test`     | Adding tests                |
| `chore`    | Build, config changes       |

---

## Quality Gates

### Before Starting Sprint

- [ ] ROADMAP.md is up to date
- [ ] Sprint folder structure created
- [ ] ORCHESTRATOR.md defined
- [ ] Expert panel identified

### Before Each Session

- [ ] Previous session committed
- [ ] SESSION_XX_PROMPT.md created
- [ ] Model and interface selected

### After Each Session

- [ ] Code committed
- [ ] Expert feedback recorded
- [ ] SESSION_SUMMARY.md updated

### Before Sprint Sign-off

- [ ] All sessions complete
- [ ] All tests passing
- [ ] Demo in Dev - WORKING
- [ ] Demo in Prod - WORKING
- [ ] SIGN_OFF.md completed
- [ ] ROADMAP.md updated

---

## Current Project Status

### Epic Progress

| Epic | Name                    | Status         | Progress |
| ---- | ----------------------- | -------------- | -------- |
| 0    | Original MVP            | ✅ Complete    | 100%     |
| 1    | Monorepo Foundation     | ⏳ In Progress | 85%      |
| 2    | User Profiles & Persona | 🔜 Next        | 0%       |
| 3    | AI Interaction Platform | Planned        | 0%       |
| 4    | Agent Orchestration     | Planned        | 0%       |
| 5    | Guest Module            | Planned        | 0%       |
| 6    | Property Manager Module | Planned        | 0%       |
| 7-14 | Expansion Modules       | Planned        | 0%       |

### Current Sprint: Epic 01, Sprint 01

**Goal**: Complete monorepo foundation with package extraction
**Remaining**:

- [ ] Complete unit testing
- [ ] Complete E2E testing
- [ ] Final validation and demo

---

## Related Documents

- [ROADMAP.md](./ROADMAP.md) - Product roadmap and epic overview
- [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) - File and branch naming standards

---

**Next Update**: After Epic 01 Sprint 01 completion
