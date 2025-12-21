# Epic 01, Sprint 01 - Planning Session Execution Prompt

**Copy this entire prompt into a new Claude session to execute the planning phase**

---

## 📋 Session Context

You are conducting a comprehensive sprint planning session for **Epic 01, Sprint 01: Monorepo Setup & Package Extraction**. This is a critical sprint that transforms the Transcript Parser from a monolithic application into a modular, Turborepo-based monorepo with shared packages.

### Your Role

You will embody **7 expert personas** and provide detailed feedback from each domain:

1. 🏗️ **Software Architecture Expert** - Dr. Sarah Chen
2. 🎨 **UX/UI Design Expert** - Marcus Rodriguez
3. ⚡ **Performance Engineering Expert** - Aisha Patel
4. 🔒 **Security Expert** - James Liu
5. ♿ **Accessibility Expert** - Emily Thompson
6. 🧪 **Testing & Quality Expert** - David Kim
7. 📚 **Technical Writing Expert** - Rachel Green

### Session Objectives

1. **Review** the sprint plan and provide expert feedback
2. **Identify** risks, concerns, and gaps
3. **Design** UX flows for developer-facing tools (where applicable)
4. **Create** actionable recommendations
5. **Produce** deliverables (checklists, diagrams, design briefs)

---

## 📁 Reference Materials

Please review the following context before providing feedback:

### Sprint Overview

**Sprint Goal**: Extract shared packages and create Module SDK foundation

**Duration**: 1 week (December 20-27, 2024)

**Story Points**: 28 total
- ✅ **Completed**: 10 points (Stories 1-3: Turborepo setup, Types package, Module SDK)
- ⏳ **Remaining**: 18 points (Stories 4-9: UI, AI Services, Audio, Export, Database, Config packages)

**Current Status**: Day 1 complete (36% done)

### Stories Breakdown

#### ✅ Story 1: Set up Turborepo Workspace (3 points) - COMPLETE
- Turborepo configured with build pipeline
- pnpm workspace created
- Folder structure established (apps/, packages/, modules/)

#### ✅ Story 2: Create Shared Types Package (2 points) - COMPLETE
- `@transcript-parser/types` package created
- All core TypeScript interfaces extracted
- Package builds successfully

#### ✅ Story 3: Create Module SDK Package (5 points) - COMPLETE
- `@transcript-parser/module-sdk` package created
- ModuleDefinition interface complete
- ModuleRegistry implementation working
- Real Estate example module created

#### ⏳ Story 4: Extract UI Components Package (5 points) - TO DO
**Tasks**:
- E01.S01.T11.UIPackage - Create @transcript-parser/ui package structure
- E01.S01.T12.ShadcnMove - Move shadcn/ui components (Button, Card, Dialog, Input, Select)
- E01.S01.T13.CustomMove - Move custom components (TranscriptList, VideoPreview, SpeakerAnalytics)
- E01.S01.T14.ExportDialog - Move ExportDialog component
- E01.S01.T15.UploadVideo - Move UploadVideo component
- E01.S01.T16.TailwindConfig - Configure Tailwind CSS for UI package
- E01.S01.T17.UITest - Test all components render correctly

**Components to Extract**:
- shadcn/ui: Button, Card, Dialog, Input, Select, Tabs, Badge, Avatar, Dropdown, Tooltip
- Custom: TranscriptList (with virtual scrolling), VideoPreview, SpeakerAnalytics, ExportDialog, UploadVideo
- Utils: cn() function, formatTime(), formatBytes()

#### ⏳ Story 5: Extract AI Services Package (5 points) - TO DO
**Tasks**:
- E01.S01.T18.AIPackage - Create @transcript-parser/ai-services package
- E01.S01.T19.GeminiClient - Move geminiClient.ts
- E01.S01.T20.Transcription - Move transcription logic
- E01.S01.T21.SpeakerDetection - Move speakerNameDetection.ts
- E01.S01.T22.UsageTracker - Move usageTracker.ts
- E01.S01.T23.AITests - Write unit tests for AI services

**Services to Extract**:
- Gemini API client wrapper
- Transcription service (video → audio → text)
- Speaker name detection using AI
- Usage tracking and rate limiting

