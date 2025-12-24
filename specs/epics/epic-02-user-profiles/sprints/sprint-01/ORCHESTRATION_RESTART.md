# Epic 02 Sprint 01 - ORCHESTRATION RESTART

**Date**: December 23, 2024
**Sprint**: User Profiles & Onboarding
**Status**: RESTART - Return to Planning Phase

---

## Executive Summary

Sprint 01 implementation failed validation. The built UI did not match design specifications. We are restarting from the Planning phase with a design-first approach.

**Previous Attempt Issues**:

- Implementation built without validated designs
- Dark mode not properly applied
- Navigation flow broken
- UI styling didn't match design system

**New Approach**: Design → Approve → Implement

---

## Phase 1: Design (Figma Make)

### Step 1.1: Generate Onboarding Designs

**Tool**: Figma Make AI (or equivalent)

**Prompt to Use**:

```
Create a 4-screen USER ONBOARDING FLOW for a persona-based platform.

DESIGN REQUIREMENTS:
- Modern, clean design using shadcn/ui and Tailwind CSS aesthetic
- Glass-morphism cards (frosted glass effect)
- Gradient accent colors
- Both Light Mode and Dark Mode versions
- Mobile responsive (375px) and Desktop (1440px)

BRAND COLORS:
- Primary: #3B82F6 (Blue)
- Secondary: #8B5CF6 (Purple)
- Accent: #10B981 (Green)
- Surface Light: #FFFFFF with 80% opacity
- Surface Dark: #1E293B with 80% opacity
- Text Light: #111827
- Text Dark: #F1F5F9

TYPOGRAPHY:
- Font: Inter
- Headings: Bold, 24-32px
- Body: Regular, 14-16px

---

SCREEN 1: PREFERENCES
Location: First screen of onboarding

LAYOUT:
- Centered container, max-width 672px
- Progress indicator at top (3 steps)
- 4 setting cards stacked vertically
- Action buttons at bottom

PROGRESS INDICATOR:
- 3 circles connected by lines
- Labels: "Preferences" (active), "Personas", "Complete"
- Active step: Blue circle with pulse
- Completed step: Green checkmark
- Future step: Gray circle

CARD 1 - APPEARANCE:
- Glass card with rounded corners (24px)
- Header: Gradient icon (amber→orange) + "Appearance" title
- Content: 3 theme buttons in a row
  - Light (sun icon)
  - Dark (moon icon)
  - System (monitor icon)
- Selected state: Blue border, light blue background, checkmark

CARD 2 - NOTIFICATIONS:
- Header: Gradient icon (blue→indigo) + "Notifications" title
- Content: 3 toggle switches
  - Email notifications
  - Push notifications
  - SMS notifications
- Toggle: 48x28px, blue when ON

CARD 3 - ACCESSIBILITY:
- Header: Gradient icon (emerald→teal) + "Accessibility" title
- Content:
  - Reduce motion toggle
  - High contrast toggle
  - Font size selector (Small/Medium/Large buttons)

CARD 4 - LANGUAGE:
- Header: Gradient icon (purple→pink) + "Language" title
- Content: Dropdown select with 7 languages

BUTTONS:
- "Skip for now" (ghost, gray text)
- "Continue" (gradient blue→purple, arrow icon)

---

SCREEN 2: PERSONA SELECTION
Location: After Preferences

LAYOUT:
- Same centered container
- Progress indicator (step 2 active)
- Grid of 5 persona cards (2 columns desktop, 1 mobile)
- Action buttons at bottom

HEADER:
- Title: "Choose Your Personas"
- Subtitle: "Select up to 3 personas"
- Counter: "0 of 3 selected"

PERSONA CARDS (5 total):

1. REAL ESTATE
   - Icon: House in blue gradient circle
   - Title: "Real Estate"
   - Description: "Property management and investments"
   - Tags: "Listings", "Tenants", "Smart Locks"

2. STUDENT
   - Icon: Graduation cap in amber gradient
   - Title: "Student"
   - Description: "Academic resources and campus life"
   - Tags: "Courses", "Study Groups", "Events"

3. TRAVEL
   - Icon: Plane in emerald gradient
   - Title: "Travel"
   - Description: "Trip planning and experiences"
   - Tags: "Planning", "Explore", "AR Tours"

4. BUSINESS
   - Icon: Briefcase in purple gradient
   - Title: "Business"
   - Description: "Professional tools and networking"
   - Tags: "Analytics", "Teams", "Reports"

5. HEALTH
   - Icon: Heart-pulse in rose gradient
   - Title: "Health & Wellness"
   - Description: "Fitness and nutrition tracking"
   - Tags: "Activity", "Meals", "Wellness"

CARD STATES:
- Default: White/dark card, subtle border
- Hover: Lift effect, shadow increase
- Selected: Blue ring, blue tint, checkmark badge
- Primary: Amber "Primary" badge

BUTTONS:
- "Back" (outline with left arrow)
- "Skip for now" (ghost)
- "Continue" (gradient, disabled until 1 selected)

---

SCREEN 3: PROFILE DASHBOARD
Location: After Personas (completion screen)

LAYOUT:
- Full width dashboard
- Welcome header
- Selected personas display
- Quick actions grid

HEADER:
- "Welcome!" or "You're all set!"
- User's selected personas shown
- "Edit Profile" button

CONTENT:
- Summary of selections made
- Next steps or quick actions
- Option to start using the app

---

SCREEN 4: DARK MODE VERSIONS

Create dark mode version of Screens 1 and 2:
- Background: Gradient slate-900 → slate-800
- Cards: slate-800/80 with subtle border
- Text: slate-100 headings, slate-400 body
- Icons: Keep colorful gradients
- Buttons: Same gradients work on dark

---

DELIVERABLES:
1. Screen 1 - Preferences (Light)
2. Screen 1 - Preferences (Dark)
3. Screen 2 - Personas (Light)
4. Screen 2 - Personas (Dark)
5. Screen 3 - Dashboard (Light)
6. Mobile versions (375px width)
7. Component states (hover, selected, disabled)
```

