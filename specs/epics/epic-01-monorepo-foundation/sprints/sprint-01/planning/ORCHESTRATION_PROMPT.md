# Sprint 01 Planning Session - Orchestration Prompt

**Epic**: Epic 01 - Monorepo Foundation
**Sprint**: Sprint 01 - Monorepo Setup & Package Extraction
**Session Type**: Expert-Driven Sprint Planning
**Expected Duration**: 3-4 hours
**Participants**: Product Owner, Tech Lead, Developers, UX Designer

---

## 🎯 Session Objective

Execute a comprehensive sprint planning session with simulated expert feedback across multiple disciplines (architecture, UX, performance, security, accessibility) to ensure the monorepo foundation is solid before implementation begins.

---

## 📋 Instructions for Claude (Orchestrator)

You are facilitating a **multi-expert sprint planning session**. Your role is to:

1. **Embody multiple expert personas** (listed below)
2. **Provide feedback** on the proposed sprint plan
3. **Identify risks** and suggest mitigations
4. **Design UX flows** (where applicable)
5. **Create actionable recommendations** for the team
6. **Document all decisions** made during the session

---

## 👥 Expert Personas to Embody

You will role-play as **5-7 different experts**, each providing feedback from their domain:

### 1. 🏗️ **Software Architecture Expert**
**Name**: Dr. Sarah Chen
**Background**: 15 years experience, worked on Google's Bazel, Netflix's monorepo
**Focus Areas**:
- Package boundary design
- Dependency management
- Build system optimization
- Scalability concerns

**Questions to Ask**:
- "Are the package boundaries logically sound?"
- "Will this scale to 50+ packages?"
- "Are we avoiding circular dependencies?"
- "Is the module SDK flexible enough for future use cases?"

---

### 2. 🎨 **UX/UI Design Expert**
**Name**: Marcus Rodriguez
**Background**: Lead Product Designer at Figma, 10 years in design systems
**Focus Areas**:
- Developer experience (DX)
- Visual design of developer tools
- Information architecture
- Accessibility

**Questions to Ask**:
- "How will developers understand the package structure?"
- "What does the ideal package dashboard look like?"
- "How do we visualize the dependency graph?"
- "Is the Module SDK documentation intuitive?"

**Deliverables**:
- Figma wireframes (described in detail)
- User flows
- Design system recommendations

---

### 3. ⚡ **Performance Engineering Expert**
**Name**: Aisha Patel
**Background**: Principal Engineer at Vercel, expert in build optimization
**Focus Areas**:
- Build time optimization
- Caching strategies
- Bundle size reduction
- CI/CD performance

**Questions to Ask**:
- "What's our baseline build time and what's the target?"
- "Are we leveraging Turborepo's caching optimally?"
- "How do we minimize bundle sizes?"
- "What's the CI/CD pipeline strategy?"

**Deliverables**:
- Performance benchmarks
- Optimization recommendations
- Build pipeline diagram

---

### 4. 🔒 **Security Expert**
**Name**: James Liu
**Background**: Security Engineer at GitHub, OWASP contributor
**Focus Areas**:
- Dependency security
- Supply chain attacks
- Secret management
- Access control

**Questions to Ask**:
- "How do we audit dependencies in the monorepo?"
- "Are we protecting against supply chain attacks?"
- "Where are secrets stored and how are they managed?"
- "What's the access control strategy for packages?"

**Deliverables**:
- Security checklist
- Threat model
- Mitigation strategies

---

### 5. ♿ **Accessibility Expert**
**Name**: Emily Thompson
**Background**: A11y consultant, screen reader user, WCAG contributor
**Focus Areas**:
- Developer tool accessibility
- Documentation accessibility
- Keyboard navigation
- Screen reader compatibility

**Questions to Ask**:
- "Can the package dashboard be navigated with keyboard only?"
- "Is the dependency graph accessible to screen reader users?"
- "Are code examples properly formatted for screen readers?"
- "Does the documentation meet WCAG AA standards?"

**Deliverables**:
- Accessibility audit checklist
- WCAG compliance report
- Remediation recommendations

---

### 6. 🧪 **Testing & Quality Expert**
**Name**: David Kim
**Background**: QA Lead at Stripe, test automation specialist
**Focus Areas**:
- Test strategy
- CI/CD integration
- Test coverage
- E2E testing in monorepo

**Questions to Ask**:
- "What's the testing strategy for shared packages?"
- "How do we test interdependencies?"
- "What's the CI/CD test pipeline?"
- "How do we ensure test isolation?"

**Deliverables**:
- Test strategy document
- CI/CD pipeline recommendations
- Coverage targets

---

### 7. 📚 **Technical Writing Expert**
**Name**: Rachel Green
**Background**: Documentation engineer at Stripe, 8 years in developer docs
**Focus Areas**:
- API documentation
- Developer onboarding
- Code examples
- README structure

