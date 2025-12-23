# Sprint 11: Session-based Notes with Templates and AI Experts

**Sprint ID**: EPIC-00-S11
**Status**: Planned
**Priority**: High (Core Functionality)
**Duration**: Weeks 21-24 (4 weeks)
**Owner**: Development Team

---

## Overview

Add a feature to generate structured notes from transcripts using templates and AI-powered expert analysis. This is **core functionality** that applies across all persona modules (Real Estate, Travel, Students, etc.).

## Business Value

- Transform raw transcripts into actionable, structured notes
- AI Experts provide domain-specific insights automatically
- Sessions group multiple recordings for comprehensive analysis
- Templates ensure consistent note formats for different use cases

---

## Core Concepts

### Sessions
- Container grouping multiple recordings/transcripts
- Notes generated from combined session transcripts
- Stored separately from individual transcripts

### Templates (control note format)
- **Meeting Notes** - action items, decisions, attendee summary
- **Podcast** - key topics, interesting facts, highlights
- **Interview** - Q&A format, key quotes
- Templates define structure, AI fills content

### AI Experts (dynamic based on content)
- Auto-detected from conversation content
- Examples: Legal Expert, IT Infrastructure Expert, Domain Expert
- Provide:
  1. **Inline annotations** on specific transcript sections
  2. **Background/context** research on topics
  3. **Summary** contributions
  4. **Feedback** and recommendations

---

## Implementation Phases

### Phase 1: MVP Foundation (Weeks 21-22)
**Goal**: Basic session management + one working template

**Types** (`packages/types/src/index.ts`)
- Add: Session, SessionNotes, NoteTemplate, AIExpert, ExpertAnnotation types

**Database** (`packages/database/src/schema.ts`)
- Add tables: sessions, sessionTranscripts, sessionNotes, noteTemplates

**New Package** (`packages/session-notes/`)
```
src/
├── services/
│   ├── session-service.ts      # Session CRUD
│   ├── note-generator.ts       # Note generation orchestrator
│   └── template-service.ts     # Template management
├── templates/
│   └── meeting-notes.ts        # Built-in template
└── prompts/
    └── section-generation.ts   # AI prompts
```

**UI Components** (`packages/ui/src/components/`)
- SessionList.tsx - List of user's sessions
- SessionCreate.tsx - Create session dialog
- TemplateSelector.tsx - Pick a template
- NotesView.tsx - Display generated notes
- NoteSection.tsx - Render each section

**MVP Limitations**:
- No AI Expert detection (add manually)
- No inline annotations
- Single template (Meeting Notes)

### Phase 2: AI Experts (Week 23)
- Topic detection from transcripts
- Expert matching algorithm
- Expert registry (Legal, Tech, Business, PM, HR)
- Expert contributions to sections
- ExpertPanel UI

### Phase 3: Inline Annotations (Week 24)
- Annotation service
- AnnotatedTranscript component
- Background research generation
- BackgroundPanel sidebar

### Phase 4: Additional Templates (Future)
- Podcast template
- Interview template
- Lecture template

### Phase 5: Custom Templates & Polish (Future)
- Template builder UI
- Export (Markdown, PDF, DOCX)
- Mobile optimization

---

## Key Data Structures

```typescript
interface Session {
  id: string;
  name: string;
  transcriptIds: string[];
  templateId: string;
  notes?: SessionNotes;
  experts?: AIExpert[];
  status: 'draft' | 'processing' | 'complete' | 'error';
  createdAt: string;
  updatedAt: string;
}

interface SessionNotes {
  id: string;
  sessionId: string;
  templateId: string;
  sections: NoteSection[];
  generatedAt: string;
}

interface NoteSection {
  id: string;
  type: string;
  title: string;
  content: string | ActionItem[] | KeyPoint[];
  expertContributions?: ExpertContribution[];
}

interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'meeting' | 'podcast' | 'interview' | 'lecture' | 'custom';
  sections: TemplateSection[];
  promptInstructions: string;
}

interface TemplateSection {
  id: string;
  type: 'summary' | 'action_items' | 'key_points' | 'decisions' | 'questions' | 'custom';
  title: string;
  required: boolean;
  prompt: string;
}

interface AIExpert {
  id: string;
  name: string;
  domain: string;
  icon: string;
  topics: string[];
  relevance: number;
  detectedFrom: 'content_analysis' | 'user_selected';
}

interface ExpertAnnotation {
  id: string;
  expertId: string;
  transcriptId: string;
  entryId: string;
  startTime: number;
  content: string;
  type: 'insight' | 'warning' | 'context' | 'correction' | 'question';
}

interface ExpertContribution {
  expertId: string;
  expertName: string;
  content: string;
  type: 'insight' | 'background' | 'recommendation';
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Session Notes View                        [Export] [Regenerate]│
├───────────────────────────────────────────────┬─────────────────┤
│  Summary                                      │  Experts        │
│  ┌─────────────────────────────────────────┐ │  ┌───────────┐  │
│  │ Executive summary text...               │ │  │ Tech      │  │
│  │ Key Takeaways: • item • item            │ │  │ Expert    │  │
│  └─────────────────────────────────────────┘ │  └───────────┘  │
│                                               │                 │
│  Action Items                                 │  Background     │
│  ┌─────────────────────────────────────────┐ │  ┌───────────┐  │
│  │ ☐ @john: Task description               │ │  │ Research  │  │
│  │ ☐ @sarah: Another task                  │ │  │ on topic  │  │
│  └─────────────────────────────────────────┘ │  └───────────┘  │
│                                               │                 │
│  Annotated Transcript                         │  Feedback       │
│  ┌─────────────────────────────────────────┐ │  ┌───────────┐  │
│  │ [00:02:15] John: The database...        │ │  │ Risk      │  │
│  │            💻 Expert annotation here    │ │  │ warning   │  │
│  └─────────────────────────────────────────┘ │  └───────────┘  │
└───────────────────────────────────────────────┴─────────────────┘
```

