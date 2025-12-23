# Epic 04 - Agent Orchestration Layer

**Status**: Planned
**Priority**: High (Phase 2)
**Dependencies**: Epic 03 (AI Interaction Platform)

---

## Goal

Build the framework for Haven, Nomi, and Aria integration. Enable agents to work together seamlessly across local and cloud environments.

---

## Business Value

- Unified agent ecosystem
- Privacy-respecting local AI (Haven)
- Cloud orchestration capabilities (Nomi)
- External service integration (Aria)
- Scalable multi-property support

---

## Agent Architecture

```
HAVEN (Local)                NOMI (Cloud)                ARIA (External)
     │                            │                            │
     │◄─── Private VPN ─────────►│                            │
     │     (Bidirectional)        │                            │
     │                            │───── MCP Protocol ────────►│
     │                            │                            │
┌────┴────────────────┐    ┌──────┴──────────┐    ┌───────────┴───────┐
│  LLM: Ollama Local  │    │  LLM: Multi-LLM │    │  LLM: Multi + Web │
│  Privacy: Maximum   │    │  + Ollama       │    │  External APIs    │
│  Network: Private   │    │  Network: Priv  │    │  Network: Public  │
└─────────────────────┘    └─────────────────┘    └───────────────────┘
```

---

## Sprint Overview

### Sprint 4.1: Agent SDK

- Agent registration interface
- Capability declaration schema
- LLM configuration per agent
- Privacy/network level settings
- Health checks & monitoring

### Sprint 4.2: Haven Integration

- Home Assistant connector
- Local Ollama LLM configuration
- Kiosk + Sonos output routing
- Private VPN tunnel to Nomi
- PWA impersonation mode

### Sprint 4.3: Nomi Integration

- Cloud deployment (Docker/K8s)
- Multi-LLM router (Claude, Gemini, GPT-4, Ollama)
- Workflow orchestration engine
- MCP server for Aria
- Property management domain logic

### Sprint 4.4: Aria Integration

- External service connectors
- Web search integration (Tavily, Serper)
- Booking API integrations
- Professional handoff system
- Travel domain logic

### Sprint 4.5: LLM Infrastructure

- LLM abstraction layer
- Model routing (task → best model)
- Fallback chains (Claude → Gemini → Ollama)
- Cost tracking per model
- Local vs cloud selection

---

## Technical Scope

### New Packages

- `packages/agent-sdk/` - Agent SDK
- `packages/haven/` - Haven agent
- `packages/nomi/` - Nomi agent
- `packages/aria/` - Aria agent
- `packages/llm/` - LLM abstraction

### Communication Protocols

| Route        | Protocol    | Use Case            |
| ------------ | ----------- | ------------------- |
| Haven ↔ Nomi | Private VPN | Bidirectional sync  |
| Nomi → Aria  | MCP         | External requests   |
| PWA → Nomi   | HTTPS       | Remote guest access |

---

## Success Criteria

- [ ] Agent SDK enables new agents in < 1 day
- [ ] Haven operates fully offline
- [ ] Nomi orchestrates 100+ properties
- [ ] Aria completes bookings end-to-end
- [ ] LLM fallback < 500ms switch time

---

## Expert Requirements

| Expert       | Focus                               |
| ------------ | ----------------------------------- |
| Architecture | Agent patterns, distributed systems |
| Security     | VPN configuration, MCP security     |
| Performance  | LLM routing, latency optimization   |
| Domain       | Property management, travel         |
| Testing      | Agent integration tests             |

---

## Related Documents

- [ROADMAP.md](../../ROADMAP.md)
- [ORCHESTRATION.md](../../ORCHESTRATION.md)
- [NAMING_CONVENTIONS.md](../../NAMING_CONVENTIONS.md)
