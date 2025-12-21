# Transcript Parser - Monorepo Transformation Plan

## Vision
Transform the Transcript Parser into a **modular, persona-driven platform** with snap-in modules for different use cases (Real Estate, Vehicles, Travel, Students, Business).

## Architecture Principles

### KISS - Keep It Simple
- Start with working monorepo structure
- Migrate existing app first
- Add modules incrementally
- Focus on functionality over perfection

### Snap-In Module System
Each module is a **separate app** that:
- Shares common packages (UI, AI, database)
- Can be deployed independently
- Registers itself with the core platform
- Provides custom fields, templates, and AI analysis

### Cloud-First
- Core app hosted on Hostinger VPS
- Docker + PostgreSQL + N8N on Ubuntu
- PWA for mobile, Electron for desktop
- Modules can run standalone or integrated

## Project Structure

```
transcript-parser/
├── apps/
│   ├── core/                  # Main platform (user selection, dashboard)
│   └── modules/               # Snap-in module apps
│       ├── real-estate/       # Property hunting module
│       ├── vehicle-hunter/    # Car/boat/RV comparison module
│       ├── travel-companion/  # Travel documentation module
│       ├── student-notes/     # Lecture notes & study tools
│       └── business-intel/    # Meeting intelligence
├── packages/
│   ├── types/                 # Shared TypeScript types
│   ├── ui/                    # Shared UI components (shadcn)
│   ├── ai-services/           # Gemini AI, transcription, analysis
│   ├── audio-processing/      # Audio extraction, FFmpeg
│   ├── database/              # Drizzle ORM schemas & queries
│   ├── export/                # Export formats (TXT, SRT, CSV, etc.)
│   └── module-sdk/            # SDK for creating snap-in modules
├── turbo.json                 # Turborepo configuration
└── pnpm-workspace.yaml        # pnpm workspace configuration
```

## Implementation Phases

### Phase 1: Monorepo Foundation ✅
- [x] Install Turborepo
- [x] Create workspace structure
- [x] Set up pnpm workspaces
- [x] Create Module SDK
- [x] Create shared types package
- [ ] Migrate existing app to `apps/core`
- [ ] Extract shared packages
- [ ] Test existing functionality still works

### Phase 2: User Profiles & Persona System
- [ ] User profile database schema
- [ ] Persona selection UI
- [ ] Module activation system
- [ ] Profile preferences (budget, lifestyle, etc.)
- [ ] Accessibility settings (dyslexia support, fonts)

### Phase 3: Real Estate Module (MVP)
- [ ] Create `apps/modules/real-estate`
- [ ] Property viewing templates
- [ ] Comparison tables
- [ ] Pro/con AI analysis
- [ ] Decision confidence scoring

### Phase 4: AI Decision Support
- [ ] Automated comparison engine
- [ ] Question generator
- [ ] Red flag detection
- [ ] Recommendation system

### Phase 5: Additional Modules
- [ ] Vehicle Hunter module
- [ ] Travel Companion module
- [ ] Student Notes module (future)
- [ ] Business Intel module (future)

### Phase 6: Collaboration
- [ ] Shared workspaces
- [ ] Comments & ratings
- [ ] Multi-user decision-making

## Key Features

### Accessibility Support
- Dyslexia-friendly fonts (OpenDyslexic, Comic Sans options)
- Customizable text sizing
- High contrast modes
- Screen reader compatibility
- Keyboard navigation

### Module Capabilities
Each module can provide:
- **Custom Fields**: Property address, vehicle VIN, course name, etc.
- **Templates**: Pre-configured recording setups
- **AI Analysis**: Module-specific insights
- **Export Formats**: Custom report formats
- **Analytics**: Comparison views, decision support

## Tech Stack

### Monorepo
- **Turborepo**: Build orchestration & caching
- **pnpm**: Fast, efficient package management
- **TypeScript**: Type safety across packages

### Frontend (Unchanged)
- React 18.3 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Framer Motion
- Vite 6

### Backend
- Drizzle ORM + PostgreSQL
- Express server
- Google Gemini AI

### Deployment
- **VPS**: Hostinger Ubuntu + Docker
- **PWA**: Mobile/tablet access
- **Electron**: Desktop apps
- **N8N**: Automation workflows

## Next Steps

1. Complete Phase 1 (monorepo migration)
2. Test existing app still works
3. Create example Real Estate module
4. Build persona selection UI
5. Implement comparison & analysis features

## Documentation To-Do
- [ ] Update root README.md
- [ ] Create module developer guide
- [ ] Add deployment documentation
- [ ] Create user guide for each module
