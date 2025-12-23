# Epic-02 Sprint 01 - Priority Action Items

**Date**: 2025-12-21
**Source**: 7-Expert Pre-Implementation Review
**Total Items**: 24 Must Do + 21 Should Do + 9 Could Do = **54 action items**

---

## How to Use This Document

This document consolidates all recommendations from 7 expert reviews into a prioritized, actionable list. Items are categorized by:

1. **Priority**: P0 (Critical/Must Do), P1 (High/Should Do), P2 (Nice to Have/Could Do)
2. **Effort**: Time estimate in hours
3. **Impact**: Expected benefit
4. **Owner**: Which team/role should own this

**Recommended Approach**:

- **Address all P0 items BEFORE Sprint 01 begins**
- **Schedule P1 items for Week 1-2 of Sprint 01**
- **Defer P2 items to Sprint 02 or backlog**

---

## Summary Statistics

| Priority           | Count | Total Effort | Average Effort |
| ------------------ | ----- | ------------ | -------------- |
| **P0 (Must Do)**   | 24    | ~127 hours   | 5.3h per item  |
| **P1 (Should Do)** | 21    | ~86 hours    | 4.1h per item  |
| **P2 (Could Do)**  | 9     | ~39 hours    | 4.3h per item  |
| **TOTAL**          | 54    | ~252 hours   | 4.7h per item  |

**Team Capacity Needed** (distributed across 5-6 people):

- **Pre-Sprint** (P0 items): ~127 hours = 3-4 days team-wide
- **Sprint Week 1-2** (P1 items): ~86 hours = 2-3 weeks team-wide

---

## P0: CRITICAL - Must Do Before Sprint 01

### Architecture (22 hours)

#### P0-ARCH-001: Make Authentication Provider Decision

- **Effort**: 4 hours
- **Owner**: Architecture Lead + Security Expert
- **Impact**: Unblocks sprint, affects all auth implementation
- **Expert**: Architecture, Security
- **Description**: Evaluate and choose between Passport.js, Auth0, and Supabase. Recommend Supabase for built-in auth + database + security features.
- **Deliverable**: ADR (Architecture Decision Record) with rationale
- **Dependencies**: None (critical path)

**Tasks**:

1. Create comparison matrix (cost, features, security, maintenance)
2. Build POC with Supabase auth (2 hours)
3. Document decision in `docs/architecture/ADR-001-auth-provider.md`
4. Update Sprint 01 plan with chosen provider

---

#### P0-ARCH-002: Redesign API Key Storage Architecture

- **Effort**: 8 hours
- **Owner**: Backend Lead
- **Impact**: Enables scalability, persona-specific keys, key rotation
- **Expert**: Architecture, Security
- **Description**: Create separate `APIKey` entity instead of embedding in `UserProfile.apiKeys`.

**Implementation**:

```typescript
interface APIKey {
  id: string
  userId: string
  personaId?: string // Optional: persona-specific
  service: 'gemini' | 'openai' | 'anthropic'
  keyHash: string // Encrypted
  keyPreview: string // Last 4 chars
  isActive: boolean
  createdAt: Date
  lastUsedAt?: Date
  expiresAt?: Date
  validationStatus: 'valid' | 'invalid' | 'not_validated'
}
```

**Tasks**:

1. Create `@transcript-parser/api-keys` package (or add to `user-management`)
2. Design `api_keys` table schema
3. Implement `APIKeyService` (encrypt, decrypt, validate)
4. Create API endpoints (GET, POST, PATCH, DELETE)
5. Update UI to support multiple keys
6. Write unit tests

**Dependencies**: P0-SEC-001 (encryption key management)

---

#### P0-ARCH-003: Define Persona Switching State Management

- **Effort**: 6 hours
- **Owner**: Frontend Lead
- **Impact**: Enables fast, reliable persona switching
- **Expert**: Architecture, UX
- **Description**: Define React Context + persistence strategy for persona switching.

**Implementation**:

```typescript
// PersonaContext
interface PersonaContext {
  activePersona: PersonaAssignment | null
  availablePersonas: PersonaAssignment[]
  switchPersona: (personaId: string) => Promise<void>
  isLoading: boolean
}

async function switchPersona(personaId: string) {
  // 1. Save current module state
  await saveModuleState()
  // 2. Update database (active persona)
  await updateActivePersona(personaId)
  // 3. Clear module-specific state
  clearModuleState()
  // 4. Load new persona config
  const newPersona = await loadPersona(personaId)
  // 5. Update React context
  setActivePersona(newPersona)
  // 6. Navigate to dashboard
  navigate('/dashboard')
}
```

**Tasks**:

1. Create `PersonaProvider` React context
2. Implement `switchPersona` with state cleanup
3. Add `usePersona()` hook
4. Test persona switching with module state
5. Document state management strategy

**Dependencies**: None

---

#### P0-ARCH-004: Define Module-Persona Compatibility Rules

- **Effort**: 4 hours
- **Owner**: Backend Lead
- **Impact**: Prevents incompatible module installations
- **Expert**: Architecture
- **Description**: Create validation rules for module-persona compatibility.

**Implementation**:

```typescript
interface ModuleRegistryEntry {
  compatiblePersonas: PersonaId[]
  requiredPersonas?: PersonaId[]
  incompatiblePersonas?: PersonaId[]
}

class ModuleInstallationValidator {
  canInstallModule(
    module: ModuleRegistryEntry,
    activePersona: PersonaId
  ): { allowed: boolean; reason?: string } {
    // Validation logic
  }
}
```

**Tasks**:

1. Add validation to `ModuleRegistryEntry`
2. Create `ModuleInstallationValidator` class
3. Add middleware to module installation endpoint
4. Update UI with compatibility badges
5. Write unit tests

**Dependencies**: None

---

### UX Design (20 hours)

#### P0-UX-001: Defer API Key Entry to Post-Onboarding

- **Effort**: 4 hours
- **Owner**: Product Manager + UX Designer
- **Impact**: Reduces onboarding friction by 40-60%
- **Expert**: UX, Security
- **Description**: Move API key entry to AFTER users experience value (after first module use).

**Revised Flow**:

1. Registration → Profile → Persona → Module Installation
2. Module loads in "demo mode" (limited features or mock AI responses)
3. Banner: "Connect your API key to unlock full features"
4. User clicks banner → API key setup modal

**Tasks**:

1. Update user story US08 to P1 (move out of critical path)
2. Add "demo mode" to modules
3. Design upgrade prompts in module UI
4. Update onboarding wireframes
5. Test with users (does demo mode provide enough value?)

**Dependencies**: None

---

#### P0-UX-002: Add Persona Comparison UI

- **Effort**: 6 hours
- **Owner**: Frontend Developer + UX Designer
- **Impact**: Better persona decisions, reduced user regret
- **Expert**: UX
- **Description**: Implement side-by-side persona comparison (FIGMA Prompt 2, Variation 3).

**Features**:

- Side-by-side comparison table
- Checkmarks for included features
- "Preview Dashboard" button (shows mockup)
- Interactive comparison

**Tasks**:

1. Implement comparison table layout
2. Add "Preview Dashboard" modal
3. Show realistic dashboard mockups for each persona
4. Add hover interactions
5. Test with users

**Dependencies**: FIGMA designs created

---

#### P0-UX-003: Design Module Installation UX

- **Effort**: 8 hours
- **Owner**: Frontend Developer + UX Designer
- **Impact**: Reduces user anxiety, provides clear feedback
- **Expert**: UX
- **Description**: Create detailed module installation UX with progress states, error handling, and success confirmation.

**Screens**:

1. Pre-installation (module card with "Install" button)
2. Installing (progress bar, step indicators, cancel button)
3. Success (celebration, "Open Module" button)
4. Error (retry button, error message, support link)

**Tasks**:

1. Design all 4 screens
2. Implement `ModuleInstallation` state machine
3. Add WebSocket/polling for real-time progress
4. Implement cancellation
5. Add error recovery

**Dependencies**: None

---

#### P0-UX-004: Add Onboarding Time Estimate

- **Effort**: 2 hours
- **Owner**: Frontend Developer
- **Impact**: Reduces user anxiety
- **Expert**: UX
- **Description**: Add total time estimate and improve progress indicators.

**Design**:

```
┌─────────────────────────────────────────┐
│  Get Started • ~3 minutes               │
│  ●━━━○━━━○━━━○  Step 2 of 4             │
└─────────────────────────────────────────┘
```

**Tasks**:

1. Calculate total onboarding time (test with users)
2. Add to every onboarding screen
3. Update progress component

**Dependencies**: None

---

### Security & Privacy (21 hours)

#### P0-SEC-001: Implement Encryption Key Management

- **Effort**: 6 hours
- **Owner**: Backend Lead + Security Engineer
- **Impact**: Secures all encrypted data (API keys, sensitive info)
- **Expert**: Security
- **Description**: Use secrets management service (AWS Secrets Manager, Google Cloud Secret Manager, or HashiCorp Vault).

**Options**:

1. **AWS Secrets Manager** (if using AWS)
2. **Google Cloud Secret Manager** (if using GCP)
3. **HashiCorp Vault** (self-hosted or cloud)

**Tasks**:

1. Choose secrets manager
2. Set up encryption key in secrets manager
3. Implement `getEncryptionKey()` function
4. Update encrypt/decrypt functions to use secrets manager
5. Document key rotation strategy
6. Test encryption/decryption

**Dependencies**: None (critical path for P0-ARCH-002)

---

#### P0-SEC-002: Implement Rate Limiting on Auth Endpoints

- **Effort**: 3 hours
- **Owner**: Backend Developer
- **Impact**: Prevents brute-force attacks, account takeovers
- **Expert**: Security
- **Description**: Add rate limiting to prevent brute-force password attacks.

**Implementation**:

```javascript
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
})

app.post('/api/auth/login', loginLimiter, loginHandler)
```

**Tasks**:

1. Install `express-rate-limit`
2. Configure rate limiters for /login, /register, /password-reset
3. Add error messages
4. Test rate limiting
5. Monitor rate limit hits

**Dependencies**: None

---

#### P0-SEC-003: Implement MFA Support (TOTP)

- **Effort**: 8 hours
- **Owner**: Backend Developer + Frontend Developer
- **Impact**: Prevents account takeovers (blocks 99.9% of automated attacks)
- **Expert**: Security
- **Description**: Implement TOTP-based MFA (Google Authenticator compatible). Make available (not required).

**If using Supabase**: Built-in MFA → Enable in dashboard ✅

**If using custom auth**:

```javascript
const speakeasy = require('speakeasy')
const QRCode = require('qrcode')

// Generate secret
const secret = speakeasy.generateSecret({ name: `App (${user.email})` })

// Generate QR code
const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)

// Verify token
const verified = speakeasy.totp.verify({
  secret: decryptedSecret,
  encoding: 'base32',
  token: userToken,
  window: 2,
})
```

**Tasks**:

1. Add MFA setup flow in profile settings
2. Generate QR code
3. Validate 6-digit code
4. Store MFA secret (encrypted)
5. Show recovery codes
6. Add MFA challenge on login
7. Test with Google Authenticator

**Dependencies**: P0-SEC-001 (for encrypting MFA secret)

---

#### P0-SEC-004: Add Database Choice Decision

- **Effort**: 4 hours
- **Owner**: Architecture Lead + DBA
- **Impact**: Unblocks data model implementation
- **Expert**: Architecture, Security, Performance
- **Description**: Evaluate and choose database (PostgreSQL, MongoDB, or Supabase).

**Recommendation**: **Supabase** (PostgreSQL + built-in auth + real-time)

**Tasks**:

1. Create comparison matrix (relational data model favors PostgreSQL)
2. Consider Supabase (solves auth + database)
3. Document decision in ADR
4. Update data model with chosen database

**Dependencies**: P0-ARCH-001 (if Supabase chosen, solves both auth and database)

---

### Performance (11 hours)

#### P0-PERF-001: Implement Database Indexes

- **Effort**: 2 hours
- **Owner**: Backend Developer/DBA
- **Impact**: 10x faster queries (50-100ms → 5-10ms)
- **Expert**: Performance
- **Description**: Add indexes on frequently queried columns.

**Indexes**:

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_persona_assignments_user_id ON persona_assignments(user_id);
CREATE INDEX idx_persona_assignments_active ON persona_assignments(user_id, is_active);
CREATE INDEX idx_installed_modules_persona_id ON installed_modules(persona_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
```

**Tasks**:

1. Create migration file with indexes
2. Run migration on development database
3. Test query performance
4. Document indexing strategy

**Dependencies**: Database chosen

---

#### P0-PERF-002: Implement Caching Strategy

- **Effort**: 6 hours
- **Owner**: Backend Developer + Frontend Developer
- **Impact**: Faster persona switching, reduced database load
- **Expert**: Performance
- **Description**: Implement client-side (localStorage) and server-side (Redis) caching.

**Caching Strategy**:

- **Client-side**: Active persona, user profile, module metadata
- **Server-side**: Session data, persona definitions, module registry

**Tasks**:

1. Set up Redis (if needed)
2. Implement cache get/set utilities
3. Add caching to persona switching
4. Add caching to module loading
5. Define TTL and invalidation rules
6. Test cache behavior

**Dependencies**: None

---

#### P0-PERF-003: Set Performance Budgets

- **Effort**: 3 hours
- **Owner**: Frontend Lead
- **Impact**: Prevents bundle bloat, ensures fast loading
- **Expert**: Performance
- **Description**: Define and enforce bundle size and performance budgets.

**Budgets**:

- Initial JS bundle: <200KB (gzipped)
- Initial CSS bundle: <50KB (gzipped)
- Time to Interactive (TTI): <3s
- Largest Contentful Paint (LCP): <2.5s
- First Input Delay (FID): <100ms

**Tasks**:

1. Add Lighthouse CI to GitHub Actions
2. Configure performance budgets
3. Fail build if budgets exceeded
4. Document budgets

**Dependencies**: None

---

### Accessibility (17 hours)

#### P0-A11Y-001: Implement Accessible Persona Selection

- **Effort**: 6 hours
- **Owner**: Frontend Developer
- **Impact**: WCAG AA compliance for core UX decision
- **Expert**: Accessibility
- **Description**: Add ARIA roles, labels, and screen reader support to persona selection.

**Implementation**:

```html
<fieldset>
  <legend>Choose Your Persona (select one or more)</legend>
  <div
    role="checkbox"
    aria-checked="false"
    aria-labelledby="real-estate-label"
    aria-describedby="real-estate-desc"
    tabindex="0"
  >
    <h3 id="real-estate-label">Real Estate Professional</h3>
    <p id="real-estate-desc">Make informed decisions...</p>
  </div>
</fieldset>
```

**Tasks**:

1. Add `role="checkbox"` or `role="radio"`
2. Implement `aria-checked`, `aria-pressed`
3. Use `fieldset` and `legend`
4. Add meaningful ARIA labels
5. Test with NVDA and VoiceOver

**Dependencies**: Persona selection UI implemented

---

#### P0-A11Y-002: Add Focus Management to Onboarding

- **Effort**: 4 hours
- **Owner**: Frontend Developer
- **Impact**: Better keyboard navigation
- **Expert**: Accessibility
- **Description**: Implement focus management for multi-step onboarding wizard.

**Implementation**:

```javascript
function goToNextStep() {
  setCurrentStep(currentStep + 1)
  setTimeout(() => {
    document.querySelector('h1')?.focus()
  }, 100)
  announceToScreenReader(`Step ${currentStep + 1} of 4`)
}
```

**Tasks**:

1. Focus heading on step change
2. Add `aria-live` regions for progress announcements
3. Implement keyboard shortcuts (Esc to cancel)
4. Test full keyboard flow

**Dependencies**: Onboarding wizard implemented

---

#### P0-A11Y-003: Implement Accessible Form Validation

- **Effort**: 4 hours
- **Owner**: Frontend Developer
- **Impact**: Screen readers announce errors
- **Expert**: Accessibility
- **Description**: Add ARIA attributes to forms so errors are announced.

**Implementation**:

```html
<input
  type="password"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="password-error"
/>
<div id="password-error" role="alert" aria-live="assertive">
  Password must be at least 8 characters
</div>
```

**Tasks**:

1. Add `aria-invalid`, `aria-describedby`
2. Use `aria-live="assertive"` for errors
3. Create error summary component
4. Test with screen readers

**Dependencies**: Forms implemented

---

#### P0-A11Y-004: Add Automated Accessibility Testing

- **Effort**: 3 hours
- **Owner**: QA Engineer + Frontend Developer
- **Impact**: Catches accessibility issues in CI/CD
- **Expert**: Accessibility
- **Description**: Add axe/jest-axe to automated test suite.

**Implementation**:

```javascript
import { axe, toHaveNoViolations } from 'jest-axe'

test('PersonaSelection is accessible', async () => {
  const { container } = render(<PersonaSelection />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

**Tasks**:

1. Install `jest-axe` and `@axe-core/playwright`
2. Add accessibility tests for all components
3. Add Lighthouse CI to GitHub Actions
4. Configure to fail on WCAG violations

**Dependencies**: None

---

### Testing (21 hours)

#### P0-TEST-001: Define Test Data Management Strategy

- **Effort**: 4 hours
- **Owner**: QA Lead + Backend Developer
- **Impact**: Prevents flaky tests, data pollution
- **Expert**: Testing
- **Description**: Use database transactions + factory pattern for test data.

**Implementation**:

```javascript
beforeEach(async () => {
  testContext.tx = await prisma.$begin()
})

afterEach(async () => {
  await testContext.tx.$rollback()
})

function createTestUser(overrides = {}) {
  return {
    email: `test-${Date.now()}@example.com`,
    password: 'Test123!',
    ...overrides,
  }
}
```

**Tasks**:

1. Set up database transactions in test setup
2. Create factory functions for test data
3. Implement cleanup in `afterEach`
4. Document test data strategy

**Dependencies**: Database chosen

---

#### P0-TEST-002: Add Security Testing Suite

- **Effort**: 8 hours
- **Owner**: QA Engineer + Security Engineer
- **Impact**: Prevents security vulnerabilities
- **Expert**: Testing, Security
- **Description**: Add comprehensive security tests.

**Test Scenarios**:

- Rate limiting blocks brute-force
- Session cookies are httpOnly
- CSRF tokens validated
- SQL injection prevented
- XSS prevented

**Tasks**:

1. Write rate limiting tests
2. Write session security tests
3. Write CSRF tests
4. Write SQL injection tests
5. Write XSS tests
6. Run OWASP ZAP scan

**Dependencies**: P0-SEC-002 (rate limiting)

---

#### P0-TEST-003: Add Edge Case E2E Tests

- **Effort**: 6 hours
- **Owner**: QA Engineer
- **Impact**: Catches bugs in error scenarios
- **Expert**: Testing
- **Description**: Add E2E tests for edge cases (network failures, browser back, etc.).

**Test Scenarios**:

- Network failure during module installation
- Browser back button during onboarding
- Page refresh during persona selection
- Concurrent edits in multiple tabs
- Slow network (loading states)

**Tasks**:

1. Write Playwright tests for each scenario
2. Mock network failures
3. Test browser navigation
4. Test concurrent edits

**Dependencies**: E2E testing framework set up

---

#### P0-TEST-004: Optimize Test Execution Time

- **Effort**: 3 hours
- **Owner**: QA Lead
- **Impact**: Developers run tests locally (faster feedback)
- **Expert**: Testing
- **Description**: Enable parallel execution, create smoke test subset.

**Target**: <5 minutes for local tests, <15 minutes for full CI suite

**Tasks**:

1. Enable Vitest parallel execution
2. Create smoke test subset
3. Set up test sharding in CI
4. Measure and document test execution times

**Dependencies**: None

---

### Documentation (15 hours)

#### P0-DOC-001: Define Documentation Stack and Standards

- **Effort**: 4 hours
- **Owner**: Tech Writer + Engineering Manager
- **Impact**: Unblocks doc writing, ensures consistency
- **Expert**: Documentation
- **Description**: Choose documentation tools and establish standards.

**Recommended Stack**:

- Format: Markdown (MDX for interactive examples)
- Tool: Docusaurus or VitePress
- API docs: OpenAPI 3.0
- Code docs: TSDoc
- Style guide: Microsoft Writing Style Guide

**Tasks**:

1. Evaluate Docusaurus vs. VitePress
2. Set up documentation site
3. Document standards in `docs/README.md`
4. Create templates

**Dependencies**: None

---

#### P0-DOC-002: Create User Documentation Outline

- **Effort**: 3 hours
- **Owner**: Tech Writer + Product Manager
- **Impact**: Clarity on documentation scope
- **Expert**: Documentation
- **Description**: Create complete documentation structure.

**Outline**:

```
docs/
├── user-guide/
│   ├── getting-started.md
│   ├── choosing-a-persona.md
│   ├── installing-modules.md
│   ├── managing-profile.md
│   ├── api-keys.md
│   ├── troubleshooting.md
│   └── faq.md
├── developer-guide/
│   ├── architecture.md
│   ├── module-development.md
│   └── api-reference.md
└── package-docs/
    ├── user-management/README.md
    ├── persona-system/README.md
    └── module-registry/README.md
```

**Tasks**:

1. Create folder structure
2. Assign ownership for each doc
3. Set deadlines

**Dependencies**: P0-DOC-001

---

#### P0-DOC-003: Set Up OpenAPI Specification

- **Effort**: 6 hours
- **Owner**: Backend Developer + Tech Writer
- **Impact**: Auto-generates API docs
- **Expert**: Documentation
- **Description**: Create OpenAPI 3.0 spec for all Sprint 01 API endpoints.

**Endpoints to Document**:

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/profile
- PATCH /api/profile
- GET /api/personas
- POST /api/personas/assign
- POST /api/modules/install

**Tasks**:

1. Create `openapi.yaml` file
2. Document all endpoints
3. Set up Swagger UI
4. Add OpenAPI validation to CI/CD

**Dependencies**: API endpoints designed

---

#### P0-DOC-004: Establish TSDoc Standards

- **Effort**: 2 hours
- **Owner**: Engineering Manager
- **Impact**: Better code understanding, IDE tooltips
- **Expert**: Documentation
- **Description**: Document TSDoc standards and set up TypeDoc.

**Standard**:

````typescript
/**
 * Description
 * @param name - Description
 * @returns Description
 * @throws {ErrorType} Description
 * @example
 * ```typescript
 * example code
 * ```
 */
````

**Tasks**:

1. Create TSDoc examples in code standards
2. Set up TypeDoc
3. Add npm script `npm run docs:generate`

**Dependencies**: None

---

## P1: HIGH PRIORITY - Should Do (Week 1-2 of Sprint 01)

_(21 items, ~86 hours - see detailed list in individual expert feedback documents)_

**Key P1 Items**:

- User Testing for Persona Selection (UX - 8h)
- Add Account Deletion Flow (Security - 4h)
- Module Pre-loading (Performance - 4h)
- Skip Links (Accessibility - 1h)
- Screen Reader Testing (Accessibility - 8h)
- Load Testing (Testing - 4h)
- Troubleshooting Guide (Documentation - 4h)

---

## P2: NICE TO HAVE - Could Do (Sprint 02+)

_(9 items, ~39 hours - see detailed list in individual expert feedback documents)_

**Key P2 Items**:

- Visual Regression Testing (Testing - 4h)
- Security Monitoring (Security - 6h)
- Video Tutorials (Documentation - 8h)
- Reduced Motion Support (Accessibility - 2h)
- Focus Visible Indicators (Accessibility - 2h)

---

## Recommended Execution Order

### Week Before Sprint 01 (Critical Path)

**Day 1-2** (Foundation Items - 18h):

1. P0-ARCH-001: Auth Provider Decision (4h)
2. P0-SEC-004: Database Choice Decision (4h)
3. P0-SEC-001: Encryption Key Management (6h)
4. P0-DOC-001: Documentation Stack (4h)

**Day 3-4** (High-Impact Items - 42h, distributed):

1. P0-ARCH-002: API Key Storage Redesign (8h)
2. P0-UX-002: Persona Comparison UI (6h)
3. P0-UX-003: Module Installation UX (8h)
4. P0-SEC-003: MFA Support (8h)
5. P0-TEST-001: Test Data Strategy (4h)
6. P0-DOC-003: OpenAPI Spec (6h)
7. P0-DOC-002: User Docs Outline (3h)

**Day 5** (Quick Wins - 16h, distributed):

1. P0-PERF-001: Database Indexes (2h)
2. P0-SEC-002: Rate Limiting (3h)
3. P0-UX-004: Onboarding Time Estimate (2h)
4. P0-PERF-003: Performance Budgets (3h)
5. P0-TEST-004: Optimize Test Execution (3h)
6. P0-DOC-004: TSDoc Standards (2h)

### Week 1 of Sprint 01 (Accessibility + Remaining P0)

**Day 1-3**:

1. P0-A11Y-001: Accessible Persona Selection (6h)
2. P0-A11Y-002: Focus Management (4h)
3. P0-A11Y-003: Form Validation (4h)
4. P0-A11Y-004: Automated Testing (3h)
5. P0-ARCH-003: Persona Switching State (6h)
6. P0-ARCH-004: Module-Persona Compatibility (4h)

**Day 4-5**:

1. P0-PERF-002: Caching Strategy (6h)
2. P0-TEST-002: Security Testing (8h)
3. P0-TEST-003: Edge Case E2E Tests (6h)
4. P0-UX-001: Defer API Key Entry (4h)

---

## Tracking Progress

Create GitHub issues/tasks for each P0 item:

- Label: `epic-02`, `sprint-01`, `expert-feedback`, `P0`
- Assign owner
- Set due date (before Sprint 01 kickoff)
- Link to expert feedback document
- Track in project board

**Sprint Readiness Checklist**:

- [ ] All 24 P0 items complete or in-progress
- [ ] All 4 architectural decisions documented
- [ ] FIGMA designs created and approved
- [ ] Team capacity confirmed
- [ ] Expert sign-off received

---

## Estimated Team Effort Distribution

| Role                   | Pre-Sprint (P0) | Week 1-2 (P1) | Total     |
| ---------------------- | --------------- | ------------- | --------- |
| **Architecture Lead**  | 22h             | 8h            | 30h       |
| **Backend Developer**  | 35h             | 18h           | 53h       |
| **Frontend Developer** | 30h             | 24h           | 54h       |
| **UX Designer**        | 20h             | 16h           | 36h       |
| **QA Engineer**        | 18h             | 14h           | 32h       |
| **Security Engineer**  | 10h             | 6h            | 16h       |
| **Tech Writer**        | 15h             | 12h           | 27h       |
| **TOTAL**              | **~150h**       | **~98h**      | **~248h** |

**Timeline**: 3-4 days pre-sprint (team-wide) + 2-3 weeks in Sprint 01

---

**Document Version**: 1.0
**Last Updated**: 2025-12-21
**Status**: Action Items Ready for Assignment
**Next Review**: After Sprint 01 kickoff
