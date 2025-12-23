# Session 05: Testing & Validation

## Epic 02 - User Profiles & Personas | Sprint 01 Final Session

**Objective**: Comprehensive testing coverage for all Sprint 01 implementations, expert validation, and sprint sign-off preparation.

**Estimated Duration**: 3-4 hours

---

## Prerequisites Verification

Before starting, verify all previous sessions are complete:

```bash
# Verify Session 01 - Database Schema (36 tables)
ls packages/database/src/schema/

# Verify Session 02 - CRUD Services & API (16 endpoints)
ls packages/api/src/services/
ls packages/api/src/routes/

# Verify Session 03 - MFA & Guest Access (13 endpoints)
ls packages/api/src/services/mfa/
ls packages/api/src/services/guest/

# Verify Session 04 - Onboarding UI (8 files)
ls packages/ui/src/components/onboarding/
ls packages/ui/src/contexts/
```

---

## Phase 1: Database & Schema Testing (45 min)

### 1.1 Schema Validation Tests

Create `packages/database/src/__tests__/schema.test.ts`:

```typescript
describe('Epic 02 Database Schema', () => {
  describe('User Tables', () => {
    it('should have proper users table structure')
    it('should enforce email uniqueness')
    it('should have valid foreign key to profiles')
  })

  describe('Profile Tables', () => {
    it('should have proper profiles table structure')
    it('should enforce one-to-one with users')
    it('should have valid accessibility_settings JSON')
  })

  describe('Persona Tables', () => {
    it('should have proper personas table structure')
    it('should enforce user_persona assignments')
    it('should track primary persona correctly')
  })

  describe('Authentication Tables', () => {
    it('should have proper sessions table structure')
    it('should have proper refresh_tokens table structure')
    it('should have proper mfa_settings table structure')
    it('should have proper backup_codes table structure')
  })

  describe('Guest Access Tables', () => {
    it('should have proper guest_codes table structure')
    it('should enforce code expiration')
    it('should track usage limits')
  })

  describe('API Keys Tables', () => {
    it('should have proper api_keys table structure')
    it('should enforce encrypted key storage')
    it('should track rate limits')
  })
})
```

### 1.2 Migration Tests

```typescript
describe('Database Migrations', () => {
  it('should run all migrations successfully')
  it('should rollback migrations cleanly')
  it('should maintain data integrity during migration')
})
```

**Target Coverage**: 90% for schema validation

---

## Phase 2: Service Layer Testing (1 hour)

### 2.1 User Service Tests

