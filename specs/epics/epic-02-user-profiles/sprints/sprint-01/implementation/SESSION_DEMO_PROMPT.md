# Sprint 01 Demo Session

## Epic 02 - User Profiles & Personas | Sprint 01 Demonstration

**Objective**: Demonstrate all Sprint 01 deliverables to stakeholders through a structured walkthrough of database, API, authentication, UI, and testing.

**Estimated Duration**: 1-2 hours

---

## Pre-Demo Checklist

Before starting the demo, verify environment readiness:

```bash
# 1. Verify all packages build
pnpm build

# 2. Verify database is running
docker compose ps

# 3. Run migrations
pnpm db:migrate

# 4. Start development servers
pnpm dev
```

---

## Demo Section 1: Database Schema (15 min)

### 1.1 Schema Overview

Present the 36-table database architecture:

```bash
# Show schema files
ls -la packages/database/src/schema/

# Display table count and structure
cat packages/database/src/schema/index.ts
```

### 1.2 Key Tables Demonstration

Walk through core tables:

| Table Category | Tables                        | Purpose          |
| -------------- | ----------------------------- | ---------------- |
| User Identity  | users, profiles               | Core user data   |
| Personas       | personas, user_personas       | Role assignments |
| Authentication | sessions, refresh_tokens      | Token management |
| Security       | mfa_settings, backup_codes    | MFA support      |
| Guest Access   | guest_codes, guest_sessions   | Temporary access |
| API            | api_keys, api_key_permissions | Developer access |

### 1.3 Live Database Query

```bash
# Connect to database and show tables
docker exec -it smarthaven-db psql -U postgres -d smarthaven -c "\dt"

# Show user table structure
docker exec -it smarthaven-db psql -U postgres -d smarthaven -c "\d users"

# Show relationships
docker exec -it smarthaven-db psql -U postgres -d smarthaven -c "\d+ user_personas"
```

---

## Demo Section 2: CRUD API Endpoints (20 min)

### 2.1 API Overview

Present the 29 total endpoints (16 CRUD + 13 Auth/MFA):

```bash
# Show route files
ls -la packages/api/src/routes/

# Display route definitions
cat packages/api/src/routes/index.ts
```

### 2.2 User Management Demo

```bash
# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@smarthaven.ai",
    "password": "SecurePass123!",
    "firstName": "Demo",
    "lastName": "User"
  }'

# Get user profile
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer <token>"

# Update profile
curl -X PATCH http://localhost:3000/api/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Demo User",
    "bio": "Testing the SmartHaven platform"
  }'
```

### 2.3 Persona Assignment Demo

```bash
# List available personas
curl -X GET http://localhost:3000/api/personas \
  -H "Authorization: Bearer <token>"

# Assign persona to user
curl -X POST http://localhost:3000/api/profile/personas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "personaId": "guest",
    "isPrimary": true
  }'

# Get user's personas
curl -X GET http://localhost:3000/api/profile/personas \
  -H "Authorization: Bearer <token>"
```

### 2.4 Preferences Demo

```bash
# Update user preferences
curl -X PATCH http://localhost:3000/api/profile/preferences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "language": "en",
    "notifications": {
      "email": true,
      "push": false
    },
    "accessibility": {
      "reducedMotion": false,
      "highContrast": false,
      "fontSize": "medium"
    }
  }'
```

---

## Demo Section 3: Authentication & MFA (20 min)

### 3.1 Standard Authentication Flow

```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "firstName": "New",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!"
  }'

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Cookie: refreshToken=<refresh_token>"

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

### 3.2 MFA Setup Demo

```bash
# Enable MFA (returns QR code and backup codes)
curl -X POST http://localhost:3000/api/auth/mfa/enable \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "SecurePass123!"
  }'

# Verify MFA setup with TOTP code
curl -X POST http://localhost:3000/api/auth/mfa/verify-setup \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'

# Get backup codes
curl -X GET http://localhost:3000/api/auth/mfa/backup-codes \
  -H "Authorization: Bearer <token>"
```

### 3.3 MFA Login Flow

```bash
# Login triggers MFA challenge (returns 202)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mfa-user@example.com",
    "password": "SecurePass123!"
  }'
# Response: { "mfaRequired": true, "mfaToken": "..." }

# Complete MFA verification
curl -X POST http://localhost:3000/api/auth/mfa/verify \
  -H "Content-Type: application/json" \
  -d '{
    "mfaToken": "<mfa_token>",
    "code": "123456"
  }'
```

### 3.4 Guest Access Demo

```bash
# Create guest access code (as authenticated user)
curl -X POST http://localhost:3000/api/guest/codes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Guest",
    "expiresIn": "24h",
    "maxUses": 5,
    "permissions": ["view_property", "request_service"]
  }'

# Use guest code to access
curl -X POST http://localhost:3000/api/guest/access \
  -H "Content-Type: application/json" \
  -d '{
    "code": "GUEST-XXXX-XXXX"
  }'

# List active guest codes
curl -X GET http://localhost:3000/api/guest/codes \
  -H "Authorization: Bearer <token>"

# Revoke guest code
curl -X DELETE http://localhost:3000/api/guest/codes/<code_id> \
  -H "Authorization: Bearer <token>"
