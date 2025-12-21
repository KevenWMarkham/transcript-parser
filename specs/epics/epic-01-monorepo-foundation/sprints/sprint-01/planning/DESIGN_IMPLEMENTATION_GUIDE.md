# Epic 01, Sprint 01 - Design Implementation Guide

**Based on**: [EXECUTION_PLAN.md](./EXECUTION_PLAN.md)
**Purpose**: Visual design and UX implementation for monorepo developer tools
**Created**: December 20, 2024
**Status**: Ready for Design Phase

---

## 🎨 Design Philosophy

This guide translates the technical execution plan into **design-focused deliverables** following our **PLAN → DESIGN → IMPLEMENT** workflow.

### Design Principles
1. **Developer-First UX**: Tools should be intuitive for developers
2. **Visual Hierarchy**: Clear information architecture
3. **Consistency**: Design system tokens across all tools
4. **Accessibility**: WCAG AA minimum (AAA target)
5. **Performance**: Lightweight, fast-loading interfaces

---

## 📐 Design Workflow Integration

This design guide maps to the [DEVELOPMENT_WORKFLOW.md](../../../../DEVELOPMENT_WORKFLOW.md) process:

```
PLAN ✅ → DESIGN 👈 (You are here) → IMPLEMENT → CODE REVIEW → TEST → COMMIT → DEMO
```

**Phase 1: PLAN** - Complete (EXECUTION_PLAN.md created)
**Phase 2: DESIGN** - Current (this guide)
**Phase 3: IMPLEMENT** - Next (execute EXECUTION_PLAN.md)

---

## 🎯 Design Deliverables Overview

### Priority 1: Developer Tools UI (High)
- [ ] Package Dashboard wireframes
- [ ] Dependency Graph visualization
- [ ] Build Status Monitor
- [ ] Module SDK Documentation Portal

### Priority 2: Design System (High)
- [ ] Design tokens (colors, typography, spacing)
- [ ] Component library specifications
- [ ] Icon system

### Priority 3: User Flows (Medium)
- [ ] Developer onboarding flow
- [ ] Create new module flow
- [ ] Package build/test flow
- [ ] Troubleshooting flow

### Priority 4: Documentation Design (Medium)
- [ ] README template design
- [ ] API documentation layout
- [ ] Code example presentation

---

## 📋 Task-by-Task Design Mapping

Each task from EXECUTION_PLAN.md has design considerations:

### Phase 1: AI Services Package (Design Requirements)

**E01.S01.T18.AIPackage** - Create @transcript-parser/ai-services package

**Design Needs**:
- [ ] Package icon/logo
- [ ] README header design
- [ ] Documentation color scheme (AI/Machine Learning theme)
- [ ] Code example formatting

**Design Specs**:
```yaml
Package Theme:
  Primary Color: "#8B5CF6" (Purple - AI/ML)
  Secondary Color: "#6366F1" (Indigo)
  Accent: "#EC4899" (Pink)
  Icon: Brain/Sparkles symbol
  Typography: JetBrains Mono for code examples
```

**Figma/Make.ai Prompt**:
```
Create a package documentation header for "@transcript-parser/ai-services"
- Modern, tech-focused design
- Purple/Indigo gradient background
- Brain icon with sparkles
- Package name in JetBrains Mono font
- Tagline: "AI-powered transcription and speaker detection"
- Include badges: npm version, TypeScript, MIT license
- Size: 1200x300px
```

---

### Phase 2: Audio Processing Package (Design Requirements)

**E01.S01.T24.AudioPackage** - Create @transcript-parser/audio-processing package

**Design Needs**:
- [ ] Package icon/logo (audio waveform theme)
- [ ] README header design
- [ ] Documentation color scheme (Audio theme)
- [ ] Visual diagram: Audio extraction workflow

**Design Specs**:
```yaml
Package Theme:
  Primary Color: "#10B981" (Green - Audio/Sound)
  Secondary Color: "#14B8A6" (Teal)
  Accent: "#06B6D4" (Cyan)
  Icon: Waveform/Speaker symbol
  Typography: Inter for body, JetBrains Mono for code
```

**Figma/Make.ai Prompt**:
```
Create an audio extraction workflow diagram showing:
1. Video file input (MP4 icon)
2. Browser-based extraction path
3. FFmpeg.wasm fallback path
4. Audio output (waveform icon)
Use clean, modern iconography
Green/Teal color scheme
Show decision points and flow arrows
Size: 800x400px
```