Create `packages/api/src/services/__tests__/user.service.test.ts`:

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data')
    it('should hash password with bcrypt')
    it('should create associated profile')
    it('should reject duplicate email')
    it('should validate email format')
  })

  describe('authenticateUser', () => {
    it('should return tokens for valid credentials')
    it('should reject invalid password')
    it('should reject non-existent user')
    it('should trigger MFA if enabled')
  })

  describe('updateUser', () => {
    it('should update allowed fields')
    it('should reject protected fields')
    it('should emit update event')
  })

  describe('deleteUser', () => {
    it('should soft delete user')
    it('should cascade to related records')
    it('should revoke all sessions')
  })
})
```

### 2.2 Profile Service Tests

Create `packages/api/src/services/__tests__/profile.service.test.ts`:

```typescript
describe('ProfileService', () => {
  describe('getProfile', () => {
    it('should return profile for valid user')
    it('should include persona assignments')
    it('should respect privacy settings')
  })

  describe('updateProfile', () => {
    it('should update preferences')
    it('should validate accessibility settings')
    it('should update notification preferences')
  })

  describe('updateAvatar', () => {
    it('should accept valid image formats')
    it('should reject oversized images')
    it('should generate thumbnails')
  })
})
```

### 2.3 Persona Service Tests

Create `packages/api/src/services/__tests__/persona.service.test.ts`:

```typescript
describe('PersonaService', () => {
  describe('assignPersona', () => {
    it('should assign persona to user')
    it('should allow multiple personas')
    it('should set primary persona')
    it('should reject invalid persona IDs')
  })

  describe('switchPersona', () => {
    it('should switch active persona')
    it('should update session context')
    it('should emit persona change event')
  })

  describe('getPersonaModules', () => {
    it('should return modules for persona')
    it('should filter by user permissions')
  })
})
```

### 2.4 MFA Service Tests

Create `packages/api/src/services/__tests__/mfa.service.test.ts`:

```typescript
describe('MFAService', () => {
  describe('enableMFA', () => {
    it('should generate secret for TOTP')
    it('should create backup codes')
    it('should require password confirmation')
  })

  describe('verifyMFA', () => {
    it('should verify valid TOTP code')
    it('should reject expired codes')
    it('should accept backup codes')
    it('should mark backup codes as used')
  })

  describe('disableMFA', () => {
    it('should require MFA verification')
    it('should revoke all backup codes')
    it('should update user settings')
  })
})
```

### 2.5 Guest Access Service Tests

Create `packages/api/src/services/__tests__/guest.service.test.ts`:

```typescript
describe('GuestAccessService', () => {
  describe('createGuestCode', () => {
    it('should generate unique code')
    it('should set expiration date')
    it('should set usage limits')
    it('should associate with creator')
  })

  describe('validateGuestCode', () => {
    it('should accept valid code')
    it('should reject expired code')
    it('should reject exhausted code')
    it('should increment usage count')
  })

  describe('revokeGuestCode', () => {
    it('should invalidate code immediately')
    it('should terminate active sessions')
  })
})
```

**Target Coverage**: 85% for all services

---

## Phase 3: API Integration Testing (1 hour)

### 3.1 Authentication Endpoints

Create `packages/api/src/routes/__tests__/auth.routes.test.ts`:

```typescript
describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register new user (201)')
    it('should reject invalid email (400)')
    it('should reject weak password (400)')
    it('should reject duplicate email (409)')
  })

  describe('POST /api/auth/login', () => {
    it('should return tokens (200)')
    it('should set refresh token cookie')
    it('should require MFA if enabled (202)')
    it('should reject invalid credentials (401)')
  })

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token (200)')
    it('should reject expired refresh token (401)')
    it('should reject revoked token (401)')
  })

  describe('POST /api/auth/logout', () => {
    it('should revoke session (200)')
    it('should clear cookies')
  })

  describe('POST /api/auth/mfa/verify', () => {
    it('should complete login with MFA (200)')
    it('should reject invalid code (401)')
    it('should accept backup code (200)')
  })
})
```

### 3.2 Profile Endpoints

Create `packages/api/src/routes/__tests__/profile.routes.test.ts`:

```typescript
describe('Profile API', () => {
  describe('GET /api/profile', () => {
    it('should return current user profile (200)')
    it('should require authentication (401)')
  })

  describe('PATCH /api/profile', () => {
    it('should update profile fields (200)')
    it('should validate input (400)')
  })

  describe('PATCH /api/profile/preferences', () => {
    it('should update preferences (200)')
    it('should validate accessibility settings')
  })

  describe('POST /api/profile/avatar', () => {
    it('should upload avatar (200)')
    it('should reject invalid format (400)')
    it('should reject large files (413)')
  })
})
```

### 3.3 Persona Endpoints

Create `packages/api/src/routes/__tests__/persona.routes.test.ts`:

```typescript
describe('Persona API', () => {
  describe('GET /api/personas', () => {
    it('should list available personas (200)')
    it('should include module counts')
  })

  describe('POST /api/profile/personas', () => {
    it('should assign persona (200)')
    it('should reject invalid persona (400)')
  })

  describe('DELETE /api/profile/personas/:id', () => {
    it('should unassign persona (200)')
    it('should prevent removing last persona (400)')
  })

  describe('PATCH /api/profile/personas/:id/primary', () => {
    it('should set primary persona (200)')
  })
})
```

### 3.4 Guest Access Endpoints

Create `packages/api/src/routes/__tests__/guest.routes.test.ts`:

```typescript
describe('Guest Access API', () => {
  describe('POST /api/guest/codes', () => {
    it('should create guest code (201)')
    it('should require authentication (401)')
    it('should enforce rate limits (429)')
  })

  describe('POST /api/guest/access', () => {
    it('should create guest session (200)')
    it('should return limited permissions')
    it('should reject invalid code (401)')
  })

  describe('GET /api/guest/codes', () => {
    it('should list user codes (200)')
    it('should show usage statistics')
  })

  describe('DELETE /api/guest/codes/:id', () => {
    it('should revoke code (200)')
  })
})
```

**Target Coverage**: 90% for API routes

---

## Phase 4: UI Component Testing (45 min)

### 4.1 Context Tests

Create `packages/ui/src/contexts/__tests__/ProfileContext.test.tsx`:

```typescript
describe('ProfileContext', () => {
  describe('ProfileProvider', () => {
    it('should provide default state')
    it('should load user on mount')
    it('should handle login')
    it('should handle logout')
    it('should refresh token automatically')
  })

  describe('useProfile hook', () => {
    it('should return context value')
    it('should throw outside provider')
  })
})
```

### 4.2 Component Tests

Create tests for each onboarding component:

```typescript
// WelcomeScreen.test.tsx
describe('WelcomeScreen', () => {
  it('should render login form by default')
  it('should switch to register form')
  it('should validate email format')
  it('should show MFA prompt when required')
  it('should handle form submission')
  it('should show loading state')
  it('should display errors')
})

