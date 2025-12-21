# Transcript Parser - Modular Architecture

## Executive Summary

The Transcript Parser is being transformed into a **modular, persona-driven AI platform** that helps users make better decisions across multiple life scenarios:

- 🏠 **Real Estate**: Property hunting, apartment search, commercial spaces
- 🚗 **Vehicles**: Car shopping, boats, RVs, motorcycles
- ✈️ **Travel**: Tour documentation, language learning, trip journals
- 🎓 **Students**: Lecture notes, study materials, professor tracking
- 💼 **Business**: Meeting intelligence, presentation analysis

## Core Innovation

### The Problem
When making major decisions (buying a house, car shopping, etc.), people:
- See too many options and they blur together
- Can't remember which property had the updated kitchen
- Lose track of details mentioned during viewings/test drives
- Struggle to compare options objectively
- Make emotional decisions without data to back them up

### The Solution
**AI-powered decision support through structured audio transcription:**

1. **Capture**: Record conversations during viewings, tours, meetings (hands-free audio)
2. **Organize**: Automatically structure with AI (speaker detection, timestamps, metadata)
3. **Analyze**: AI generates comparisons, pros/cons, decision confidence scores
4. **Decide**: Make better choices with data, not just memory and emotion

## Architecture Vision

### Snap-In Module System

**Core Philosophy**: Each use case is a separate, snap-in module that extends the core platform.

```
┌─────────────────────────────────────────────────────────────┐
│                      CORE PLATFORM                          │
│  • User Profiles & Preferences                              │
│  • Module Registry & Activation                             │
│  • Transcription Engine (Gemini AI)                         │
│  • Storage (IndexedDB + PostgreSQL)                         │
│  • Analytics Dashboard                                      │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
│   REAL       │      │   VEHICLE    │      │   TRAVEL    │
│   ESTATE     │      │   HUNTER     │      │  COMPANION  │
│   MODULE     │      │   MODULE     │      │   MODULE    │
└──────────────┘      └─────────────┘      └─────────────┘
        │                     │                     │
┌───────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
│   STUDENT    │      │   BUSINESS   │      │    CUSTOM   │
│   NOTES      │      │    INTEL     │      │   MODULES   │
│   MODULE     │      │    MODULE    │      │   (Future)  │
└──────────────┘      └─────────────┘      └─────────────┘
```

### Module Capabilities

Each module can provide:

1. **Custom Metadata Fields**
   - Real Estate: Address, price, square footage, realtor name
   - Vehicle: Make/model, VIN, dealership, test drive notes
   - Travel: Location (GPS), tour guide name, language
   - Student: Course name, professor, lecture number, topic

2. **Templates**
   - Pre-configured recording setups
   - Quick-start options (House Viewing, Test Drive, Tour, Lecture)

3. **AI Analysis**
   - Module-specific insights
   - Comparison tables
   - Pro/con extraction
   - Decision confidence scoring
   - Red flag detection

4. **Export Formats**
   - Custom reports (Property Comparison Spreadsheet, Vehicle Cost Analysis)
   - Standard formats (TXT, SRT, CSV, JSON, PDF)

5. **UI Components**
   - Custom detail views
   - Comparison interfaces
   - Analytics dashboards

## Technical Architecture

### Monorepo Structure (Turborepo + pnpm)

```
transcript-parser/
├── apps/
│   ├── core/                      # Main platform application
│   │   ├── src/
│   │   │   ├── pages/            # Persona selection, dashboard
│   │   │   ├── components/       # Core UI components
│   │   │   ├── services/         # API clients, module registry
│   │   │   └── hooks/            # Shared React hooks
│   │   └── package.json
│   │
│   └── modules/                  # Snap-in module applications
│       ├── real-estate/          # Property hunting
│       ├── vehicle-hunter/       # Vehicle comparison
│       ├── travel-companion/     # Travel documentation
│       ├── student-notes/        # Lecture notes
│       └── business-intel/       # Meeting intelligence
│
├── packages/
│   ├── types/                    # Shared TypeScript types
│   │   └── src/
│   │       └── index.ts         # TranscriptData, UserProfile, etc.
│   │
│   ├── module-sdk/               # SDK for creating modules
│   │   └── src/
│   │       └── index.ts         # ModuleDefinition, ModuleRegistry
│   │
│   ├── ui/                       # Shared UI components (shadcn)
│   │   └── src/
│   │       ├── Button/
│   │       ├── Dialog/
│   │       └── ...
│   │
│   ├── ai-services/              # AI & transcription
│   │   └── src/
│   │       ├── geminiClient.ts  # Google Gemini API
│   │       ├── transcription.ts # Audio → Text
│   │       └── analysis.ts      # AI insights
│   │
│   ├── audio-processing/         # Audio extraction
│   │   └── src/
│   │       ├── audioExtractor.ts
│   │       └── ffmpegExtractor.ts
│   │
│   ├── database/                 # Drizzle ORM schemas
│   │   └── src/
│   │       ├── schema.ts        # DB tables
│   │       └── queries.ts       # Common queries
│   │
│   └── export/                   # Export utilities
│       └── src/
│           ├── txt.ts
│           ├── srt.ts
│           ├── csv.ts
│           └── pdf.ts
│
├── turbo.json                    # Turborepo config
├── pnpm-workspace.yaml          # pnpm workspace config
└── package.json                 # Root dependencies
```