---

### Phase 3: Export Package (Design Requirements)

**E01.S01.T29.ExportPackage** - Create @transcript-parser/export package

**Design Needs**:
- [ ] Package icon/logo (export/file theme)
- [ ] Format comparison table design
- [ ] Visual examples of each export format
- [ ] Usage code snippet styling

**Design Specs**:
```yaml
Package Theme:
  Primary Color: "#F59E0B" (Amber - Export/File)
  Secondary Color: "#F97316" (Orange)
  Accent: "#EAB308" (Yellow)
  Icon: Download/File-Export symbol
  Typography: Inter for body, Source Code Pro for code
```

**Format Comparison Table Design**:
```
| Format | Use Case | Features | Size |
|--------|----------|----------|------|
| TXT    | Simple text | Timestamps, speakers | Small |
| SRT    | Subtitles | Timecodes, formatting | Medium |
| VTT    | Web video | Cues, styling | Medium |
| CSV    | Spreadsheets | Structured data | Medium |
| JSON   | Full export | All metadata | Large |

Design: Modern table with hover states, color-coded formats
```

---

### Phase 4: Database Package (Design Requirements)

**E01.S01.T36.DBPackage** - Create @transcript-parser/database package

**Design Needs**:
- [ ] Package icon/logo (database theme)
- [ ] Entity relationship diagram (ERD)
- [ ] Schema visualization
- [ ] Query example formatting

**Design Specs**:
```yaml
Package Theme:
  Primary Color: "#3B82F6" (Blue - Database)
  Secondary Color: "#2563EB" (Dark Blue)
  Accent: "#60A5FA" (Light Blue)
  Icon: Database/Cylinder symbol
  Typography: Inter for body, Fira Code for SQL/code
```

**ERD Design**:
```
Create an Entity Relationship Diagram showing:
- users table (id, email, api_key)
- transcripts table (id, user_id, title, data)
- llm_usage table (id, user_id, tokens, cost)
- speakers table (id, transcript_id, name, color)

Use modern database diagram style
Blue color scheme
Show relationships with arrows
Include field types
Size: 1000x600px
```

---

### Phase 5: UI Package Enhancement (Design Requirements)

**E01.S01.T11-T17** - Extract UI Components Package

This is the **most design-intensive phase**. Each component needs:

#### Component Design Checklist

**Transcript Components**:
- [ ] TranscriptList - Virtual scrolling design
- [ ] TranscriptEntry - Entry card design with speaker colors
- [ ] TranscriptView - Full-page transcript layout
- [ ] TranscriptSearch - Search input with filters
- [ ] TranscriptFilters - Filter panel design

**Export Components**:
- [ ] ExportDialog - Modal dialog design
- [ ] AdvancedExportPanel - Multi-step export wizard

**Speaker Components**:
- [ ] SpeakerSummary - Speaker card design
- [ ] SpeakerAnalytics - Chart/graph visualizations
- [ ] SpeakerNameSuggestions - Autocomplete dropdown

**Upload Components**:
- [ ] UploadVideo - Drag-drop zone design
- [ ] VideoPreview - Video player with transcript sync
- [ ] ProcessingStatus - Progress indicators

---

## 🎨 Design System Specification

### Color Palette

**Primary Colors**:
```css
--primary-50: #F0F9FF;
--primary-100: #E0F2FE;
--primary-500: #0EA5E9; /* Main brand color */
--primary-600: #0284C7;
--primary-900: #0C4A6E;
```

**Semantic Colors**:
```css
/* Success (AI Services, Audio) */
--success-500: #10B981;
--success-600: #059669;

/* Warning (Export, Config) */
--warning-500: #F59E0B;
--warning-600: #D97706;

/* Error (Validation, Issues) */
--error-500: #EF4444;
--error-600: #DC2626;

/* Info (Database, Documentation) */
--info-500: #3B82F6;
--info-600: #2563EB;
```

**Neutral Grays**:
```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-500: #6B7280;
--gray-700: #374151;
--gray-900: #111827;
```

### Typography

**Font Families**:
```css
/* Headings & UI */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;

/* Code & Technical */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Body Text (Documentation) */
--font-body: 'Inter', sans-serif;
```

