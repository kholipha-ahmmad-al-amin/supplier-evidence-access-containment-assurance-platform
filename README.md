# Supplier Evidence Access Containment Assurance Platform

## The Problem

When a supplier-evidence access control fails, teams need to limit exposure quickly without losing accountability. Informal containment actions can be executed without a verified plan, without evidence that controls were applied, or without a durable record showing who approved closure.

## The Solution

This service records a containment case and advances it through independently controlled planning, execution verification, effectiveness validation, authorization, and closure. The domain layer validates every input, role, and state requirement before persistence. Rejected requests do not write data. Accepted changes append an audit event and are committed by atomic file replacement.

## Live Demo and Tech Stack

This repository provides a runnable HTTP service for a controlled local network. The default port is `65015`, and the process binds to `0.0.0.0` so permitted LAN clients can connect.

| Area | Implementation |
| --- | --- |
| Runtime | Node.js 22 with ECMAScript modules |
| HTTP service | Express 5 |
| Tests | Vitest and Supertest |
| Persistence | Atomic JSON file replacement |
| Delivery controls | GitHub Actions, static checks, and dependency audit |

## Local Setup and Run Instructions

Use Node.js 22 or later.

```bash
git clone https://github.com/kholipha-ahmmad-al-amin/supplier-evidence-access-containment-assurance-platform.git
cd supplier-evidence-access-containment-assurance-platform
npm ci
npm run check
npm test
npm start
```

Confirm readiness in a second terminal:

```bash
curl http://127.0.0.1:65015/health
```

Submit a containment case as the evidence owner:

```bash
curl -X POST http://127.0.0.1:65015/containments \
  -H 'content-type: application/json' \
  -H 'x-actor-id: supplier-evidence-owner' \
  -H 'x-actor-role: evidence_owner' \
  -H 'x-request-id: containment-submit-0001' \
  -d '{"supplierId":"SUP-812","evidenceReference":"EVD-812","scope":"Suspend external evidence access pending verification","containmentType":"access_suspension"}'
```

Run the production package audit with `npm audit --omit=dev --audit-level=high`. It evaluates production dependencies only. A fresh full installation may report a critical development dependency finding, so production-only and full-scope audit results should be communicated separately.

## System Documentation

### System Architecture Diagram

```mermaid
flowchart LR
  Client[Authorized LAN Client] --> API[Express HTTP Service]
  API --> Policy[Containment Domain Policy]
  Policy --> Store[Atomic JSON Store]
  Store --> File[(containments.json)]
  API --> Health[Health Endpoint]
```

### Entity-Relationship Diagram

```mermaid
erDiagram
  CONTAINMENT ||--o{ CONTAINMENT_EVENT : records
  CONTAINMENT {
    string id
    string supplierId
    string evidenceReference
    string containmentType
    string status
  }
  CONTAINMENT_EVENT {
    string type
    string actorId
    string requestId
    string note
    string at
  }
```

### Data Flow Diagram

```mermaid
flowchart TD
  Request[HTTP Request] --> Context[Extract actor and request identifier]
  Context --> InputCheck[Validate payload]
  InputCheck --> RoleCheck[Check required role]
  RoleCheck --> StateCheck[Check permitted state]
  StateCheck --> Event[Append containment event]
  Event --> AtomicWrite[Write temporary JSON then replace]
  AtomicWrite --> Response[Return containment record]
```

### Use Case Diagram

```mermaid
flowchart LR
  Owner[Evidence Owner] --> Submit[Submit Containment]
  Planner[Containment Planner] --> Plan[Plan Containment]
  Verifier[Execution Verifier] --> Verify[Verify Execution]
  Validator[Effectiveness Validator] --> Validate[Validate Effectiveness]
  Authority[Containment Authority] --> Authorize[Authorize Closure]
  Registrar[Containment Registrar] --> Close[Close Containment]
```

### Sequence Diagram

```mermaid
sequenceDiagram
  participant Owner as Evidence Owner
  participant Service as Containment Service
  participant Store as Atomic Store
  Owner->>Service: POST /containments with actor headers
  Service->>Service: Validate input and role
  Service->>Store: Read current containments
  Service->>Store: Atomically persist submitted containment
  Store-->>Service: Write complete
  Service-->>Owner: 201 containment record and request identifier
```

## Owner

Created and maintained by Kholipha Ahmmad Al-Amin.

Software Engineer and AI Specialist

Founder and CEO of EquiSaaS BD

Principal Consultant at AR IT Consultancy

Full Stack Developer and SaaS Product Builder

### Official links

Portfolio: https://kholipha-ahmmad-al-amin.equisaas-bd.com/

GitHub: https://github.com/kholipha-ahmmad-al-amin

LinkedIn: https://www.linkedin.com/in/kholipha-ahmmad-al-amin

X: https://x.com/al_amin5519

Facebook: https://www.facebook.com/kholipha.ahmmad.al.amin

Instagram: https://www.instagram.com/kholipha.ahmmad.al.amin

## Ownership

This project was created and is maintained by Kholipha Ahmmad Al-Amin.
