# Sprint 01: Session Prompt - Package Extraction

**Epic**: Epic 01 - Monorepo Foundation
**Sprint**: 01
**Session Type**: Design & Implementation
**Participants**: Engineering Team + Product Owner

---

## 🎯 Session Objective

Design and execute the extraction of shared code into reusable packages within our Turborepo monorepo, ensuring clean boundaries and optimal code reuse.

---

## 📋 Pre-Session Preparation

### Required Reading
- [ ] [Epic 01 Overview](../Epic%2001%20-%20Monorepo%20Foundation%20-%20Overview.md)
- [ ] [Sprint 01 Overview](./Sprint%2001%20-%20Overview.md)
- [ ] [Turborepo Handbook](https://turbo.build/repo/docs)
- [ ] Current codebase structure (`src/` directory)

### Environment Setup
- [ ] Pull latest code from main branch
- [ ] Install pnpm (`npm install -g pnpm`)
- [ ] Review existing dependencies in package.json
- [ ] Have VSCode or preferred IDE ready

---

## 🗣️ Session Agenda (3 hours)

### Part 1: Code Analysis & Package Boundary Design (60 min)

**Facilitator**: Tech Lead

**Activities**:

1. **Code Inventory** (20 min)
   - Review current `src/` directory structure
   - Identify all shared code:
     - Components (UI)
     - Services (AI, audio, export)
     - Types and interfaces
     - Utilities
     - Hooks
   - Create list of files and their dependencies

2. **Package Boundary Design** (30 min)
   - Group files into logical packages
   - Define package dependencies (DAG - Directed Acyclic Graph)
   - Identify potential circular dependencies
   - Decide on package naming convention
   - Sketch package structure on whiteboard/Miro

3. **Risk Assessment** (10 min)
   - Identify high-risk areas (complex dependencies)
   - Plan mitigation strategies
   - Agree on testing approach

**Output**:
- Package dependency diagram
- List of files per package
- Risk mitigation plan

---

### Part 2: Package Extraction Strategy (45 min)

**Facilitator**: Senior Developer

**Activities**:

1. **Extraction Order** (15 min)
   - Prioritize packages with no dependencies first
   - Plan incremental extraction (one package at a time)
   - Agree on extraction order:
     1. Types (no dependencies)
     2. Module SDK (depends on types)
     3. UI components (depends on types)
     4. AI services (depends on types)
     5. Audio processing (depends on types)
     6. Export utilities (depends on types)
     7. Database (depends on types)

2. **Technical Approach** (20 min)
   - Decide on package.json structure
   - Choose build tools (tsup, vite, tsc?)
   - Define export strategy (named exports, default exports)
   - Plan testing approach per package
   - Agree on documentation requirements

3. **Import Path Strategy** (10 min)
   - Decide on naming: `@transcript-parser/*`
   - Plan find/replace approach for imports
   - Identify automated tools (jscodeshift, ast-grep)
   - Test import paths work in TypeScript

**Output**:
- Step-by-step extraction guide
- package.json templates for each package
- Import path migration script (if needed)

---

### Part 3: Hands-On Extraction (60 min)

**Facilitator**: All team members (pair programming)

**Activities**:

1. **Extract Types Package** (15 min)
   - Create `packages/types/` directory
   - Move `src/types/` files
   - Create package.json
   - Configure tsconfig.json
   - Build and test package
   - Update imports in remaining code

2. **Extract UI Package** (20 min)
   - Create `packages/ui/` directory
   - Move shadcn/ui components
   - Move custom components
   - Move Tailwind config
   - Handle CSS imports
   - Build and test package
   - Verify components render

3. **Extract AI Services Package** (15 min)
   - Create `packages/ai-services/` directory
   - Move Gemini client
   - Move transcription services
   - Move speaker detection
   - Move usage tracker
   - Build and test package
   - Verify API calls work

4. **Testing & Validation** (10 min)
   - Run Turbo build for all packages
   - Verify no errors
   - Check import paths resolve correctly
   - Run existing tests (should still pass)

**Output**:
- Working packages building with Turbo
- Updated import paths
- All tests passing

---

### Part 4: Integration & Testing (30 min)

**Facilitator**: QA Lead

**Activities**:

1. **Integration Testing** (15 min)
   - Test existing app with new packages
   - Verify all functionality works:
     - Video upload
     - Transcription
     - Speaker detection
     - Export functionality
   - Test across different browsers
   - Test PWA installation

2. **Performance Testing** (10 min)
   - Measure build time (baseline)
   - Compare with Turbo caching enabled
   - Verify app load time hasn't regressed
   - Check bundle sizes

3. **Documentation Review** (5 min)
   - Review package READMEs
   - Ensure usage examples are clear
   - Update main README with monorepo info

**Output**:
- Test report (all green)
- Performance metrics
- Updated documentation

---

### Part 5: Wrap-Up & Next Steps (15 min)

**Facilitator**: Product Owner

**Activities**:

1. **Review Completed Work** (5 min)
   - What was accomplished?
   - What's remaining?
   - Any blockers for next sprint?

2. **Action Items** (5 min)
   - Assign remaining tasks
   - Set deadlines
   - Identify dependencies for Sprint 02

3. **Retrospective Quick Hits** (5 min)
   - What went well?
   - What could be improved?
   - Any surprises or learnings?

**Output**:
- Action item list with owners
- Updated sprint backlog
- Notes for retrospective

---

## 🛠️ Technical Details

### Package Template Structure

Each package should follow this structure:

```
packages/[package-name]/
├── src/
│   ├── index.ts          # Main export file
│   └── ...               # Source files
├── dist/                 # Build output (generated)
├── package.json
├── tsconfig.json
├── README.md
└── tests/                # Unit tests (optional)
```

### package.json Template

```json
{
  "name": "@transcript-parser/[package-name]",
  "version": "0.1.0",
  "description": "...",
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
  "keywords": ["transcript-parser", "..."],
  "author": "Keven Markham",
  "license": "ISC",
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "~5.6.2"
  },
  "dependencies": {
    // Package-specific dependencies
  }
}
```

### tsconfig.json Template

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

---

## 🎓 Expert Guidance

### Monorepo Best Practices

**Expert 1: Architecture Consultant**
- Keep packages small and focused (single responsibility)
- Avoid circular dependencies at all costs
- Use TypeScript project references for type checking
- Document package APIs clearly

**Expert 2: Performance Engineer**
- Leverage Turbo's caching (outputs, dependencies)
- Use parallel builds where possible
- Minimize package interdependencies for faster builds
- Profile build times to find bottlenecks

**Expert 3: DX (Developer Experience) Engineer**
- Make packages easy to use (clear exports, good docs)
- Provide examples in README
- Use consistent naming and structure
- Add helpful error messages

---

## ✅ Session Success Criteria

At the end of this session, we should have:

- [ ] All packages created in `packages/` directory
- [ ] All packages building successfully with Turbo
- [ ] No circular dependencies
- [ ] Existing app works with new packages (no regressions)
- [ ] Import paths updated throughout codebase
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Team aligned on monorepo structure

---

## 📊 Metrics to Track

### During Session
- Number of packages created: __/7
- Build time with Turbo: __ seconds
- Test pass rate: __%
- Team velocity: __ story points/hour

### Post-Session
- Code duplication reduced: __%
- Developer satisfaction: __/10
- Time to add new feature: __ (baseline for future)

---

## 🔗 Resources

### Tools
- [Turborepo](https://turbo.build)
- [pnpm](https://pnpm.io)
- [tsup](https://tsup.egoist.dev) - TypeScript bundler
- [Changesets](https://github.com/changesets/changesets) - Version management (future)

### Documentation
- [Monorepo Architecture Docs](../../../../docs/ARCHITECTURE.md)
- [Module SDK Docs](../../../../packages/module-sdk/README.md)
- [Sprint Backlog](./Sprint%2001%20-%20Overview.md)

### Collaboration
- Miro Board: [Link to design board]
- Slack Channel: #monorepo-migration
- GitHub Project: [Link to project board]

---

## 📝 Post-Session Actions

After the session, the team should:

1. **Document Decisions**
   - [ ] Update architecture docs with final package structure
   - [ ] Document any deviations from the plan
   - [ ] Record technical decisions made

2. **Create Follow-Up Tasks**
   - [ ] Create GitHub issues for remaining work
   - [ ] Assign owners to tasks
   - [ ] Set realistic deadlines

3. **Communicate Progress**
   - [ ] Update stakeholders on progress
   - [ ] Share wins and learnings in team meeting
   - [ ] Document blockers and escalate if needed

4. **Prepare for Sprint 02**
   - [ ] Review Sprint 02 goals
   - [ ] Identify dependencies
   - [ ] Ensure team is ready

---

## 🎯 Expected Outcomes

### Immediate (End of Session)
- Functional monorepo with 7+ packages
- Turbo build working
- All tests passing
- Team confident in monorepo approach

### Short-Term (End of Sprint 01)
- All packages fully extracted
- Documentation complete
- CI/CD updated for monorepo
- Ready to start Sprint 02 (app migration)

### Long-Term (Epic 01 Complete)
- Scalable architecture for modules
- 50% faster builds
- 70% code reuse
- Foundation for rapid module development

---

**Session Facilitator**: [Name]
**Session Notes**: [Link to notes doc]
**Recording**: [Link to video if recorded]
**Next Session**: Sprint 02 - Core App Migration
