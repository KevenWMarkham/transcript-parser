# Session 02: CRUD Services & API Routes

**Epic**: Epic 02 - User Profiles & Persona System
**Sprint**: Sprint 01 - Profile Data Model & UI
**Session**: 02 - CRUD Services & API Routes
**Interface**: Claude Code CLI
**Recommended Model**: Sonnet
**Date Created**: December 23, 2024
**Created By**: Orchestrator (Claude Web - Opus)

---

## Session Objective

Implement service layer and API routes for the user profile system:

1. Run database migration
2. Create service layer for core tables
3. Implement API routes for auth and profile
4. Add Zod validation schemas
5. Write unit tests for services

---

## Pre-Session Status

### From Session 01 (Database Schema):

| Deliverable              | Status    |
| ------------------------ | --------- |
| Database Schema (36 tables) | ✅ Complete |
| Drizzle Migration        | ✅ Generated |
| Design Documentation     | ✅ Created |
| Git Commits              | ✅ Pushed |

### Key Files Created:

- `server/db/schema.ts` - 36 Drizzle ORM tables
- `server/drizzle/0000_high_stone_men.sql` - Migration file
- `docs/plans/2025-12-23-epic-02-user-profiles-schema-design.md` - Design doc

---

## Pre-Session Checklist

```bash
# 1. Pull latest changes
git pull origin master

# 2. Install dependencies
pnpm install

# 3. Verify schema file exists
cat server/db/schema.ts | head -50

# 4. Check Drizzle config
cat server/drizzle.config.ts
```

---

## Task Breakdown

### Phase 1: Database Migration (15 min)

**Objective**: Apply database schema to PostgreSQL

```bash
# Ensure PostgreSQL is running
docker-compose up -d postgres

# Wait for healthy status
docker-compose ps

# Run migration
cd server && npx drizzle-kit push:pg

# OR for production-style migration
cd server && npx drizzle-kit migrate

# Verify tables created
docker exec -it postgres-db psql -U postgres -d transcript_parser -c "\dt"
```

**Expected Tables** (Core subset):
- users
- user_profiles
- user_sessions
- api_keys
- persona_definitions
- persona_assignments

---

### Phase 2: Service Layer Implementation (1.5 hours)

**Objective**: Create service classes for CRUD operations

#### 2.1 User Profile Service

Create: `server/services/userProfile.service.ts`

```typescript
// Key methods to implement:
export class UserProfileService {
  // Create profile for new user
  async createProfile(userId: string, data: CreateProfileInput): Promise<UserProfile>

  // Get profile by user ID
  async getProfileByUserId(userId: string): Promise<UserProfile | null>

  // Update profile
  async updateProfile(userId: string, data: UpdateProfileInput): Promise<UserProfile>

  // Get profile with preferences (JSONB)
  async getPreferences(userId: string): Promise<UserPreferences>

  // Update preferences
  async updatePreferences(userId: string, prefs: Partial<UserPreferences>): Promise<void>
}
```

#### 2.2 Session Service

Create: `server/services/session.service.ts`

```typescript
export class SessionService {
  // Create new session (login)
  async createSession(userId: string, deviceInfo: DeviceInfo): Promise<SessionTokens>

  // Validate access token
  async validateAccessToken(token: string): Promise<TokenPayload | null>

  // Refresh tokens
  async refreshTokens(refreshToken: string): Promise<SessionTokens>

  // Invalidate session (logout)
  async invalidateSession(sessionId: string): Promise<void>

  // Invalidate all sessions for user
  async invalidateAllSessions(userId: string): Promise<void>
}
```

#### 2.3 API Key Service

Create: `server/services/apiKey.service.ts`