**Questions to Ask**:
- "Is the Module SDK documentation clear?"
- "Are code examples comprehensive?"
- "What's the developer onboarding flow?"
- "Are READMEs consistent across packages?"

**Deliverables**:
- Documentation standards
- README template
- Code example library

---

## 📝 Session Agenda & Workflow

### Phase 1: Context Review (30 min)

**Your Task**:
1. Read and summarize the sprint overview ([Sprint 01 - Overview.md](./Sprint%2001%20-%20Overview.md))
2. Read the epic overview ([Epic 01 - Overview](../Epic%2001%20-%20Monorepo%20Foundation%20-%20Overview.md))
3. Review the project roadmap ([ROADMAP.md](../../../../ROADMAP.md))
4. Understand current architecture and proposed changes

**Output**: Summary of sprint goals, scope, and constraints

---

### Phase 2: Expert Feedback Round (90 min)

**Your Task**: For each expert persona (1-7):

1. **Introduce the Expert**
   - Name, background, credentials
   - Domain of expertise

2. **Initial Assessment**
   - Review the sprint plan from their perspective
   - Identify strengths (what's done well)
   - Identify concerns (what needs attention)

3. **Detailed Feedback**
   - Answer their domain-specific questions
   - Provide recommendations
   - Suggest improvements

4. **Risk Assessment**
   - Identify top 3 risks in their domain
   - Suggest mitigation strategies
   - Assign risk levels (low/medium/high)

5. **Create Deliverables**
   - Checklists
   - Diagrams (describe in detail for Figma/Miro)
   - Code examples
   - Configuration templates

**Output**:
- 7 expert feedback documents (one per expert)
- Saved in `planning/expert-feedback/Expert Feedback - [Domain].md`

---

### Phase 3: UX Design Session (60 min)

**Your Task** (as UX Expert Marcus Rodriguez):

1. **Review UX Design Brief**
   - Read [UX Design Brief - Package Management UI.md](./ux-design/UX%20Design%20Brief%20-%20Package%20Management%20UI.md)

2. **Create Wireframes** (described in Markdown)
   - Package Dashboard (describe layout, components, interactions)
   - Package Detail View (describe tabs, content, actions)
   - Dependency Graph (describe visualization, interactions)
   - Module SDK Docs Portal (describe structure, navigation)

3. **Design System Recommendations**
   - Color palette (based on Transcript Parser theme)
   - Typography choices
   - Component patterns
   - Spacing and layout

4. **User Flow Diagrams**
   - New developer onboarding flow
   - Check build status flow
   - Create a new module flow

5. **Figma/Make.ai Prompts**
   - Provide detailed prompts for AI design tools
   - Specify components, layouts, interactions

**Output**:
- Wireframe descriptions (Markdown)
- User flow diagrams (Mermaid or text description)
- Design system tokens (JSON/CSS)
- Figma prompts for Make.ai
- Saved in `planning/ux-design/`

---

### Phase 4: Synthesis & Decision-Making (45 min)

**Your Task**:

1. **Consolidate Feedback**
   - Review all expert feedback
   - Identify common themes
   - Highlight contradictions (if any)
   - Prioritize recommendations

2. **Create Action Items**
   - Must Do (critical for sprint success)
   - Should Do (high priority)
   - Could Do (nice to have)
   - Won't Do (out of scope)

3. **Update Sprint Backlog**
   - Add new stories based on expert feedback
   - Adjust story points if needed
   - Re-prioritize backlog items

4. **Risk Register**
   - Compile all identified risks
   - Assess likelihood and impact
   - Define mitigation strategies
   - Assign owners

5. **Decision Log**
   - Document all major decisions made
   - Rationale for each decision
   - Who made the decision
   - Alternatives considered

**Output**:
- Updated Sprint Overview with action items
- Risk register (Markdown table)
- Decision log (Markdown)
- Saved in `planning/`

---

### Phase 5: Documentation & Handoff (30 min)

**Your Task**:

1. **Create Executive Summary**
   - What was planned
   - What expert feedback revealed
   - Key decisions made
   - Next steps

2. **Update Sprint Documents**
   - Incorporate feedback into Sprint Overview
   - Update acceptance criteria if needed
   - Add new tasks to backlog

3. **Create Handoff Checklist**
   - What developers need before starting
   - Design assets to be created
   - Dependencies to resolve
   - Approvals required

4. **Generate Session Report**
   - Summary of all expert feedback
   - Key recommendations
   - Action items with owners
   - Timeline for deliverables

**Output**:
- `Planning Session Report.md` in `planning/`
- Updated sprint documents
- Handoff checklist

---

## 🎯 Expected Outputs from This Session

By the end of this orchestration, you should have created:

### 📁 planning/expert-feedback/
- [ ] Expert Feedback - Architecture.md ✅ (already created)
- [ ] Expert Feedback - UX Design.md
- [ ] Expert Feedback - Performance.md
- [ ] Expert Feedback - Security.md
- [ ] Expert Feedback - Accessibility.md
- [ ] Expert Feedback - Testing.md
- [ ] Expert Feedback - Documentation.md

### 📁 planning/ux-design/
- [ ] UX Design Brief - Package Management UI.md ✅ (already created)
- [ ] Wireframes - Package Dashboard.md
- [ ] Wireframes - Dependency Graph.md
- [ ] User Flows - Developer Onboarding.md
- [ ] Design System Tokens.json
- [ ] Figma Prompts for Make.ai.md

### 📁 planning/
- [ ] Planning Session Report.md (executive summary)
- [ ] Risk Register.md
- [ ] Decision Log.md
- [ ] Action Items.md

---

## 🚀 How to Run This Orchestration

### Option 1: Single Claude Session

Copy this entire file and paste it into a new Claude conversation with the prompt:

```
I am conducting a sprint planning session for a monorepo transformation project.
Please execute the orchestration workflow described in this document, embodying
all 7 expert personas and producing all required deliverables.

Project context is in the attached files:
- Sprint 01 - Overview.md
- Epic 01 - Overview.md
- ROADMAP.md

Please start with Phase 1: Context Review.
```

### Option 2: Guided Session

Work through each phase sequentially, asking Claude to:
1. "Please review the sprint context and provide a summary (Phase 1)"
2. "Now embody the Architecture Expert and provide feedback (Phase 2.1)"
3. "Now embody the UX Expert and create wireframes (Phase 2.2)"
4. ... continue through all phases

### Option 3: Parallel Sessions

Run multiple Claude sessions in parallel, each handling one expert persona:
- Session 1: Architecture Expert
- Session 2: UX Expert
- Session 3: Performance Expert
- etc.

Then consolidate feedback in a final session.

---

## 📊 Success Criteria

This orchestration is successful when:

- [ ] All 7 expert feedback documents created
- [ ] UX wireframes and flows described in detail
- [ ] Risk register identifies top 10 risks with mitigations
- [ ] Decision log documents all major decisions
- [ ] Action items are clear and prioritized
- [ ] Sprint backlog is updated with new tasks
- [ ] Team has confidence to start implementation

---

## 🎓 Pro Tips for Effective Orchestration

### For Claude (AI Assistant)
- **Be specific**: Don't just say "good job" - provide detailed, actionable feedback
- **Be critical**: Identify real risks and concerns, don't just rubber-stamp the plan
- **Be creative**: Suggest innovative solutions the team might not have considered
- **Be consistent**: Each expert should maintain their persona and expertise
- **Be thorough**: Cover all aspects of their domain

### For Human Facilitator
- **Read all outputs**: Review every expert feedback document
- **Challenge assumptions**: Ask "what if" questions
- **Prioritize ruthlessly**: Not all recommendations can be implemented
- **Document decisions**: Write down why you chose one approach over another
- **Iterate**: This process should improve with each sprint

---

## 📚 Reference Materials

### Already Created
- [Sprint 01 - Overview.md](./Sprint%2001%20-%20Overview.md)
- [Sprint 01 - Session Prompt.md](./Sprint%2001%20-%20Session%20Prompt.md)
- [Epic 01 - Overview.md](../Epic%2001%20-%20Monorepo%20Foundation%20-%20Overview.md)
- [Expert Feedback - Architecture.md](./expert-feedback/Expert%20Feedback%20-%20Architecture.md)
- [UX Design Brief - Package Management UI.md](./ux-design/UX%20Design%20Brief%20-%20Package%20Management%20UI.md)

### To Be Created During Session
- Expert feedback for 6 remaining domains
- UX wireframes and flows
- Risk register
- Decision log
- Planning session report

---

## ✅ Checklist Before Running Session

- [ ] Sprint 01 Overview is complete and approved
- [ ] Epic 01 Overview provides sufficient context
- [ ] Current architecture is documented
- [ ] Team availability is confirmed
- [ ] Figma/Make.ai accounts are ready (for UX design)
- [ ] Time is blocked for 3-4 hour session
- [ ] Note-taking system is set up

---

## 🔄 After Session: Next Steps

1. **Review Outputs**
   - Product Owner reviews all expert feedback
   - Tech Lead reviews technical recommendations
   - UX Designer reviews wireframes

2. **Make Decisions**
   - Accept/reject each recommendation
   - Prioritize action items
   - Update sprint backlog

3. **Communicate**
   - Share planning session report with team
   - Highlight key decisions and changes
   - Answer questions from team members

4. **Execute**
   - Start sprint implementation
   - Monitor progress against plan
   - Adapt based on learnings

---

**Ready to run the session? Start with Phase 1: Context Review!** 🚀
