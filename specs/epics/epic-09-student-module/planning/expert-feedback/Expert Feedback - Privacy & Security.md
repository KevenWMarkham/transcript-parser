# Expert Feedback: Privacy & Security

**Expert Profile**: Sarah Thompson, CISSP, CIPP/US
**Specialization**: Application Security, Data Privacy, EdTech Compliance
**Credentials**: Certified Information Systems Security Professional (CISSP), Certified Information Privacy Professional (CIPP/US)
**Experience**: 12 years in security, former CISO at edtech startup, privacy consultant for universities
**Review Date**: December 21, 2024
**Review Scope**: Epic 09 - Student Module (security & privacy)

---

## 📋 Executive Summary

**Overall Assessment**: ⭐⭐⭐ (3/5) - Significant privacy/security gaps, legal compliance unclear

The Student Module handles sensitive student data (lecture transcripts, academic performance, learning disabilities) but lacks explicit security and privacy controls in user stories. Several features (collaboration, AI processing, analytics) introduce privacy risks that must be addressed to comply with FERPA (U.S.), GDPR (EU), and other regulations. Universities will not adopt products that risk student privacy violations.

---

## 🚨 Critical Security & Privacy Risks

### 1. FERPA Compliance Not Addressed (Critical Priority)

**Issue**:
The Family Educational Rights and Privacy Act (FERPA) governs student education records in the U.S.

**What is FERPA**:
- Protects privacy of student education records
- Requires written consent to disclose records to third parties
- Violations = loss of federal funding for universities

**Student Module Data Scope**:
- **Education records**: Lecture transcripts, course info, grades (quiz scores)
- **Personal data**: Name, email, university, major
- **Sensitive data**: Learning disabilities (dyslexia, ADHD), accommodations

**FERPA Requirements**:
1. **Consent**: Can't share student data without written consent
2. **Access control**: Students can view/modify their records
3. **Disclosure log**: Track who accessed student data
4. **Data retention**: Limits on how long data is kept
5. **Third-party agreements**: Vendors (AI providers) must sign agreements

**Current Gaps**:
- ❌ No consent mechanism for data sharing
- ❌ No disclosure logging
- ❌ AI providers (Gemini, OpenAI) not addressed
- ❌ No data retention policy
- ❌ Collaboration feature shares education records (FERPA violation?)

**Legal Risk**: **EXTREME**
Universities cannot use products that violate FERPA. This is a deal-breaker.

**Recommendation**:

1. **FERPA compliance checklist** (Sprint 01):
   ```markdown
   - [ ] Obtain consent before sharing data (collaboration, AI processing)
   - [ ] Implement access controls (students can view/edit/delete their data)
   - [ ] Log all data disclosures (who accessed what, when)
   - [ ] Data retention policy (delete data after X months/years)
   - [ ] Vendor agreements with AI providers (BAA/DPA equivalent for education)
   - [ ] Privacy policy explains data use in plain language
   - [ ] Parents can access data (for students < 18)
   ```

2. **Consent flows**:
   ```
   User: Clicks "Share transcript with study group"
   System: "This will share your education record. Do you consent? [Yes] [No]"
   User: Clicks "Generate AI summary"
   System: "This sends your transcript to Google Gemini. Do you consent? [Yes] [No] [Learn More]"
   ```

3. **Third-party AI compliance**:
   - Google Gemini: Review Terms of Service (do they use data for training?)
   - OpenAI: GPT-4 Enterprise Tier (zero data retention)
   - Anthropic Claude: Commercial agreement (no training on data)
   - Document: Which AI provider, what data shared, retention policy

**Priority**: Critical (blocker for university adoption)

---

### 2. GDPR Compliance for International Students (Critical Priority)

**Issue**:
Aisha persona and other international students may be EU residents → GDPR applies.

**What is GDPR**:
- EU data protection regulation (applies to EU residents, regardless of where service is hosted)
- Strict consent, data minimization, right to be forgotten
- Fines: Up to €20M or 4% of global revenue (whichever is higher)

**GDPR Requirements**:
1. **Explicit consent**: Clear, specific, informed consent (not buried in ToS)
2. **Right to access**: Users can download all their data
3. **Right to erasure** ("right to be forgotten"): Users can delete all data
4. **Data portability**: Users can export data in machine-readable format
5. **Data minimization**: Only collect necessary data
6. **Purpose limitation**: Only use data for stated purpose
7. **Data Protection Officer**: Required for large-scale processing
8. **Data Processing Agreement**: With all vendors (e.g., AI providers)

