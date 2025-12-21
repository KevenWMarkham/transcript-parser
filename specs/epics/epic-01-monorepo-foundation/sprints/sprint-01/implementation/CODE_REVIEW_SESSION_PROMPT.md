# Sprint 01 - Code Review Session Prompt

**⚡ RECOMMENDED MODEL: Claude Opus**

- **Complexity**: High (comprehensive review of 8 packages, architectural decisions, expert feedback validation)
- **Risk**: Medium (identifying issues before they become technical debt)
- **Estimated Duration**: 2-3 hours (thorough review + documentation)

**Alternative**: Use Sonnet for individual package reviews, but Opus is strongly recommended for comprehensive cross-package analysis.

---

## 📋 Session Overview

**Objective**: Conduct comprehensive code review of Sprint 01 monorepo implementation, validating against all 7 expert feedback requirements and identifying any issues before marking the sprint complete.

**Status**:

- ✅ 8/8 packages extracted and building
- ✅ Main app migrated and functional
- ⏳ Awaiting code review approval
- ⏳ Awaiting expert feedback validation

**Completion Criteria**:

- All expert feedback requirements validated
- No critical issues identified
- All packages following established patterns
- Security requirements met
- Performance targets achieved
- Accessibility compliance verified
- Documentation complete

---

## 🎯 Review Scope

### Packages to Review (8 total)

1. **@transcript-parser/types** - TypeScript types and interfaces
2. **@transcript-parser/module-sdk** - Module development framework
3. **@transcript-parser/ui** - UI components and design system
4. **@transcript-parser/ai-services** - Gemini AI integration
5. **@transcript-parser/audio-processing** - FFmpeg audio extraction
6. **@transcript-parser/export** - Export format utilities
7. **@transcript-parser/database** - Drizzle ORM and database
8. **@transcript-parser/config** - Shared configurations

### Main Application

- Import updates and integration
- Build configuration
- Performance metrics

### Infrastructure

- Turborepo configuration
- pnpm workspace setup
- TypeScript project references
- Build pipelines

---

## 👥 Expert Review Panel

### 1. 🏗️ Architecture Expert - Dr. Sarah Chen

**Background**: 15 years experience, worked on Google's Bazel, Netflix's monorepo

**Review Checklist**:

#### Package Architecture

- [ ] Package boundaries are logical and well-defined
- [ ] No circular dependencies between packages
- [ ] Dependency graph flows in correct direction (types → everything else)
- [ ] Each package has single, clear responsibility

#### TypeScript Configuration

- [ ] **CRITICAL**: All packages use `"moduleResolution": "bundler"` in tsconfig.json
- [ ] TypeScript project references configured correctly
- [ ] No `any` types escaping package boundaries
- [ ] Type definitions exported properly

#### Turborepo Configuration

- [ ] turbo.json pipeline matches expert recommendations
- [ ] Build dependencies specified correctly (`dependsOn: ["^build"]`)
- [ ] Cache outputs configured for all tasks
- [ ] No unnecessary cache invalidation

**Expected Deliverables**:

```markdown
## Architecture Review - Dr. Sarah Chen

### ✅ Strengths

- [List what's working well]

### ⚠️ Issues Found

- **Critical**: [Any blocking issues]
- **Major**: [Significant concerns]
- **Minor**: [Nice to have improvements]

### 📝 Recommendations

1. [Specific actionable items]

### 🎯 Approval Status

- [ ] Approved - No blocking issues
- [ ] Approved with Minor Changes
- [ ] Requires Major Revisions
```

---

### 2. 🎨 UX Design Expert - Marcus Rodriguez

**Background**: 10 years in developer experience, worked on Stripe's design system

**Review Checklist**:

#### Package Discoverability

- [ ] Each package has comprehensive README.md
- [ ] README follows consistent template structure
- [ ] Quick start examples are clear and copy-paste ready
- [ ] API surface is well-documented

#### Developer Experience

- [ ] Error messages are actionable and helpful
- [ ] Import paths are intuitive (`@transcript-parser/[name]`)
- [ ] Package names clearly communicate purpose
- [ ] No confusing naming conflicts

#### Module SDK Onboarding

- [ ] GETTING_STARTED.md exists and is comprehensive
- [ ] Step-by-step tutorial for first module
- [ ] Common pitfalls documented
- [ ] Example modules provided

**Expected Deliverables**:

```markdown
## UX Design Review - Marcus Rodriguez

### ✅ Strengths

- [What makes developer experience great]

### 📋 Documentation Gaps

- [Missing or unclear documentation]

### 🎨 DX Improvements

- [Suggestions for better developer experience]

### 🎯 Approval Status

- [ ] Approved
- [ ] Needs Documentation Updates
- [ ] Requires UX Improvements
```

