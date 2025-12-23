# FIGMA Make AI - Design Prompts for Epic-02 Sprint 01

> **Purpose**: Copy-paste ready prompts for FIGMA Make AI to generate visual designs for the User Profile & Persona System

> **Innovation**: This is a NEW addition to the Epic planning process, enabling visual design BEFORE implementation

---

## How to Use These Prompts

1. **Open FIGMA Make AI** (or your FIGMA AI design tool)
2. **Copy each prompt** below (one at a time)
3. **Paste into FIGMA Make AI**
4. **Review and iterate** on the generated designs
5. **Export designs** for implementation reference
6. **Share with team** for feedback

---

## Design System Context

Before using these prompts, ensure FIGMA Make AI understands our design system:

### Brand Colors

- **Primary**: `#3B82F6` (Blue)
- **Secondary**: `#8B5CF6` (Purple)
- **Accent**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Background**: `#FFFFFF` (White)
- **Surface**: `#F9FAFB` (Light Gray)
- **Text Primary**: `#111827` (Near Black)
- **Text Secondary**: `#6B7280` (Gray)

### Typography

- **Headings**: Inter (Bold 600-700)
- **Body**: Inter (Regular 400)
- **Code/Mono**: JetBrains Mono

### Component Library

- Built on **shadcn/ui** components
- **Tailwind CSS** utility classes
- **Radix UI** primitives

---

## Prompt 1: User Onboarding Flow Visualization

### Context

We need a complete onboarding flow for first-time users, from landing page to first module use.

### FIGMA Make AI Prompt

```
Create a comprehensive user onboarding flow for a multi-module decision intelligence platform.

DESIGN REQUIREMENTS:
- Create 8-10 screens showing the complete onboarding journey
- Modern, clean design using shadcn/ui and Tailwind CSS aesthetic
- Mobile-responsive layouts (show desktop and mobile variants)
- Include micro-interactions and transition indicators

SCREENS TO CREATE:

1. LANDING PAGE
   - Hero section with value proposition
   - "Get Started" CTA button (primary action)
   - "Learn More" button (secondary)
   - Brief feature highlights (3-4 cards)
   - Clean, professional design

2. REGISTRATION SCREEN
   - Email input field
   - Password input field (with strength indicator)
   - Confirm password field
   - Name input field
   - "Create Account" button
   - Link to login page
   - Password requirements tooltip
   - Form validation error states

3. EMAIL VERIFICATION SCREEN (Optional)
   - Success message
   - "Check your email" instruction
   - Resend email button
   - Email illustration/icon

4. WELCOME SCREEN
   - Personalized greeting using user's name
   - Brief platform introduction (2-3 sentences)
   - "Continue" button
   - Progress indicator (step 1 of 4)

5. PROFILE CREATION SCREEN
   - Profile photo upload (optional, with placeholder avatar)
   - Name field (pre-filled from registration)
   - Bio field (optional, multiline)
   - "Continue" button
   - "Skip for now" link
   - Progress indicator (step 2 of 4)

6. PERSONA SELECTION SCREEN (CRITICAL)
   - Header: "Choose Your Path"
   - Subtitle: "Select one or more personas that match your needs"
   - 2 persona cards (Real Estate Professional, Student)
   - Each card shows:
     * Persona name and icon
     * Brief description (2-3 lines)
     * Example use cases (3 bullet points)
     * "Select" button (toggleable)
   - Visual differentiation between personas (colors, icons)
   - "Continue" button (enabled when at least 1 selected)
   - Progress indicator (step 3 of 4)

7. MODULE RECOMMENDATION SCREEN
   - Header: "Recommended Modules"
   - Subtitle: "Based on your selected persona"
   - 2-3 module cards showing:
     * Module name and icon
     * Description
     * "Install" button
   - "Install All" button
   - "Customize" link (to module marketplace)
   - Progress indicator (step 4 of 4)

8. MODULE INSTALLATION SCREEN
   - Installation in progress
   - Progress bar (0-100%)
   - Installation steps list with checkmarks
   - Loading spinner
   - "Preparing your workspace..." message

9. SUCCESS / DASHBOARD SCREEN
   - Welcome message: "You're all set!"
   - Quick tour prompt: "Take a tour" / "Skip tour"
   - Dashboard preview with:
     * User profile widget (top right)
     * Active persona indicator
     * Installed modules list
     * "Add Module" button
   - Navigation sidebar

10. MODULE MARKETPLACE (Bonus)
    - Search bar
    - Filter by persona
    - Module grid (3-4 columns)
    - Each module card shows:
      * Icon and name
      * Description
      * Rating/reviews
      * "Install" button
      * Tags (persona compatibility)

DESIGN STYLE:
- Clean, modern, professional
- Generous white space
- Subtle shadows and borders
- Rounded corners (8px typical)
- Smooth transitions (fade, slide)
- Accessibility-focused (high contrast, clear labels)
- Mobile-first responsive design

COLOR PALETTE:
- Primary: #3B82F6 (Blue)
- Secondary: #8B5CF6 (Purple)
- Accent: #10B981 (Green)
- Background: #FFFFFF
- Surface: #F9FAFB
- Text: #111827

TYPOGRAPHY:
- Headings: Inter Bold (24-32px)
- Body: Inter Regular (14-16px)
- Buttons: Inter Medium (14-16px)

COMPONENTS:
- Use shadcn/ui style components
- Tailwind CSS utility aesthetic
- Radix UI interaction patterns

DELIVERABLES:
- Desktop layouts (1440px width)
- Mobile layouts (375px width)
- Transition/flow indicators
- Component states (hover, focus, active, disabled, error)
- Annotated design with spacing and color codes
```

