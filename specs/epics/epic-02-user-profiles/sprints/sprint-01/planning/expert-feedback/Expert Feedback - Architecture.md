# Expert Feedback: Architecture

**Sprint**: Sprint 01 - User Authentication & Basic Profiles
**Epic**: Epic 02 - User Profiles & Persona System
**Expert Role**: Software Architecture Expert
**Expert Name**: Dr. Sarah Chen
**Date**: 2025-12-21
**Review Type**: Pre-Implementation Review

---

## Review Scope

I have reviewed the Epic-02 and Sprint 01 planning documents from an architecture perspective, focusing on:

- User data model design (User, UserProfile, PersonaAssignment, PersonaDefinition)
- Module system architecture and extensibility
- Package boundaries for new packages (`@transcript-parser/user-management`, `persona-system`, `module-registry`)
- Database schema design and normalization
- API design patterns
- Authentication flow architecture
- Scalability and future-proofing
- Integration with Epic-01 Module SDK
- State management strategy
- Potential architectural risks

---

## Expert Profile

**Name**: Dr. Sarah Chen

**Background**:
Dr. Chen is a Senior Software Architect with 15 years of experience designing large-scale, multi-tenant SaaS platforms. She has led architecture teams at major tech companies, specializing in modular system design, authentication systems, and plugin architectures. She holds a Ph.D. in Computer Science from MIT with a focus on distributed systems.

**Relevant Experience**:

- Architected authentication and user management for 5M+ user platforms
- Designed plugin/module systems for 3 major SaaS products
- Led migration of monolithic applications to microservices and modular architectures
- Expert in TypeScript, Node.js, React, and database design
- Published papers on modular software architecture patterns

**Credentials**:

- Ph.D. Computer Science, MIT
- AWS Certified Solutions Architect (Professional)
- Author: "Modular Software Architecture Patterns" (O'Reilly, 2023)

---

## Strengths of Proposed Approach

### 1. Clean Package Boundaries

**Rating**: ⭐⭐⭐⭐⭐ (5/5)

The separation into three distinct packages (`user-management`, `persona-system`, `module-registry`) demonstrates excellent separation of concerns. Each package has a clear, single responsibility:

- **user-management**: Authentication, user profiles, session management
- **persona-system**: Persona definitions and selection logic
- **module-registry**: Module metadata and installation lifecycle

This separation will enable:

- Independent testing and deployment
- Clear ownership boundaries for teams
- Easy maintenance and updates
- Potential for future microservices migration

**Why This is Strong**: Following Epic-01's successful package extraction pattern, this maintains consistency and leverages proven architectural decisions.

---

### 2. Well-Designed Data Model Foundation

**Rating**: ⭐⭐⭐⭐ (4/5)

The proposed data model is generally well-structured with appropriate entities:

**Strengths**:

- Separation of `User` (authentication) from `UserProfile` (application data) follows best practices
- `PersonaAssignment` as a join entity enables multi-persona support
- `PersonaDefinition` separation allows for easy addition of new personas
- Use of TypeScript interfaces provides type safety

**Minor Gap** (why not 5/5):

- Missing explicit relationship cardinalities (one-to-many, many-to-many)
- API keys embedded in `UserProfile.apiKeys` object may not scale well (see concerns below)

Overall, this is a solid foundation that can be refined during implementation.

---

### 3. Persona System Flexibility

**Rating**: ⭐⭐⭐⭐⭐ (5/5)

The persona system architecture is excellent:

**Key Strengths**:

- Multi-persona support from the start (critical for power users)
- Persona-specific configurations via `PersonaConfiguration`
- Persona-specific module installation (`installedModules` per persona)
- `isActive` flag enables persona switching without data loss

This design anticipates real-world usage patterns where users may be both a student AND looking for housing (Real Estate), requiring both personas simultaneously.

**Forward-Thinking**: The architecture supports future features like persona recommendations, persona templates, and persona sharing without major refactoring.

---

### 4. Leverages Epic-01 Module SDK

**Rating**: ⭐⭐⭐⭐⭐ (5/5)

Excellent reuse of Epic-01's Module SDK infrastructure:

- Builds on proven `@transcript-parser/module-sdk` foundation
- Module installation integrates with existing package architecture
- Follows established TypeScript and build patterns
- Maintains zero breaking changes commitment from Epic-01

This reduces risk, accelerates development, and ensures consistency across the platform.

---

### 5. Appropriate Sprint Scope

**Rating**: ⭐⭐⭐⭐ (4/5)

The Sprint 01 scope (36 P0 story points) is ambitious but achievable:

**Well-Scoped**:

- Focuses on authentication and basic profile management (core foundation)
- Limits to 2 personas (Real Estate, Student) for Sprint 01
- Defers advanced features (password recovery, email verification) to P2
- Module installation foundation only (not full marketplace)

**Why not 5/5**: 36 P0 points + 11 P1 points (47 total) pushes sprint capacity. Recommend strict prioritization to ensure P0 stories complete.

---

### 6. Security-First Approach

**Rating**: ⭐⭐⭐⭐⭐ (5/5)

Strong security considerations throughout the plan:

- Password hashing explicitly mentioned (bcrypt or Argon2)
- API key encryption at rest
- Session management with httpOnly, secure cookies
- CSRF and XSS protection awareness
- Security expert review included in planning

This proactive security focus is critical for authentication systems and demonstrates architectural maturity.

---

## Areas of Concern

### ⚠️ API Key Storage Architecture

**Severity**: High
**Impact**: Scalability, security, and multi-service support

**Concern**:
The current `UserProfile.apiKeys` design stores API keys as a simple object:

```typescript
apiKeys: {
  gemini?: string // encrypted
}
```

**Problems**:

1. **Not Scalable**: Adding new AI services (OpenAI, Anthropic, Cohere, etc.) requires schema changes
2. **Persona-Specific Keys**: Users may want different API keys per persona (real estate persona uses one Gemini key, student persona uses another)
3. **Key Rotation**: No support for key versioning, rotation, or expiration
4. **Metadata Missing**: No creation date, last used, or validation status
5. **Encryption Strategy**: Unclear where encryption/decryption happens

**Why This Matters**:
Epic-03 (Real Estate), Epic-04 (AI Decision Support), and Epic-09 (Student) will all require AI API keys. This simple structure will become a bottleneck quickly.

---

### ⚠️ Missing Module-to-Persona Relationship

**Severity**: Medium
**Impact**: Module discovery, installation validation, user experience

**Concern**:
The data model shows `ModuleRegistryEntry.compatiblePersonas: string[]` but there's no clear enforcement mechanism or validation logic described.

**Questions**:

- Can users install incompatible modules?
- How do we prevent a "Student" persona from installing a "Real Estate Analysis" module if it's not compatible?
- What happens if a user switches from Real Estate to Student persona - do incompatible modules hide/disable?

**Why This Matters**:
Without clear constraints, users may install irrelevant modules, leading to confusion and poor UX. The architecture should enforce persona-module compatibility at the data and API layer.

---

### ⚠️ Authentication Provider Decision Deferred

**Severity**: High
**Impact**: Timeline, architecture, implementation complexity

**Concern**:
The plan lists "TBD (Passport.js, Auth0, Supabase?)" for authentication without a recommendation or evaluation criteria.

**Risk**:

- **Timeline Impact**: Evaluating auth providers during Sprint 01 consumes valuable time
- **Architecture Lock-in**: Different providers have different architectures (local DB vs. cloud service)
- **Cost**: Auth0 is expensive, Supabase is freemium, Passport.js requires more dev work
- **Integration Complexity**: Each option integrates differently with the data model

**Why This Matters**:
This is a **critical path decision** that affects database design, API structure, and deployment. Delaying this decision risks sprint delays.

---

### ⚠️ Persona Switching State Management Undefined

**Severity**: Medium
**Impact**: User experience, data integrity, performance

**Concern**:
The plan mentions "persona switching" but doesn't define:

- What happens to application state when switching personas?
- Are all React components unmounted and remounted?
- Does switching personas trigger a page reload?
- How do we handle in-progress module operations (e.g., mid-transcript analysis)?

**Example Scenario**:
User is analyzing a real estate transcript in the Real Estate persona, then switches to Student persona. What happens to:

- The in-progress analysis?
- Module state?
- UI state?
- URL routing?

**Why This Matters**:
Without clear state management architecture, persona switching could lead to data loss, confusing UX, or application errors.

---

### ⚠️ Module Installation Lifecycle Not Detailed

**Severity**: Medium
**Impact**: Reliability, error handling, user experience

**Concern**:
The plan mentions "module installation API" but doesn't specify:

- What are the installation steps? (download, validate, configure, activate)
- How do we handle installation failures?
- Can users cancel in-progress installations?
- What happens if a module depends on another module?
- How do we roll back failed installations?

**Why This Matters**:
The Epic-02 Overview promises "<5s module installation time" (target metric). Without a detailed lifecycle architecture, this target may be unrealistic or lead to poor error handling.

---

### ⚠️ Database Choice Impacts All Architecture

**Severity**: Critical
**Impact**: All packages, scalability, deployment, cost

**Concern**:
The plan lists "TBD (Postgres, MongoDB, Supabase?)" without architectural guidance.

**Each Choice Has Major Implications**:

**PostgreSQL** (Relational):

- ✅ Best for structured data (User, UserProfile relationships)
- ✅ ACID compliance, transactions
- ✅ Complex queries and joins
- ❌ Requires separate deployment and management
- ❌ More complex horizontal scaling

**MongoDB** (Document):

- ✅ Flexible schema (good for PersonaConfiguration variations)
- ✅ Easy horizontal scaling
- ✅ Fast reads
- ❌ Weaker for complex relationships
- ❌ No ACID transactions (without replica sets)

**Supabase** (Hosted PostgreSQL + Real-time):

- ✅ PostgreSQL benefits + managed service
- ✅ Built-in authentication (could replace custom auth)
- ✅ Real-time subscriptions (good for module updates)
- ❌ Vendor lock-in
- ❌ Cost scales with usage

**Why This Matters**:
This decision affects the entire data model, API design, and infrastructure. Given the relational nature of User → Profile → Persona → Modules, **PostgreSQL (or Supabase)** is likely the better choice, but this needs explicit decision and rationale.

---

## Recommendations

### Must Do (Critical - P0)

#### 1. Redesign API Key Storage Architecture

**Priority**: P0 - Critical
**Estimated Effort**: 8 hours (design + implementation)
**Impact if Skipped**: Scalability issues, persona-specific keys impossible, poor UX

**Recommendation**:
Create a separate `APIKey` entity instead of embedding in `UserProfile`:

```typescript
interface APIKey {
  id: string
  userId: string
  personaId?: string // Optional: persona-specific key
  service: 'gemini' | 'openai' | 'anthropic' | 'cohere' // Enum
  keyHash: string // Encrypted API key
  keyPreview: string // Last 4 characters for UI display
  isActive: boolean
  createdAt: Date
  lastUsedAt?: Date
  expiresAt?: Date // For key rotation
  validationStatus: 'valid' | 'invalid' | 'not_validated'
  metadata: {
    label?: string // User-defined label: "My work key"
    quotaRemaining?: number // If service provides quota info
  }
}
```

**Implementation Approach**:

1. Create `@transcript-parser/api-keys` package (or add to `user-management`)
2. Add `api_keys` table to database schema
3. Create `APIKeyService` with encrypt/decrypt, validate, rotate methods
4. Update `UserProfile` to remove `apiKeys` object
5. Add API endpoints: GET /api-keys, POST /api-keys, PATCH /api-keys/:id, DELETE /api-keys/:id
6. Update UI to support multiple keys per service and per persona

**Success Criteria**:

- [ ] Users can add multiple API keys for the same service
- [ ] Users can assign API keys to specific personas
- [ ] API keys support validation before saving
- [ ] API keys show last used date and validation status
- [ ] Key rotation is supported (add new key, deprecate old key)

---

#### 2. Make Auth Provider Decision BEFORE Sprint 01

**Priority**: P0 - Critical
**Estimated Effort**: 4 hours (evaluation + decision)
**Impact if Skipped**: Sprint delays, architectural rework, potential cost overruns

**Recommendation**:
Evaluate and choose authentication provider NOW, before Sprint 01 begins.

**Evaluation Criteria**:

| Criterion                | Passport.js        | Auth0    | Supabase | Weight |
| ------------------------ | ------------------ | -------- | -------- | ------ |
| **Cost** (for 10K users) | $0 (dev time only) | ~$500/mo | ~$25/mo  | 20%    |
| **Time to Implement**    | 2-3 weeks          | 1 week   | 1 week   | 30%    |
| **Flexibility**          | High               | Medium   | High     | 15%    |
| **Scalability**          | Manual             | Auto     | Auto     | 15%    |
| **Maintenance Burden**   | High               | Low      | Low      | 10%    |
| **Social Auth Support**  | Manual             | Built-in | Built-in | 10%    |

**Preliminary Recommendation**: **Supabase**

- Built-in PostgreSQL database (solves database TBD)
- Built-in authentication (reduces dev work)
- Real-time features (good for module updates)
- Cost-effective for startup/scale-up phase
- Easy migration path to self-hosted Postgres if needed

**Implementation Approach**:

1. Schedule 2-hour architecture spike THIS WEEK
2. Build POC with Supabase auth (2 hours)
3. Validate against Sprint 01 requirements
4. Make decision and update Sprint plan
5. If Supabase chosen, remove custom `User` table and use Supabase `auth.users`

**Success Criteria**:

- [ ] Decision documented with rationale
- [ ] Sprint 01 plan updated with chosen provider
- [ ] Database schema updated accordingly
- [ ] Cost projection for 1K, 10K, 100K users documented

---

#### 3. Define Module-Persona Compatibility Rules

**Priority**: P0 - Critical
**Estimated Effort**: 4 hours (design + validation logic)
**Impact if Skipped**: Poor UX, user confusion, support burden

**Recommendation**:
Create explicit validation rules for module-persona compatibility and enforce at API layer.

**Design**:

```typescript
// In @transcript-parser/module-registry
interface ModuleRegistryEntry {
  id: string
  name: string
  version: string
  description: string
  compatiblePersonas: PersonaId[] // e.g., ['real-estate', 'student']
  requiredPersonas?: PersonaId[] // Module ONLY works with these personas
  incompatiblePersonas?: PersonaId[] // Module explicitly blocked for these personas
  // ... other fields
}

// Validation Service
class ModuleInstallationValidator {
  canInstallModule(
    module: ModuleRegistryEntry,
    activePersona: PersonaId
  ): {
    allowed: boolean
    reason?: string
  } {
    // Check if module is compatible with active persona
    if (
      module.requiredPersonas &&
      !module.requiredPersonas.includes(activePersona)
    ) {
      return {
        allowed: false,
        reason: `This module requires one of these personas: ${module.requiredPersonas.join(', ')}`,
      }
    }

    if (module.incompatiblePersonas?.includes(activePersona)) {
      return {
        allowed: false,
        reason: `This module is not compatible with the ${activePersona} persona`,
      }
    }

    if (!module.compatiblePersonas.includes(activePersona)) {
      return {
        allowed: false,
        reason: `This module is designed for ${module.compatiblePersonas.join(', ')} personas`,
      }
    }

    return { allowed: true }
  }
}
```

**Implementation Approach**:

1. Add validation to `ModuleRegistryEntry` interface
2. Create `ModuleInstallationValidator` class
3. Add middleware to `POST /modules/install` endpoint
4. Update UI to show compatibility badges on module cards
5. Filter module marketplace by active persona
6. Add unit tests for all validation scenarios

**Success Criteria**:

- [ ] Users cannot install incompatible modules
- [ ] Module marketplace filters by active persona
- [ ] Clear error messages explain why module is incompatible
- [ ] Edge cases handled (switching personas with installed modules)

---

#### 4. Define Persona Switching State Management Architecture

**Priority**: P0 - Critical
**Estimated Effort**: 6 hours (design + implementation)
**Impact if Skipped**: Data loss, poor UX, application errors

**Recommendation**:
Define clear state management strategy for persona switching using React Context + persistence.

**Architecture**:

```typescript
// In @transcript-parser/persona-system
interface PersonaContext {
  activePersona: PersonaAssignment | null
  availablePersonas: PersonaAssignment[]
  switchPersona: (personaId: string) => Promise<void>
  isLoading: boolean
}

// Persona switching flow
async function switchPersona(personaId: string): Promise<void> {
  // 1. Save current module state
  await saveCurrentModuleState()

  // 2. Update active persona in database
  await updateActivePersona(userId, personaId)

  // 3. Clear module-specific state
  clearModuleState()

  // 4. Load new persona configuration
  const newPersona = await loadPersona(personaId)

  // 5. Update React context
  setActivePersona(newPersona)

  // 6. Trigger module reload if needed
  await loadPersonaModules(newPersona)

  // 7. Navigate to appropriate route
  navigate('/dashboard')
}
```

**State Management Strategy**:

- **Global State**: Active persona, available personas (React Context)
- **Persisted State**: Active persona ID (database + localStorage)
- **Module State**: Each module manages its own state, cleared on persona switch
- **UI State**: Reset on persona switch (no cross-persona state leakage)

**Implementation Approach**:

1. Create `PersonaProvider` React context
2. Implement `switchPersona` with state cleanup
3. Add `usePersona()` hook for components
4. Implement state save/restore logic
5. Add loading states and error handling
6. Test persona switching with module state

**Success Criteria**:

- [ ] Persona switching is fast (<500ms target)
- [ ] No data loss during persona switch
- [ ] Module state is properly cleared/restored
- [ ] UI provides clear feedback during switch
- [ ] Edge cases handled (switch during module operation)

---

### Should Do (High Priority - P1)

#### 5. Add Module Installation Lifecycle Architecture

**Priority**: P1 - High
**Estimated Effort**: 4 hours
**Benefit**: Robust error handling, better UX, clear debugging

**Recommendation**:
Define detailed module installation lifecycle with clear states and transitions.

**Lifecycle States**:

```typescript
type ModuleInstallationState =
  | 'pending' // User clicked install
  | 'downloading' // Fetching module assets
  | 'validating' // Checking module integrity
  | 'configuring' // Setting up module config
  | 'activating' // Enabling module
  | 'completed' // Successfully installed
  | 'failed' // Installation failed
  | 'cancelled' // User cancelled

interface ModuleInstallation {
  id: string
  moduleId: string
  userId: string
  personaId: string
  state: ModuleInstallationState
  progress: number // 0-100
  error?: {
    code: string
    message: string
    retryable: boolean
  }
  startedAt: Date
  completedAt?: Date
  estimatedDuration: number // milliseconds
}
```

**Benefits**:

- Clear progress tracking (solves <5s target with progress bar)
- Proper error handling and rollback
- Cancellation support
- Debugging and analytics

---

#### 6. Document Database Choice with Architectural Rationale

**Priority**: P1 - High
**Estimated Effort**: 2 hours
**Benefit**: Clear decision-making, team alignment, future reference

**Recommendation**:
Create an Architecture Decision Record (ADR) for the database choice.

**ADR Template**:

```markdown
# ADR-001: Database Selection for Epic-02

## Status

Accepted

## Context

Epic-02 requires persistent storage for users, profiles, personas, and modules.
We need to choose between PostgreSQL, MongoDB, or Supabase.

## Decision

We will use [CHOSEN DATABASE].

## Rationale

- [Reason 1]
- [Reason 2]
- [Reason 3]

## Consequences

**Positive**:

- [Benefit 1]

**Negative**:

- [Trade-off 1]

## Alternatives Considered

- [Alternative 1]: Rejected because...
```

**Benefits**:

- Documents decision for future team members
- Prevents re-litigating decisions
- Provides learning resource

---

#### 7. Add Database Migration Strategy

**Priority**: P1 - High
**Estimated Effort**: 3 hours
**Benefit**: Zero-downtime deployments, rollback capability, data integrity

**Recommendation**:
Use a proper database migration tool (Prisma Migrate, TypeORM Migrations, or Drizzle).

**Strategy**:

1. All schema changes via migrations (no manual SQL)
2. Migrations version-controlled in git
3. Migrations run automatically in CI/CD
4. Rollback capability for failed migrations
5. Seed data for development and testing

**Tools**:

- **Prisma**: Best TypeScript integration, excellent DX
- **TypeORM**: Good for complex apps, more boilerplate
- **Drizzle**: Lightweight, modern, type-safe

---

### Could Do (Nice to Have - P2)

#### 8. Consider Multi-Tenancy Architecture (Future)

**Priority**: P2 - Nice to Have
**Estimated Effort**: 8 hours (research + design)
**Benefit**: Enables Epic-08 (Collaboration), team/org accounts

**Recommendation**:
While not required for Sprint 01, consider how the data model would support multi-tenancy (teams, organizations) in the future.

**Future Data Model**:

```typescript
interface Organization {
  id: string
  name: string
  plan: 'free' | 'team' | 'enterprise'
  members: OrganizationMember[]
}

interface OrganizationMember {
  userId: string
  organizationId: string
  role: 'owner' | 'admin' | 'member'
  permissions: string[]
}
```

**Design Question**:
Should users belong to organizations, or should organizations own user accounts?

---

#### 9. Add Caching Layer Architecture

**Priority**: P2 - Nice to Have
**Estimated Effort**: 4 hours
**Benefit**: Faster persona switching, reduced database load

**Recommendation**:
Design caching strategy for frequently accessed data (personas, module metadata).

**Strategy**:

- **In-Memory Cache** (Redis): Persona definitions, module registry
- **Browser Cache**: User preferences, active persona
- **CDN Cache**: Static module assets

---

## Approval Status

### Overall Assessment

The Epic-02 Sprint 01 architecture is **fundamentally sound** with excellent package boundaries, a well-structured data model, and appropriate security focus. The decision to build on Epic-01's Module SDK infrastructure is wise and reduces risk.

However, there are **4 critical decisions** that MUST be made before Sprint 01 begins:

1. **Authentication Provider** (Passport.js vs. Auth0 vs. Supabase)
2. **Database** (PostgreSQL vs. MongoDB vs. Supabase)
3. **API Key Storage** (needs redesign)
4. **Persona Switching State Management** (needs definition)

These decisions are interdependent (e.g., Supabase solves both auth and database) and affect the entire sprint timeline.

### Recommendation

- [ ] **Approved with Conditions** - Proceed after addressing Must Do items
- [x] **Approved with Conditions** - Proceed after addressing Must Do items ✅

**Conditions**:

1. ✅ **API Key Storage Redesign** - Create separate APIKey entity (8 hours)
2. ✅ **Auth Provider Decision** - Choose and document provider (4 hours)
3. ✅ **Module-Persona Validation** - Define and implement validation rules (4 hours)
4. ✅ **Persona Switching Architecture** - Define state management strategy (6 hours)

**Total Condition Effort**: ~22 hours (2-3 days)

I **recommend scheduling a 1-day architecture sprint THIS WEEK** to address these conditions before Sprint 01 kickoff. This will prevent mid-sprint delays and architectural rework.

### Confidence Level

**Confidence in Success**: **High** (85%)

**Why High Confidence**:

- ✅ Proven package architecture from Epic-01
- ✅ Clear separation of concerns
- ✅ Security-first mindset
- ✅ Appropriate sprint scope

**Why Not Higher**:

- ⚠️ Critical decisions still TBD (auth, database)
- ⚠️ API key storage needs redesign
- ⚠️ Persona switching state management undefined

**After Addressing Conditions**: Confidence → **95%**

### Risk Level

**Overall Risk**: **Medium**

**Primary Risks**:

1. **Authentication Provider Decision Delay** - High impact, medium probability
2. **API Key Storage Scalability** - High impact, low probability (easy fix)
3. **Persona Switching Complexity** - Medium impact, medium probability
4. **Module-Persona Compatibility Edge Cases** - Low impact, medium probability

**Risk Mitigation**:
All primary risks can be mitigated by addressing the 4 Must Do conditions before Sprint 01.

---

## Additional Notes

### Alignment with Epic-01 Success

Epic-01 achieved zero breaking changes and high quality by:

1. **Comprehensive planning** (what we're doing now ✅)
2. **Expert feedback** (architecture, UX, security, etc. ✅)
3. **Clear package boundaries** (Sprint 01 continues this pattern ✅)
4. **Iterative approach** (focus on P0, defer P2 ✅)

Epic-02 is following the same successful methodology. By addressing the 4 critical conditions, Epic-02 is well-positioned for the same level of success.

### Recommended Next Steps

**Week of 2025-12-21** (BEFORE Sprint 01):

1. **Monday**: Auth provider evaluation and decision (4 hours)
2. **Tuesday**: API key storage redesign (8 hours)
3. **Wednesday**: Module-persona validation + persona switching architecture (10 hours)
4. **Thursday**: Update Sprint 01 plan with decisions, review with team
5. **Friday**: Sprint 01 kickoff with clear architecture

**Dependencies**:

- Security Expert should review auth provider decision
- UX Expert should review persona switching UX implications

### Questions for Team Discussion

1. **Auth Provider**: Are we comfortable with Supabase vendor lock-in, or do we prefer more control with Passport.js?
2. **Database**: Should we use Supabase (managed Postgres) or self-hosted Postgres?
3. **API Keys**: Should API keys be persona-specific or user-global with persona overrides?
4. **Module Installation**: Should users be able to install modules outside their persona scope (with warnings)?
5. **State Management**: Should we use React Context, Redux, or Zustand for persona state?

---

**Document Version**: 1.0
**Last Updated**: 2025-12-21
**Status**: Expert Review Complete - Awaiting Team Response
**Next Review**: After addressing conditions and before Sprint 01 kickoff