**Current Gaps**:
- ❌ No consent mechanism (GDPR-compliant)
- ❌ No data export feature
- ❌ No data deletion feature ("right to be forgotten")
- ❌ Analytics track student behavior (GDPR issue if not consented)
- ❌ AI providers may not be GDPR-compliant

**Legal Risk**: **EXTREME**
GDPR fines are severe. Even one complaint can trigger investigation.

**Recommendation**:

1. **GDPR compliance features** (Sprint 01):
   ```markdown
   - [ ] Cookie consent banner (if using analytics)
   - [ ] Explicit consent for AI processing (checkbox, not pre-checked)
   - [ ] Data export: "Download my data" (JSON/CSV)
   - [ ] Data deletion: "Delete my account" (irreversible, 30-day grace period)
   - [ ] Privacy policy (GDPR-compliant, plain language)
   - [ ] Data Processing Agreement with AI vendors
   ```

2. **Privacy-by-design**:
   - Default: Data is private (not shared)
   - Opt-in for analytics (not opt-out)
   - Minimal data collection (don't store what you don't need)

3. **Vendor compliance**:
   - Google Gemini: Check if GDPR-compliant (data residency, DPA)
   - If not, use EU-hosted alternative (e.g., Claude, local models)

**Priority**: Critical (legal requirement for EU students)

---

### 3. Sensitive Student Data Not Adequately Protected (High Priority)

**Issue**:
Jordan persona discloses dyslexia, Aisha discloses language challenges, Sarah may track mental health (study stress).

**Sensitivity**:
- **Disability status**: Protected under ADA (U.S.), similar laws globally
- **Learning accommodations**: Education record (FERPA)
- **Mental health**: Highly sensitive, possible discrimination if disclosed

**Risks**:
1. **Unauthorized access**: Hackers steal disability status → discrimination
2. **Data breach**: Leaked disability data → stigma, harm to students
3. **Employer access**: Future employers see student had dyslexia (illegal, but happens)
4. **University misuse**: University uses data to deny admissions/services

**Current Gaps**:
- ❌ No encryption at rest (database encryption)
- ❌ No encryption in transit (HTTPS, but database connections?)
- ❌ No access controls specified (who can see disability status?)
- ❌ No data classification (what is "sensitive"?)
- ❌ No breach notification plan (GDPR requires 72-hour notification)

**Recommendation**:

1. **Encryption** (must-have, Sprint 01):
   ```
   - At rest: Database encryption (PostgreSQL TDE, or application-level)
   - In transit: HTTPS (TLS 1.3), secure DB connections
   - Backups: Encrypted backups
   ```

2. **Access controls** (Sprint 01):
   ```typescript
   // Disability status is highly sensitive
   const canAccessDisabilityStatus = (user, student) => {
     return user.id === student.id || user.role === 'ADMIN';
   };

   // Transcripts are semi-sensitive
   const canAccessTranscript = (user, transcript) => {
     return transcript.ownerId === user.id
       || transcript.sharedWith.includes(user.id);
   };
   ```

3. **Data classification** (Sprint 01):
   ```
   - Public: Course names, public profiles (if opted-in)
   - Internal: Transcripts, flashcards, quiz scores
   - Confidential: Disability status, accommodations
   - Restricted: Payment info (if applicable)
   ```

4. **Breach response plan** (Sprint 02):
   - Incident response team
   - 72-hour GDPR notification requirement
   - Communication plan (notify affected students)
   - Post-mortem and remediation

**Priority**: High (data breach = catastrophic)

---

### 4. Collaboration Feature Introduces Privacy Risks (High Priority)

**Issue** (Sprint 02, Story 5):
Students can share transcripts with study groups. This is great for learning, dangerous for privacy.

**Risks**:
1. **Unintended disclosure**: Student shares transcript with professor name-calling (embarrassing)
2. **FERPA violation**: Sharing education records without consent
3. **Permanent sharing**: Student shares, then wants to un-share (too late if downloaded)
4. **Misuse**: Transcript shared publicly on social media (goes viral)

**Recommendation**:

1. **Default privacy** (Sprint 02):
   - Default: Private (only owner can see)
   - Sharing requires explicit action (click "Share", choose recipients)
   - Warning: "You're about to share your education record. Continue?"