// PreferencesForm.test.tsx
describe('PreferencesForm', () => {
  it('should render all preference sections')
  it('should save theme preference')
  it('should save notification settings')
  it('should apply accessibility settings')
  it('should handle form validation')
})

// PersonaSelection.test.tsx
describe('PersonaSelection', () => {
  it('should render persona cards')
  it('should allow multi-select')
  it('should designate primary persona')
  it('should show module previews')
  it('should validate minimum selection')
})

// ProfileDashboard.test.tsx
describe('ProfileDashboard', () => {
  it('should render all tabs')
  it('should switch between tabs')
  it('should load user data')
  it('should handle profile updates')
  it('should show MFA settings')
  it('should manage API keys')
})

// OnboardingFlow.test.tsx
describe('OnboardingFlow', () => {
  it('should render step indicator')
  it('should navigate between steps')
  it('should save progress')
  it('should resume from saved step')
  it('should complete flow')
})
```

**Target Coverage**: 80% for UI components

---

## Phase 5: E2E Testing (45 min)

### 5.1 Critical User Flows

Create `packages/e2e/tests/epic02/`:

```typescript
// registration.spec.ts
test.describe('User Registration Flow', () => {
  test('should complete full registration', async ({ page }) => {
    // Navigate to registration
    // Fill form with valid data
    // Submit and verify redirect
    // Verify email sent (mock)
    // Complete onboarding
  })

  test('should handle registration errors', async ({ page }) => {
    // Test duplicate email
    // Test weak password
    // Test invalid format
  })
})

// login.spec.ts
test.describe('User Login Flow', () => {
  test('should login without MFA', async ({ page }) => {
    // Navigate to login
    // Enter credentials
    // Verify dashboard redirect
  })

  test('should login with MFA', async ({ page }) => {
    // Navigate to login
    // Enter credentials
    // Enter MFA code
    // Verify dashboard redirect
  })
})

// onboarding.spec.ts
test.describe('Onboarding Flow', () => {
  test('should complete full onboarding', async ({ page }) => {
    // Login as new user
    // Complete preferences
    // Select personas
    // Verify dashboard
  })

  test('should resume interrupted onboarding', async ({ page }) => {
    // Start onboarding
    // Leave mid-flow
    // Return and verify resumption
  })
})

// guest-access.spec.ts
test.describe('Guest Access Flow', () => {
  test('should create and use guest code', async ({ page }) => {
    // Login as host
    // Create guest code
    // Use code in new session
    // Verify limited access
  })
})

// profile-management.spec.ts
test.describe('Profile Management', () => {
  test('should update profile settings', async ({ page }) => {
    // Login
    // Navigate to settings
    // Update preferences
    // Verify changes persist
  })

  test('should enable MFA', async ({ page }) => {
    // Login
    // Navigate to security
    // Enable MFA
    // Verify backup codes
  })
})
```

### 5.2 Multi-Device Testing

```typescript
// Run tests across device profiles
const devices = ['Desktop Chrome', 'iPhone 12', 'iPad Pro']