---

### 3. ⚡ Performance Expert - Aisha Patel

**Background**: Performance engineering at Meta, specialized in build optimization

**Review Checklist**:

#### Bundle Size & Tree-Shaking

- [ ] **CRITICAL**: FFmpeg.wasm is lazy-loaded (not in main bundle)
- [ ] All packages have `"sideEffects": false` in package.json
- [ ] No unnecessary dependencies bundled
- [ ] External dependencies configured correctly

#### Build Performance

- [ ] Turborepo cache working correctly
- [ ] Build times are reasonable (<2 min full, <10s cached)
- [ ] Parallel builds maximized
- [ ] No redundant rebuilds

#### Runtime Performance

- [ ] Main bundle size target met (<500KB after FFmpeg lazy load)
- [ ] No performance regressions from package extraction
- [ ] Lazy loading implemented where appropriate

**Performance Baselines** (from Session 1):

- Main bundle before: 730.56 KB
- Main bundle after UI extraction: 622.61 KB
- Target after FFmpeg lazy load: <500 KB

**Expected Deliverables**:

```markdown
## Performance Review - Aisha Patel

### 📊 Bundle Analysis

- Current main bundle: [size]
- FFmpeg lazy loading: [implemented/missing]
- Total size reduction: [calculation]

### ⚡ Build Performance

- Full build time: [time]
- Cached build time: [time]
- Cache hit rate: [percentage]

### ⚠️ Performance Issues

- **Critical**: [Any bundle bloat or slow builds]
- **Optimization Opportunities**: [Suggestions]

### 🎯 Approval Status

- [ ] Approved - Performance targets met
- [ ] Needs Optimization
- [ ] Critical Performance Issues
```

---

### 4. 🔒 Security Expert - James Liu

**Background**: Security architect, OWASP contributor, penetration testing specialist

**Review Checklist**:

#### API Key Management

- [ ] **CRITICAL**: No API keys committed to git
- [ ] Environment variables used correctly (VITE_GEMINI_API_KEY)
- [ ] .env.example exists with safe placeholders
- [ ] Error messages don't leak API keys

#### Dependency Security

- [ ] `pnpm audit` shows no vulnerabilities
- [ ] No dependencies with known CVEs
- [ ] Lockfile (pnpm-lock.yaml) committed
- [ ] Dependencies pinned to specific versions

#### Pre-commit Hooks

- [ ] Husky installed and configured
- [ ] lint-staged configured
- [ ] Secrets detection running (if implemented)

#### Module SDK Security

- [ ] Documentation warns about third-party module risks
- [ ] No `eval()` or unsafe code execution
- [ ] Input validation present

**Expected Deliverables**:

```markdown
## Security Review - James Liu

### 🔒 Security Audit Results

- API key management: [Pass/Fail]
- Dependency vulnerabilities: [Count]
- Pre-commit hooks: [Status]

### ⚠️ Security Issues

- **Critical**: [Immediate security risks]
- **High**: [Important but not urgent]
- **Medium**: [Best practice improvements]

### 🛡️ Recommendations

1. [Specific security improvements]

### 🎯 Approval Status

- [ ] Approved - No security concerns
- [ ] Approved with Recommendations
- [ ] Security Issues Must Be Fixed
```

---

### 5. ♿ Accessibility Expert - Emily Thompson

**Background**: WCAG 2.1 AAA certified, worked on government accessibility standards

**Review Checklist**:

#### ESLint Accessibility

- [ ] eslint-plugin-jsx-a11y installed in UI package
- [ ] No accessibility lint errors
- [ ] Accessibility rules enforced in CI

#### Color Contrast (WCAG AA minimum)

- [ ] All text meets 4.5:1 contrast ratio (normal text)
- [ ] All text meets 3:1 contrast ratio (large text)
- [ ] Interactive elements have sufficient contrast
- [ ] Color is not the only indicator

#### Keyboard Navigation

- [ ] All interactive elements focusable
- [ ] Focus styles visible and clear
- [ ] Focus trap handled correctly in modals
- [ ] Tab order is logical

#### Screen Reader Support

- [ ] ARIA labels present where needed
- [ ] Semantic HTML used correctly
- [ ] Form labels associated properly
- [ ] Error messages announced

**Expected Deliverables**:

```markdown
## Accessibility Review - Emily Thompson

### ♿ WCAG Compliance

- ESLint accessibility: [Pass/Fail]
- Color contrast: [AA/AAA]
- Keyboard navigation: [Status]
- Screen reader: [Status]

### ⚠️ Accessibility Issues

- **Critical**: [WCAG failures]
- **Important**: [Best practice violations]

### 📋 Recommendations

1. [Specific a11y improvements]

### 🎯 Approval Status

- [ ] Approved - WCAG AA compliant
- [ ] Needs Accessibility Fixes
- [ ] Major Accessibility Barriers
```

