# Epic 05 - Guest Module

**Status**: Planned
**Priority**: High (Phase 3 - First Module)
**Dependencies**: Epic 04 (Agent Orchestration)

---

## Goal

Build the complete guest experience at properties. This is the first persona module and demonstrates the module architecture for future modules.

---

## Business Value

- First revenue-generating module
- Demonstrates module SDK capabilities
- Direct Haven/Nomi integration showcase
- Guest satisfaction drives property reviews
- Foundation for property manager workflows

---

## Module Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GUEST MODULE                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INTERACTION METHODS                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Kiosk (Haven) │ PWA (Nomi) │ Chat │ Avatar │ Sonos  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  FEATURES                                                   │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ Property  │ │ Service   │ │  Local    │ │Communication
│  │   Info    │ │ Requests  │ │   Recs    │ │   Hub     │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sprint Overview

### Sprint 5.1: In-Property Experience

- Property info & amenities display
- House rules & instructions
- Wi-Fi, parking, check-in/out info
- Emergency contacts
- Property photo gallery

### Sprint 5.2: Service Requests

- Request cleaning/maintenance
- Report issues with photos
- Order supplies
- Track request status
- Notification on completion

### Sprint 5.3: Local Recommendations

- Restaurant suggestions (via Aria)
- Activity recommendations
- Transportation options
- Delivery services
- Booking integration

### Sprint 5.4: Communication

- Message property manager
- Automated responses
- Notification preferences
- Multi-language support
- Chat history

---

## Technical Scope

### Module Package

```
packages/modules/guest/
├── package.json
├── src/
│   ├── index.ts
│   ├── components/
│   │   ├── PropertyInfo.tsx
│   │   ├── ServiceRequest.tsx
│   │   ├── LocalRecs.tsx
│   │   └── GuestChat.tsx
│   ├── hooks/
│   │   ├── useProperty.ts
│   │   ├── useServiceRequest.ts
│   │   └── useRecommendations.ts
│   └── services/
│       ├── propertyService.ts
│       ├── requestService.ts
│       └── ariaService.ts
└── README.md
```

### Database Tables

- `properties`
- `property_amenities`
- `service_requests`
- `guest_preferences`
- `recommendation_cache`

### API Endpoints

```
GET    /api/v1/properties/:id
GET    /api/v1/properties/:id/amenities
POST   /api/v1/service-requests
GET    /api/v1/service-requests/:id
GET    /api/v1/recommendations
POST   /api/v1/guest/messages
```

---

## Success Criteria

- [ ] Guest satisfaction rating > 4.5/5
- [ ] Service request response < 2 hours
- [ ] Local rec click-through > 30%
- [ ] Multi-language support (5+ languages)
- [ ] PWA works offline (basic features)

---

## Expert Requirements

| Expert       | Focus                            |
| ------------ | -------------------------------- |
| UX           | Guest journey, mobile experience |
| Domain       | Hospitality best practices       |
| Architecture | Module SDK usage                 |
| Performance  | Offline support, caching         |
| Testing      | Guest flow E2E tests             |

---

## Related Documents

- [ROADMAP.md](../../ROADMAP.md)
- [ORCHESTRATION.md](../../ORCHESTRATION.md)
- [NAMING_CONVENTIONS.md](../../NAMING_CONVENTIONS.md)