### Module SDK Example

Creating a new module is simple with the Module SDK:

```typescript
import { createModule } from '@transcript-parser/module-sdk';

export const realEstateModule = createModule({
  metadata: {
    id: 'real-estate',
    name: 'Real Estate Hunter',
    description: 'Property search and comparison for houses, apartments, and commercial spaces',
    icon: '🏠',
    version: '1.0.0',
    author: 'Keven Markham',
    category: 'major-purchase',
    tags: ['property', 'housing', 'real-estate']
  },

  fields: [
    {
      key: 'address',
      label: 'Property Address',
      type: 'text',
      required: true,
      showInComparison: true
    },
    {
      key: 'price',
      label: 'Asking Price',
      type: 'number',
      required: true,
      showInComparison: true
    },
    {
      key: 'bedrooms',
      label: 'Bedrooms',
      type: 'number',
      showInComparison: true
    },
    {
      key: 'bathrooms',
      label: 'Bathrooms',
      type: 'number',
      showInComparison: true
    },
    {
      key: 'squareFeet',
      label: 'Square Footage',
      type: 'number',
      showInComparison: true
    },
    {
      key: 'realtorName',
      label: 'Realtor Name',
      type: 'text'
    }
  ],

  templates: [
    {
      id: 'house-viewing',
      name: 'House Viewing',
      description: 'For touring single-family homes',
      icon: '🏡',
      defaultValues: {
        type: 'house'
      }
    },
    {
      id: 'apartment-tour',
      name: 'Apartment Tour',
      description: 'For touring apartments and condos',
      icon: '🏢',
      defaultValues: {
        type: 'apartment'
      }
    }
  ],

  aiEnhancements: [
    {
      id: 'property-comparison',
      name: 'Property Comparison',
      description: 'Compare multiple properties side-by-side',
      promptTemplate: `Compare these properties and provide:
        1. Pros and cons of each
        2. Best value analysis
        3. Red flags or concerns
        4. Recommendation based on user preferences`,
      processResponse: (response, transcript) => ({
        comparison: response
      }),
      trigger: 'on-demand'
    }
  ]
});
```

## User Experience Flow

### 1. **Onboarding: Create Your Profile**

First-time users complete a profile:

```
┌────────────────────────────────────────┐
│  Welcome to Transcript Parser!        │
│                                        │
│  Let's personalize your experience.   │
│                                        │
│  Your Budget Range:                   │
│  [$400,000] to [$500,000]             │
│                                        │
│  Your Lifestyle:                      │
│  ○ Urban  ● Suburban  ○ Rural         │
│                                        │
│  Decision Style:                      │
│  ● Analytical  ○ Intuitive            │
│                                        │
│  Accessibility Needs:                 │
│  ☑ Dyslexia-friendly fonts            │
│  ☐ High contrast mode                 │
│  ☐ Larger text size                   │
│                                        │
│  [Continue]                           │
└────────────────────────────────────────┘
```

### 2. **Module Selection: Choose Your Scenario**

User activates modules they need:

```
┌────────────────────────────────────────┐
│  What are you working on?             │
│                                        │
│  ☑ 🏠 Real Estate (House Hunting)     │
│  ☑ 🚗 Vehicle Shopping (Car)          │
│  ☐ ✈️ Travel & Exploration            │
│  ☐ 🎓 Education (Student)             │
│  ☐ 💼 Business (Meetings)             │
│                                        │
│  [Activate Modules]                   │
└────────────────────────────────────────┘
```

### 3. **Mobile Recording (PWA)**

