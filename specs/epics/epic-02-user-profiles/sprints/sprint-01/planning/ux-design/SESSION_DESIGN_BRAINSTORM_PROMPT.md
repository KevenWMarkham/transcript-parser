# Design Session: Onboarding Flow UI Brainstorm

## Epic 02 - User Profiles & Personas | Sprint 01 Restart

**Objective**: Brainstorm, design, and generate pixel-perfect Figma mockups for the onboarding flow using Figma Make AI before any implementation begins.

**Session Type**: Design & Planning (NO CODE)
**Tools**: Figma Make AI, Moodboards, Design System
**Output**: Approved design files ready for implementation

---

## Part 1: Design Discovery (30 min)

### 1.1 User Journey Mapping

Map the complete onboarding journey:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │ ──► │ Preferences │ ──► │  Personas   │ ──► │  Dashboard  │
│   /Welcome  │     │   Step 1    │     │   Step 2    │     │  Complete   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
   - Login/Register    - Theme             - Select roles      - Summary
   - Social auth       - Notifications     - Set primary       - Quick actions
   - Guest access      - Accessibility     - Max 3 choices     - Get started
                       - Language
```

### 1.2 Design Questions to Answer

Before generating designs, answer these:

| Question                       | Decision                             |
| ------------------------------ | ------------------------------------ |
| How many onboarding steps?     | 2-3 steps recommended                |
| Skip option available?         | Yes, allow skip with defaults        |
| Progress indicator style?      | Dots, steps, or progress bar?        |
| Card style preference?         | Glass-morphism, flat, or neumorphic? |
| Animation level?               | Subtle, moderate, or rich?           |
| Mobile-first or desktop-first? | Mobile-first responsive              |

### 1.3 Competitive Analysis Reference

Look at these patterns for inspiration:

- **Notion**: Clean, minimal onboarding with workspace setup
- **Linear**: Dark mode first, smooth animations
- **Vercel**: Step-by-step with clear progress
- **Stripe**: Professional, trust-building flow
- **Spotify**: Preference collection for personalization

---

## Part 2: Design System Definition

### 2.1 Color Palette

```css
/* Primary Brand Colors */
--primary-500: #3b82f6; /* Blue - primary actions */
--primary-600: #2563eb; /* Blue - hover states */
--secondary-500: #8b5cf6; /* Purple - accents */
--accent-500: #10b981; /* Green - success/complete */

/* Neutral Colors */
--gray-50: #f9fafb; /* Light backgrounds */
--gray-100: #f3f4f6; /* Card backgrounds (light) */
--gray-200: #e5e7eb; /* Borders (light) */
--gray-400: #9ca3af; /* Muted text */
--gray-600: #4b5563; /* Body text (light) */
--gray-800: #1f2937; /* Headings (light) */
--gray-900: #111827; /* Dark text */