---

## Prompt 2: Persona Selection Interface (Detailed)

### Context

The persona selection screen is the most critical UX decision point. We need multiple design variations.

### FIGMA Make AI Prompt

```
Create 3 design variations for a PERSONA SELECTION INTERFACE for a multi-module platform.

CONTEXT:
- Users have just registered and created their profile
- They need to select 1+ personas that match their needs
- Each persona unlocks different modules and features
- This is a critical decision point in onboarding

PERSONAS TO DESIGN (2 personas for Sprint 01):

1. REAL ESTATE PROFESSIONAL
   - Icon: House/Building icon
   - Color: Blue (#3B82F6)
   - Description: "Make informed decisions about property buying, selling, and investing"
   - Use Cases:
     * Analyze market trends and property values
     * Compare neighborhoods and locations
     * Review inspection reports and contracts
   - Default Modules: Real Estate Module, Document Analysis, Market Intelligence

2. STUDENT
   - Icon: Graduation cap icon
   - Color: Purple (#8B5CF6)
   - Description: "Navigate academic, career, and financial decisions with confidence"
   - Use Cases:
     * Choose the right courses and majors
     * Evaluate internships and job offers
     * Plan budgets and student housing
   - Default Modules: Student Module, Career Planning, Budget Tracker

DESIGN VARIATION 1: CARD GRID LAYOUT
- 2 large persona cards side-by-side (desktop) or stacked (mobile)
- Each card has:
  * Large icon at top
  * Persona name (24px bold)
  * Description (14px regular)
  * 3 bullet points of use cases
  * "Select" button at bottom (toggles to "Selected" with checkmark)
- Selected state: Border highlight, background tint, checkmark icon
- Cards have hover state (lift effect, subtle shadow)

DESIGN VARIATION 2: HORIZONTAL STEPPER LAYOUT
- Personas displayed as steps in a horizontal flow
- Click each persona to see details in an expanded panel
- Details panel shows:
  * Large persona illustration
  * Extended description
  * List of included modules
  * Testimonial quote from a user
- "Select This Persona" button in panel
- Visual breadcrumb showing which personas are selected

DESIGN VARIATION 3: COMPARISON TABLE LAYOUT
- Side-by-side comparison table
- Columns: Real Estate Professional | Student
- Rows:
  * Icon and name
  * Description
  * Use cases (checkmarks)
  * Included modules (list)
  * "Select" button
- Highlight key differences with visual cues
- Sticky header for table

COMMON ELEMENTS (All Variations):
- Header: "Choose Your Path"
- Subtitle: "Select one or more personas. You can always add more later."
- Multi-select capability (checkboxes or toggle buttons)
- "Continue" button at bottom (disabled until at least 1 selected)
- "Not sure? Take a quiz" link
- Progress indicator showing step 3 of 4
- "Skip for now" option (shows generic dashboard)

INTERACTION STATES:
- Default (unselected)
- Hover (for desktop)
- Focus (keyboard navigation)
- Selected (active state)
- Disabled (if mutual exclusion exists)

ACCESSIBILITY:
- High contrast between personas
- Clear focus indicators
- Keyboard navigable
- Screen reader labels
- ARIA roles and states

RESPONSIVE DESIGN:
- Desktop: Side-by-side layout (1440px)
- Tablet: Single column (768px)
- Mobile: Stacked cards (375px)

COLOR CODING:
- Real Estate: Blue theme (#3B82F6)
- Student: Purple theme (#8B5CF6)
- Selected state: Green accent (#10B981)

DELIVERABLES:
- 3 complete design variations
- Mobile and desktop for each
- All interaction states
- Annotated spacing and measurements
- Recommended variation with rationale
```

