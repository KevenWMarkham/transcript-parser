# Epic 02 - User Profiles & Persona System

**Status**: Planned
**Priority**: High (Phase 2 - First)
**Dependencies**: Epic 01 (Monorepo Foundation)

---

## Goal

Establish user identity and subscription management before building interaction methods. Users must have profiles and subscriptions before accessing AI capabilities.

---

## Business Value

- Enable user authentication and identification
- Support subscription-based monetization model
- Allow module activation/deactivation per user
- Track usage for billing purposes

---

## Sprint Overview

### Sprint 2.1: Authentication & Profiles

- User registration/login (email, OAuth)
- Profile data model (preferences, settings)
- JWT authentication enhancement
- Session management

### Sprint 2.2: Subscription Management

- Stripe integration
- Module activation/deactivation
- Usage tracking per user
- Billing portal integration

### Sprint 2.3: Onboarding Flow

- Welcome wizard
- Preference collection
- Module recommendation engine
- Profile completion tracking

---

## Technical Scope

### New Packages

- `packages/auth/` - Authentication services
- `packages/billing/` - Stripe integration

### Database Changes

- `users` table
- `profiles` table
- `subscriptions` table
- `usage_tracking` table

### API Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/subscriptions
POST   /api/v1/subscriptions
DELETE /api/v1/subscriptions/:moduleId
```

---

## Success Criteria

- [ ] Users can register and login
- [ ] OAuth support (Google, Apple)
- [ ] Users can manage subscriptions
- [ ] Usage is tracked per user
- [ ] Onboarding completion rate > 80%

---

## Expert Requirements

| Expert       | Focus                                                |
| ------------ | ---------------------------------------------------- |
| Security     | OAuth implementation, JWT security, password hashing |
| Architecture | User data model, subscription patterns               |
| UX           | Onboarding flow, registration friction               |
| Testing      | Auth edge cases, integration tests                   |

---

## Related Documents

- [ROADMAP.md](../../ROADMAP.md)
- [ORCHESTRATION.md](../../ORCHESTRATION.md)
- [NAMING_CONVENTIONS.md](../../NAMING_CONVENTIONS.md)
