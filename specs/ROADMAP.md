# SmartHaven AI Platform - Product Roadmap

**Last Updated**: December 24, 2024
**Project Vision**: Multi-module, persona-driven AI platform with agent orchestration
**Current Status**: Epic 2 Sprint 01 - COMPLETE | Epic 2 Sprint 02 - NEXT

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SMARTHAVEN AI PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  LAYER 4: CUSTOMIZATION (Separate Cost)                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  N8N WORKFLOWS - Per-scenario automation & customization        │   │
│  │  Tiers: Local (Property) | Private Cloud | Public               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  LAYER 3: PERSONA MODULES (Subscription Add-ons: $5-10/mo each)         │
│  ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐         │
│  │ Guest  ││Property││Student ││Traveler││  Real  ││Vehicle │ + More  │
│  │ [1st]  ││Mgr[1st]││        ││        ││ Estate ││        │         │
│  └────────┘└────────┘└────────┘└────────┘└────────┘└────────┘         │
│                                                                         │
│  LAYER 2: AI AGENTS (Snap-in Agents)                                    │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐           │
│  │     HAVEN       │ │      NOMI       │ │      ARIA       │ + Future │
│  │  Local/Ollama   │ │ Cloud/Multi-LLM │ │ External/Search │           │
│  │  Private VPN    │ │  Orchestrator   │ │      MCP        │           │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘           │
│                                                                         │
│  LAYER 1: CORE AI PLATFORM (Base Subscription: $10-15/mo)               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  AI INTERACTION METHODS (Build Order: 1→6)                      │   │
│  │  1.API │ 2.Chat │ 3.Media │ 4.Avatar │ 5.IoT │ 6.Agents         │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  CORE CAPABILITIES                                              │   │
│  │  Transcription │ Analysis │ Export │ Storage │ Auth │ Sync     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  LAYER 0: INFRASTRUCTURE                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Monorepo │ Module SDK │ Database │ Deployment │ CI/CD          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  PLATFORMS: Android │ iOS │ Windows │ Mac │ Linux │ Web │ Kiosk │ Sonos│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Agent Ecosystem

### Communication Protocols

```
HAVEN (Local)                    NOMI (Cloud)                    ARIA (External)
     │                                │                                │
     │◄────── Private VPN ──────────►│                                │
     │       (Bidirectional)          │                                │
     │                                │────── MCP Protocol ──────────►│
     │                                │       (Nomi calls Aria)        │
     │                                │                                │
     │  PWA Users ──── HTTPS ────────►│                                │
     │  (Nomi impersonates Haven)     │                                │
```

### Agent Specifications

| Agent     | Location                 | LLM                    | Network         | Primary Function                   |
| --------- | ------------------------ | ---------------------- | --------------- | ---------------------------------- |
| **Haven** | Bee-link SER5 (Property) | Ollama (Local)         | Private VPN     | In-home guest AI, smart home       |
| **Nomi**  | SmartHavenAI.com (VPS)   | Multi-LLM + Ollama     | Private Cloud   | Property management, orchestration |
| **Aria**  | Krowdzing.com            | Multi-LLM + Web Search | External/Public | Travel advisor, bookings           |

---

## Database Architecture

| Data Type             | Technology              | Use Cases                              |
| --------------------- | ----------------------- | -------------------------------------- |
| **Relational**        | PostgreSQL              | Users, transcripts, modules, CRUD      |
| **Vector/Embeddings** | pgvector extension      | RAG, semantic search, similarity       |
| **Knowledge Graph**   | Apache AGE (PostgreSQL) | Relationships, concept maps, workflows |
| **Blob Storage**      | S3/MinIO/Local          | Media files, documents, assets         |

---

## Monetization Model

| Layer               | Pricing                | Description                               |
| ------------------- | ---------------------- | ----------------------------------------- |
| **Core Platform**   | $10-15/mo base         | API, Chat, Media, Avatar, IoT, Agents     |
| **Persona Modules** | $5-10/mo each          | Add/remove based on current life scenario |
| **N8N Workflows**   | $5-20/workflow or tier | Custom automation for power users         |
| **Enterprise**      | Custom pricing         | White-label, SSO, SLA                     |

---

## Epic Roadmap