---

## Prompt 3: Module Management Dashboard

### Context

After onboarding, users need a dashboard to manage their installed modules and discover new ones.

### FIGMA Make AI Prompt

```
Create a MODULE MANAGEMENT DASHBOARD for a persona-driven platform.

CONTEXT:
- User has completed onboarding and installed at least 1 module
- They can view installed modules, switch personas, and discover new modules
- This is the main "home" screen after login

DASHBOARD LAYOUT:

HEADER (Top Navigation)
- Logo (left)
- Search bar (center) - "Search modules..."
- User profile dropdown (right)
  * Profile photo/avatar
  * User name
  * Dropdown menu: Profile Settings, API Keys, Logout

SIDEBAR (Left, Collapsible)
- Active persona indicator at top
  * Persona icon and name
  * "Switch Persona" button
- Navigation menu:
  * Dashboard (active)
  * My Modules
  * Discover Modules
  * Settings
  * Help & Support
- "Add Module" button at bottom (primary CTA)

MAIN CONTENT AREA:

1. WELCOME BANNER
   - "Welcome back, [Name]!"
   - Active persona: [Persona Name]
   - Quick stats: "3 modules installed, 2 recent activities"

2. INSTALLED MODULES SECTION
   - Header: "Your Modules"
   - Grid of module cards (3-4 columns)
   - Each module card shows:
     * Module icon
     * Module name
     * Last used date
     * "Open" button
     * "..." menu (Configure, Uninstall)
   - Empty state (if no modules): "No modules installed yet. Discover modules →"

3. RECOMMENDED MODULES SECTION
   - Header: "Recommended for You"
   - Subtitle: "Based on your [Persona Name] persona"
   - Horizontal scrollable carousel of module cards
   - Each module card shows:
     * Module icon
     * Module name
     * Brief description (1 line)
     * Star rating
     * "Install" button

4. RECENT ACTIVITY SECTION (Optional)
   - Timeline of recent actions:
     * "Installed Real Estate Module - 2 days ago"
     * "Created new profile - 3 days ago"
   - "View all activity" link

PERSONA SWITCHER MODAL:
- Overlay modal triggered by "Switch Persona" button
- Shows all user's personas
- Each persona shows:
  * Icon and name
  * Number of installed modules
  * "Activate" button
- "Add New Persona" option at bottom

MODULE MARKETPLACE VIEW (Separate Screen):
- Search and filter bar
  * Search input
  * Filter by category dropdown
  * Filter by persona toggle
  * Sort by (Popular, Recent, Rating)
- Module grid (3-4 columns, masonry layout)
- Each module card shows:
  * Large module icon
  * Module name and developer
  * Description (2-3 lines)
  * Tags (persona compatibility, category)
  * Star rating and review count
  * "Install" button (or "Installed" checkmark)
- Pagination or infinite scroll

DESIGN SPECIFICATIONS:

Layout:
- Sidebar: 240px width (collapsed: 64px)
- Main content: Remaining width with max 1200px, centered
- Spacing: 16px grid system

Colors:
- Background: #F9FAFB
- Surface (cards): #FFFFFF
- Primary action: #3B82F6
- Persona badge: Persona-specific color (Blue, Purple, etc.)

Typography:
- Page title: 32px bold
- Section headers: 20px bold
- Card titles: 16px semibold
- Body text: 14px regular

Components:
- Cards with subtle shadow: 0 1px 3px rgba(0,0,0,0.1)
- Rounded corners: 8px
- Buttons: 8px border radius, 12px padding
- Module icons: 48x48px

Interaction States:
- Module card hover: Lift effect, shadow increase
- Button hover: Darken 10%
- Active nav item: Background highlight, left border accent

Responsive:
- Desktop (1440px): Full sidebar + grid layout
- Tablet (768px): Collapsed sidebar, 2-column grid
- Mobile (375px): No sidebar (hamburger menu), 1-column stack

Accessibility:
- Keyboard navigation throughout
- Focus indicators on all interactive elements
- Screen reader labels
- High contrast mode support

DELIVERABLES:
- Dashboard main view (desktop and mobile)
- Module marketplace view (desktop and mobile)
- Persona switcher modal
- Empty states
- All interaction states
- Component specifications
```