#### ⏳ Story 6: Extract Audio Processing Package (3 points) - TO DO
**Tasks**:
- E01.S01.T24.AudioPackage - Create @transcript-parser/audio-processing package
- E01.S01.T25.BrowserExtractor - Move browser-based audio extractor
- E01.S01.T26.FFmpegExtractor - Move FFmpeg.wasm extractor
- E01.S01.T27.FFmpegDeps - Handle FFmpeg.wasm dependencies
- E01.S01.T28.AudioTests - Write tests for extractors

**Extractors to Extract**:
- Browser-based audio extraction (using Web Audio API)
- FFmpeg.wasm extractor (for unsupported formats)

#### ⏳ Story 7: Extract Export Utilities Package (3 points) - TO DO
**Tasks**:
- E01.S01.T29.ExportPackage - Create @transcript-parser/export package
- E01.S01.T30.TXTModule - Split TXT export into separate module
- E01.S01.T31.SRTModule - Split SRT export into separate module
- E01.S01.T32.VTTModule - Split VTT export into separate module
- E01.S01.T33.CSVModule - Split CSV export into separate module
- E01.S01.T34.JSONModule - Split JSON export into separate module
- E01.S01.T35.ExportTests - Write tests for each format

**Export Formats**:
- TXT (plain text with timestamps)
- SRT (SubRip subtitle format)
- VTT (WebVTT subtitle format)
- CSV (spreadsheet with metadata)
- JSON (full data export)

#### ⏳ Story 8: Create Database Package (3 points) - TO DO
**Tasks**:
- E01.S01.T36.DBPackage - Create @transcript-parser/database package
- E01.S01.T37.Schemas - Move Drizzle schema definitions
- E01.S01.T38.Connection - Move database connection logic
- E01.S01.T39.Queries - Create common query functions
- E01.S01.T40.DrizzleKit - Configure Drizzle kit

**Database Components**:
- Drizzle ORM schemas (users, transcripts, llm_usage)
- Database connection management
- Common CRUD operations
- Migration management

#### ⏳ Story 9: Create Config Package (2 points) - TO DO
**Tasks**:
- E01.S01.T41.ConfigPackage - Create @transcript-parser/config package
- E01.S01.T42.ESLint - Extract shared ESLint config
- E01.S01.T43.TSConfig - Extract base tsconfig.json
- E01.S01.T44.TailwindBase - Extract base Tailwind config

**Shared Configs**:
- ESLint configuration (extends recommended, TypeScript rules)
- Base TypeScript config (strict mode, paths)
- Tailwind CSS base config (theme, plugins)

### Technical Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Drizzle ORM, Neon PostgreSQL
- **AI**: Google Gemini API
- **Audio**: Web Audio API, FFmpeg.wasm
- **Testing**: Jest (unit), Playwright (E2E)

### Architecture Decisions

1. **Package Naming**: All packages use `@transcript-parser/*` scope
2. **Build Tool**: Turbo for orchestration, individual package.json scripts
3. **Testing**: Jest for unit tests, run via Turbo
4. **Documentation**: Each package has its own README with API docs

### Known Risks

1. **Import path complexity** (Medium) - Updating all imports may introduce bugs
2. **Circular dependencies** (Low) - Packages may depend on each other circularly
3. **Module SDK complexity** (Medium) - API must be simple yet extensible

---

## 🎯 Your Tasks

For each expert persona, please provide:

### 1. Initial Assessment (5-10 minutes per expert)
- Review the sprint plan from your domain's perspective
- Identify what's done well
- Identify what needs attention

### 2. Detailed Feedback (10-15 minutes per expert)
- Answer domain-specific questions
- Provide recommendations
- Suggest improvements

### 3. Risk Assessment (5 minutes per expert)
- Identify top 3 risks in your domain
- Suggest mitigation strategies
- Assign risk levels (low/medium/high)

### 4. Create Deliverables (10-15 minutes per expert)
- Checklists for your domain
- Diagrams (described in detail for Figma/Miro)
- Code examples or configuration templates
- Design briefs (for UX expert)

---

## 👥 Expert Personas - Detailed Instructions

### 1. 🏗️ Software Architecture Expert - Dr. Sarah Chen

**Background**: 15 years experience, worked on Google's Bazel, Netflix's monorepo

**Your Focus**:
- Package boundary design
- Dependency management
- Build system optimization
- Scalability concerns

**Questions to Answer**:
1. Are the package boundaries logically sound?
2. Will this scale to 50+ packages in the future?
3. Are we avoiding circular dependencies?
4. Is the Module SDK flexible enough for third-party developers?
5. Should any packages be split further or combined?
6. Is the Turborepo pipeline configuration optimal?

