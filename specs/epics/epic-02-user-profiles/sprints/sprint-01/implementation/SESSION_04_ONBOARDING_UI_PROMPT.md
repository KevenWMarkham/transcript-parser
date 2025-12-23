# Session 04: Onboarding Flow UI

**Epic**: Epic 02 - User Profiles & Persona System
**Sprint**: Sprint 01 - Profile Data Model & UI
**Session**: 04 - Onboarding Flow UI
**Interface**: Claude Code CLI
**Recommended Model**: Sonnet
**Date Created**: December 23, 2024
**Created By**: Orchestrator (Claude Web - Opus)

---

## Session Objective

Implement frontend components for user onboarding and profile management:

1. Welcome screen component
2. Preferences form with accessibility settings
3. Persona/Module selection screen
4. Profile dashboard with settings
5. React Context for profile state management

---

## Pre-Session Status

### Completed Sessions (Epic 02 Sprint 01):

| Session | Focus | Commit | Status |
|---------|-------|--------|--------|
| 01 | Database Schema (36 tables) | `fc62075` | ✅ Complete |
| 02 | CRUD Services & API (16 endpoints) | `0db8e37` | ✅ Complete |
| 03 | MFA & Guest Access (13 endpoints) | `0d90d75` | ✅ Complete |

### Backend Ready:
- User registration/login API
- Profile CRUD endpoints
- Persona management API
- MFA challenge flow
- Guest access codes

---

## Expert Panel Review

Before proceeding with UI implementation, experts should verify Sessions 01-03:

### Architecture Expert Review

**Review Focus**: Database schema and API design

| Item | Criteria | Status |
|------|----------|--------|
| Schema normalization | 3NF compliance, no redundant data | [ ] |
| Foreign key integrity | All relationships properly defined | [ ] |
| Index strategy | Query-critical columns indexed | [ ] |
| API RESTfulness | Proper HTTP methods and status codes | [ ] |
| Service layer separation | Clean separation of concerns | [ ] |

**Questions to Answer**:
1. Is the 36-table schema appropriate or over-engineered?
2. Are the JSONB preference fields structured correctly?
3. Is the persona system flexible enough for future modules?

---

### Security Expert Review

**Review Focus**: Authentication, encryption, access control

| Item | Criteria | Status |
|------|----------|--------|
| Password hashing | bcrypt with appropriate rounds | [ ] |
| JWT implementation | Short-lived access, long-lived refresh | [ ] |
| API key encryption | AES-256-GCM with proper IV handling | [ ] |
| MFA implementation | OTP timing, backup code entropy | [ ] |
| Guest access isolation | Guests cannot access user data | [ ] |
| Input validation | Zod schemas on all endpoints | [ ] |

**Questions to Answer**:
1. Is the 6-digit OTP with 5-minute expiry secure enough?
2. Are backup codes sufficiently random (8 chars)?
3. Is guest session isolation properly implemented?

---

### Testing Expert Review

**Review Focus**: Test coverage and quality

| Item | Criteria | Status |
|------|----------|--------|
| Service unit tests | Core logic covered | [ ] |
| API endpoint tests | All routes tested | [ ] |
| Validation tests | Edge cases covered | [ ] |
| Mock strategy | External deps properly mocked | [ ] |
| Error scenarios | Failure paths tested | [ ] |

**Questions to Answer**:
1. What's the current test coverage for new services?
2. Are there integration tests for auth flows?
3. Should E2E tests be added for MFA?

---

### UX Expert Review

**Review Focus**: API design for frontend consumption

| Item | Criteria | Status |
|------|----------|--------|
| Error messages | User-friendly, actionable | [ ] |
| Response structure | Consistent across endpoints | [ ] |
| Pagination | Implemented where needed | [ ] |
| Loading states | Endpoints support partial data | [ ] |
| Offline support | API designed for retry | [ ] |

**Questions to Answer**:
1. Are error responses consistent for frontend handling?
2. Should onboarding support resume/save progress?
3. Is the persona selection flow intuitive?

---

## Task Breakdown

### Phase 1: Profile Context Provider (30 min)

**Objective**: Create React Context for profile state management

Create: `src/contexts/ProfileContext.tsx`

```typescript
interface ProfileContextType {
  user: User | null;
  profile: UserProfile | null;
  personas: PersonaAssignment[];
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;

  // Actions
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  activatePersona: (personaId: string) => Promise<void>;
  deactivatePersona: (personaId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
```

Create: `src/hooks/useProfile.ts`
- Custom hook for accessing profile context
- Handles loading states and errors