---

### 6. 🧪 Testing Expert - David Kim

**Background**: 12 years QA, Jest core contributor, Playwright maintainer

**Review Checklist**:

#### Test Coverage

- [ ] Vitest workspace configured correctly
- [ ] All packages have test setup
- [ ] Coverage thresholds configured (80% target)
- [ ] Tests are running in CI

#### Mock Strategy

- [ ] FFmpeg.wasm properly mocked
- [ ] Gemini API properly mocked
- [ ] Database connections mocked for tests
- [ ] No real API calls in tests

#### Test Quality

- [ ] Tests are deterministic (no flaky tests)
- [ ] Tests are fast (<30s for all unit tests)
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Edge cases covered

#### E2E Tests

- [ ] Playwright tests updated for new structure
- [ ] Main user flows tested
- [ ] No hardcoded waits (use proper selectors)

**Expected Deliverables**:

```markdown
## Testing Review - David Kim

### 🧪 Test Coverage

- Overall coverage: [percentage]
- Packages below 80%: [list]
- Total tests: [count]
- Test execution time: [time]

### ⚠️ Testing Issues

- **Critical**: [Test failures or missing tests]
- **Coverage Gaps**: [Areas needing tests]
- **Quality Issues**: [Flaky or slow tests]

### 📋 Recommendations

1. [Specific testing improvements]

### 🎯 Approval Status

- [ ] Approved - Test coverage adequate
- [ ] Needs More Tests
- [ ] Critical Test Failures
```

---

### 7. 📖 Documentation Expert - Rachel Green

**Background**: Technical writer, O'Reilly author, documentation systems architect

**Review Checklist**:

#### Root Documentation

- [ ] Root README.md exists and is comprehensive
- [ ] Project structure clearly explained
- [ ] Getting started guide is complete
- [ ] Contributing guide exists

#### Package Documentation

- [ ] All 8 packages have README.md
- [ ] READMEs follow consistent template
- [ ] API documentation generated (TypeDoc)
- [ ] Code examples are correct and tested

#### Module SDK Documentation

- [ ] GETTING_STARTED.md exists
- [ ] API reference complete
- [ ] Common patterns documented
- [ ] Migration guides provided

#### Code Comments

- [ ] Complex logic has explanatory comments
- [ ] No obvious code without comments
- [ ] JSDoc comments for public APIs
- [ ] Type definitions documented

**Expected Deliverables**:

```markdown
## Documentation Review - Rachel Green

### 📖 Documentation Audit

- Root README: [Complete/Incomplete]
- Package READMEs: [X/8 complete]
- API documentation: [Status]
- Code comments: [Quality]

### 📋 Documentation Gaps

- [List of missing or unclear documentation]

### ✍️ Recommendations

1. [Specific documentation improvements]

### 🎯 Approval Status

- [ ] Approved - Documentation complete
- [ ] Needs Documentation Updates
- [ ] Critical Documentation Missing
```

---

## 🔍 Detailed Review Process

### Phase 1: Initial Scan (30 min)

**Objective**: Get overall picture of implementation

**Tasks**:

1. Review git commit history

   ```bash
   git log --oneline --graph | head -20
   ```

2. Check current build status

   ```bash
   npm run build
   ```

3. Review package structure

   ```bash
   ls -la packages/
   ```

4. Scan for obvious issues
   ```bash
   pnpm audit
   git status
   ```

**Output**: Initial findings document

---

### Phase 2: Architecture Review (30 min)

**Expert**: Dr. Sarah Chen (Architecture)

**Review Items**:

1. **Package Boundaries**
   - Read each package's package.json
   - Verify dependencies are logical
   - Check for circular dependencies

2. **TypeScript Configuration**
   - Review all tsconfig.json files
   - Verify `"moduleResolution": "bundler"` present
   - Check project references

3. **Turborepo Configuration**
   - Review turbo.json
   - Verify pipeline matches expert recommendations
   - Test cache hits

**Commands to Run**:

```bash
# Check for circular dependencies
pnpm list --depth=1

# Verify TypeScript config
grep -r "moduleResolution" packages/*/tsconfig.json

# Test Turborepo cache
pnpm build
pnpm build  # Should be cached
```

**Output**: Architecture review document

---

### Phase 3: Security Review (20 min)

**Expert**: James Liu (Security)

**Review Items**:

1. **Secret Scanning**

   ```bash
   # Check for committed secrets
   git log -p | grep -i "api.key\|secret\|password" | head -20

   # Verify .env is gitignored
   git check-ignore .env
   ```