```

---

## Demo Section 4: Onboarding UI (20 min)

### 4.1 Component Overview

Present the 8 UI components:

```bash
# Show UI component structure
ls -la packages/ui/src/components/onboarding/
ls -la packages/ui/src/contexts/
```

| Component        | Purpose          | Key Features                      |
| ---------------- | ---------------- | --------------------------------- |
| ProfileContext   | State management | Auth state, user data, tokens     |
| WelcomeScreen    | Login/Register   | Form validation, MFA support      |
| PreferencesForm  | User settings    | Theme, notifications, a11y        |
| PersonaSelection | Role selection   | Multi-select, primary designation |
| ProfileDashboard | Settings hub     | Tabbed interface                  |
| OnboardingFlow   | Step router      | Progress tracking, resumption     |

### 4.2 Live UI Walkthrough

Navigate through the application:

```bash
# Start the UI development server
cd packages/ui && pnpm dev
```

**Demo Flow**:

1. **Welcome Screen**
   - Show login form with validation
   - Show registration form
   - Demonstrate error states
   - Show MFA verification modal

2. **Preferences Form**
   - Toggle theme (light/dark)
   - Adjust notification settings
   - Configure accessibility options
   - Change language preference

3. **Persona Selection**
   - Display available personas as cards
   - Select multiple personas
   - Designate primary persona
   - Show module preview for each

4. **Profile Dashboard**
   - Navigate between tabs:
     - Profile (basic info, avatar)
     - Preferences (settings)
     - Personas (assignments)
     - Security (MFA, sessions)
     - Notifications (channels)

5. **Onboarding Flow**
   - Show step indicator
   - Navigate forward/back
   - Demonstrate step resumption
   - Complete flow

### 4.3 Responsive Design Demo

Show UI across device sizes:

```bash
# Use browser dev tools to demonstrate:
# - Desktop (1920x1080)
# - Tablet (768x1024)
# - Mobile (375x812)
```

### 4.4 Accessibility Demo

Demonstrate WCAG 2.1 AA compliance:

- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements
- Color contrast verification
- Reduced motion support

---

## Demo Section 5: Testing Suite (15 min)

### 5.1 Test Coverage Overview

```bash
# Run full test suite with coverage
pnpm test:coverage

# Display coverage summary
cat coverage/coverage-summary.json
```

### 5.2 Test Categories

| Category        | Count    | Coverage |
| --------------- | -------- | -------- |
| Database/Schema | 176      | 85.85%   |
| Service Layer   | 80       | 85%+     |
| API Routes      | 143      | 90%+     |
| UI Components   | 87       | 80%      |
| E2E Scenarios   | 17       | 5 flows  |
| **Total**       | **503+** |          |

### 5.3 Live Test Execution

```bash
# Run unit tests
pnpm test:unit

# Run API tests
pnpm test:api

# Run UI component tests
pnpm test:ui

# Run E2E tests (headless)
pnpm test:e2e

# Run E2E tests (headed - for demo visibility)
pnpm test:e2e:headed
```

### 5.4 E2E Critical Flows

Demonstrate the 5 critical user flows:

1. **User Registration Flow**
   - Navigate to register
   - Fill valid data
   - Submit and verify redirect

2. **User Login Flow**
   - Login without MFA
   - Login with MFA

3. **Onboarding Flow**
   - Complete full onboarding
   - Resume interrupted flow

4. **Guest Access Flow**
   - Create guest code
   - Use guest code

5. **Profile Management**
   - Update settings
   - Enable MFA

---

## Demo Section 6: Architecture Highlights (10 min)

### 6.1 Monorepo Structure

```
packages/
├── api/           # Express.js REST API
├── database/      # Drizzle ORM schemas
├── ui/            # React components
├── types/         # Shared TypeScript types
├── utils/         # Common utilities
├── config/        # Configuration
├── e2e/           # Playwright E2E tests
└── sdk/           # Module SDK
```

### 6.2 Security Highlights

| Feature          | Implementation             |
| ---------------- | -------------------------- |
| Password Hashing | bcrypt (cost 10+)          |
| JWT Tokens       | Short-lived access (15min) |
| MFA              | TOTP with backup codes     |
| Guest Isolation  | Limited permissions        |
| Input Validation | Zod on all endpoints       |
| Rate Limiting    | Sensitive endpoints        |

### 6.3 Expert Review Summary

| Expert       | Status | Key Findings                      |
| ------------ | ------ | --------------------------------- |
| Architecture | ✅     | 3NF schema, clean separation      |
| Security     | ✅     | Industry-standard implementations |
| Testing      | ✅     | Coverage targets exceeded         |
| UX           | ✅     | WCAG 2.1 AA compliant             |

---

## Q&A Preparation

Common questions and answers:

**Q: How does persona switching work?**
A: Users can have multiple personas assigned. The active persona determines which modules are accessible. Switching updates the session context.

**Q: What happens if a guest code expires?**
A: Active sessions are terminated, and the code cannot be used for new access. The host is notified.

**Q: How is MFA recovery handled?**
A: Users receive 10 backup codes at setup. Each code is single-use. If all codes are exhausted, account recovery is required.

**Q: What's the token refresh strategy?**
A: Access tokens expire in 15 minutes. Refresh tokens last 7 days and are rotated on each use.

---

## Demo Completion Checklist

- [ ] Database schema demonstrated
- [ ] All API endpoints shown
- [ ] Authentication flows verified
- [ ] MFA setup and login tested
- [ ] Guest access demonstrated
- [ ] UI components walked through
- [ ] Responsive design shown
- [ ] Accessibility features verified
- [ ] Test suite executed
- [ ] E2E flows passed
- [ ] Architecture explained
- [ ] Q&A completed

---

## Handoff to Orchestrator

After demo completion, report:

```markdown
## Sprint 01 Demo Complete

### Demo Status

- All sections demonstrated: [Yes/No]
- Stakeholder feedback: [Summary]
- Issues discovered: [List any]

### Attendees

- [List attendees]

### Action Items

- [Any follow-up items]

### Sign-off

- Demo approved: [Yes/No]
- Ready for production: [Yes/No]
```

---

_Sprint 01 Demo Session - Epic 02 User Profiles & Personas_
_Orchestrator: Claude Web (Opus) | Executor: Claude Code CLI (Sonnet)_