---

### Phase 2: Welcome Screen Component (45 min)

**Objective**: Create onboarding entry point

Create: `src/components/onboarding/WelcomeScreen.tsx`

**Features**:
- Hero section with value proposition
- Login / Register toggle
- OAuth buttons (Google, GitHub) - UI only, backend later
- Guest access option (if enabled)
- Accessibility-first design

**UI Requirements**:
- Glassmorphism styling (match existing design)
- Framer Motion animations
- Mobile responsive
- WCAG AA compliant

---

### Phase 3: Preferences Form (1 hour)

**Objective**: User preferences and accessibility settings

Create: `src/components/onboarding/PreferencesForm.tsx`

**Sections**:

1. **Display Preferences**
   - Theme: Light / Dark / System
   - Language: Dropdown
   - Timezone: Auto-detect with override

2. **Accessibility Settings**
   - Font size: Small / Medium / Large / Extra Large
   - High contrast mode: Toggle
   - Reduce motion: Toggle
   - Dyslexia-friendly font: Toggle

3. **Notification Preferences**
   - Email notifications: Toggle
   - Push notifications: Toggle
   - Notification frequency: Immediate / Daily / Weekly

4. **Privacy Settings**
   - Analytics opt-in: Toggle
   - Data retention: 30/60/90 days

**Validation**:
- Use React Hook Form + Zod
- Real-time validation feedback
- Save progress on blur

---

### Phase 4: Persona Selection Screen (1 hour)

**Objective**: Module/persona activation during onboarding

Create: `src/components/onboarding/PersonaSelection.tsx`

**Features**:

1. **Persona Cards**
   - Icon and name
   - Description
   - Features list
   - Pricing (if applicable)
   - Active/Inactive toggle

2. **Available Personas** (from database):
   - Guest (property guest experience)
   - Property Manager (owner/manager tools)
   - Student (lecture notes, flashcards)
   - Traveler (tour recordings, recommendations)
   - Real Estate (property hunting)
   - Vehicle (car shopping, TCO)
   - Business (meeting transcription)

3. **Recommendation Engine**
   - Based on preferences selected
   - "Recommended for you" badges

4. **Selection State**
   - Multi-select support
   - Minimum 1 required
   - Maximum based on subscription tier

---

### Phase 5: Profile Dashboard (1 hour)

**Objective**: User profile management after onboarding

Create: `src/components/profile/ProfileDashboard.tsx`

**Sections**:

1. **Profile Header**
   - Avatar (with upload)
   - Display name (editable)
   - Email (read-only)
   - Account created date

2. **Settings Tabs**
   - Profile (name, avatar, bio)
   - Preferences (from Phase 3)
   - Security (password, MFA)
   - Personas (active modules)
   - API Keys (for developers)
   - Sessions (active devices)

3. **Security Tab**
   Create: `src/components/profile/SecuritySettings.tsx`
   - Change password form
   - MFA enable/disable
   - Active sessions list
   - Logout all devices button

4. **API Keys Tab**
   Create: `src/components/profile/ApiKeySettings.tsx`
   - List saved API keys (masked)
   - Add new key form
   - Delete key button
   - Copy key (one-time reveal)

---

### Phase 6: Onboarding Flow Router (30 min)

**Objective**: Multi-step onboarding with progress tracking

Create: `src/components/onboarding/OnboardingFlow.tsx`

**Steps**:
1. Welcome / Register
2. Verify Email (if required)
3. Set Preferences
4. Select Personas
5. Complete (redirect to dashboard)

**Features**:
- Progress indicator (step X of Y)
- Back/Next navigation
- Skip option for optional steps
- Resume from last step (localStorage)
- Completion celebration animation

---

## Component Structure

```
src/
├── contexts/
│   └── ProfileContext.tsx
├── hooks/
│   └── useProfile.ts
├── components/
│   ├── onboarding/
│   │   ├── WelcomeScreen.tsx
│   │   ├── PreferencesForm.tsx
│   │   ├── PersonaSelection.tsx
│   │   ├── OnboardingFlow.tsx
│   │   └── OnboardingProgress.tsx
│   └── profile/
│       ├── ProfileDashboard.tsx
│       ├── ProfileHeader.tsx
│       ├── SecuritySettings.tsx
│       ├── ApiKeySettings.tsx
│       ├── PersonaManager.tsx
│       └── SessionManager.tsx
└── pages/
    ├── Onboarding.tsx
    └── Profile.tsx
```