/* Dark Mode */
--slate-800: #1e293b; /* Card backgrounds (dark) */
--slate-900: #0f172a; /* Page background (dark) */
--slate-700: #334155; /* Borders (dark) */
--slate-100: #f1f5f9; /* Headings (dark) */
--slate-400: #94a3b8; /* Body text (dark) */

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #3b82f6, #8b5cf6);
--gradient-amber: linear-gradient(135deg, #f59e0b, #ea580c);
--gradient-emerald: linear-gradient(135deg, #10b981, #14b8a6);
--gradient-purple: linear-gradient(135deg, #8b5cf6, #ec4899);
```

### 2.2 Typography Scale

```css
/* Font Family */
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;

/* Type Scale */
--text-xs: 12px; /* Labels, captions */
--text-sm: 14px; /* Body small */
--text-base: 16px; /* Body default */
--text-lg: 18px; /* Body large */
--text-xl: 20px; /* Subheadings */
--text-2xl: 24px; /* Section headings */
--text-3xl: 30px; /* Page headings */
--text-4xl: 36px; /* Hero headings */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 2.3 Spacing System

```css
/* Base unit: 4px */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

### 2.4 Border Radius

```css
--radius-sm: 6px; /* Buttons, inputs */
--radius-md: 8px; /* Small cards */
--radius-lg: 12px; /* Medium cards */
--radius-xl: 16px; /* Large cards */
--radius-2xl: 24px; /* Feature cards */
--radius-full: 9999px; /* Pills, avatars */
```

### 2.5 Shadows

```css
/* Light Mode Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Glass Effect */
--glass-light: background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.2);

--glass-dark: background: rgba(30, 41, 59, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## Part 3: Figma Make AI Prompts

### 3.1 Screen 1: Preferences Screen (Light Mode)

Copy this prompt into Figma Make AI:

```
Create a PREFERENCES SETTINGS screen for a modern SaaS onboarding flow.

LAYOUT:
- Desktop: 1440x900px, centered content max-width 640px
- Clean white background (#FFFFFF)
- 32px padding on all sides

PROGRESS INDICATOR (top):
- Horizontal stepper with 3 steps
- Step labels: "Preferences", "Personas", "Complete"
- Step 1 active: blue filled circle (#3B82F6) with subtle pulse animation
- Step 2-3: gray outline circles (#E5E7EB)
- Connected by thin gray lines

PAGE HEADER:
- Title: "Set Your Preferences" (24px, bold, #111827)
- Subtitle: "Customize your experience" (16px, #6B7280)
- 24px gap below

SETTINGS CARDS (4 stacked vertically, 16px gap):

CARD 1 - APPEARANCE:
- White card with subtle shadow, 24px border-radius
- 24px padding inside
- Header row: gradient icon (amber→orange in circle) + "Appearance" (18px semibold)
- Content: 3 equal-width buttons in a row
  - "Light" with sun icon
  - "Dark" with moon icon
  - "System" with monitor icon
- Selected button: blue border, light blue background, small checkmark
- Unselected: gray border, white background

CARD 2 - NOTIFICATIONS:
- Same card style as above
- Header: gradient icon (blue→indigo) + "Notifications"
- Content: 3 rows with toggle switches
  - "Email notifications" with toggle
  - "Push notifications" with toggle
  - "SMS alerts" with toggle
- Toggle style: 44x24px, blue when ON (#3B82F6), gray when OFF

CARD 3 - ACCESSIBILITY:
- Header: gradient icon (emerald→teal) + "Accessibility"
- Content:
  - Row 1: "Reduce motion" with toggle
  - Row 2: "High contrast" with toggle
  - Row 3: "Font size" label with 3 buttons (S/M/L)

CARD 4 - LANGUAGE:
- Header: gradient icon (purple→pink) + "Language"
- Content: Dropdown select showing "English (US)"
- Dropdown has chevron-down icon

FOOTER BUTTONS (bottom, 32px from cards):
- Left: "Skip for now" ghost button (gray text)
- Right: "Continue" button (gradient blue→purple, white text, arrow-right icon)

STYLE NOTES:
- Use Inter font family
- All icons from Lucide icon set
- Subtle hover states on interactive elements
- Glass-morphism effect on cards (optional)
```

---

### 3.2 Screen 1: Preferences Screen (Dark Mode)

```
Create the DARK MODE version of the Preferences screen.

CHANGES FROM LIGHT MODE:
- Background: gradient from #0F172A to #1E293B
- Cards: #1E293B with 80% opacity, subtle white border (10% opacity)
- Text headings: #F1F5F9
- Text body: #94A3B8
- Selected button: same blue, but with darker background tint
- Unselected buttons: #334155 background
- Toggle OFF state: #475569
- Dropdown: #1E293B background with #334155 border

Keep all other elements the same:
- Gradient icons stay colorful
- Blue accent color stays the same
- Button gradients stay the same
- Progress indicator styling adapts
```

---

### 3.3 Screen 2: Persona Selection (Light Mode)

```
Create a PERSONA SELECTION screen for choosing user roles.

LAYOUT:
- Desktop: 1440x900px, centered content max-width 800px
- White background
- Same progress indicator (step 2 now active)

PAGE HEADER:
- Title: "Choose Your Personas" (28px, bold, #111827)
- Subtitle: "Select up to 3 that match your needs" (16px, #6B7280)
- Selection counter: "0 of 3 selected" (14px, #9CA3AF)

PERSONA CARDS GRID:
- 2 columns on desktop, 1 on mobile
- 16px gap between cards
- 5 persona cards total

CARD DESIGN (each card):
- White background, 16px border-radius, subtle shadow
- 24px padding
- Left side: 48px circular icon with gradient background
- Right side:
  - Title (18px, semibold)
  - Description (14px, gray)
  - Tags row: 3 small pills with feature names

THE 5 PERSONAS:

1. REAL ESTATE
   - Icon: Home (house icon) in blue gradient circle
   - Title: "Real Estate"
   - Description: "Property management and investments"
   - Tags: "Listings", "Tenants", "Smart Locks"

2. STUDENT
   - Icon: GraduationCap in amber gradient circle
   - Title: "Student"
   - Description: "Academic resources and campus life"
   - Tags: "Courses", "Study Groups", "Events"

3. TRAVEL
   - Icon: Plane in emerald gradient circle
   - Title: "Travel"
   - Description: "Trip planning and experiences"
   - Tags: "Planning", "Explore", "AR Tours"

4. BUSINESS
   - Icon: Briefcase in purple gradient circle
   - Title: "Business"
   - Description: "Professional tools and networking"
   - Tags: "Analytics", "Teams", "Reports"

5. HEALTH & WELLNESS
   - Icon: HeartPulse in rose gradient circle
   - Title: "Health & Wellness"
   - Description: "Fitness and nutrition tracking"
   - Tags: "Activity", "Meals", "Wellness"

CARD STATES:
- Default: white background, gray border
- Hover: slight lift, increased shadow
- Selected: blue ring border (2px), light blue tint, checkmark badge top-right
- Primary selected: amber "Primary" badge

FOOTER BUTTONS:
- Left: "Back" outline button with arrow-left
- Center: "Skip for now" ghost button
- Right: "Continue" gradient button (disabled until 1+ selected)
```

---

### 3.4 Screen 2: Persona Selection (Dark Mode)

```
Create the DARK MODE version of the Persona Selection screen.

CHANGES:
- Background: gradient #0F172A to #1E293B
- Cards: #1E293B background, subtle white border
- Card text: #F1F5F9 for titles, #94A3B8 for descriptions
- Tags: #334155 background, #94A3B8 text
- Selected card: blue ring, slightly lighter card background
- Hover: subtle brightness increase

Keep gradient icons colorful as in light mode.
```

---

### 3.5 Screen 3: Completion Dashboard

```
Create a COMPLETION/WELCOME DASHBOARD screen.

LAYOUT:
- Full width dashboard layout
- Light gray background (#F9FAFB)
- Top navigation bar (optional)

HERO SECTION:
- Centered content
- Celebration icon or confetti animation
- Title: "You're All Set!" (32px, bold)
- Subtitle: "Your SmartHaven experience is ready" (18px, gray)

SELECTED PERSONAS DISPLAY:
- Horizontal row of selected persona cards (compact)
- Shows 1-3 selected personas with icons
- "Edit" link to go back

QUICK ACTIONS GRID:
- 2x2 grid of action cards
- Each card: icon, title, description, arrow
- Actions:
  1. "Explore Dashboard" - View your personalized home
  2. "Complete Profile" - Add photo and details
  3. "Connect Apps" - Integrate your tools
  4. "Invite Team" - Collaborate with others

CTA BUTTON:
- Large "Get Started" button (gradient, centered)
- Or "Go to Dashboard"

FOOTER:
- Help link
- Terms & Privacy links
```

---

### 3.6 Mobile Responsive Versions

```
Create MOBILE versions (375px width) of:

1. PREFERENCES MOBILE:
- Single column layout
- Cards stack vertically, full width
- Smaller padding (16px)
- Progress dots smaller
- Buttons full width, stacked

2. PERSONAS MOBILE:
- Single column card layout
- Cards full width
- Smaller icons (40px)
- Sticky bottom button bar
- Scrollable card area

3. DASHBOARD MOBILE:
- Hero section smaller
- Quick actions in 1 column
- Bottom navigation bar
```

---

### 3.7 Component States

```
Create a COMPONENT STATES reference sheet showing:

BUTTONS:
- Default, Hover, Active, Disabled states
- Primary (gradient), Secondary (outline), Ghost

TOGGLES:
- ON state (blue)
- OFF state (gray)
- Disabled state

CARDS:
- Default, Hover, Selected, Primary states

INPUTS:
- Default, Focus, Error, Disabled

PROGRESS STEPS:
- Complete (green check), Active (blue), Upcoming (gray)

PERSONA CARDS:
- Default, Hover, Selected, Primary designation
```

---

## Part 4: Design Review Checklist

### Before Approval, Verify:

**Visual Consistency**

- [ ] Colors match design system exactly
- [ ] Typography follows scale
- [ ] Spacing is consistent (8px grid)
- [ ] Border radius matches spec
- [ ] Shadows are consistent

**Accessibility**

- [ ] Color contrast passes WCAG AA (4.5:1 for text)
- [ ] Touch targets are 44x44px minimum
- [ ] Focus states are visible
- [ ] Text is readable at all sizes

**Responsiveness**

- [ ] Desktop layout works (1440px)
- [ ] Tablet layout works (768px)
- [ ] Mobile layout works (375px)
- [ ] No horizontal scroll on mobile

**Dark Mode**

- [ ] All screens have dark variants
- [ ] Text remains readable
- [ ] Contrast is maintained
- [ ] Gradients work on dark backgrounds

**Interactions**

- [ ] Hover states defined
- [ ] Selected states clear
- [ ] Disabled states visible
- [ ] Loading states considered

---

## Part 5: Export Instructions

### File Naming Convention

```
specs/epics/epic-02-user-profiles/sprints/sprint-01/design/
├── 01-preferences-light.png
├── 01-preferences-dark.png
├── 01-preferences-mobile.png
├── 02-personas-light.png
├── 02-personas-dark.png
├── 02-personas-mobile.png
├── 03-dashboard-light.png
├── 03-dashboard-dark.png
├── 03-dashboard-mobile.png
├── components-states.png
└── design-tokens.md
```

### Export Settings

- Format: PNG
- Scale: 2x (retina)
- Background: Include
- Trim: No

---

## Part 6: Approval Sign-off

### Stakeholder Approval Required

| Screen      | Light Mode | Dark Mode | Mobile | Approved By | Date |
| ----------- | ---------- | --------- | ------ | ----------- | ---- |
| Preferences | [ ]        | [ ]       | [ ]    |             |      |
| Personas    | [ ]        | [ ]       | [ ]    |             |      |
| Dashboard   | [ ]        | [ ]       | [ ]    |             |      |
| Components  | [ ]        | N/A       | N/A    |             |      |

### Design Change Log

| Date | Screen | Change Description | Requested By |
| ---- | ------ | ------------------ | ------------ |
|      |        |                    |              |

---

## Next Steps After Approval

Once all designs are approved:

1. **Export final PNGs** to the design folder
2. **Create design tokens** CSS file
3. **Notify Orchestrator** that designs are ready
4. **Begin Session 1**: Preferences Screen Implementation

---

## Handoff Template

When designs are complete, report:

```markdown
## Design Session Complete

### Designs Generated

- [ ] Preferences (Light/Dark/Mobile)
- [ ] Personas (Light/Dark/Mobile)
- [ ] Dashboard (Light/Dark/Mobile)
- [ ] Component States

### Files Exported

[List of files in design/ folder]

### Approval Status

- Stakeholder approved: [Yes/No]
- Changes requested: [List if any]

### Ready for Implementation

[Yes/No - blocked until approved]
```

---

_Design Session - Epic 02 Sprint 01 Restart_
_Approach: Design First, Then Implement_
_Tool: Figma Make AI_