**Deliverables to Create**:
- ✅ Package dependency diagram (describe for Mermaid)
- ✅ Architecture decision record (ADR) for monorepo structure
- ✅ Best practices checklist for package creation
- ✅ Scalability roadmap (how to grow to 50+ packages)

**Save your feedback as**: `expert-feedback/Expert Feedback - Architecture.md` *(already exists, review and enhance if needed)*

---

### 2. 🎨 UX/UI Design Expert - Marcus Rodriguez

**Background**: Lead Product Designer at Figma, 10 years in design systems

**Your Focus**:
- Developer experience (DX)
- Visual design of developer tools
- Information architecture
- Accessibility of developer-facing UIs

**Questions to Answer**:
1. How will developers understand the package structure?
2. What does the ideal "package dashboard" look like for monitoring builds/tests?
3. How do we visualize the dependency graph in a useful way?
4. Is the Module SDK documentation intuitive for third-party developers?
5. What design system tokens should we establish for consistency?

**Deliverables to Create**:
- 📐 Wireframes for Package Dashboard (describe layout, components, interactions)
- 📐 Wireframes for Dependency Graph Visualization
- 📐 Wireframes for Module SDK Documentation Portal
- 🎨 Design system tokens (colors, typography, spacing) in JSON format
- 🎨 User flows: (1) Developer onboarding, (2) Create new module, (3) Check build status
- 🎨 Figma/Make.ai prompts for generating these designs

**Save your feedback as**: `ux-design/Expert Feedback - UX Design.md`

**Save wireframes as**:
- `ux-design/Wireframes - Package Dashboard.md`
- `ux-design/Wireframes - Dependency Graph.md`
- `ux-design/User Flows - Developer Onboarding.md`

**Save design tokens as**: `ux-design/Design System Tokens.json`

---

### 3. ⚡ Performance Engineering Expert - Aisha Patel

**Background**: Principal Engineer at Vercel, expert in build optimization

**Your Focus**:
- Build time optimization
- Caching strategies
- Bundle size reduction
- CI/CD performance

**Questions to Answer**:
1. What's our baseline build time and what's the target?
2. Are we leveraging Turborepo's caching optimally?
3. How do we minimize bundle sizes for each package?
4. What's the optimal CI/CD pipeline strategy?
5. Should we use remote caching (Vercel Remote Cache)?
6. How do we monitor build performance over time?

**Deliverables to Create**:
- 📊 Performance benchmarks (current vs. target)
- 📊 Caching strategy recommendations
- 📊 Bundle size budget per package type
- 📊 CI/CD pipeline optimization plan
- 📊 Build performance monitoring dashboard design

**Save your feedback as**: `expert-feedback/Expert Feedback - Performance.md`

---

### 4. 🔒 Security Expert - James Liu

**Background**: Security Engineer at GitHub, OWASP contributor

**Your Focus**:
- Dependency security
- Supply chain attacks
- Secret management
- Access control

**Questions to Answer**:
1. How do we audit dependencies in the monorepo?
2. Are we protecting against supply chain attacks?
3. Where are secrets stored and how are they managed?
4. What's the access control strategy for publishing packages?
5. How do we ensure third-party modules don't access sensitive data?
6. Should we implement package signing?

**Deliverables to Create**:
- 🔐 Security checklist for package creation
- 🔐 Threat model for Module SDK (third-party code execution)
- 🔐 Secret management guidelines
- 🔐 Dependency audit process
- 🔐 Security scanning integration (Snyk, npm audit)

**Save your feedback as**: `expert-feedback/Expert Feedback - Security.md`

---

### 5. ♿ Accessibility Expert - Emily Thompson

**Background**: A11y consultant, screen reader user, WCAG contributor

**Your Focus**:
- Developer tool accessibility
- Documentation accessibility
- Keyboard navigation
- Screen reader compatibility

**Questions to Answer**:
1. Can the package dashboard be navigated with keyboard only?
2. Is the dependency graph accessible to screen reader users?
3. Are code examples properly formatted for screen readers?
4. Does the documentation meet WCAG AA standards (aiming for AAA)?
5. Are error messages clear and actionable?
6. Is the Module SDK documentation accessible?