2. **Granular permissions**:
   ```
   - View only (can read, can't download)
   - View + download (can save locally)
   - View + edit (can annotate)
   ```

3. **Revocable sharing**:
   - Owner can revoke access anytime
   - Shared users lose access immediately
   - (Caveat: Can't un-download if already saved)

4. **Expiring shares**:
   - "Share for 7 days" (auto-expires)
   - "Share until exam" (date-based expiration)
   - Prevents permanent leaks

5. **No public sharing** (Sprint 02):
   - Don't allow "share with anyone who has link"
   - Too risky (link leaks → public)
   - Only share with specific users (email-based)

**Priority**: High (FERPA compliance + student safety)

---

### 5. AI Providers May Violate Privacy (High Priority)

**Issue**:
Sending student transcripts to Google Gemini, OpenAI, etc. May violate FERPA/GDPR if not handled correctly.

**Concerns**:
1. **Data retention**: Does AI provider store transcripts? For how long?
2. **Model training**: Does AI provider use student data to train models? (FERPA violation)
3. **Data residency**: Is data stored in U.S.? EU? (GDPR requires EU data stay in EU)
4. **Subprocessors**: Does AI provider share data with third parties?
5. **Security**: Is AI provider's infrastructure secure?

**Example Problem**:
- Student: "Generate summary" (sends transcript to Gemini)
- Google: Stores transcript for 30 days (default policy)
- Google: Uses data for model improvement (training)
- Result: **FERPA violation** (education record shared without consent, used for non-educational purpose)

**Recommendation**:

1. **Vendor due diligence** (Sprint 01):
   ```markdown
   For each AI provider, document:
   - [ ] Data retention policy (zero retention preferred)
   - [ ] Model training policy (opt-out required)
   - [ ] Data residency (where is data stored?)
   - [ ] Security certifications (SOC 2, ISO 27001)
   - [ ] FERPA/GDPR compliance (BAA/DPA signed?)
   - [ ] Subprocessors (who else has access?)
   ```

2. **Prefer privacy-friendly providers**:
   ```
   Best:
   - Anthropic Claude (commercial tier, no training, zero retention)
   - OpenAI GPT-4 Turbo (enterprise tier, zero retention, no training)
   - Self-hosted models (full control, but expensive)

   Avoid:
   - Free tiers (often use data for training)
   - Providers without clear policies
   ```

3. **Anonymize data before sending** (if possible):
   ```
   Before sending to AI:
   - Remove student name → "Student"
   - Remove professor name → "Instructor"
   - Remove university → "University"
   - Keep content intact

   Result: AI can still summarize, but less PII exposed
   ```

4. **Consent flow**:
   ```
   First use of AI feature:
   "This feature sends your lecture to [AI Provider].
   [Provider] says they [don't use data for training / delete after processing].
   Do you consent? [Yes] [No] [Learn More]"
   ```

**Priority**: High (legal requirement, trust issue)

---

## 💡 Additional Security Recommendations

### 1. Authentication & Authorization (Sprint 01)
**Current**: Not specified in user stories
**Recommendation**:
- OAuth 2.0 / OpenID Connect (e.g., Auth0, Clerk, Supabase Auth)
- Multi-factor authentication (MFA) for sensitive accounts
- Session management (secure cookies, timeout after 30 min inactivity)
- Password requirements (if not using OAuth):
  - Minimum 12 characters
  - No common passwords (use have-i-been-pwned API)
  - Bcrypt hashing (cost factor 12+)

### 2. API Security (Sprint 01)
- Rate limiting (prevent brute force, DoS)
- Input validation (prevent SQL injection, XSS)
- CORS policy (restrict which domains can call API)
- API keys rotation (don't hardcode keys in client)

### 3. Dependency Security (Sprint 01)
- Dependabot / Renovate (auto-update dependencies)
- npm audit (check for known vulnerabilities)
- Snyk / Socket (monitor supply chain attacks)

### 4. Security Headers (Sprint 01)
```
Content-Security-Policy: Prevent XSS
X-Frame-Options: Prevent clickjacking
X-Content-Type-Options: Prevent MIME sniffing
Strict-Transport-Security: Force HTTPS
```

### 5. Logging & Monitoring (Sprint 02)
- Log all authentication attempts (success + failure)
- Log all data access (who viewed what)
- Alert on suspicious activity (multiple failed logins, unusual data access)
- SIEM integration (for enterprise customers)

---

## 📊 Privacy & Security Compliance Checklist

| Requirement | Regulation | Status | Priority |
|-------------|-----------|--------|----------|
| Student consent for data sharing | FERPA | ❌ | Critical |
| Data access controls | FERPA, GDPR | ❌ | Critical |
| Right to be forgotten | GDPR | ❌ | Critical |
| Data export | GDPR | ❌ | Critical |
| Encryption at rest | Best practice | ❌ | High |
| Encryption in transit | Best practice | ✓ (HTTPS) | ✓ |
| AI vendor compliance | FERPA, GDPR | ❌ | High |
| Breach notification plan | GDPR | ❌ | High |
| Access logging | FERPA, GDPR | ❌ | Medium |
| Data retention policy | FERPA, GDPR | ❌ | Medium |
| Cookie consent | GDPR | ❌ | Medium |

---

## 🎯 Priority Action Items

### Critical (Sprint 01, Blockers)
1. **FERPA compliance plan** (consent, access controls, vendor agreements)
2. **GDPR compliance plan** (consent, data export, right to be forgotten)
3. **AI vendor due diligence** (zero retention, no training, GDPR/FERPA)
4. **Encryption at rest** (database, backups)
5. **Privacy policy** (FERPA/GDPR-compliant, plain language)

### High Priority (Sprint 01-02)
6. Data classification (public, internal, confidential, restricted)
7. Access controls (role-based, attribute-based)
8. Collaboration privacy controls (revocable, expiring shares)
9. Breach response plan (incident team, notification process)
10. Security headers & API security (XSS, CSRF, injection prevention)

### Medium Priority (Sprint 02-03)
11. Access logging & monitoring (audit trail)
12. Data retention policy (auto-delete old data)
13. Security testing (penetration test, vulnerability scan)
14. Compliance certifications (SOC 2, ISO 27001)

---

## 🧪 Security Testing Recommendations

### Sprint 01
1. **OWASP Top 10 check**:
   - Injection (SQL, NoSQL, XSS)
   - Broken authentication
   - Sensitive data exposure
   - XML external entities (if using XML)
   - Broken access control
   - Security misconfiguration
   - Cross-site scripting (XSS)
   - Insecure deserialization
   - Using components with known vulnerabilities
   - Insufficient logging & monitoring

2. **Dependency scanning**:
   - npm audit (weekly)
   - Snyk / Socket (CI/CD integration)

### Sprint 02-03
3. **Penetration testing**:
   - Hire external security firm
   - Test authentication, authorization, data access
   - Simulate attacks (SQLi, XSS, CSRF, etc.)

4. **Privacy audit**:
   - Lawyer reviews FERPA/GDPR compliance
   - Privacy engineer reviews data flows
   - Compliance consultant reviews vendor agreements

---

## ✅ Final Assessment

**FERPA Compliance**: 2/10 (critical gaps)
**GDPR Compliance**: 2/10 (critical gaps)
**Data Security**: 4/10 (basic HTTPS, but many gaps)
**Privacy Controls**: 3/10 (sharing feature risky)
**AI Vendor Compliance**: 1/10 (not addressed)

**Overall**: ⭐⭐⭐ (3/5) - **High legal risk, must address before launch**

**Blocker Issues**:
1. No FERPA compliance → Universities won't adopt
2. No GDPR compliance → EU students can't use (legal risk)
3. No AI vendor agreements → Potential FERPA violation

**Recommendation**:
Hire privacy lawyer and security consultant for Sprint 01. Privacy and security cannot be retrofitted—must be foundational. Budget 10-15 story points for compliance work in Sprint 01.

---

**Reviewed by**: Sarah Thompson, CISSP, CIPP/US
**Date**: December 21, 2024
**Next Review**: After Sprint 01 compliance implementation

---

## 📚 Resources

### Regulations
- [FERPA](https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html) - U.S. student privacy law
- [GDPR](https://gdpr.eu/) - EU data protection regulation
- [CCPA](https://oag.ca.gov/privacy/ccpa) - California Consumer Privacy Act (if serving CA students)

### Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Controls](https://www.cisecurity.org/controls)

### Tools
- [Have I Been Pwned](https://haveibeenpwned.com/) - Check if passwords are compromised
- [Security Headers](https://securityheaders.com/) - Test HTTP security headers
- [Observatory by Mozilla](https://observatory.mozilla.org/) - Web security scan