---

## Critical Files to Modify

| File | Changes |
|------|---------|
| `packages/types/src/index.ts` | Add Session, SessionNotes, NoteTemplate, AIExpert types |
| `packages/database/src/schema.ts` | Add sessions, sessionNotes, noteTemplates tables |
| `packages/ai-services/src/` | Add note-generator.ts, expert-detector.ts |
| `packages/ui/src/components/` | Add sessions/, notes/, templates/ folders |
| `src/App.tsx` | Add session routes and state management |

---

## AI Prompt Strategy

1. **Topic Detection** - Analyze combined transcript for topics, domains, entities
2. **Expert Matching** - Match detected topics to expert profiles
3. **Section Generation** - Template-specific prompts per section type
4. **Annotation Generation** - Expert persona prompts for inline insights

---

## Built-in Templates

### Meeting Notes Template
**Sections**:
1. Executive Summary (2-3 sentences)
2. Key Decisions Made
3. Action Items (with assignees if detected)
4. Discussion Topics
5. Questions/Follow-ups

### Podcast Template (Phase 4)
**Sections**:
1. Episode Summary
2. Key Topics Discussed
3. Interesting Facts/Stats
4. Quotable Moments
5. References Mentioned

### Interview Template (Phase 4)
**Sections**:
1. Overview
2. Q&A Summary
3. Key Quotes
4. Candidate Strengths/Concerns (if job interview)
5. Follow-up Questions

---

## Expert Registry

### Built-in Experts
| Expert | Domain | Trigger Topics |
|--------|--------|----------------|
| Legal Expert | Law & Compliance | contracts, liability, legal, regulations |
| Tech Expert | Technology | software, API, database, infrastructure |
| Business Expert | Business Strategy | revenue, market, growth, strategy |
| PM Expert | Project Management | timeline, deadline, scope, sprint |
| HR Expert | Human Resources | hiring, performance, benefits, policy |
| Finance Expert | Financial | budget, ROI, cost, investment |

### Expert Detection Algorithm
1. Extract keywords and entities from transcript
2. Match against expert topic lists
3. Rank by frequency and context relevance
4. Return top 3 experts with confidence scores

---

## Deliverables Checklist

### Phase 1 - MVP
- [ ] Session, SessionNotes, NoteTemplate types in `packages/types`
- [ ] Database schema for sessions and notes
- [ ] SessionService (create, read, update, delete)
- [ ] MeetingNotes template implementation
- [ ] NoteGenerator service with Gemini integration
- [ ] SessionList UI component
- [ ] SessionCreate dialog
- [ ] NotesView component
- [ ] NoteSection component
- [ ] Integration with App.tsx

### Phase 2 - AI Experts
- [ ] AIExpert, ExpertAnnotation types
- [ ] ExpertDetector service
- [ ] Expert registry with 6 built-in experts
- [ ] ExpertPanel UI component
- [ ] Expert contributions in note sections

### Phase 3 - Annotations
- [ ] AnnotationService
- [ ] AnnotatedTranscript component
- [ ] BackgroundPanel sidebar
- [ ] Annotation display in transcript entries

---

## Success Criteria

1. User can create a session from 1+ transcripts
2. User can select a template for notes generation
3. AI generates structured notes based on template
4. Notes display in organized sections
5. AI Experts auto-detected from content (Phase 2)
6. Expert annotations appear inline (Phase 3)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI response quality varies | Notes may be incomplete | Retry logic + user can regenerate |
| Expert detection inaccurate | Wrong experts selected | Allow manual override |
| Long transcripts hit token limits | Generation fails | Chunk and summarize strategy |
| Template complexity | Hard to maintain | Start simple, add complexity gradually |

---

## Cross-Epic Value

This feature provides core functionality for all persona modules:

- **Real Estate** (Epic 03): Property showing notes, client meeting summaries
- **Travel** (Epic 07): Trip planning notes, experience logs
- **Students** (Epic 09): Lecture notes, study guides
- **Vehicles** (future): Inspection reports, dealer negotiation notes

Each module can define its own templates and relevant experts while reusing the core infrastructure.

---

**Created**: December 22, 2024
**Status**: Planned
**Dependencies**: Sprint 1-10 core features