---

## Design System Requirements

### Styling
- Use existing Tailwind + shadcn/ui components
- Glassmorphism cards (match current design)
- Consistent spacing (4px grid)
- Dark mode support

### Animations
- Framer Motion for transitions
- Respect `prefers-reduced-motion`
- Subtle micro-interactions

### Accessibility
- Keyboard navigation
- Screen reader labels (ARIA)
- Focus indicators
- Color contrast 4.5:1 minimum

---

## API Integration

### Endpoints to Connect:

| Component | Endpoint | Method |
|-----------|----------|--------|
| WelcomeScreen | `/api/auth/register` | POST |
| WelcomeScreen | `/api/auth/login` | POST |
| PreferencesForm | `/api/profile/preferences` | GET/PATCH |
| PersonaSelection | `/api/personas` | GET |
| PersonaSelection | `/api/personas/:id/activate` | POST |
| ProfileDashboard | `/api/profile` | GET/PUT |
| SecuritySettings | `/api/mfa/*` | Various |
| ApiKeySettings | `/api/keys` | GET/POST/DELETE |
| SessionManager | `/api/auth/sessions` | GET/DELETE |

---

## Acceptance Criteria

Before completing this session, verify:

- [ ] ProfileContext provides user/profile state
- [ ] WelcomeScreen renders with login/register forms
- [ ] PreferencesForm saves all preference categories
- [ ] PersonaSelection shows all personas with toggle
- [ ] ProfileDashboard has all tabs functional
- [ ] SecuritySettings integrates with MFA API
- [ ] OnboardingFlow progresses through all steps
- [ ] All components are mobile responsive
- [ ] Accessibility audit passes (axe DevTools)
- [ ] Dark mode works correctly

---

## Commit Guidelines

```bash
# After context and hooks
git add src/contexts/ src/hooks/
git commit -m "feat(profile): add ProfileContext and useProfile hook

- ProfileContext for user/profile state management
- useProfile hook for component access
- Loading and error state handling"

# After onboarding components
git add src/components/onboarding/
git commit -m "feat(onboarding): implement onboarding flow components

- WelcomeScreen with auth forms
- PreferencesForm with accessibility settings
- PersonaSelection with module cards
- OnboardingFlow with progress tracking"

# After profile components
git add src/components/profile/
git commit -m "feat(profile): add profile dashboard and settings

- ProfileDashboard with tabbed interface
- SecuritySettings with MFA integration
- ApiKeySettings for developer keys
- SessionManager for device management"

# Push
git push -u origin <branch-name>
```

---

## Handoff to Orchestrator

Upon completion, report back with:

1. **Components Created**:
   ```
   ✅/❌ ProfileContext
   ✅/❌ WelcomeScreen
   ✅/❌ PreferencesForm
   ✅/❌ PersonaSelection
   ✅/❌ ProfileDashboard
   ✅/❌ SecuritySettings
   ✅/❌ OnboardingFlow
   ```

2. **API Integration**:
   ```
   ✅/❌ Auth endpoints connected
   ✅/❌ Profile endpoints connected
   ✅/❌ Persona endpoints connected
   ✅/❌ MFA endpoints connected
   ```

3. **Quality Checks**:
   ```
   ✅/❌ Mobile responsive
   ✅/❌ Dark mode works
   ✅/❌ Accessibility audit passed
   ✅/❌ Animations smooth
   ```

4. **Expert Reviews Completed**:
   ```
   Architecture: ✅/❌ (findings)
   Security: ✅/❌ (findings)
   Testing: ✅/❌ (findings)
   UX: ✅/❌ (findings)
   ```

5. **Issues Found** (if any):
   - List any blockers needing orchestrator decision

---

## Next Session

After this session completes successfully:

**Session 05: Testing & Validation**
- Unit tests for new components
- E2E tests for onboarding flow
- Integration tests for auth/profile
- Sprint sign-off

---

## Expert Sign-off Required

Before Session 05, the following experts must review and approve:

| Expert | Focus | Sign-off |
|--------|-------|----------|
| Architecture | Schema, API, patterns | [ ] |
| Security | Auth, encryption, access | [ ] |
| Testing | Coverage, quality | [ ] |
| UX | Usability, accessibility | [ ] |

---

**Session Status**: 🟢 Ready for CLI Execution
**Estimated Duration**: 4-5 hours
**Priority**: P0 (Critical path)

---

_Created by Orchestrator - Claude Web (Opus)_
_For execution by Claude Code CLI (Sonnet)_
