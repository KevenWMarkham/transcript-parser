# Sprint 01 - Expert Review Orchestration Prompt

> **Purpose**: This prompt orchestrates a comprehensive expert review process by simulating 7 domain experts providing feedback on the Sprint 01 plan BEFORE implementation begins.

> **When to Use**: At the start of the planning phase, after the Sprint Overview is complete but before any code is written.

> **How to Use**: Copy this entire document and paste it into a Claude conversation. Claude will embody each expert sequentially and produce 7 detailed feedback documents.

---

## ORCHESTRATION PROMPT (COPY BELOW THIS LINE)

---

# Expert Review Session: Epic-02 Sprint 01 - User Authentication & Basic Profiles

I need you to conduct a comprehensive pre-implementation expert review of our Sprint 01 plan for Epic-02 (User Profiles & Persona System). This is a **critical planning exercise** to identify issues BEFORE we write any code.

## Context

**Project**: Transcript Parser → Multi-Module Persona-Driven Platform
**Epic**: Epic-02 - User Profiles & Persona System
**Sprint**: Sprint 01 - User Authentication & Basic Profiles
**Phase**: Planning (Pre-Implementation)

**Sprint Goal**: Enable users to securely register, authenticate, create profiles, and select personas, with foundation for module installation.

## Documents to Review

Please review these planning documents:

1. **Epic Overview**: `specs/epics/epic-02-user-profiles/Epic 02 - User Profiles & Persona System - Overview.md`
2. **Sprint Overview**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/Sprint 01 - Overview.md`
3. **Folder Structure**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/FOLDER_STRUCTURE.md`

## Your Task

You will embody **7 different expert personas**, each providing domain-specific feedback. For each expert:

1. **Read** all three documents above thoroughly
2. **Analyze** the plan from your expert domain perspective
3. **Identify** strengths and concerns
4. **Provide** specific, actionable recommendations
5. **Write** a complete feedback document using the template below

## Expert Domains (Review in Order)

1. **Architecture Expert** - User data model, module system design, package boundaries
2. **UX Design Expert** - Onboarding flow, persona selection, profile UI/UX
3. **Security & Privacy Expert** - Authentication, API keys, data protection, GDPR
4. **Performance Expert** - Response times, caching, lazy loading, bundle optimization
5. **Accessibility Expert** - WCAG AA compliance, keyboard navigation, screen readers
6. **Testing Expert** - Test strategy, coverage targets, E2E scenarios
7. **Documentation Expert** - User guides, API docs, developer documentation

---

## Expert Feedback Template

For each expert, create a document following this exact structure:

```markdown
# Expert Feedback: [Domain]

**Sprint**: Sprint 01 - User Authentication & Basic Profiles
**Epic**: Epic 02 - User Profiles & Persona System
**Expert Role**: [Domain] Expert
**Expert Name**: [Realistic name]
**Date**: [Today's date]
**Review Type**: Pre-Implementation Review

---

## Review Scope

[What specific aspects of the sprint plan are you reviewing from your domain perspective?]

---

## Expert Profile

**Name**: [Expert name]

**Background**:
[2-3 sentences about the expert's background and credentials]

**Relevant Experience**:

- [Experience point 1]
- [Experience point 2]
- [Experience point 3]

**Credentials**:

- [Credential 1]
- [Credential 2]

---

## Strengths of Proposed Approach

[Identify and rate 4-6 strengths using ⭐⭐⭐⭐⭐ rating system]

### [Strength 1 Name]

**Rating**: ⭐⭐⭐⭐⭐ (5/5)

[Detailed explanation of why this is a strength]

### [Strength 2 Name]

**Rating**: ⭐⭐⭐⭐ (4/5)

[Detailed explanation]

[Continue for 4-6 strengths...]

---

## Areas of Concern

[Identify 3-5 concerns or risks using ⚠️ markers]

### ⚠️ [Concern 1 Name]

**Severity**: Critical / High / Medium / Low
**Impact**: [Description of potential impact]

[Detailed explanation of the concern]

**Why This Matters**:
[Business/technical/user impact]

### ⚠️ [Concern 2 Name]

[Continue for 3-5 concerns...]

---

## Recommendations

### Must Do (Critical - P0)

[3-5 recommendations that are absolutely essential]

#### 1. [Recommendation Title]

**Priority**: P0 - Critical
**Estimated Effort**: [Hours/Days]
**Impact if Skipped**: [Consequences]

**Recommendation**:
[Detailed, actionable recommendation]

**Implementation Approach**:
[Specific steps to implement]

**Success Criteria**:

- [How to verify this is done correctly]

[Continue for 3-5 Must Do items...]

---

### Should Do (High Priority - P1)

[3-5 recommendations that are highly important but not blockers]

#### 1. [Recommendation Title]

**Priority**: P1 - High
**Estimated Effort**: [Hours/Days]
**Benefit**: [Why this is valuable]

**Recommendation**:
[Detailed explanation]

[Continue for 3-5 Should Do items...]

---

### Could Do (Nice to Have - P2)

[2-3 recommendations that would improve quality but can be deferred]

#### 1. [Recommendation Title]

**Priority**: P2 - Nice to Have
**Estimated Effort**: [Hours/Days]
**Benefit**: [Why this is valuable]

**Recommendation**:
[Brief explanation]

[Continue for 2-3 Could Do items...]

---

## Approval Status

### Overall Assessment

[2-3 paragraphs summarizing your overall opinion]

### Recommendation

- [ ] **Approved** - Proceed with implementation as planned
- [ ] **Approved with Conditions** - Proceed after addressing Must Do items
- [ ] **Revisions Required** - Significant changes needed before proceeding

**Conditions** (if applicable):

1. [Condition 1]
2. [Condition 2]

### Confidence Level

**Confidence in Success**: [High / Medium / Low]

[Explanation of confidence level]

### Risk Level

**Overall Risk**: [Low / Medium / High / Critical]

**Primary Risks**:

1. [Risk 1]
2. [Risk 2]

---

## Additional Notes

[Any additional observations, suggestions, or context]

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Status**: Expert Review Complete
```

---

## Expert 1: Architecture Expert

**Focus Areas**:

- User data model design (User, UserProfile, PersonaAssignment, etc.)
- Module system architecture
- Package boundaries (`@transcript-parser/user-management`, `persona-system`, etc.)
- Database schema design
- API design (REST endpoints, GraphQL, etc.)
- State management approach
- Authentication flow architecture
- Module installation lifecycle
- Scalability and extensibility

**Key Questions to Address**:

- Is the user data model well-designed and normalized?
- Will the persona system scale to 10+ personas?
- Are package boundaries clear and logical?
- Is the module installation architecture flexible enough?
- Are there any circular dependency risks?
- Is the authentication architecture secure and standard-compliant?

**Save output to**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/planning/expert-feedback/Expert Feedback - Architecture.md`

---

## Expert 2: UX Design Expert

**Focus Areas**:

- Onboarding flow (registration → profile → persona → module)
- Persona selection interface
- Profile management UI
- Module marketplace discovery
- First-time user experience
- User guidance and help
- Visual hierarchy and information architecture
- Responsive design considerations
- User testing strategy
- Design system integration

**Key Questions to Address**:

- Is the onboarding flow intuitive and delightful?
- Will users understand what personas are and how to choose?
- Are there too many steps in the registration flow?
- Is the persona selection visually clear and differentiated?
- What happens if a user gets stuck or confused?
- How do we guide users without overwhelming them?

**Save output to**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/planning/expert-feedback/Expert Feedback - UX Design.md`

---

## Expert 3: Security & Privacy Expert

**Focus Areas**:

- Authentication security (password hashing, session management)
- API key storage and encryption
- User data protection (PII, sensitive data)
- GDPR compliance
- Authorization and access control
- CSRF and XSS protection
- SQL injection prevention
- Session hijacking prevention
- Vulnerability scanning
- Security testing strategy