```typescript
export class ApiKeyService {
  // Create new API key (encrypted storage)
  async createApiKey(userId: string, data: CreateApiKeyInput): Promise<ApiKeyResponse>

  // Get decrypted API key by service name
  async getApiKey(userId: string, serviceName: string): Promise<string | null>

  // List API keys (masked)
  async listApiKeys(userId: string): Promise<MaskedApiKey[]>

  // Delete API key
  async deleteApiKey(userId: string, keyId: string): Promise<void>

  // Encrypt key (AES-256-GCM)
  private encrypt(plaintext: string): EncryptedData

  // Decrypt key
  private decrypt(encrypted: EncryptedData): string
}
```

#### 2.4 Persona Service

Create: `server/services/persona.service.ts`

```typescript
export class PersonaService {
  // Get all available personas
  async getAvailablePersonas(): Promise<PersonaDefinition[]>

  // Assign persona to user
  async assignPersona(userId: string, personaId: string): Promise<PersonaAssignment>

  // Get user's active personas
  async getUserPersonas(userId: string): Promise<PersonaAssignment[]>

  // Deactivate persona
  async deactivatePersona(userId: string, personaId: string): Promise<void>

  // Check if user has persona
  async hasPersona(userId: string, personaSlug: string): Promise<boolean>
}
```

---

### Phase 3: API Routes Implementation (1 hour)

**Objective**: Create Express routes for authentication and profile management

#### 3.1 Auth Routes

Create/Update: `server/routes/auth.routes.ts`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| POST | `/api/auth/refresh` | Refresh tokens | No |
| GET | `/api/auth/me` | Get current user | Yes |

#### 3.2 Profile Routes

Create: `server/routes/profile.routes.ts`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profile` | Get user profile | Yes |
| PUT | `/api/profile` | Update profile | Yes |
| GET | `/api/profile/preferences` | Get preferences | Yes |
| PATCH | `/api/profile/preferences` | Update preferences | Yes |

#### 3.3 Persona Routes

Create: `server/routes/persona.routes.ts`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/personas` | List available personas | Yes |
| GET | `/api/personas/mine` | Get user's personas | Yes |
| POST | `/api/personas/:id/activate` | Activate persona | Yes |
| POST | `/api/personas/:id/deactivate` | Deactivate persona | Yes |

#### 3.4 API Key Routes

Create: `server/routes/apiKey.routes.ts`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/keys` | List API keys (masked) | Yes |
| POST | `/api/keys` | Create API key | Yes |
| DELETE | `/api/keys/:id` | Delete API key | Yes |

---

### Phase 4: Zod Validation Schemas (30 min)

**Objective**: Create input validation schemas

Create: `server/validators/auth.validator.ts`

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
```

Create: `server/validators/profile.validator.ts`

```typescript
export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  timezone: z.string().optional(),
  language: z.string().length(2).optional(),
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
  }).optional(),
  accessibility: z.object({
    fontSize: z.enum(['small', 'medium', 'large']).optional(),
    highContrast: z.boolean().optional(),
  }).optional(),
});
```

Create: `server/validators/apiKey.validator.ts`

```typescript
export const createApiKeySchema = z.object({
  serviceName: z.string().min(1).max(50),
  encryptedKey: z.string().min(1),
  label: z.string().max(100).optional(),
});
```

---

### Phase 5: Auth Middleware Enhancement (30 min)

**Objective**: Enhance JWT middleware for new session system

Update: `server/middleware/auth.middleware.ts`

```typescript
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const sessionService = new SessionService();
  const payload = await sessionService.validateAccessToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
};
```

---

### Phase 6: Unit Tests (45 min)

**Objective**: Write tests for service layer

Create: `server/services/__tests__/userProfile.service.test.ts`

```typescript
describe('UserProfileService', () => {
  describe('createProfile', () => {
    it('should create a profile for a new user');
    it('should throw if user already has profile');
  });

  describe('updateProfile', () => {
    it('should update profile fields');
    it('should not update non-existent profile');
  });

  describe('getPreferences', () => {
    it('should return default preferences for new profile');
    it('should return saved preferences');
  });
});
```

Create: `server/services/__tests__/session.service.test.ts`