---

## Prompt 4: User Profile Settings Screens

### Context

Users need to manage their profile, API keys, preferences, and security settings.

### FIGMA Make AI Prompt

```
Create a comprehensive USER PROFILE SETTINGS interface with multiple settings screens.

CONTEXT:
- Users access settings from the dashboard
- They can edit profile info, manage API keys, configure personas, and set preferences
- Settings must be intuitive and well-organized

SETTINGS NAVIGATION (Left Sidebar):
- Profile
- Security
- API Keys
- Personas
- Preferences
- Notifications (optional)
- Privacy (optional)
- Help & Support

SCREEN 1: PROFILE SETTINGS

Layout:
- Two-column layout (left: form fields, right: preview)

Left Column - Form:
- Profile Photo
  * Current photo thumbnail (or placeholder avatar)
  * "Upload New Photo" button
  * "Remove Photo" link
  * Supported formats: JPG, PNG (max 2MB)

- Personal Information
  * Name (text input)
  * Email (text input, with "verified" badge)
  * Bio (textarea, optional)
  * Character count: "0 / 500"

- Public Profile (Toggle)
  * "Make my profile public" switch
  * Description: "Allow others to see your profile"

- Action Buttons
  * "Save Changes" (primary button)
  * "Cancel" (secondary button)

Right Column - Preview:
- "Profile Preview" header
- Card showing how profile appears to others
- Live preview updates as user types

SCREEN 2: SECURITY SETTINGS

- Change Password Section
  * Current Password (password input)
  * New Password (password input with strength meter)
  * Confirm New Password (password input)
  * Password requirements list (checkmarks)
  * "Update Password" button

- Two-Factor Authentication (Optional)
  * Status: "Not enabled" or "Enabled"
  * "Enable 2FA" button
  * QR code display (when enabling)
  * Backup codes download

- Active Sessions
  * List of active sessions:
    - Device name and browser
    - Location (city, country)
    - Last active timestamp
    - "Sign out" button
  * "Sign out all other sessions" button

SCREEN 3: API KEYS MANAGEMENT (CRITICAL)

- Header: "API Keys"
- Subtitle: "Manage your API keys for accessing AI services"

- API Keys List
  * Service: "Google Gemini API"
    - Status badge: "Active" (green) or "Not configured" (gray)
    - API Key: "•••••••••••••••sk7a2" (masked, show last 4 chars)
    - Added date: "Added on Dec 15, 2025"
    - "Edit" button
    - "Delete" button (with confirmation modal)
  * "Add API Key" button (primary)

- Add/Edit API Key Modal
  * Service dropdown: "Google Gemini", "OpenAI", etc.
  * API Key input (password field)
  * "Validate Key" button (tests key before saving)
  * Validation status: "Valid" (green check) or "Invalid" (red X)
  * "Save" button (disabled until validated)

- Help Section
  * "How to get an API key" link
  * Security notice: "API keys are encrypted and never shared"

SCREEN 4: PERSONA MANAGEMENT

- Active Persona Indicator
  * Current active persona: [Name]
  * "Switch Persona" button

- Your Personas List
  * Card for each persona:
    - Persona icon and name
    - "Active" badge (if current)
    - Number of installed modules
    - "Activate" button
    - "Configure" button
    - "Remove" button (with confirmation)

- Add New Persona
  * "Add Persona" button
  * Opens persona selection modal (similar to onboarding)

SCREEN 5: PREFERENCES

- General Settings
  * Language dropdown: "English (US)"
  * Time zone dropdown
  * Date format: "MM/DD/YYYY" or "DD/MM/YYYY"

- Appearance
  * Theme: "Light", "Dark", "System"
  * Color scheme (optional)

- Module Preferences
  * Auto-update modules: Toggle switch
  * Show module recommendations: Toggle switch

DESIGN SPECIFICATIONS:

Layout:
- Settings sidebar: 200px width
- Content area: Remaining width, max 800px
- Form fields: 100% width, max 500px

Typography:
- Section headers: 24px bold
- Subsection headers: 18px semibold
- Labels: 14px medium
- Help text: 12px regular, gray

Form Elements:
- Input height: 40px
- Border radius: 6px
- Border: 1px solid #D1D5DB
- Focus: Blue border (#3B82F6)
- Error: Red border (#EF4444)

Buttons:
- Primary: Blue background (#3B82F6)
- Secondary: Gray border, white background
- Destructive: Red background (#EF4444)
- Height: 40px
- Padding: 12px 20px

Colors:
- Background: #F9FAFB
- Card background: #FFFFFF
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444

Interaction States:
- Form validation (real-time)
- Success messages (green toast)
- Error messages (red toast)
- Loading states (spinner)

Responsive:
- Desktop: Side-by-side layout
- Mobile: Stacked, full-width forms

Accessibility:
- All form fields have labels
- Error messages announce to screen readers
- Keyboard navigation support
- High contrast mode

DELIVERABLES:
- All 5 settings screens (desktop and mobile)
- API key modal
- Persona selection modal
- All form states (default, hover, focus, error, success, disabled)
- Toast notifications
- Confirmation modals
```