**Type Scale**:
```css
--text-xs: 0.75rem;    /* 12px - Labels, badges */
--text-sm: 0.875rem;   /* 14px - Body small */
--text-base: 1rem;     /* 16px - Body default */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-xl: 1.25rem;    /* 20px - H4 */
--text-2xl: 1.5rem;    /* 24px - H3 */
--text-3xl: 1.875rem;  /* 30px - H2 */
--text-4xl: 2.25rem;   /* 36px - H1 */
```

**Font Weights**:
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 0.25rem;  /* 4px - Buttons, badges */
--radius-md: 0.5rem;   /* 8px - Cards, inputs */
--radius-lg: 0.75rem;  /* 12px - Modals */
--radius-xl: 1rem;     /* 16px - Large cards */
--radius-full: 9999px; /* Pills, avatars */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## 📐 Wireframes & User Flows

### 1. Package Dashboard Wireframe

**Purpose**: Monitor all packages, build status, dependencies

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│  Package Dashboard                    [Refresh] [⚙]  │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Types    │  │ AI Svcs  │  │ UI       │          │
│  │ ✅ Built │  │ ✅ Built │  │ 🔄 Build │          │
│  │ 2.3 MB   │  │ 5.1 MB   │  │ 8.7 MB   │          │
│  │ 0 issues │  │ 0 issues │  │ 2 warns  │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Audio    │  │ Export   │  │ Database │          │
│  │ ❌ Error │  │ ⏸ Idle   │  │ ✅ Built │          │
│  │ --       │  │ 1.2 MB   │  │ 3.4 MB   │          │
│  │ 1 error  │  │ 0 issues │  │ 0 issues │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
│  Build Log                                            │
│  ┌───────────────────────────────────────────────┐  │
│  │ [14:23:45] Building @transcript-parser/ui... │  │
│  │ [14:23:50] TypeScript compilation complete   │  │
│  │ [14:23:52] ⚠ Warning: Large bundle (8.7 MB) │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Figma/Make.ai Prompt**:
```
Create a package dashboard UI showing:
- Grid of package cards (3x2 layout)
- Each card shows: package name, build status (icon), size, issues count
- Status icons: ✅ (green), 🔄 (blue), ❌ (red), ⏸ (gray)
- Build log panel at bottom with monospace font
- Modern card design with shadows
- Blue/gray color scheme
- Include refresh button and settings gear icon
Size: 1400x900px
```

---

### 2. Dependency Graph Visualization

**Purpose**: Visualize package dependencies to avoid circular refs

**Design Concept**:
```
      ┌─────────┐
      │  Types  │ (Foundation - no deps)
      └────┬────┘
           │
     ┌─────┴─────────┬─────────┐
     │               │         │
┌────▼────┐    ┌────▼────┐  ┌─▼────────┐
│ AI Svcs │    │  Audio  │  │ Database │
└────┬────┘    └────┬────┘  └─────┬────┘
     │              │              │
     └──────┬───────┴──────────────┘
            │
       ┌────▼────┐
       │   UI    │ (Depends on all)
       └─────────┘
```

**Interactive Features**:
- Hover to highlight dependencies
- Click to see package details
- Color-coded by type (green=shared, blue=services, purple=UI)
- Animated transitions

**Figma/Make.ai Prompt**:
```
Create an interactive dependency graph showing:
- Nodes: Package boxes with rounded corners
- Edges: Arrows showing dependencies
- Layout: Top-down hierarchy
- Color coding: Types (gray), Services (green/purple), UI (blue)
- Node includes: package name, version, dependency count
- Modern graph visualization style
- Include legend for colors
- Animated connection lines
Size: 1200x800px
```

---

### 3. Module SDK Documentation Portal

