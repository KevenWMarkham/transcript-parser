# Epic 1: Monorepo Foundation 🏗️

**Epic ID**: EPIC-01
**Status**: In Progress
**Priority**: Critical
**Timeline**: 2 weeks (Sprint 1-2)
**Owner**: TBD

---

## 🎯 Epic Goal

Establish a scalable monorepo infrastructure using Turborepo and pnpm that enables rapid development of snap-in modules without code duplication.

## 💡 Why This Epic?

The current single-app architecture doesn't support our vision of multiple persona-driven modules (Real Estate, Vehicles, Travel, Students, Business). A monorepo with shared packages will allow us to:

- **Develop modules independently** while sharing common code
- **Reduce duplication** of UI components, AI services, and utilities
- **Speed up builds** with Turbo's intelligent caching
- **Scale easily** by adding new modules as separate apps
- **Maintain quality** with consistent types and tooling across all modules

## 📦 Success Criteria

- [x] Turborepo and pnpm workspace configured
- [ ] All shared packages extracted and building
- [ ] Existing app migrated to `apps/core` without regression
- [ ] Build time improved by 50% (baseline: measure first)
- [ ] Code sharing: 70%+ of code in shared packages
- [ ] Documentation updated to reflect new architecture
- [ ] All existing tests passing
- [ ] CI/CD pipeline supports monorepo

## 🎁 Deliverables

### Sprint 1: Monorepo Setup & Package Extraction
1. **Turborepo Configuration**
   - turbo.json with optimized pipeline
   - Build caching enabled
   - Task dependencies defined

2. **Shared Packages**
   - `packages/types` - All TypeScript types
   - `packages/ui` - UI components (shadcn/ui + custom)
   - `packages/ai-services` - Gemini AI, transcription, analysis
   - `packages/audio-processing` - Audio extraction (browser + FFmpeg)
   - `packages/export` - Export formats (TXT, SRT, VTT, CSV, JSON)
   - `packages/database` - Drizzle ORM schemas and queries
   - `packages/module-sdk` - SDK for creating snap-in modules

3. **Module SDK**
   - ModuleDefinition interface
   - ModuleRegistry for dynamic loading
   - Lifecycle hooks
   - Documentation for module developers

### Sprint 2: Core App Migration & Testing
1. **App Migration**
   - Move `src/` to `apps/core/src/`
   - Update imports to workspace packages
   - Verify no regressions

2. **Build Pipeline**
   - Turbo build configuration
   - Parallel builds for packages
   - Incremental builds

3. **CI/CD Updates**
   - GitHub Actions workflow for monorepo
   - Test all packages
   - Deploy core app

4. **Documentation**
   - Architecture docs updated
   - Developer guide for monorepo
   - Module development guide

## 🔗 Dependencies

### Prerequisites
- [x] Existing single-app is stable and working
- [x] pnpm installed (v9.0.0)
- [ ] Team understands monorepo concepts

### Blockers
- None currently

### Dependent Epics
All future epics depend on this foundation:
- Epic 2: User Profiles & Persona System
- Epic 3: Real Estate Module
- All module epics require the Module SDK

## 📊 Key Metrics

| Metric | Baseline | Target | Current |
|--------|----------|--------|---------|
| Build time | TBD | 50% faster | TBD |
| Code duplication | High | <30% | TBD |
| Package count | 1 | 8+ | 3 |
| Test coverage | TBD | >80% | TBD |

## 🚧 Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Complex migration breaks existing app | High | Medium | Thorough testing at each step, keep existing app working until migration complete |
| Build configuration issues | Medium | Low | Start with simple Turbo config, iterate |
| Team learning curve | Low | Medium | Documentation, pair programming, code reviews |
| Import path changes cause bugs | Medium | Medium | Use automated tools (codemod), comprehensive testing |

## 👥 Roles & Responsibilities

- **Product Owner**: Define module requirements
- **Tech Lead**: Design monorepo architecture, review PRs
- **Developers**: Extract packages, migrate code, write tests
- **QA**: Test migration thoroughly, verify no regressions
- **DevOps**: Update CI/CD for monorepo

## 📅 Sprint Planning

### Sprint 1 (Week 1)
**Goal**: Extract shared packages and create Module SDK

**Planning Session**:
- [ ] Review existing codebase to identify shared code
- [ ] Design package boundaries
- [ ] Plan extraction order (dependencies first)
- [ ] Estimate effort for each package

**Daily Standups**:
- Progress on package extraction
- Blockers with import paths or dependencies
- Testing strategy

**Sprint Review**:
- Demo: All packages building independently
- Demo: Module SDK with example Real Estate module
- Review: Code quality, test coverage

**Retrospective**:
- What went well?
- What could be improved?
- Action items for Sprint 2

### Sprint 2 (Week 2)
**Goal**: Migrate core app and complete monorepo setup

**Planning Session**:
- [ ] Review Sprint 1 completion
- [ ] Plan migration strategy (incremental vs. big bang)
- [ ] Define testing checkpoints
- [ ] Assign tasks

**Daily Standups**:
- Migration progress
- Any breaking changes
- CI/CD status

**Sprint Review**:
- Demo: Existing app running in monorepo
- Demo: Turbo build improvements
- Review: Performance metrics (build time)

**Retrospective**:
- Monorepo lessons learned
- Process improvements
- Prepare for Epic 2

## 📝 Notes

### Design Decisions
1. **Turborepo over Nx**: Simpler, better caching, less opinionated
2. **pnpm over npm/yarn**: Faster, more efficient, workspace support
3. **Module SDK as separate package**: Allows third-party module development
4. **Local-first approach**: IndexedDB + PostgreSQL sync (optional)

### Technical Constraints
- Must maintain backward compatibility during migration
- Existing tests must all pass
- Build time must improve, not regress

### Future Considerations
- Module marketplace (Epic 14)
- Third-party module development
- White-label deployments for enterprises

## 📚 Resources

### Documentation
- [Turborepo Handbook](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Module SDK Documentation](../../../packages/module-sdk/README.md)
- [Monorepo Architecture](../../../docs/ARCHITECTURE.md)

### Examples
- [Real Estate Module Example](../../../modules/real-estate.example.ts)

### Tools
- [Turborepo](https://turbo.build)
- [pnpm](https://pnpm.io)
- [TypeScript](https://www.typescriptlang.org)

---

## ✅ Definition of Done

This epic is complete when:
- [ ] All packages in `packages/` are extracted and building
- [ ] Core app in `apps/core` works identically to before
- [ ] All existing tests pass
- [ ] Build time is measurably faster
- [ ] Documentation is updated
- [ ] CI/CD pipeline works
- [ ] Code review approved
- [ ] Retrospective completed
- [ ] Demo to stakeholders successful

---

**Status Updates**:
- **2024-12-20**: Epic created, Sprint 1 in progress
- **2024-12-20**: Module SDK and types packages created ✅
- **2024-12-20**: pnpm workspace configured ✅

**Next Steps**: Complete package extraction for UI, AI services, audio processing