**Key Questions to Address**:

- Are passwords hashed with a strong algorithm (bcrypt, Argon2)?
- Are API keys encrypted at rest with AES-256 or similar?
- Is session management secure (httpOnly, secure, SameSite cookies)?
- Is there CSRF protection?
- Are we vulnerable to common attacks (OWASP Top 10)?
- Is user data properly protected (encryption at rest/in transit)?
- Do we have a security testing plan?

**Save output to**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/planning/expert-feedback/Expert Feedback - Security & Privacy.md`

---

## Expert 4: Performance Expert

**Focus Areas**:

- Authentication response time (<200ms target)
- Module installation speed (<5s target)
- Persona switching performance (<500ms target)
- Caching strategy (user profiles, persona data)
- Lazy loading (modules, heavy components)
- Bundle size optimization
- Database query optimization
- API response times
- Load testing strategy
- Performance budgets

**Key Questions to Address**:

- Will authentication be fast enough (<200ms)?
- How do we cache user profiles and persona data?
- Will module installation complete in under 5 seconds?
- Are there performance bottlenecks in the onboarding flow?
- How do we handle slow network connections?
- What are our performance budgets for bundle size?

**Save output to**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/planning/expert-feedback/Expert Feedback - Performance.md`

---

## Expert 5: Accessibility Expert

**Focus Areas**:

- WCAG AA compliance (target: 100%)
- Keyboard navigation
- Screen reader support (ARIA labels, roles)
- Color contrast ratios
- Focus management
- Form accessibility (labels, error messages)
- Skip links and landmarks
- Accessible onboarding wizard
- Accessibility testing strategy
- ESLint accessibility plugins

**Key Questions to Address**:

- Is the onboarding flow keyboard navigable?
- Are all form inputs properly labeled?
- Do error messages announce to screen readers?
- Are color contrast ratios sufficient (WCAG AA 4.5:1)?
- Is focus management handled correctly (modals, wizards)?
- Are there skip links for navigation?
- How do we test accessibility thoroughly?

**Save output to**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/planning/expert-feedback/Expert Feedback - Accessibility.md`

---

## Expert 6: Testing Expert

**Focus Areas**:

- Unit testing strategy (90%+ coverage target)
- Integration testing approach
- E2E testing scenarios (registration, login, persona selection)
- Authentication testing (valid/invalid credentials, session)
- Security testing (password validation, API key encryption)
- Accessibility testing (keyboard, screen reader)
- Performance testing (response times, load testing)
- Test automation
- Testing tools and frameworks
- Code coverage targets

**Key Questions to Address**:

- Can we achieve 90%+ test coverage realistically?
- What are the critical E2E scenarios to test?
- How do we test authentication securely?
- How do we test persona selection and module installation?
- What tools should we use (Vitest, Playwright, etc.)?
- How do we test accessibility (axe, jest-axe)?
- What's the test execution time budget?

**Save output to**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/planning/expert-feedback/Expert Feedback - Testing.md`

---

## Expert 7: Documentation Expert

**Focus Areas**:

- User onboarding documentation
- User guides (how to select persona, install module)
- API documentation
- Developer documentation (module SDK integration)
- Package README files
- Inline code comments (JSDoc, TSDoc)
- Architecture decision records
- Security documentation
- Contribution guidelines
- Documentation quality and clarity

**Key Questions to Address**:

- Will users understand how to get started?
- Are persona descriptions clear and helpful?
- Is the API documentation comprehensive?
- Can module developers integrate easily?
- Are package README files complete?
- Is complex logic documented with comments?
- How do we maintain documentation?

**Save output to**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/planning/expert-feedback/Expert Feedback - Documentation.md`

---

## After All 7 Expert Reviews

Once you've completed all 7 expert feedback documents, create two consolidation documents:

### 1. Expert Feedback Summary

**File**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/planning/expert-feedback/EXPERT_FEEDBACK_SUMMARY.md`

**Content**:

- Executive summary of all 7 reviews
- Common themes across experts
- Most critical concerns raised
- Overall approval status
- Next steps

### 2. Priority Action Items

**File**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/planning/expert-feedback/PRIORITY_ACTION_ITEMS.md`

**Content**:

- Consolidated list of all recommendations
- Categorized by priority (Critical / High / Medium / Low)
- Grouped by theme (Architecture, Security, UX, etc.)
- Estimated effort for each item
- Implementation order suggestions

---

## Output Format

For each expert review:

1. **Read** the Sprint 01 and Epic 02 overview documents
2. **Embody** the expert persona with realistic credentials and experience
3. **Analyze** from that expert's domain perspective
4. **Provide** specific, actionable, detailed feedback
5. **Use** the template structure exactly
6. **Rate** strengths with ⭐ ratings (1-5 stars)
7. **Flag** concerns with ⚠️ severity levels
8. **Categorize** recommendations as Must/Should/Could Do
9. **Estimate** effort for each recommendation
10. **Approve** conditionally or unconditionally

---

## Quality Standards

Each expert review should:

- **Be thorough**: 3-5 pages minimum per expert
- **Be specific**: Cite exact user stories, sections, or technical details
- **Be actionable**: Every recommendation should be implementable
- **Be realistic**: Use real-world examples and best practices
- **Be critical**: Don't just praise - find real issues
- **Be constructive**: Suggest solutions, not just problems
- **Be expert-level**: Demonstrate deep domain knowledge

---

## Example Recommendation Format

### Must Do: Implement Password Strength Validation

**Priority**: P0 - Critical
**Estimated Effort**: 4 hours
**Impact if Skipped**: Users will create weak passwords, increasing security breach risk

**Recommendation**:
Implement comprehensive password strength validation that enforces:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No common passwords (use zxcvbn library)

**Implementation Approach**:

1. Install `zxcvbn` library for password strength estimation
2. Create `validatePassword()` utility function in `@transcript-parser/user-management`
3. Add real-time password strength indicator in registration form
4. Display helpful error messages for weak passwords
5. Add unit tests for password validation logic

**Success Criteria**:

- [ ] Password strength indicator shows weak/medium/strong
- [ ] Users cannot register with passwords scoring < 3 on zxcvbn scale
- [ ] Error messages are clear and helpful
- [ ] 100% test coverage for password validation

---

## Ready to Begin?

Please proceed with Expert 1 (Architecture Expert) and work through all 7 experts sequentially. After completing all reviews, create the two consolidation documents.

---

**END OF ORCHESTRATION PROMPT**

---

## Usage Instructions

1. **Copy** everything between "ORCHESTRATION PROMPT (COPY BELOW THIS LINE)" and "END OF ORCHESTRATION PROMPT"
2. **Paste** into a new Claude conversation
3. **Wait** for Claude to complete all 7 expert reviews
4. **Save** each expert review to its designated file path
5. **Review** the EXPERT_FEEDBACK_SUMMARY.md and PRIORITY_ACTION_ITEMS.md
6. **Integrate** findings into the implementation plan

---

## Expected Outputs

After running this orchestration prompt, you should have:

- 7 expert feedback documents (Architecture, UX, Security, Performance, Accessibility, Testing, Documentation)
- 1 expert feedback summary document
- 1 priority action items document
- **Total**: 9 documents
- **Total pages**: 30-50 pages of comprehensive expert feedback

---

## Next Steps After Expert Review

1. **Review** all expert feedback with the team
2. **Prioritize** action items (Must Do items are blockers)
3. **Update** Sprint 01 plan based on feedback
4. **Address** all P0 (Must Do) recommendations before implementation
5. **Schedule** P1 (Should Do) recommendations
6. **Defer** P2 (Could Do) recommendations if needed
7. **Get approval** from stakeholders
8. **Proceed** to FIGMA design phase

---

**Document Version**: 1.0
**Last Updated**: 2025-12-21
**Status**: Ready to Use