During property viewing, test drive, etc.:

```
┌────────────────────────────────────────┐
│  🏠 New House Viewing                 │
│                                        │
│  Address: 789 Pine Road               │
│  Price: $440,000                      │
│                                        │
│  [📍 Auto-detected via GPS]           │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │         [● REC 12:34]            │ │
│  │                                  │ │
│  │  Recording realtor walkthrough…  │ │
│  │                                  │ │
│  │  [■ Stop]                        │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Quick Notes:                         │
│  [Voice note] "I love this kitchen!"  │
│  [Photo] Take photo → Link to time    │
│                                        │
└────────────────────────────────────────┘
```

### 4. **Desktop Analysis**

That evening, reviewing on desktop/tablet:

```
┌──────────────────────────────────────────────────────────────────┐
│  🏠 Property Comparison (5 houses viewed)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AI Recommendation: 789 Pine Road ⭐⭐⭐⭐⭐                        │
│  Confidence: 87% 🟢 HIGH                                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         123 Oak   456 Elm   789 Pine   321 Main  567 Birch│ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ Price   $450k     $475k     $440k      $500k     $420k    │ │
│  │ Beds    3         4         3          4         2        │ │
│  │ Baths   2         2.5       2          3         1.5      │ │
│  │ SqFt    1,800     2,200     1,900      2,500     1,400    │ │
│  │ Rating  ⭐⭐⭐⭐     ⭐⭐⭐       ⭐⭐⭐⭐⭐      ⭐⭐        ⭐⭐⭐      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ✅ PROS (789 Pine Road)                                         │
│  • "The kitchen is absolutely perfect" (00:08:34)               │
│  • Walkable to downtown - coffee, restaurants (00:15:22)        │
│  • Incredible natural light (00:12:10)                          │
│  • Roof replaced 2023, new HVAC (realtor - 00:20:45)           │
│                                                                  │
│  ❌ CONS                                                          │
│  • Yard smaller than hoped (00:18:30)                           │
│  • Street noise might be an issue (00:22:15)                    │
│                                                                  │
│  🤔 QUESTIONS TO ASK                                             │
│  1. What are typical property tax increases in this area?       │
│  2. HOA guest parking restrictions?                             │
│  3. Noise levels at night? (only viewed during day)             │
│                                                                  │
│  💡 AI INSIGHT                                                   │
│  Your "lively area" preference matches this location perfectly.  │
│  Nearby parks can offset the small yard concern.                │
│                                                                  │
│  [Export Comparison] [Share with Partner] [Make Offer]          │
└──────────────────────────────────────────────────────────────────┘
```

### 5. **Collaboration (Future)**

Partner reviews remotely:

```
┌────────────────────────────────────────┐
│  Sarah's Review: 789 Pine Road        │
│                                        │
│  Rating: ⭐⭐⭐⭐ (4/5)                   │
│                                        │
│  💬 "Love the kitchen and location,   │
│     but worried about the yard size   │
│     for future kids."                 │
│                                        │
│  ↪️ Keven: "There are 3 parks within  │
│     10min walk! AI found them."       │
│                                        │
│  [Add Comment] [Change Rating]        │
└────────────────────────────────────────┘
```

## Key Features

### AI-Powered Decision Support

1. **Automated Comparison Tables**
   - Extracts specs from natural language ("three bedroom, two bath")
   - Normalizes data (converts "twenty-five thousand" to $25,000)
   - Highlights differences between options
   - Flags missing information

2. **Pro/Con Analysis**
   - Sentiment detection (positive/negative language)
   - Weight by importance (user said "critical" about parking)
   - Surfaces hidden concerns ("I'm worried about...")
   - Celebrates excitement ("We loved the backyard!")

3. **Question Generator**
   - "You forgot to ask about HOA fees"
   - Generates follow-up email to realtor
   - Tracks which questions were answered

4. **Red Flag Detection**
   - "Salesperson avoided your question about accident history"
   - "Realtor said 'unfortunately' multiple times about foundation"
   - High-pressure tactics: "This deal expires today"
   - Inconsistencies between viewings

5. **Decision Confidence Score**
   - Budget alignment
   - Emotional response (language analysis)
   - Feature match (hits 8/10 must-haves)
   - Risk factors
   - Partner/family alignment

### Accessibility Features

Supporting diverse needs:

1. **Dyslexia Support**
   - OpenDyslexic font option
   - Comic Sans, Arial alternatives
   - Increased letter spacing
   - Reduced visual clutter