---

## Prompt 5: Complete User Journey Wireframes

### Context

High-fidelity wireframes showing the complete user journey from landing to daily use.

### FIGMA Make AI Prompt

```
Create a COMPLETE USER JOURNEY WIREFRAME SET showing a first-time user's experience from discovery to daily use.

USER JOURNEY STAGES:

STAGE 1: DISCOVERY (Pre-Registration)
- Landing page
- Features page (optional)
- Pricing page (optional)

STAGE 2: REGISTRATION & ONBOARDING
- Registration form
- Email verification (optional)
- Welcome screen
- Profile creation
- Persona selection (CRITICAL)
- Module recommendation
- Module installation progress
- Success screen

STAGE 3: FIRST USE
- Dashboard (first time, with onboarding tips)
- Module interface (Real Estate or Student)
- Contextual help overlays

STAGE 4: DAILY USE
- Dashboard (returning user)
- Module switching
- Profile management
- Module marketplace

WIREFRAME SPECIFICATIONS:

Fidelity Level: HIGH-FIDELITY
- Include actual content (not lorem ipsum)
- Show real UI components (buttons, inputs, cards)
- Include visual design (colors, shadows, icons)
- Show interaction states

Annotations:
- User actions (arrows, numbered steps)
- User thoughts/emotions (thought bubbles)
- Pain points (red flags)
- Delights (green stars)
- Interaction notes (hover, click, etc.)

Flow Indicators:
- Arrows showing navigation flow
- Decision points (if/then branches)
- Success and error paths
- Back/cancel paths

Responsive Views:
- Show key screens in both desktop and mobile
- Highlight responsive behavior changes

JOURNEY MAP OVERLAY:
- Timeline showing progression
- Emotional curve (frustration → delight)
- Touch points (landing, registration, first module use, etc.)
- Duration estimates (5 min, 10 min, etc.)

DELIVERABLES:
- Complete journey wireframe (single artboard or flow)
- Annotated with user actions and emotions
- Desktop and mobile key screens
- Journey map overlay
- Handoff notes for developers
```

