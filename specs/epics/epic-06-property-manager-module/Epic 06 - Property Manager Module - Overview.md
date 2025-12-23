# Epic 06 - Property Manager Module

**Status**: Planned
**Priority**: High (Phase 3 - First Module)
**Dependencies**: Epic 04 (Agent Orchestration), Epic 05 (Guest Module)

---

## Goal

Build Nomi-powered property operations for property managers. Enable efficient management of multiple properties, vendors, and guests through AI-assisted workflows.

---

## Business Value

- Primary Nomi use case
- High-value B2B subscription tier
- N8N workflow showcase
- Operational efficiency gains
- Scalable to 100+ properties

---

## Module Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               PROPERTY MANAGER MODULE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NOMI ORCHESTRATION                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Multi-LLM │ N8N Workflows │ VPN → Haven │ MCP → Aria│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  FEATURES                                                   │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ Property  │ │ Workflow  │ │  Guest    │ │ Financial │   │
│  │ Dashboard │ │ Automation│ │Management │ │ & Legal   │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sprint Overview

### Sprint 6.1: Property Dashboard

- Multi-property overview
- Occupancy calendar
- Revenue tracking
- Quick actions
- Property health scores

### Sprint 6.2: Workflow Automation

- Maid scheduling & dispatch
- Maintenance ticket routing
- Vendor management
- Checklist automation
- N8N workflow templates

### Sprint 6.3: Guest Management

- Guest communication hub
- Booking management integration
- Review tracking & responses
- Guest preferences/history
- VIP guest tagging

### Sprint 6.4: Financial & Legal

- Revenue reporting
- Expense tracking
- Compliance checklists
- Document templates
- Tax preparation support

---

## Technical Scope

### Module Package

```
packages/modules/property-manager/
├── package.json
├── src/
│   ├── index.ts
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── PropertyCalendar.tsx
│   │   ├── WorkflowBuilder.tsx
│   │   ├── GuestHub.tsx
│   │   └── FinancialReports.tsx
│   ├── hooks/
│   │   ├── useProperties.ts
│   │   ├── useWorkflows.ts
│   │   ├── useVendors.ts
│   │   └── useAnalytics.ts
│   └── services/
│       ├── propertyService.ts
│       ├── workflowService.ts
│       ├── vendorService.ts
│       └── reportService.ts
└── README.md
```

### N8N Workflow Templates

- `maid-scheduling` - Auto-schedule cleaning after checkout
- `maintenance-dispatch` - Route tickets to vendors
- `guest-welcome` - Send welcome messages
- `review-request` - Request reviews after checkout
- `revenue-report` - Weekly/monthly reports

### Database Tables

- `property_managers`
- `manager_properties` (junction)
- `vendors`
- `vendor_assignments`
- `workflows`
- `workflow_executions`
- `financial_records`

### API Endpoints

```
GET    /api/v1/manager/dashboard
GET    /api/v1/manager/properties
POST   /api/v1/manager/properties
GET    /api/v1/manager/workflows
POST   /api/v1/manager/workflows
GET    /api/v1/manager/vendors
POST   /api/v1/manager/vendors
GET    /api/v1/manager/reports/:type
POST   /api/v1/manager/guests/:id/message
```

---

## Success Criteria

- [ ] Dashboard loads < 3 seconds
- [ ] Workflow execution success > 99%
- [ ] 50% time saved on routine tasks
- [ ] Support 100+ properties per manager
- [ ] Revenue tracking accuracy > 99.9%

---

## Expert Requirements

| Expert       | Focus                            |
| ------------ | -------------------------------- |
| Domain       | Property management operations   |
| Architecture | Workflow engine, N8N integration |
| Performance  | Dashboard optimization, caching  |
| Security     | Multi-tenant data isolation      |
| Testing      | Workflow reliability tests       |

---

## N8N Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                    N8N WORKFLOW TRIGGERS                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TRIGGERS                    ACTIONS                        │
│  ───────────────────        ───────────────────             │
│  • Guest checkout     →     Schedule cleaning               │
│  • Service request    →     Notify vendor                   │
│  • New booking        →     Send welcome info               │
│  • Checkout complete  →     Request review                  │
│  • Month end          →     Generate reports                │
│  • Low inventory      →     Order supplies                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Related Documents

- [ROADMAP.md](../../ROADMAP.md)
- [ORCHESTRATION.md](../../ORCHESTRATION.md)
- [NAMING_CONVENTIONS.md](../../NAMING_CONVENTIONS.md)