2. **Dependency Audit**

   ```bash
   pnpm audit
   pnpm audit --audit-level=moderate
   ```

3. **API Key Management**
   - Review src/services/geminiClient.ts (or @transcript-parser/ai-services)
   - Verify environment variable usage
   - Check error handling doesn't leak keys

4. **Pre-commit Hooks**

   ```bash
   # Check Husky setup
   cat .husky/pre-commit

   # Verify lint-staged config
   cat package.json | grep -A 10 "lint-staged"
   ```

**Output**: Security review document

---

### Phase 4: Performance Review (30 min)

**Expert**: Aisha Patel (Performance)

**Review Items**:

1. **Bundle Analysis**

   ```bash
   # Build and check sizes
   npm run build

   # Check main bundle size
   ls -lh dist/assets/*.js

   # Verify FFmpeg is not bundled
   grep -r "ffmpeg" dist/assets/*.js | wc -l
   ```

2. **Tree-Shaking Verification**

   ```bash
   # Check package.json for sideEffects
   grep -r "sideEffects" packages/*/package.json
   ```

3. **Build Performance**

   ```bash
   # Time full build
   time pnpm build

   # Time cached build
   time pnpm build
   ```

4. **Review external dependencies**
   - Check each package's package.json
   - Verify heavy dependencies are externalized
   - Look for duplicate dependencies

**Output**: Performance review document with metrics

---

### Phase 5: Accessibility Review (20 min)

**Expert**: Emily Thompson (Accessibility)

**Review Items**:

1. **ESLint Configuration**

   ```bash
   # Check for a11y plugin
   grep -r "eslint-plugin-jsx-a11y" packages/ui/package.json

   # Run ESLint
   cd packages/ui && pnpm lint
   ```

2. **Color Contrast Check**
   - Review design system colors in ui package
   - Verify against WCAG AA standards (4.5:1 minimum)
   - Check design tokens

3. **Keyboard Navigation Review**
   - Review Button, Dialog, Select components
   - Check for focus styles
   - Verify tab order

4. **ARIA Labels**
   - Scan components for proper ARIA usage
   - Check form labels
   - Verify semantic HTML

**Output**: Accessibility review document

---

### Phase 6: Testing Review (30 min)

**Expert**: David Kim (Testing)

**Review Items**:

1. **Test Setup Verification**

   ```bash
   # Check Vitest workspace
   cat vitest.workspace.ts

   # Run all tests
   pnpm test

   # Check coverage
   pnpm test:coverage
   ```

2. **Mock Review**
   - Check for FFmpeg mocks
   - Check for Gemini API mocks
   - Verify no real external calls

3. **Test Quality Analysis**

   ```bash
   # Count tests
   find packages -name "*.test.ts" -o -name "*.spec.ts" | wc -l

   # Check for .only or .skip
   grep -r "test.only\|test.skip" packages/
   ```

4. **Coverage Analysis**
   - Review coverage report
   - Identify packages below 80%
   - Check for uncovered critical paths

**Output**: Testing review document with coverage metrics

---

### Phase 7: Documentation Review (30 min)

**Expert**: Rachel Green (Documentation)

**Review Items**:

1. **Root Documentation**

   ```bash
   # Check root README exists and is complete
   cat README.md | head -50

   # Verify all packages documented
   ls -1 packages/*/README.md
   ```

2. **Package README Quality**
   - Review each package's README
   - Verify Quick Start sections
   - Check code examples
   - Verify API documentation

3. **Module SDK Documentation**

   ```bash
   # Check for getting started guide
   cat packages/module-sdk/docs/GETTING_STARTED.md | head -20
   ```

4. **TypeDoc Setup**

   ```bash
   # Verify TypeDoc configured
   grep -r "typedoc" packages/*/package.json

   # Generate API docs (if configured)
   pnpm docs
   ```

**Output**: Documentation review document

---

### Phase 8: Cross-Cutting Concerns (30 min)

**All Experts**: Collaborative review

**Review Items**:

1. **Integration Testing**
   - Verify main app imports all packages correctly
   - Test full transcription workflow
   - Check for runtime errors

2. **Developer Experience**
   - Try creating a new package
   - Test package installation flow
   - Verify error messages are helpful

3. **Build System**
   - Test full clean build
   - Verify cache invalidation works
   - Check build reproducibility

4. **Git Hygiene**

   ```bash
   # Check commit quality
   git log --oneline | head -20

   # Verify no large files
   git ls-files | xargs ls -lh | sort -k5 -hr | head -10

   # Check gitignore
   cat .gitignore
   ```

**Output**: Cross-cutting concerns document

---

## 📊 Consolidated Review Report

