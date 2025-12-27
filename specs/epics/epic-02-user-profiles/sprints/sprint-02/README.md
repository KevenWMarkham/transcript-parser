# Epic 02 Sprint 02: Subscription Management

**Epic**: 02 - User Profiles & Persona System
**Sprint**: 02 - Subscription Management
**Status**: 🔄 IN PROGRESS
**Start Date**: December 27, 2024
**Orchestrator**: Claude Web (Opus)

---

## Sprint Overview

Build the subscription and billing infrastructure using Stripe, enabling module activation/deactivation, usage tracking, and self-service billing management.

---

## Sprint Objectives

| Objective                      | Priority | Sessions |
| ------------------------------ | -------- | -------- |
| Stripe integration & webhooks  | P0       | 01       |
| Subscription plans & pricing   | P0       | 01       |
| Module activation/deactivation | P0       | 02       |
| Usage tracking & metering      | P1       | 02       |
| Billing portal & invoices      | P1       | 03       |
| Email verification flow        | P1       | 03       |
| Testing & validation           | P0       | 04       |

---

## Session Plan

| Session | Focus                               | Duration  | Status     |
| ------- | ----------------------------------- | --------- | ---------- |
| 01      | Stripe Setup & Subscription API     | 3-4 hours | 🔜 Next    |
| 02      | Module Management & Usage Tracking  | 3 hours   | ⏳ Pending |
| 03      | Billing Portal & Email Verification | 3 hours   | ⏳ Pending |
| 04      | Testing & Validation                | 2-3 hours | ⏳ Pending |

---

## Technical Stack

| Component        | Technology                      |
| ---------------- | ------------------------------- |
| Payment Provider | Stripe                          |
| Webhooks         | Stripe Webhooks + Express       |
| Email            | SendGrid / Resend               |
| Database         | PostgreSQL (Drizzle ORM)        |
| Caching          | Redis (rate limiting, sessions) |

---

## Database Tables (New)

| Table               | Purpose                     |
| ------------------- | --------------------------- |
| subscriptions       | User subscription records   |
| subscription_items  | Line items per subscription |
| invoices            | Invoice history             |
| payment_methods     | Stored payment methods      |
| usage_records       | Metered usage tracking      |
| email_verifications | Email verification tokens   |
| module_activations  | Per-user module status      |

---

## API Endpoints (Planned)

### Subscription Endpoints

- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions` - Get current subscription
- `PATCH /api/subscriptions` - Update subscription
- `DELETE /api/subscriptions` - Cancel subscription
- `POST /api/subscriptions/resume` - Resume cancelled

### Billing Endpoints

- `GET /api/billing/portal` - Get Stripe portal URL
- `GET /api/billing/invoices` - List invoices
- `GET /api/billing/payment-methods` - List payment methods
- `POST /api/billing/payment-methods` - Add payment method

### Module Endpoints

- `GET /api/modules` - List available modules
- `POST /api/modules/:id/activate` - Activate module
- `POST /api/modules/:id/deactivate` - Deactivate module
- `GET /api/modules/usage` - Get usage statistics

### Email Verification

- `POST /api/auth/verify-email/send` - Send verification email
- `POST /api/auth/verify-email/confirm` - Confirm email token

### Webhooks

- `POST /api/webhooks/stripe` - Stripe webhook handler

---

## Pricing Model

### Base Subscription

| Plan       | Price  | Features                             |
| ---------- | ------ | ------------------------------------ |
| Free       | $0/mo  | 1 persona, basic features            |
| Starter    | $10/mo | 3 personas, all core features        |
| Pro        | $25/mo | Unlimited personas, priority support |
| Enterprise | Custom | SSO, SLA, dedicated support          |

### Module Add-ons

| Module           | Price  |
| ---------------- | ------ |
| Guest Module     | $5/mo  |
| Property Manager | $10/mo |
| Student          | $5/mo  |
| Travel           | $5/mo  |
| Business         | $10/mo |

---

## Success Criteria

- [ ] Stripe integration working (test mode)
- [ ] Subscription CRUD operations
- [ ] Module activation/deactivation
- [ ] Usage tracking functional
- [ ] Billing portal accessible
- [ ] Email verification flow
- [ ] Webhook handling robust
- [ ] 80%+ test coverage
- [ ] All expert reviews passed

---

## Dependencies

### From Sprint 01

- User authentication (JWT, MFA)
- User profiles database
- Persona assignments

### External

- Stripe account (test mode)
- SendGrid/Resend account
- Redis instance

---

## Files Location

```
specs/epics/epic-02-user-profiles/sprints/sprint-02/
├── README.md (this file)
├── planning/
│   └── SPRINT_02_PLANNING.md
├── implementation/
│   ├── SESSION_01_STRIPE_SETUP_PROMPT.md
│   ├── SESSION_02_MODULES_USAGE_PROMPT.md
│   ├── SESSION_03_BILLING_EMAIL_PROMPT.md
│   └── SESSION_04_TESTING_PROMPT.md
└── design/
    └── (billing UI designs if needed)
```

---

_Sprint 02 - Epic 02 User Profiles & Personas_
_Orchestrator: Claude Web (Opus) | Executor: Claude Code CLI (Sonnet)_