### PHASE 1: FOUNDATION

#### Epic 0: Original MVP ✅ COMPLETED

**Location**: `specs/epics/epic-00-original-mvp/`

Core transcript parser with Gemini AI integration, video/audio upload, speaker diarization, and export functionality.

- [x] Sprint 1: Foundation & Upload
- [x] Sprint 2: AI Integration (Gemini)
- [x] Sprint 3: Backend Infrastructure
- [x] Sprint 4: Transcript Viewer
- [x] Sprint 5: Export Functionality (partial)
- [x] Sprint 6: Premium UX
- [x] Sprint 7: Backend Integration

---

#### Epic 1: Monorepo Foundation ✅ COMPLETE

**Location**: `specs/epics/epic-01-monorepo-foundation/`

Establish scalable monorepo infrastructure for modular development.

**Sprint 01**: Package Extraction & Setup ✅ SIGNED OFF (Dec 23, 2024)

- [x] Turborepo + pnpm workspaces
- [x] 8 packages extracted (@transcript-parser/\*)
- [x] Module SDK architecture
- [x] Docker persistent volumes and dev environment
- [x] Multi-device E2E testing (Desktop, Mobile, Tablet)
- [x] Production deployment verified (SmartHavenAI.com)

**Sign-off**: [SIGN_OFF.md](./epics/epic-01-monorepo-foundation/sprints/sprint-01/SIGN_OFF.md)

---

### PHASE 2: IDENTITY & INTERACTION

#### Epic 2: User Profiles & Persona System 🔄 IN PROGRESS

**Location**: `specs/epics/epic-02-user-profiles/`
**Goal**: Establish user identity before building interaction methods

**Sprint 01: Authentication, Profiles, MFA & Onboarding** ✅ COMPLETE (Dec 24, 2024)

- [x] Database schema (36 tables with Drizzle ORM)
- [x] CRUD services & API routes (16 endpoints)
- [x] MFA & Guest Access (13 endpoints)
- [x] Onboarding Flow UI (8 components)
- [x] Testing & Validation (503+ tests)

**Sign-off**: [SIGN_OFF.md](./epics/epic-02-user-profiles/sprints/sprint-01/SIGN_OFF.md)

**Sprint 02: Subscription Management** 🔜 NEXT

- Stripe integration
- Module activation/deactivation
- Usage tracking per user
- Billing portal
- Email verification flow

**Sprint 03: OAuth & Advanced Features**

- OAuth providers (Google, GitHub)
- Password reset flow
- Profile image upload
- Module recommendations

---

#### Epic 3: AI Interaction Platform

**Location**: `specs/epics/epic-03-ai-interaction-platform/`
**Goal**: Build 6 core AI interaction methods

| Sprint | Focus                         | Priority |
| ------ | ----------------------------- | -------- |
| 3.1    | API Foundation                | 1st      |
| 3.2    | Chat Interface                | 2nd      |
| 3.3    | Media Input Pipeline          | 3rd      |
| 3.4    | Avatar System                 | 4th      |
| 3.5    | IoT Integration (Kiosk/Sonos) | 5th      |
| 3.6    | Agent Communication (MCP/N8N) | 6th      |

---

#### Epic 4: Agent Orchestration Layer

**Location**: `specs/epics/epic-04-agent-orchestration/`
**Goal**: Framework for Haven, Nomi, Aria integration

| Sprint | Focus                                        |
| ------ | -------------------------------------------- |
| 4.1    | Agent SDK                                    |
| 4.2    | Haven Integration (Home Assistant, Ollama)   |
| 4.3    | Nomi Integration (Cloud, Multi-LLM)          |
| 4.4    | Aria Integration (External APIs, Web Search) |
| 4.5    | LLM Infrastructure (Router, Fallbacks)       |

---

### PHASE 3: FIRST MODULES (Haven/Nomi Ecosystem)

#### Epic 5: Guest Module 🎯 FIRST MODULE

**Location**: `specs/epics/epic-05-guest-module/`
**Goal**: Complete guest experience at properties

| Sprint | Focus                            |
| ------ | -------------------------------- |
| 5.1    | In-Property Experience           |
| 5.2    | Service Requests                 |
| 5.3    | Local Recommendations (via Aria) |
| 5.4    | Communication                    |