**Purpose**: Developer documentation for creating modules

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│  Module SDK Documentation             🔍 Search      │
├────────┬────────────────────────────────────────────┤
│        │  Getting Started                           │
│ Sidebar│  ═══════════════                           │
│        │                                             │
│ • Home │  Welcome to the Module SDK! Build custom   │
│ • Guide│  modules that snap into Transcript Parser. │
│ • API  │                                             │
│ • Ex's │  Quick Start                                │
│        │  ───────────                                │
│ Types  │  ```typescript                              │
│ -----  │  import { createModule } from              │
│ • Def  │    '@transcript-parser/module-sdk';        │
│ • Meta │                                             │
│ • Field│  export const myModule = createModule({   │
│        │    metadata: { ... },                      │
│ Examples│    fields: [ ... ]                         │
│ --------│  });                                       │
│ • R.E. │  ```                                        │
│ • Veh  │                                             │
│ • Trvl │  [Try it now →]                            │
│        │                                             │
└────────┴────────────────────────────────────────────┘
```

**Design Requirements**:
- Sidebar navigation with expandable sections
- Syntax-highlighted code examples
- Copy-to-clipboard buttons on code blocks
- "Try it now" interactive playground
- Responsive for mobile/tablet
- Dark mode support

**Figma/Make.ai Prompt**:
```
Create a documentation portal layout:
- Left sidebar (250px): Navigation tree with expandable sections
- Main content area: Documentation with code examples
- Top header: Logo, search bar, theme toggle
- Code blocks: Syntax highlighted with copy button
- CTA buttons: "Try it now", "View on GitHub"
- Clean, modern documentation style (similar to Next.js docs)
- Blue/gray color scheme with purple accents for code
- Include mobile responsive breakpoints
Size: 1920x1080px (desktop), 375x812px (mobile)
```

---

## 🎨 Component-Level Design Specs

### TranscriptList Component

**Visual Design**:
```
┌─────────────────────────────────────────────┐
│  [00:12] Speaker 1                          │
│  Hello, welcome to the presentation...      │
├─────────────────────────────────────────────┤
│  [00:18] Speaker 2                          │
│  Thanks for having me. Let's dive into...   │
├─────────────────────────────────────────────┤
│  [00:25] Speaker 1                          │
│  First, let's cover the main points...      │
└─────────────────────────────────────────────┘
```

**Design Tokens**:
```css
.transcript-entry {
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  transition: background-color 0.2s;
}

.transcript-entry:hover {
  background-color: var(--gray-50);
}

.speaker-label {
  font-weight: var(--font-semibold);
  color: var(--primary-600);
  margin-right: var(--space-2);
}

.timestamp {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--gray-500);
}
```

**Accessibility**:
- ARIA labels for screen readers
- Keyboard navigation (arrow keys)
- Focus indicators
- High contrast mode support

---

### ExportDialog Component

**Visual Design**:
```
┌─────────────────────────────────────────┐
│  Export Transcript              [✕]     │
├─────────────────────────────────────────┤
│                                          │
│  Select Format                           │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │  TXT   │ │  SRT   │ │  VTT   │      │
│  │  ✓     │ │        │ │        │      │
│  └────────┘ └────────┘ └────────┘      │
│  ┌────────┐ ┌────────┐                  │
│  │  CSV   │ │  JSON  │                  │
│  │        │ │        │                  │
│  └────────┘ └────────┘                  │
│                                          │
│  Options                                 │
│  ☑ Include timestamps                   │
│  ☑ Include speaker names                │
│  ☐ Include metadata                     │
│                                          │
│          [Cancel]  [Export]              │
└─────────────────────────────────────────┘
```

**Interaction States**:
- Default: Neutral background
- Hover: Light highlight
- Selected: Blue background
- Disabled: Grayed out

---

## 🎯 User Flow Diagrams

### Developer Onboarding Flow

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Choose    │
│  Use Case   │ (Real Estate, Vehicle, etc.)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Install   │
│   Packages  │ (pnpm install)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Create    │
│   Module    │ (Use template)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Test     │
│   Locally   │ (pnpm dev)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Deploy    │
│   Module    │
└─────────────┘
```

**Design Each Step**:
- Landing: Hero section with "Get Started" CTA
- Choose: Card grid with module types
- Install: Code block with copy button
- Create: Interactive wizard
- Test: Live preview panel
- Deploy: Deployment checklist

---

## 📱 Responsive Design Breakpoints