**Deliverables to Create**:
- ♿ Accessibility audit checklist for developer tools
- ♿ WCAG compliance report (current state)
- ♿ Remediation recommendations
- ♿ Accessible documentation template
- ♿ Keyboard navigation guide

**Save your feedback as**: `expert-feedback/Expert Feedback - Accessibility.md`

---

### 6. 🧪 Testing & Quality Expert - David Kim

**Background**: QA Lead at Stripe, test automation specialist

**Your Focus**:
- Test strategy for monorepo
- CI/CD integration
- Test coverage targets
- E2E testing in monorepo context

**Questions to Answer**:
1. What's the testing strategy for shared packages?
2. How do we test interdependencies between packages?
3. What's the CI/CD test pipeline architecture?
4. How do we ensure test isolation?
5. What are the coverage targets for each package type?
6. How do we test the Module SDK with example modules?

**Deliverables to Create**:
- 🧪 Test strategy document
- 🧪 CI/CD pipeline recommendations
- 🧪 Coverage targets per package type
- 🧪 Test isolation guidelines
- 🧪 Integration test examples

**Save your feedback as**: `expert-feedback/Expert Feedback - Testing.md`

---

### 7. 📚 Technical Writing Expert - Rachel Green

**Background**: Documentation engineer at Stripe, 8 years in developer docs

**Your Focus**:
- API documentation
- Developer onboarding
- Code examples
- README structure

**Questions to Answer**:
1. Is the Module SDK documentation clear and comprehensive?
2. Are code examples easy to understand and copy-paste ready?
3. What's the developer onboarding flow?
4. Are READMEs consistent across packages?
5. Do we have a documentation style guide?
6. How do we version and maintain docs?

**Deliverables to Create**:
- 📚 Documentation standards and style guide
- 📚 README template for packages
- 📚 Code example library (common use cases)
- 📚 Developer onboarding guide
- 📚 API documentation template

**Save your feedback as**: `expert-feedback/Expert Feedback - Documentation.md`

---

## 📤 Expected Outputs

By the end of this planning session, you should create the following files:

### Expert Feedback Files
- [x] `expert-feedback/Expert Feedback - Architecture.md` (already exists, enhance if needed)
- [ ] `expert-feedback/Expert Feedback - Performance.md`
- [ ] `expert-feedback/Expert Feedback - Security.md`
- [ ] `expert-feedback/Expert Feedback - Accessibility.md`
- [ ] `expert-feedback/Expert Feedback - Testing.md`
- [ ] `expert-feedback/Expert Feedback - Documentation.md`

### UX Design Files
- [x] `ux-design/UX Design Brief - Package Management UI.md` (already exists)
- [ ] `ux-design/Expert Feedback - UX Design.md`
- [ ] `ux-design/Wireframes - Package Dashboard.md`
- [ ] `ux-design/Wireframes - Dependency Graph.md`
- [ ] `ux-design/User Flows - Developer Onboarding.md`
- [ ] `ux-design/Design System Tokens.json`
- [ ] `ux-design/Figma Prompts for Make.ai.md`

### Consolidated Planning Files
- [ ] `Planning Session Report.md` (executive summary)
- [ ] `Risk Register.md` (all identified risks)
- [ ] `Decision Log.md` (all decisions made)
- [ ] `Action Items.md` (prioritized action items)

---

## 📋 Template: Expert Feedback Format

Use this format for each expert feedback document:

```markdown
# Expert Feedback - [Domain]

**Expert**: [Name]
**Domain**: [Expertise Area]
**Date**: December 20, 2024
**Sprint**: Epic 01, Sprint 01

---

## 🎯 Executive Summary

[2-3 sentence summary of your overall assessment]

**Overall Rating**: ✅ APPROVED / ⚠️ APPROVED WITH CONCERNS / ❌ NEEDS REVISION

---

## ✅ Strengths

What's done well in this sprint plan:

1. **[Strength 1]**
   - Details...

2. **[Strength 2]**
   - Details...

---

## ⚠️ Concerns

Areas that need attention:

1. **[Concern 1]** (Priority: High/Medium/Low)
   - **Issue**: [Describe the problem]
   - **Impact**: [What happens if not addressed]
   - **Recommendation**: [How to fix it]

2. **[Concern 2]**
   - ...

---

## 🔍 Detailed Feedback

### [Topic 1]

[Detailed feedback on this topic]

### [Topic 2]

[Detailed feedback on this topic]

---

## 🚨 Risk Assessment

### Risk 1: [Risk Name]
- **Likelihood**: Low / Medium / High
- **Impact**: Low / Medium / High
- **Mitigation**: [Strategy to reduce or eliminate risk]
- **Owner**: [Who should handle this]

### Risk 2: [Risk Name]
- ...

### Risk 3: [Risk Name]
- ...

---

## 📋 Deliverables

### [Deliverable 1 Name]

[Content of deliverable - checklist, diagram description, code example, etc.]

### [Deliverable 2 Name]

[Content...]

---

## ✅ Recommendations

### Must Do (Critical)
- [ ] [Action item 1]
- [ ] [Action item 2]

### Should Do (High Priority)
- [ ] [Action item 3]
- [ ] [Action item 4]

### Could Do (Nice to Have)
- [ ] [Action item 5]

---

## 📚 References

- [Link or reference 1]
- [Link or reference 2]

---

**Next Steps**: [What should happen after this feedback is reviewed]
```

---

## 🚀 How to Execute This Session

### Step 1: Review Context (15 minutes)
Read all reference materials above to understand:
- Sprint goals and scope
- Current progress (Day 1: 36% complete)
- Remaining work (Stories 4-9)
- Technical stack and architecture

### Step 2: Embody Each Expert (60-90 minutes total)
For each of the 7 experts:
1. Introduce yourself (name, background, credentials)
2. Provide initial assessment (strengths & concerns)
3. Answer domain-specific questions
4. Assess risks (top 3 per domain)
5. Create deliverables (checklists, diagrams, templates)
6. Make recommendations (Must Do / Should Do / Could Do)

### Step 3: Create UX Designs (30-45 minutes)
As Marcus Rodriguez (UX Expert):
1. Design Package Dashboard wireframes
2. Design Dependency Graph visualization
3. Create user flows for developer onboarding
4. Define design system tokens
5. Write Figma/Make.ai prompts for generating designs

### Step 4: Consolidate Findings (30 minutes)
Create the consolidated planning files:
1. **Planning Session Report.md** - Executive summary of all feedback
2. **Risk Register.md** - All 21 risks (3 per expert × 7 experts)
3. **Decision Log.md** - All major decisions made
4. **Action Items.md** - Prioritized list of all recommendations

### Step 5: Final Deliverables
Ensure all files are created and properly formatted:
- 7 expert feedback documents
- 6 UX design documents
- 4 consolidated planning documents

---

## ✅ Success Criteria

This planning session is successful when:

- [x] All 7 expert feedback documents created
- [ ] All 6 UX design documents created
- [ ] All 4 consolidated planning documents created
- [ ] Risk register identifies 15-25 risks with mitigations
- [ ] Decision log documents all major decisions
- [ ] Action items are clear, prioritized, and actionable
- [ ] Sprint backlog is updated with new tasks based on feedback
- [ ] Team has confidence to continue implementation

---

## 🎓 Pro Tips

**For You (Claude)**:
- **Be specific**: Don't just say "good job" - provide detailed, actionable feedback
- **Be critical**: Identify real risks and concerns, don't just rubber-stamp the plan
- **Be creative**: Suggest innovative solutions the team might not have considered
- **Be consistent**: Each expert should maintain their persona and expertise throughout
- **Be thorough**: Cover all aspects of their domain, use the questions as a guide

**For the Human Facilitator**:
- **Review all outputs**: Carefully read every expert feedback document
- **Challenge assumptions**: Ask "what if" questions based on the feedback
- **Prioritize ruthlessly**: Not all recommendations can be implemented in this sprint
- **Document decisions**: Write down why you chose one approach over another
- **Update the sprint plan**: Add new tasks to the backlog based on expert recommendations

---

## 📞 Ready to Start?

Begin by embodying **Dr. Sarah Chen**, the Software Architecture Expert, and provide your feedback on the monorepo foundation plan. Then proceed through the remaining 6 experts.

**Good luck! 🚀**

---

## 📝 Notes

- Save all files in Markdown format
- Use clear headings and formatting
- Include code examples where appropriate
- Reference specific tasks using the E01.S01.Txx.Name format
- Be as detailed as possible - this feedback will guide implementation

---

**Session Start Time**: [Record when you begin]
**Expected Duration**: 3-4 hours
**Target Completion**: All 17 deliverables created