After all expert reviews complete, create a consolidated report:

```markdown
# Sprint 01 - Code Review Summary

**Date**: [Date]
**Reviewer**: [Name/Model]
**Duration**: [Time]

---

## 🎯 Overall Status

- **Architecture**: [Approved/Needs Work]
- **UX/DX**: [Approved/Needs Work]
- **Performance**: [Approved/Needs Work]
- **Security**: [Approved/Needs Work]
- **Accessibility**: [Approved/Needs Work]
- **Testing**: [Approved/Needs Work]
- **Documentation**: [Approved/Needs Work]

**Overall Recommendation**:

- [ ] ✅ Approved - Ready for Sprint Completion
- [ ] ⚠️ Approved with Minor Issues - Can proceed
- [ ] ❌ Requires Major Revisions - Do not proceed

---

## 🏆 Strengths

1. [What went exceptionally well]
2. [Positive findings]
3. [Best practices observed]

---

## ⚠️ Critical Issues (Must Fix)

### Architecture

- [Any critical architecture issues]

### Security

- [Any security vulnerabilities]

### Performance

- [Any performance blockers]

### Accessibility

- [Any WCAG violations]

---

## 📋 Major Issues (Should Fix)

1. [List major issues that should be addressed]

---

## 💡 Minor Issues (Nice to Have)

1. [List minor improvements]

---

## 📈 Metrics

### Build Performance

- Full build time: [time]
- Cached build time: [time]
- Bundle size: [size]

### Test Coverage

- Overall: [percentage]
- Packages below 80%: [list]

### Code Quality

- ESLint errors: [count]
- TypeScript errors: [count]
- Security vulnerabilities: [count]

---

## ✅ Action Items

### Immediate (Before Sprint Complete)

1. [Critical fixes needed]

### Short-term (Next Sprint)

1. [Important improvements]

### Long-term (Future Sprints)

1. [Nice to have enhancements]

---

## 🎓 Lessons Learned

1. [What worked well]
2. [What to improve next time]
3. [Patterns to repeat]

---

## 📝 Expert Sign-Off

- [ ] 🏗️ Architecture (Dr. Sarah Chen)
- [ ] 🎨 UX Design (Marcus Rodriguez)
- [ ] ⚡ Performance (Aisha Patel)
- [ ] 🔒 Security (James Liu)
- [ ] ♿ Accessibility (Emily Thompson)
- [ ] 🧪 Testing (David Kim)
- [ ] 📖 Documentation (Rachel Green)

---

**Final Verdict**: [APPROVED / NEEDS WORK / REJECTED]

**Sign-off**: [Name] - [Date]
```

---

## 🚀 Post-Review Actions

### If Approved ✅

1. **Update Sprint Status**
   - Mark Sprint 01 as complete in ORCHESTRATION.md
   - Update README.md status
   - Check off completion criteria

2. **Create Release**

   ```bash
   # Create git tag
   git tag -a v2.0.0-sprint-01 -m "Sprint 01 - Monorepo Foundation Complete"
   git push origin v2.0.0-sprint-01
   ```

3. **Document for Future Sprints**
   - Update patterns for reuse
   - Document any deviations
   - Create templates for future packages

4. **Celebrate!** 🎉

---

### If Changes Needed ⚠️

#### 1. Extract Expert Feedback into Actionable Tasks

Create a comprehensive list of rework items from all expert reviews:

**Create File**: `implementation/code-review/REWORK_TASKS.md`

````markdown
# Sprint 01 - Code Review Rework Tasks

**Created**: [Date]
**Review Completed**: [Date]
**Status**: 🔴 In Progress

---

## 🚨 Critical Issues (Must Fix Before Sprint Complete)

### From 🏗️ Architecture Expert (Dr. Sarah Chen)

#### Issue #1: [Title]