---

#### Epic 6: Property Manager Module 🎯 FIRST MODULE

**Location**: `specs/epics/epic-06-property-manager-module/`
**Goal**: Nomi-powered property operations

| Sprint | Focus               |
| ------ | ------------------- |
| 6.1    | Property Dashboard  |
| 6.2    | Workflow Automation |
| 6.3    | Guest Management    |
| 6.4    | Financial & Legal   |

---

### PHASE 4: EXPANSION MODULES

#### Epic 7: Student Module

**Location**: `specs/epics/epic-07-student-module/`
Lecture transcription, flashcards, study tools

#### Epic 8: Travel Module

**Location**: `specs/epics/epic-08-travel-module/`
Tour recordings, itinerary building, Aria integration

#### Epic 9: Real Estate Module

**Location**: `specs/epics/epic-09-real-estate-module/`
Property viewing recordings, comparison, decision support

#### Epic 10: Vehicle Module

**Location**: `specs/epics/epic-10-vehicle-module/`
Test drive recordings, TCO calculator, negotiation tracking

#### Epic 11: Business Module

**Location**: `specs/epics/epic-11-business-module/`
Meeting transcription, action items, integrations

---

### PHASE 5: CUSTOMIZATION & SCALE

#### Epic 12: N8N Workflow Marketplace

**Location**: `specs/epics/epic-12-n8n-marketplace/`

- Self-hosted N8N integration
- Pre-built workflow templates
- Workflow marketplace (buy/sell)
- Tiered deployment (Local/Private Cloud/Public)

#### Epic 13: Multi-Platform Deployment

**Location**: `specs/epics/epic-13-multi-platform/`

- Android & iOS apps
- Desktop apps (Windows, Mac, Linux)
- PWA enhancements
- Kiosk deployment tools

#### Epic 14: Marketplace & Enterprise

**Location**: `specs/epics/epic-14-marketplace-enterprise/`

- Module marketplace
- Enterprise white-label
- SSO (SAML, OAuth)
- Usage reporting & SLA

---

## Infrastructure

### Cloud (Hostinger)

| Domain                    | Purpose           | Agent  |
| ------------------------- | ----------------- | ------ |
| SmartHavenAI.com          | Nomi Portal (VPS) | Nomi   |
| Krowdzing.com             | Aria Portal       | Aria   |
| PromptSourceSolutions.com | Consulting        | Public |
| PromptSource.live         | Demo Environment  | Demo   |

### On-Premise (Per Property)

| Component | Model              | Purpose                    |
| --------- | ------------------ | -------------------------- |
| Mini PC   | Bee-link SER 5     | Haven + Ollama             |
| Kiosk     | 11" Android Tablet | Guest interface (optional) |
| Speakers  | Sonos              | TTS output (optional)      |
| Smart Hub | Home Assistant     | Device integration         |

---

## Implementation Sequence

```
Phase 1 ✅ COMPLETE        Phase 2 (Current)          Phase 3
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Epic 1: Monorepo │ ──►  │ Epic 2: Profiles │ ──►  │ Epic 5: Guest    │
│ ✅ COMPLETE      │      │ Sprint 1 ✅      │      │ Epic 6: Property │
│                  │      │ Sprint 2 🔜      │      │   Manager        │
│                  │      │ Epic 3: AI       │      │                  │
│                  │      │ Epic 4: Agent    │      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## Success Metrics

| Phase   | Key Metrics                                    | Target                        |
| ------- | ---------------------------------------------- | ----------------------------- |
| Phase 2 | API response time, Chat engagement             | <200ms, 5min avg session      |
| Phase 3 | Guest satisfaction, PM efficiency              | 4.5+ rating, 50% time saved   |
| Phase 4 | Module adoption, subscription conversion       | 2+ modules/user, 5% free→paid |
| Phase 5 | Workflow marketplace revenue, enterprise deals | $5k MRR, 2 enterprise         |

---

## Related Documents

- [ORCHESTRATION.md](./ORCHESTRATION.md) - Claude development workflow
- [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) - File and branch naming standards
- [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) - Sprint execution process

---

**Next Review**: After Epic 1 Sprint 01 completion