2. **Visual Accessibility**
   - High contrast mode
   - Customizable text size (100%-200%)
   - Color-blind friendly palettes
   - Focus indicators

3. **Screen Reader Support**
   - ARIA labels
   - Semantic HTML
   - Keyboard navigation
   - Audio descriptions

4. **Cognitive Accessibility**
   - Simple, clear language
   - Progress indicators
   - Error prevention & recovery
   - Undo/redo functionality

## Deployment Strategy

### Cloud Infrastructure (Hostinger VPS)

```
┌─────────────────────────────────────────────┐
│         Hostinger VPS (Ubuntu)              │
│                                             │
│  ┌─────────────┐  ┌──────────────┐         │
│  │   Docker    │  │  PostgreSQL  │         │
│  │  Containers │  │   Database   │         │
│  └─────────────┘  └──────────────┘         │
│                                             │
│  ┌─────────────┐  ┌──────────────┐         │
│  │   N8N       │  │    Nginx     │         │
│  │  Automation │  │  Web Server  │         │
│  └─────────────┘  └──────────────┘         │
└─────────────────────────────────────────────┘
```

### Multi-Platform Access

1. **Web (PWA)**
   - Mobile-first for on-the-go capture
   - Offline-capable (IndexedDB)
   - Install on iOS/Android
   - Push notifications

2. **Desktop (Electron)**
   - Windows, macOS, Linux
   - Full-featured analysis interface
   - Local-first storage
   - Cloud sync optional

3. **Hybrid Approach**
   - Capture on mobile (PWA)
   - Analyze on desktop
   - Cloud sync for collaboration

## Data Architecture

### Local-First with Optional Cloud Sync

```
┌──────────────┐         ┌──────────────┐
│   Mobile     │         │   Desktop    │
│              │         │              │
│  IndexedDB   │◄───────►│  IndexedDB   │
│  (Offline)   │         │  (Offline)   │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │    (Optional Sync)     │
       │                        │
       └────────┬───────────────┘
                │
                ▼
       ┌────────────────┐
       │   PostgreSQL   │
       │   (Cloud VPS)  │
       │                │
       │  • Users       │
       │  • Transcripts │
       │  • Workspaces  │
       │  • LLM Usage   │
       └────────────────┘
```

### Privacy-First

- **Default**: All data stays local (IndexedDB)
- **Optional**: Enable cloud sync for collaboration
- **Encryption**: Sensitive data encrypted at rest
- **GDPR Compliant**: User controls their data

## Monetization Strategy (Future)

### Freemium Model

**Free Tier**:
- 3 transcripts per module per month
- All core features
- Local storage only
- Basic AI analysis

**Pro Tier** ($10/month):
- Unlimited transcripts
- Advanced AI features (decision confidence, recommendations)
- Cloud sync
- Collaboration workspaces
- Priority support

**Enterprise** (Custom pricing):
- Team workspaces
- Custom modules
- White-label options
- Dedicated support

## Next Steps

### Immediate (This Sprint)
1. ✅ Set up Turborepo monorepo structure
2. ✅ Create Module SDK package
3. ✅ Create shared types package
4. ⏳ Create example Real Estate module
5. ⏳ Build user profile & persona selection UI
6. ⏳ Update documentation

### Short-Term (Next 2-4 Weeks)
1. Migrate existing app to `apps/core`
2. Extract shared packages (UI, AI, export)
3. Build Real Estate module MVP
4. Implement comparison & analysis features
5. Add accessibility features

### Medium-Term (1-2 Months)
1. Vehicle Hunter module
2. Travel Companion module
3. Cloud deployment (Hostinger VPS)
4. Collaboration features (basic)
5. Mobile PWA optimization

### Long-Term (3-6 Months)
1. Student Notes module
2. Business Intel module
3. Advanced AI features (Q&A, summarization)
4. Third-party integrations (Zillow, Carfax, Google Maps)
5. Mobile native apps (React Native)

## Success Metrics

### User Engagement
- Modules activated per user
- Transcripts created per week
- Comparison views generated
- Decision confidence scores

### Product Quality
- Transcription accuracy (>95%)
- AI insight relevance (user ratings)
- Load time (<2s)
- Mobile responsiveness score

### Business (Future)
- Free → Pro conversion rate
- Monthly recurring revenue
- Customer lifetime value
- Net Promoter Score (NPS)

---

**This architecture enables rapid iteration while maintaining code quality and user experience across all modules.**