- **Severity**: 🔴 Critical
- **Package**: @transcript-parser/[name]
- **Location**: [file:line]
- **Issue**: [Description of what's wrong]
- **Impact**: [Why this blocks sprint completion]
- **Recommendation**: [Expert's suggested fix]
- **Action Required**: [Specific implementation steps]
- **Verification**: [How to verify fix works]
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

**Commands to verify fix**:

```bash
[exact commands to run]
```
````

### From 🔒 Security Expert (James Liu)

[Continue for all critical issues from all experts]

---

## ⚠️ Major Issues (Should Fix Before Sprint Complete)

### From ⚡ Performance Expert (Aisha Patel)

#### Issue #5: [Title]

- **Severity**: ⚠️ Major
- **Package**: @transcript-parser/[name]
- **Location**: [file:line]
- **Issue**: [Description]
- **Impact**: [User/developer impact]
- **Recommendation**: [Expert's suggested fix]
- **Action Required**: [Implementation steps]
- **Can Defer To**: Sprint 02 if blocked
- **Status**: [ ] Not Started / [ ] In Progress / [ ] Complete / [ ] Deferred

---

## 💡 Minor Issues (Can Defer to Future Sprints)

### From 📖 Documentation Expert (Rachel Green)

#### Issue #12: [Title]

- **Severity**: 💡 Minor
- **Package**: @transcript-parser/[name]
- **Issue**: [Description]
- **Recommendation**: [Suggested improvement]
- **Deferred To**: Sprint 02
- **Reason**: [Why deferring is acceptable]

---

## 📊 Summary

- **Total Issues**: [count]
- **Critical**: [count] (🔴 Must fix)
- **Major**: [count] (⚠️ Should fix)
- **Minor**: [count] (💡 Can defer)
- **Deferred**: [count]

---

## ✅ Completion Criteria

Sprint 01 can be marked complete when:

- [ ] All 🔴 Critical issues resolved and verified
- [ ] All ⚠️ Major issues either resolved or explicitly deferred with justification
- [ ] All fixes validated by re-running verification commands
- [ ] Re-review completed and approved by affected experts
- [ ] Documentation updated with lessons learned

````

---

#### 2. Prioritize and Categorize Issues

Use this severity matrix:

**🔴 Critical (Must Fix)**:
- Blocks core functionality
- Security vulnerabilities
- Breaking changes introduced
- Violates architectural principles
- Circular dependencies
- Missing critical accessibility features (WCAG A)

**⚠️ Major (Should Fix)**:
- Impacts performance significantly (>20% degradation)
- Missing important tests (coverage <80%)
- Accessibility issues (WCAG AA)
- Poor documentation for key features
- Suboptimal architecture but not blocking
- Can potentially defer to Sprint 02 if blocking issues arise

**💡 Minor (Can Defer)**:
- Nice-to-have improvements
- Documentation polish
- Non-critical performance optimizations
- Additional test cases
- Enhanced examples
- Future enhancements

---

#### 3. Create Rework Implementation Plan

**Create File**: `implementation/code-review/REWORK_PLAN.md`

```markdown
# Sprint 01 - Rework Implementation Plan

**Created**: [Date]
**Target Completion**: [Date]

---

## 🎯 Rework Goals

1. Address all critical issues from code review
2. Resolve major issues or document deferrals
3. Ensure Sprint 01 foundation is solid
4. Update documentation with lessons learned

---

## 📋 Implementation Sequence

### Phase 1: Critical Fixes (Estimated: [X] hours)

#### Fix 1: [Title] - @transcript-parser/[package]
**Expert**: 🏗️ Architecture (Dr. Sarah Chen)
**Estimated Time**: [X] min

**Steps**:
1. Read current implementation: `[file path]`
2. Apply fix: [specific changes needed]
3. Verify: `[command to run]`
4. Test: `cd packages/[name] && pnpm test`
5. Commit: `git commit -m "fix([package]): [description]"`

**Acceptance Criteria**:
- [ ] Fix applied successfully
- [ ] Tests passing
- [ ] Build successful
- [ ] Expert verification command passes

---

#### Fix 2: [Title] - @transcript-parser/[package]
[Continue for all critical fixes]

---

### Phase 2: Major Fixes (Estimated: [X] hours)

[Similar structure for major fixes]

---

### Phase 3: Verification (Estimated: 30 min)

1. **Run Full Build**
   ```bash
   pnpm install
   pnpm build
````

2. **Run All Tests**

   ```bash
   pnpm test
   ```

3. **Verify Each Fix**

   ```bash
   # Run verification commands from REWORK_TASKS.md
   ```

4. **Bundle Analysis**
   ```bash
   cd apps/transcript-parser
   npm run build
   # Verify bundle size maintained or improved
   ```

---

### Phase 4: Documentation Updates (Estimated: 30 min)

1. Update SESSION_SUMMARY.md with rework completed
2. Update README.md if approach changed
3. Document lessons learned for future sprints
4. Create templates for future packages if patterns emerged

---

## 🔄 Re-Review Process

After all fixes are complete:

1. **Update REWORK_TASKS.md**
   - Mark all items as complete
   - Document verification results
   - Note any deferred items

2. **Request Focused Re-Review**

   **Create File**: `implementation/code-review/RE_REVIEW_REQUEST.md`

   ````markdown
   # Sprint 01 - Re-Review Request

   **Date**: [Date]
   **Scope**: Focused re-review of fixed issues

   ## 🎯 What Changed

   ### Critical Fixes Applied

   1. **[Package]**: [Fix description]
      - Expert: [Name]
      - Original Issue: [Link to REWORK_TASKS.md#issue-1]
      - Verification: ✅ [Command passed]

   [Continue for all fixes]

   ## 🔍 Review Focus Areas

   Please review ONLY the following:

   ### 🏗️ Architecture Expert

   - [ ] Issue #1 fix verified in @transcript-parser/[package]
   - [ ] Issue #3 fix verified in @transcript-parser/[package]

   ### 🔒 Security Expert

   - [ ] Issue #2 fix verified in @transcript-parser/[package]

   [Continue for all affected experts]

   ## ✅ Verification Commands

   All verification commands from original review have been re-run:

   ```bash
   # [List all commands that were re-run with results]
   ```
   ````

   ## 📊 Updated Metrics
   - Build time: [before] → [after]
   - Bundle size: [before] → [after]
   - Test coverage: [before] → [after]
   - ESLint errors: [before] → [after]

   ## 🚀 Ready for Re-Review
   - [x] All critical fixes applied
   - [x] All verification commands passing
   - [x] Tests passing (with coverage)
   - [x] Build successful
   - [x] Documentation updated

   ```

   ```

3. **Execute Focused Re-Review**
   - Only review changed areas
   - Verify fixes address original issues
   - Check for new issues introduced by fixes
   - Sign off on each resolved issue

4. **Final Approval**
   - All affected experts sign off
   - Update CODE_REVIEW_SUMMARY.md with final verdict
   - Mark Sprint 01 as complete

---

## 📝 Lessons Learned Documentation

After completing rework, update implementation files:

**Update File**: `implementation/SESSION_SUMMARY.md`

Add section:

```markdown
## 🔄 Code Review Rework (Post-Implementation)

### Issues Found

**Total Issues**: [count]

- Critical: [count]
- Major: [count]
- Minor: [count]

### Key Fixes Applied

1. **[Package]**: [Fix description]
   - Why: [Issue explanation]
   - Fix: [What was changed]
   - Impact: [Improvement gained]
   - Lesson: [What to do differently next time]

### Patterns for Future Sprints

Based on code review feedback:

1. **[Pattern/Practice]**: [Description]
   - When: [When to apply]
   - How: [Implementation approach]
   - Example: [Code reference]

### Templates Created

- [Template name]: [Purpose and location]
- [Template name]: [Purpose and location]
```

---

## 🎯 Deferral Process

If major issues need to be deferred to Sprint 02:

**Create File**: `implementation/code-review/DEFERRED_ITEMS.md`

```markdown
# Sprint 01 - Deferred Issues

Items deferred from Sprint 01 code review to future sprints.

---

## Sprint 02 (Next Sprint)

### Issue #[X]: [Title]

- **Original Severity**: ⚠️ Major
- **Package**: @transcript-parser/[name]
- **Expert**: [Name]
- **Issue**: [Description]
- **Why Deferred**: [Justification - e.g., "Requires dependency on Sprint 02 module system"]
- **Impact of Deferring**: [What's acceptable without this fix]
- **Workaround**: [Temporary mitigation if any]
- **Target Sprint**: Sprint 02
- **Story Points**: [estimate]

---

## Future Sprints

### Issue #[X]: [Title]

- **Original Severity**: 💡 Minor
- **Package**: @transcript-parser/[name]
- **Expert**: [Name]
- **Issue**: [Description]
- **Why Deferred**: [Justification - e.g., "Nice-to-have, not blocking any workflows"]
- **Target Sprint**: [Sprint number or "Backlog"]
```

**Update Epic Backlog**:

Add deferred items to:
`specs/epics/epic-01-monorepo-foundation/sprints/sprint-02/Sprint 02 - Backlog.md`

---

## 🔧 Implementation Tips

### For Each Fix:

1. **Create Feature Branch** (optional for small fixes)

   ```bash
   git checkout -b fix/sprint-01-review-issue-[N]
   ```

2. **Make Changes**
   - Follow expert recommendation exactly
   - Test thoroughly
   - Update relevant documentation

3. **Verify Fix**

   ```bash
   # Run expert's verification command
   # Run package tests
   cd packages/[name]
   pnpm test

   # Run package build
   pnpm build
   ```

4. **Commit with Reference**

   ```bash
   git add .
   git commit -m "fix([package]): [description] (review issue #[N])"
   ```

5. **Update REWORK_TASKS.md**
   - Mark issue as complete
   - Document verification results
   - Note any deviations from recommendation

### For Complex Fixes:

If a fix requires significant refactoring:

1. **Create Implementation Sub-Plan**
   - Break fix into smaller steps
   - Identify affected files
   - Plan testing strategy

2. **Consider Creating New Package** (if architecture issue)
   - May need to extract more code
   - Follow same package creation pattern
   - Update dependencies

3. **Add Integration Tests**
   - Prevent regression
   - Verify fix across packages

---

## ✅ Re-Review Sign-Off

After all fixes and re-review:

**Update File**: `implementation/code-review/CODE_REVIEW_SUMMARY.md`

Add section:

```markdown
## 🔄 Re-Review Results

**Re-Review Date**: [Date]
**Scope**: [Focused/Full]

### Fixes Verified

- [x] Issue #1: [Title] - ✅ Approved by 🏗️ Architecture Expert
- [x] Issue #2: [Title] - ✅ Approved by 🔒 Security Expert
- [x] Issue #3: [Title] - ✅ Approved by ⚡ Performance Expert

### Final Expert Sign-Off

- [x] 🏗️ Architecture (Dr. Sarah Chen) - Re-approved
- [x] 🔒 Security (James Liu) - Re-approved
- [x] ⚡ Performance (Aisha Patel) - Re-approved
- [x] 🎨 UX Design (Marcus Rodriguez) - No changes required
- [x] ♿ Accessibility (Emily Thompson) - No changes required
- [x] 🧪 Testing (David Kim) - No changes required
- [x] 📖 Documentation (Rachel Green) - No changes required

### Final Metrics

- Build time: [time]
- Bundle size: [size]
- Test coverage: [percentage]
- ESLint errors: 0
- TypeScript errors: 0
- Security vulnerabilities: 0

### Final Verdict

**Status**: ✅ APPROVED

All critical and major issues have been resolved. Sprint 01 foundation is solid and ready for Sprint 02.

**Sign-off**: [Name] - [Date]
```

---

## 🎉 Sprint 01 Completion

Once all rework is complete and re-review approved:

1. **Update Sprint Status**

   ```bash
   # Update implementation/README.md
   # Change phase from "CODE REVIEW" to "COMPLETE"
   # Update status to "✅ Complete"
   ```

2. **Create Git Tag**

   ```bash
   git tag -a v2.0.0-sprint-01 -m "Sprint 01 - Monorepo Foundation Complete (with code review fixes)"
   git push origin v2.0.0-sprint-01
   ```

3. **Document for Sprint 02**
   - Move lessons learned to Epic level
   - Create templates for future use
   - Update patterns documentation

4. **Celebrate!** 🎉
   - Sprint 01 is DONE
   - Foundation is solid
   - Ready for Sprint 02

---

## 📁 Review Artifacts

Save all review documents in:

```
specs/epics/epic-01-monorepo-foundation/sprints/sprint-01/implementation/code-review/
├── CODE_REVIEW_SUMMARY.md
├── architecture-review.md
├── ux-design-review.md
├── performance-review.md
├── security-review.md
├── accessibility-review.md
├── testing-review.md
└── documentation-review.md
```

---

## ⚠️ Important Notes

### DO:

✅ Be thorough - this sets the foundation for all future work
✅ Validate against all expert feedback requirements
✅ Run all commands and verify outputs
✅ Document all findings clearly
✅ Provide specific, actionable recommendations

### DON'T:

❌ Rush through the review
❌ Skip expert areas
❌ Approve without verification
❌ Ignore minor issues (they compound)
❌ Forget to document findings

---

## 🎯 Success Criteria Checklist

### Architecture

- [ ] All packages have clear boundaries
- [ ] No circular dependencies
- [ ] TypeScript project references configured
- [ ] turbo.json optimized

### Security

- [ ] No API keys in git
- [ ] pnpm audit clean
- [ ] Pre-commit hooks working
- [ ] Module SDK security documented

### Performance

- [ ] FFmpeg lazy loaded
- [ ] Bundle size <500KB
- [ ] Build time <2 min
- [ ] Tree-shaking working

### Accessibility

- [ ] WCAG AA compliant
- [ ] ESLint a11y passing
- [ ] Keyboard navigation working
- [ ] Screen reader friendly

### Testing

- [ ] 80% coverage achieved
- [ ] All tests passing
- [ ] Mocks properly configured
- [ ] E2E tests updated

### Documentation

- [ ] All READMEs complete
- [ ] API documentation generated
- [ ] Getting started guides exist
- [ ] Code examples tested

---

**Ready to begin?**

1. Open a new Claude Code session with Opus
2. Copy this entire prompt
3. Execute the review phase by phase
4. Document all findings
5. Create consolidated report
6. Make approval recommendation

**Estimated Time**: 2-3 hours for comprehensive review

**Expected Outcome**: Complete validation of Sprint 01 implementation with clear approval status and action items.

---

**🎯 Remember**: This review ensures the monorepo foundation is solid for all future epics. Take the time to do it right!