---

## Prompt 6: Responsive Layout Variations

### Context

Ensure all designs work perfectly across desktop, tablet, and mobile.

### FIGMA Make AI Prompt

```
Create RESPONSIVE LAYOUT VARIATIONS for the key screens of the User Profile & Persona System.

SCREENS TO CREATE (3 breakpoints each):

1. Desktop (1440px width)
2. Tablet (768px width)
3. Mobile (375px width)

KEY SCREENS:
- Registration form
- Persona selection
- Dashboard
- Module marketplace
- Profile settings

RESPONSIVE BEHAVIOR:

REGISTRATION FORM:
- Desktop: Single column, centered, max-width 500px
- Tablet: Full width with padding
- Mobile: Full width, stack all elements

PERSONA SELECTION:
- Desktop: 2 columns (side-by-side personas)
- Tablet: 2 columns (narrower cards)
- Mobile: 1 column (stacked, scrollable)

DASHBOARD:
- Desktop: Sidebar + 3-column module grid
- Tablet: Collapsed sidebar + 2-column grid
- Mobile: Hamburger menu + 1-column grid

MODULE MARKETPLACE:
- Desktop: 4-column grid
- Tablet: 2-column grid
- Mobile: 1-column list

PROFILE SETTINGS:
- Desktop: Settings sidebar + form
- Tablet: Settings sidebar (collapsible) + form
- Mobile: Settings tabs at top + form

RESPONSIVE DESIGN PATTERNS:
- Navigation: Desktop sidebar → Mobile hamburger
- Forms: Multi-column → Single column
- Grids: 4 columns → 2 columns → 1 column
- Modals: Centered overlay → Full screen (mobile)
- Tables: Horizontal scroll → Card stack

TOUCH TARGETS (Mobile):
- Minimum 44x44px for all interactive elements
- Adequate spacing between touch targets
- Larger buttons on mobile

TYPOGRAPHY SCALING:
- Desktop: Base 16px
- Tablet: Base 16px
- Mobile: Base 14px (headings scale down proportionally)

DELIVERABLES:
- All key screens at 3 breakpoints
- Responsive behavior annotations
- Component spacing and sizing specs
- Mobile-specific interaction notes
```

---

## Usage Checklist

After generating all designs:

- [ ] Prompt 1: Onboarding flow (8-10 screens) ✅
- [ ] Prompt 2: Persona selection variations (3 designs) ✅
- [ ] Prompt 3: Module dashboard ✅
- [ ] Prompt 4: Profile settings (5 screens) ✅
- [ ] Prompt 5: Complete user journey wireframes ✅
- [ ] Prompt 6: Responsive layout variations ✅

- [ ] All designs reviewed by UX expert
- [ ] User testing conducted with 3+ users
- [ ] Feedback incorporated and designs iterated
- [ ] Final designs approved for implementation
- [ ] Design assets exported for development

---

## Next Steps After FIGMA Designs

1. **Review with team** - Get feedback from developers and stakeholders
2. **User testing** - Test with real users from target personas
3. **Iterate** - Refine based on feedback
4. **Export assets** - Icons, images, color codes
5. **Create component library** - Build reusable React components
6. **Begin implementation** - Use designs as reference

---

**Document Version**: 1.0
**Last Updated**: 2025-12-21
**Status**: Ready to Use
**Estimated Time**: 4-8 hours to generate all designs