```css
/* Mobile First Approach */
/* Extra Small: 0-639px (mobile) */
.container {
  padding: var(--space-4);
}

/* Small: 640px-767px (large mobile) */
@media (min-width: 640px) {
  .container {
    padding: var(--space-6);
  }
}

/* Medium: 768px-1023px (tablet) */
@media (min-width: 768px) {
  .sidebar {
    display: block; /* Show sidebar */
  }
}

/* Large: 1024px-1279px (desktop) */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Extra Large: 1280px+ (large desktop) */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

---

## ♿ Accessibility Design Requirements

### WCAG AA Compliance (Minimum)

**Color Contrast**:
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Keyboard Navigation**:
- All interactive elements accessible via Tab
- Focus indicators clearly visible
- Logical tab order

**Screen Reader Support**:
- ARIA labels on all icons
- Semantic HTML (nav, main, article, aside)
- Alt text on images
- Live regions for dynamic content

### WCAG AAA Target

**Enhanced Contrast**:
- Normal text: 7:1
- Large text: 4.5:1

**Additional Requirements**:
- Skip navigation links
- Consistent navigation
- Clear error messages
- Predictable focus order

---

## 🎬 Animation & Motion Design

**Motion Principles**:
1. **Purpose**: Animations should guide attention
2. **Performance**: Use CSS transforms (not position changes)
3. **Duration**: 150-300ms for micro-interactions
4. **Easing**: Use ease-out for entrances, ease-in for exits

**Animation Tokens**:
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**Example Animations**:
```css
/* Card hover */
.card {
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Modal entrance */
.modal {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

**Respect User Preferences**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📦 Design Deliverables Checklist

### Before Implementation
- [ ] Design system tokens defined (colors, typography, spacing)
- [ ] All wireframes created (Package Dashboard, Dependency Graph, Docs Portal)
- [ ] User flows documented (Developer onboarding, Module creation)
- [ ] Component designs specified (TranscriptList, ExportDialog, etc.)
- [ ] Responsive breakpoints defined
- [ ] Accessibility requirements documented
- [ ] Animation specifications created

### During Implementation
- [ ] Components match design specifications
- [ ] Color contrast meets WCAG AA (minimum)
- [ ] Typography scales correctly
- [ ] Spacing uses design tokens
- [ ] Interactive states implemented (hover, focus, active)
- [ ] Animations respect reduced-motion preference

### After Implementation
- [ ] Visual QA completed
- [ ] Accessibility audit passed (WAVE, axe DevTools)
- [ ] Responsive design tested on multiple devices
- [ ] Design system documented in Storybook (optional)

---

## 🔗 Integration with Development Workflow

### Handoff to Developers

**Design Assets**:
1. Figma file (or Make.ai outputs) with all screens
2. Design tokens exported as JSON/CSS
3. Component specifications document
4. User flow diagrams (Mermaid or PNG)
5. Accessibility checklist

**Developer Resources**:
- Design system documentation
- Component API specifications
- Interactive prototypes (if available)
- Asset exports (icons, logos, images)

### Design Review Process

**Before Implementation**:
1. Product Owner reviews wireframes
2. Tech Lead reviews feasibility
3. UX Expert reviews accessibility
4. Team approves design direction

**During Implementation**:
1. Daily check-ins on design adherence
2. Mid-sprint design QA
3. Adjust as needed based on technical constraints

**After Implementation**:
1. Final visual QA
2. Accessibility testing
3. User acceptance testing
4. Design handoff complete

---

## 📚 Resources & Tools

### Design Tools
- **Figma**: Primary design tool (wireframes, mockups)
- **Make.ai**: AI-powered design generation
- **Mermaid**: Flow diagrams and charts
- **Excalidraw**: Quick sketches and diagrams

### Development Tools
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library
- **Framer Motion**: Animation library
- **Lucide Icons**: Icon library

### Testing Tools
- **WAVE**: Accessibility testing browser extension
- **axe DevTools**: Accessibility testing tool
- **Lighthouse**: Performance and accessibility audits
- **Responsively**: Responsive design testing

---

## ✅ Next Steps

1. **Review this design guide** with Product Owner and UX Designer
2. **Generate design assets** using Figma/Make.ai prompts provided
3. **Create design system tokens** (colors, typography, spacing)
4. **Build wireframes** for Package Dashboard, Dependency Graph, Docs Portal
5. **Document user flows** for developer onboarding
6. **Hand off to developers** with [EXECUTION_PLAN.md](./EXECUTION_PLAN.md)
7. **Begin implementation** following PLAN → DESIGN → IMPLEMENT workflow

---

**Design Phase Status**: ✅ Ready to Execute
**Next Phase**: IMPLEMENT (use EXECUTION_PLAN.md)
**Estimated Design Time**: 8-12 hours (including feedback/revisions)