for (const device of devices) {
  test.describe(`${device} - Responsive UI`, () => {
    test('should adapt layout correctly')
    test('should handle touch interactions')
    test('should maintain accessibility')
  })
}
```

---

## Phase 6: Expert Panel Review (30 min)

### 6.1 Architecture Expert Review

| Item                     | Criteria                            | Status | Notes |
| ------------------------ | ----------------------------------- | ------ | ----- |
| Schema normalization     | 3NF compliance, no redundant data   | [ ]    |       |
| Foreign key integrity    | All relationships properly defined  | [ ]    |       |
| Index optimization       | Queries use appropriate indexes     | [ ]    |       |
| API RESTfulness          | Proper HTTP methods, status codes   | [ ]    |       |
| Service layer separation | Business logic isolated from routes | [ ]    |       |
| Error handling patterns  | Consistent error responses          | [ ]    |       |
| State management         | Context properly scoped             | [ ]    |       |
| Component composition    | Reusable, testable components       | [ ]    |       |

### 6.2 Security Expert Review

| Item                     | Criteria                                   | Status | Notes |
| ------------------------ | ------------------------------------------ | ------ | ----- |
| Password hashing         | bcrypt with cost factor >= 10              | [ ]    |       |
| JWT implementation       | Short-lived access (15min), secure refresh | [ ]    |       |
| MFA security             | TOTP with proper secret handling           | [ ]    |       |
| Backup codes             | Hashed storage, single-use enforcement     | [ ]    |       |
| Guest isolation          | Limited permissions, no data leakage       | [ ]    |       |
| API key encryption       | AES-256-GCM with proper IV                 | [ ]    |       |
| Session management       | Secure cookies, proper revocation          | [ ]    |       |
| Input validation         | Zod schemas on all endpoints               | [ ]    |       |
| SQL injection prevention | Parameterized queries only                 | [ ]    |       |
| XSS prevention           | Proper output encoding                     | [ ]    |       |
| CSRF protection          | Token validation on mutations              | [ ]    |       |
| Rate limiting            | Applied to sensitive endpoints             | [ ]    |       |

### 6.3 Testing Expert Review

| Item                    | Criteria                      | Status | Notes |
| ----------------------- | ----------------------------- | ------ | ----- |
| Unit test coverage      | >= 80% across packages        | [ ]    |       |
| Service test coverage   | >= 85% for business logic     | [ ]    |       |
| API test coverage       | >= 90% for endpoints          | [ ]    |       |
| UI component coverage   | >= 80% for components         | [ ]    |       |
| E2E critical paths      | All 5 flows passing           | [ ]    |       |
| Error scenario coverage | Edge cases tested             | [ ]    |       |
| Mock isolation          | External deps properly mocked | [ ]    |       |
| Test performance        | Suite runs < 5 minutes        | [ ]    |       |

### 6.4 UX Expert Review

| Item                  | Criteria                          | Status | Notes |
| --------------------- | --------------------------------- | ------ | ----- |
| Form validation UX    | Inline errors, clear messages     | [ ]    |       |
| Loading states        | Skeleton/spinner on async ops     | [ ]    |       |
| Error recovery        | Clear recovery actions            | [ ]    |       |
| Accessibility         | WCAG 2.1 AA compliance            | [ ]    |       |
| Responsive design     | Mobile-first, breakpoints correct | [ ]    |       |
| Keyboard navigation   | Full keyboard support             | [ ]    |       |
| Screen reader support | Proper ARIA labels                | [ ]    |       |
| Color contrast        | Meets contrast ratios             | [ ]    |       |
| Animation preferences | Respects reduced-motion           | [ ]    |       |

---

## Phase 7: Sprint Sign-off Preparation

### 7.1 Coverage Report

Run and document final coverage:

```bash
# Generate coverage reports
pnpm test:coverage

# Document results
echo "## Sprint 01 Test Coverage" >> COVERAGE.md
echo "" >> COVERAGE.md
echo "| Package | Statements | Branches | Functions | Lines |" >> COVERAGE.md
echo "|---------|------------|----------|-----------|-------|" >> COVERAGE.md
```

### 7.2 Build Verification

```bash
# Full build verification
pnpm build

# Type checking
pnpm type-check

# Lint verification
pnpm lint
```

### 7.3 Documentation Checklist

- [ ] API documentation updated
- [ ] Component storybook entries
- [ ] Schema documentation
- [ ] Security considerations documented
- [ ] Deployment notes updated

---

## Success Criteria

| Metric             | Target       | Actual |
| ------------------ | ------------ | ------ |
| Unit Test Coverage | >= 80%       |        |
| API Test Coverage  | >= 90%       |        |
| E2E Tests Passing  | 100%         |        |
| Build Success      | All packages |        |
| Type Check         | Zero errors  |        |
| Lint               | Zero errors  |        |
| Expert Sign-offs   | 4/4 complete |        |

---

## Session Completion Report

Upon completion, provide:

1. **Test Summary**
   - Total tests: [count]
   - Passing: [count]
   - Skipped: [count]
   - Coverage: [percentage]

2. **Expert Review Status**
   - Architecture: [Approved/Pending]
   - Security: [Approved/Pending]
   - Testing: [Approved/Pending]
   - UX: [Approved/Pending]

3. **Issues Found**
   - List any bugs discovered
   - List any security concerns
   - List any UX improvements needed

4. **Sprint Sign-off Readiness**
   - [ ] All tests passing
   - [ ] All expert reviews complete
   - [ ] Documentation updated
   - [ ] Ready for Sprint 01 Sign-off

---

## Handoff to Orchestrator

After completing this session, report:

```markdown
## Session 05 Complete

### Test Results

- Unit Tests: X passing, Y skipped
- Integration Tests: X passing
- E2E Tests: X passing
- Coverage: X%

### Expert Reviews

- Architecture: [Status]
- Security: [Status]
- Testing: [Status]
- UX: [Status]

### Files Created

[List of test files]

### Sprint 01 Status

[Ready for Sign-off / Issues Remaining]
```

---

_Session 05 - Final session for Epic 02 Sprint 01_
_Orchestrator: Claude Web (Opus) | Executor: Claude Code CLI (Sonnet)_