---

### Step 1.2: Export and Document Designs

After generating in Figma Make:

1. **Export images** of each screen (PNG, 2x resolution)
2. **Save to**: `specs/epics/epic-02-user-profiles/sprints/sprint-01/design/`
3. **Name files**:
   - `01-preferences-light.png`
   - `01-preferences-dark.png`
   - `02-personas-light.png`
   - `02-personas-dark.png`
   - `03-dashboard-light.png`
   - `mobile-preferences.png`
   - `mobile-personas.png`

---

## Phase 2: Design Approval

### Stakeholder Review Checklist

Before proceeding to implementation:

- [ ] All screens generated and exported
- [ ] Light mode approved
- [ ] Dark mode approved
- [ ] Mobile layouts approved
- [ ] Component states documented
- [ ] Any design changes noted

### Questions to Answer

1. Are the 5 personas correct for Sprint 01?
2. Is the glass-morphism style approved?
3. Are the gradient colors correct?
4. Should any screens be simplified?
5. Are the toggle/button styles correct?

---

## Phase 3: Implementation (After Approval Only)

### Session 1: Setup & Preferences Screen

- Create design tokens CSS file
- Build Preferences screen matching Figma exactly
- Implement theme toggle functionality
- Test against Figma design

### Session 2: Persona Selection Screen

- Build persona card component
- Implement selection logic
- Add primary persona feature
- Test against Figma design

### Session 3: Dashboard & Navigation

- Build completion dashboard
- Implement flow navigation
- Add back/skip functionality
- Test complete flow

### Session 4: Dark Mode & Polish

- Implement dark mode CSS
- Test all screens in dark mode
- Polish animations
- Visual QA against Figma

### Session 5: Testing & Demo

- E2E tests for complete flow
- Visual regression tests
- Accessibility testing
- Final demo

---

## File Locations

```
specs/epics/epic-02-user-profiles/sprints/sprint-01/
├── ORCHESTRATION_RESTART.md (this file)
├── design/
│   ├── 01-preferences-light.png (to create)
│   ├── 01-preferences-dark.png (to create)
│   ├── 02-personas-light.png (to create)
│   └── ... more exports
├── planning/
│   ├── ux-design/
│   │   └── FIGMA_PROMPTS.md (full prompts)
│   └── SPRINT_01_PLANNING_RESTART.md
└── implementation/
    └── (session prompts after design approval)
```

---

## Next Action

**For Orchestrator (Human)**:

1. Copy the Figma Make prompt above
2. Generate designs in Figma Make AI
3. Export and save design images
4. Review and approve designs
5. Then return to Claude for implementation sessions

**DO NOT** proceed to implementation until designs are approved.

---

## Success Criteria

Sprint 01 is complete when:

- [ ] Figma designs approved
- [ ] Implementation matches Figma pixel-perfect
- [ ] Light + Dark mode working
- [ ] Navigation flow works (Preferences → Personas → Dashboard)
- [ ] Mobile responsive
- [ ] E2E tests passing
- [ ] Stakeholder demo approved