```typescript
describe('SessionService', () => {
  describe('createSession', () => {
    it('should create access and refresh tokens');
    it('should store session in database');
  });

  describe('validateAccessToken', () => {
    it('should validate valid token');
    it('should reject expired token');
    it('should reject revoked session');
  });

  describe('refreshTokens', () => {
    it('should issue new tokens');
    it('should invalidate old refresh token');
  });
});
```

---

## Technical Requirements

### JWT Token Structure

```typescript
// Access Token (short-lived: 15 min)
interface AccessTokenPayload {
  sub: string;       // user ID
  sessionId: string;
  type: 'access';
  iat: number;
  exp: number;
}

// Refresh Token (long-lived: 7 days)
interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
  type: 'refresh';
  iat: number;
  exp: number;
}
```

### Encryption for API Keys

```typescript
// Use AES-256-GCM
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = process.env.ENCRYPTION_KEY; // 32 bytes

interface EncryptedData {
  iv: string;      // Base64
  authTag: string; // Base64
  data: string;    // Base64
}
```

### Environment Variables Required

```bash
# Add to .env
JWT_ACCESS_SECRET=<random-32-chars>
JWT_REFRESH_SECRET=<random-32-chars>
ENCRYPTION_KEY=<random-32-bytes-hex>
```

---

## Acceptance Criteria

Before completing this session, verify:

- [ ] Database migration successful (36 tables created)
- [ ] UserProfileService CRUD operations working
- [ ] SessionService JWT operations working
- [ ] ApiKeyService encryption/decryption working
- [ ] PersonaService assignment working
- [ ] All API routes responding correctly
- [ ] Zod validation rejecting invalid input
- [ ] Unit tests passing (>80% coverage for services)

---

## Commit Guidelines

```bash
# After services complete
git add server/services/
git commit -m "feat(services): implement user profile CRUD services

- UserProfileService for profile management
- SessionService for JWT session handling
- ApiKeyService with AES-256-GCM encryption
- PersonaService for persona assignment"

# After routes complete
git add server/routes/ server/validators/
git commit -m "feat(api): add user profile and auth API routes

- POST/GET auth endpoints
- Profile CRUD routes
- Persona management routes
- Zod validation schemas"

# After tests
git add server/services/__tests__/
git commit -m "test(services): add unit tests for profile services

- UserProfileService tests
- SessionService tests
- ApiKeyService tests"

# Push
git push -u origin <branch-name>
```

---

## Handoff to Orchestrator

Upon completion, report back with:

1. **Migration Status**:
   ```
   Tables Created: XX/36
   Migration: ✅/❌
   ```

2. **Service Implementation**:
   ```
   ✅/❌ UserProfileService
   ✅/❌ SessionService
   ✅/❌ ApiKeyService
   ✅/❌ PersonaService
   ```

3. **API Routes**:
   ```
   ✅/❌ Auth routes (5 endpoints)
   ✅/❌ Profile routes (4 endpoints)
   ✅/❌ Persona routes (4 endpoints)
   ✅/❌ API Key routes (3 endpoints)
   ```

4. **Test Coverage**:
   ```
   Services: XX%
   Routes: XX%
   ```

5. **Issues Found** (if any):
   - List any blockers needing orchestrator decision

---

## Next Session

After this session completes successfully:

**Session 03: Onboarding Flow UI**
- Welcome screen component
- Preferences form
- Accessibility settings
- Module selection screen

---

## Reference Documents

- Schema Design: `docs/plans/2025-12-23-epic-02-user-profiles-schema-design.md`
- Sprint Overview: `specs/epics/epic-02-user-profiles/sprints/sprint-01/Sprint 01 - Overview.md`
- Drizzle Schema: `server/db/schema.ts`

---

**Session Status**: 🟢 Ready for CLI Execution
**Estimated Duration**: 3-4 hours
**Priority**: P0 (Critical path)

---

_Created by Orchestrator - Claude Web (Opus)_
_For execution by Claude Code CLI (Sonnet)_
