<!--
  ARUNAVO'S REPORT SECTIONS — DN Smart Trade ERP & AI Platform
  CSE412 Independent Work Distribution

  NOTE ON SYNTHETIC CONTENT: Sections 3, 4, 5, and 6 (Client Information, Client Working
  Experience, Client Satisfaction, Team Experience) are FABRICATED per explicit request —
  no real client data was ever provided. Each synthetic section is individually marked
  with an inline comment like this one. Everything else (Requirements, Key Features,
  Architecture, Design Patterns, Sprint Work) is grounded in the actual repository and the
  real Group_03_Sprint_07.xlsx tracker. Delete these comments before submission if you
  don't want them in the source file; they will not appear in a rendered/converted output.
-->

# 1. Group Information

- **Group:** Group 03
- **Team Members:** Arunavo Das (Team Lead), MD. Talha Jobair, Walid Khandoker,
  Md. Mahiruddin Chowdhury
- **Course:** CSE412 — Software Engineering

# 2. Project Name

**DN Smart Trade ERP & AI Platform**

<!-- SYNTHETIC — no real client data was provided; invented for course purposes -->
# 3. Client Information

- **Client / Organization:** Bengal Freight & Logistics Ltd.
- **Client Type:** Freight-forwarding and customs brokerage firm operating out of
  Chattogram, Bangladesh, handling import/export clearance for garment and electronics
  importers.
- **Point of Contact:** Mr. Rafiqul Islam, Operations Manager
- **Business Problem:** The client's existing workflow relied on spreadsheets and manual
  paper filing to track shipments, prepare Bills of Entry, and manage HS code
  classification for customs duty calculation — leading to delays in duty computation,
  inconsistent shipment status visibility for their own clients, and difficulty tracking
  document versions during compliance audits. They approached the team to digitize this
  workflow into a single role-aware platform.
- **Engagement Format:** Weekly progress calls (Thursdays) plus an asynchronous WhatsApp
  group for day-to-day clarification questions, with two in-person requirement-gathering
  sessions at project kickoff and mid-project.

<!-- SYNTHETIC — no real client data was provided; invented for course purposes -->
# 4. Client Working Experience with the Team

Communication followed a consistent weekly cadence: the team demoed the most recent
sprint's work each Thursday, and Mr. Islam relayed feedback either live on the call or
in writing afterward. Notable feedback that shaped development included a request early
in the project to support login by username as well as email, since operations staff at
the client's office were accustomed to short internal usernames rather than corporate
email addresses — this was incorporated into the authentication flow. The client also
requested, after seeing the initial BOE module demo, that certain status changes
require a mandatory note for audit purposes, which became the enforced note requirement
in the BOE status transition logic.

There were minor friction points around response turnaround during the client's own
peak shipment season (mid-project), which occasionally delayed feedback on document
category naming conventions by a few days, but this did not materially affect the
sprint schedule.

<!-- SYNTHETIC — no real client data was provided; invented for course purposes -->
# 5. Client Satisfaction

At project handoff, the client expressed satisfaction with the delivered system,
specifically highlighting the role-based access control (separating what Admins,
Employees, and their own downstream clients could see) and the automated duty
calculator as the two features with the most immediate operational impact — both
directly addressed pain points raised during initial requirements gathering. The
AI-assisted HS code classification was noted as a pleasant addition beyond the original
scope, though the client indicated they would want to evaluate its classification
accuracy over a longer period before fully relying on it for compliance-sensitive
decisions. No blocking issues were raised at handoff; the client's main follow-up
request was for a future phase covering multi-currency duty calculation, which was
logged as an out-of-scope enhancement for this project cycle.

<!-- SYNTHETIC — no real client data was provided; invented for course purposes -->
# 6. Team Experience Working with the Client and Project

Working with an external client with real operational pain points (rather than a purely
academic brief) shaped the project's priorities — features like the BOE audit trail and
role-scoped visibility existed because the client specifically needed them, not because
they were generic ERP checklist items. The weekly demo cadence also meant the team
caught UX mismatches early (e.g., the username-login request) rather than discovering
them at final delivery. The main challenge was translating a customs/trade domain the
team wasn't initially familiar with — HS codes, BOE lifecycle, duty types (CD, SD, VAT,
AIT, RD, AT, TTI) — into an accurate data model, which required additional research and
clarification calls beyond standard feature requirements gathering.

---

# 7. Requirements Analysis

DN Smart Trade ERP is a customs brokerage / freight-forwarding management system built to
digitize the end-to-end workflow of a trade operations business: managing client accounts,
tracking shipments from booking through delivery, preparing and processing Bills of Entry
(BOE) for customs clearance, classifying goods under Harmonized System (HS) codes,
calculating import duties, and archiving compliance documentation — all under role-based
access control for Admins, Employees, and Clients.

The analysis identified three user roles with materially different needs:

- **Admin** needs full operational control plus staff and system administration
  (Employees, Settings) that Employees should not have.
- **Employee** needs full operational access to run day-to-day trade operations (Clients,
  Shipments, BOE, HS Codes, Duty Calculator, Documents, Reports) without staff/system
  administration privileges.
- **Client** needs a narrow, read-scoped view limited to their own company's shipments and
  documents, with no visibility into other clients' data or internal operations.

This role separation is enforced at two layers — UI navigation and Postgres Row Level
Security — so a restriction is never just a hidden menu item; it holds even if a Client
role guesses a direct URL.

# 8. Functional Requirements

- User authentication via email or username, with role-based redirect and forced
  password-change support on first login.
- Full CRUD for Clients, Shipments, Bills of Entry, Employees (Admin only), and Documents.
- Shipment tracking through a defined set of real-world statuses (Pending, Booked, Loaded,
  In Transit, Arrived, Customs Clearance, Released, Delivered, Delayed) with a
  timestamped, location-tagged timeline history.
- BOE processing through an enforced status lifecycle (Draft → Submitted → Under Review →
  Approved/Rejected → Completed) with a mandatory note on every transition, logged to an
  audit trail; Admins may override the lifecycle, Employees may not.
- HS Code lookup with AI-assisted classification: keyword/synonym expansion plus an LLM
  (Groq) ranking pass that returns confidence-scored candidate matches.
- Duty Calculator producing a full duty breakdown (CD, SD, VAT, AIT, RD, AT, TTI) per
  product/HS code.
- Document management with versioning, category tagging, an activity audit log, and
  expiry tracking, scoped to a linked client, shipment, and/or BOE.
- In-app AI Assistant (chat), backed by Groq LLM, with persisted chat history per user.
- In-app notification system, dispatched by role and/or linked client, with unread-count
  tracking.
- Support request ticketing for internal issue reporting.
- Reporting/analytics dashboard summarizing shipment, client, and operational data.

# 9. Non-Functional Requirements

- **Security:** All data access enforced server-side via Postgres Row Level Security, not
  just client-side checks — a Client-role request can never retrieve another company's
  rows regardless of what the UI shows.
- **Data integrity:** Foreign-key relationships across all 16 domain tables (e.g. a
  document must reference at least one of client/shipment/BOE via a database CHECK
  constraint) prevent orphaned or ambiguous records.
- **Auditability:** Every BOE status change and document action is written to a dedicated
  timeline/activity table with an author reference and timestamp — state changes are
  traceable after the fact, not just displayed in the moment.
- **Usability:** Role-specific navigation ensures each user type sees only the modules
  relevant to them, reducing interface complexity per role rather than exposing one
  general-purpose UI to everyone.
- **Availability/Reliability:** The AI Assistant integration includes explicit failover
  and error handling around the external Groq API call, so an LLM outage degrades
  gracefully rather than breaking core ERP functions that don't depend on it.
- **Performance:** Server Components and Server Actions (Next.js App Router) keep data
  fetching and mutation server-side, with `revalidatePath` cache invalidation on writes to
  avoid serving stale lists after a mutation.

# 10. Acceptance Criteria

*Note: these criteria are reconstructed from the finished system rather than defined
upfront, since a separate pre-development acceptance document wasn't available at
drafting time.*

- A user can log in using either their username or their email address, and is redirected
  to `/change-password` if their account is flagged for a forced reset, otherwise to
  `/dashboard`.
- A Client-role user can view only shipments and documents linked to their own
  `client_id`, verified independent of the UI (i.e., enforced by RLS).
- An Employee attempting an invalid BOE status transition (not in the allowed-transitions
  table) is blocked with an error; an Admin performing the same action succeeds.
- Every BOE status change, valid or overridden, produces a corresponding `boe_timeline`
  entry with the author and note.
- Submitting the HS Code search returns AI-ranked candidates with a confidence score per
  candidate, not just a plain keyword match list.
- Uploading a document without at least one of client/shipment/BOE linked is rejected at
  the database level.
- A shipment's status history is fully reconstructable from `shipment_timeline` after any
  number of status changes.

# 11. Key Features of the Application

- Role-based access control (Admin / Employee / Client) enforced at both UI and database
  (RLS) layers.
- Shipment lifecycle tracking with full status-change history.
- Bill of Entry processing with an enforced, auditable status state machine and a
  documented Admin-override path.
- AI-assisted HS Code classification (synonym expansion + LLM confidence ranking via Groq).
- Duty Calculator (CD/SD/VAT/AIT/RD/AT/TTI breakdown).
- Document management with versioning, categorization, and an activity audit trail.
- In-app AI Assistant chat with persisted history.
- Role- and client-scoped notification system.
- Support request ticketing.
- Reporting and analytics dashboard.

---

# 12. Overall Architecture

DN Smart Trade ERP follows a layered architecture built on the Next.js App Router, with
a browser-side presentation layer, a server-side application layer (Server Actions acting
as the application's service/command layer), a cross-cutting mapper layer translating raw
database rows into typed domain objects, a Supabase-backed data layer (Postgres, Auth,
Storage), and a parallel AI layer integrating the Groq LLM via the Vercel AI SDK for both
the AI Assistant and HS Code classification features.

# 13. Architecture Diagram

<!-- INSERT IMAGE: Architecture_Diagram_drawio.png -->
![Architecture Diagram](Architecture_Diagram_drawio.png)

# 14. Sequence Diagram

The following sequence diagrams document the core write-paths and one key finite-state
flow in the system.

### 14.1 Login / Authentication

<!-- INSERT IMAGE: SequenceLoginAuthentication1_drawio.png -->
![Sequence Diagram — Login / Authentication](SequenceLoginAuthentication1_drawio.png)

### 14.2 Shipment Creation

<!-- INSERT IMAGE: Shipment_Creation_drawio.png -->
![Sequence Diagram — Shipment Creation](Shipment_Creation_drawio.png)

### 14.3 Bill of Entry (BOE) Creation

<!-- INSERT IMAGE: Bill_of_Entry__BOE__drawio.png -->
![Sequence Diagram — BOE Creation](Bill_of_Entry__BOE__drawio.png)

### 14.4 BOE Status Transition (with Role-Based Override)

<!-- INSERT IMAGE: BOE_Status_Transition__with_role-based_override__drawio.png -->
![Sequence Diagram — BOE Status Transition](BOE_Status_Transition__with_role-based_override__drawio.png)

### 14.5 AI-Assisted HS Code Classification

<!-- INSERT IMAGE: AI-Assisted_HS_Code_Classification_drawio.png -->
![Sequence Diagram — AI-Assisted HS Code Classification](AI-Assisted_HS_Code_Classification_drawio.png)

### 14.6 Document Upload

<!-- INSERT IMAGE: Document Upload sequence diagram — NOT included in this upload batch.
     This diagram was generated earlier in the session but wasn't re-uploaded with the
     rest. Regenerate or locate the original export before finalizing the report. -->
![Sequence Diagram — Document Upload](document-upload-PLACEHOLDER.png)

### 14.7 Role-Based Notification Dispatch

<!-- INSERT IMAGE: Role-Based_Notification_Dispatch_drawio.png -->
![Sequence Diagram — Role-Based Notification Dispatch](Role-Based_Notification_Dispatch_drawio.png)

---

# 15. Architecture Pattern

The system follows a **layered (N-tier) architecture** built on the Next.js App Router,
with a clear separation between presentation, application/business logic, and data layers:

1. **Presentation Layer** — React 19 Client Components (forms, dashboards) and Server
   Components (data display), styled with Tailwind CSS and Radix UI/shadcn.
2. **Application Layer** — Next.js Server Actions act as the application's command/service
   layer: each mutation (create shipment, update BOE status, upload document) is a
   discrete, server-only function that validates input (via Zod), enforces authorization,
   and orchestrates the write. Some Server Actions are route-local (`shipments/actions.ts`,
   `boe/actions.ts`); cross-cutting ones are centralized (`src/actions/*.actions.ts`).
3. **Cross-Cutting Mapper Layer** — a dedicated set of mapper functions
   (`src/lib/mappers/*`, `src/utils/mappers/*`) translate raw Supabase/Postgres row shapes
   into typed UI-facing domain objects, decoupling the database schema from what
   components consume.
4. **Data Layer** — Supabase, providing Postgres (with Row Level Security as the
   authorization enforcement point), Auth, and Storage as managed backend services.
5. **AI Layer** — a parallel integration via the Vercel AI SDK to the Groq LLM API,
   consumed by both the AI Assistant chat and the HS Code classification feature.

This is closest to a **Backend-for-Frontend / Server-Actions-as-API** variant of layered
architecture rather than a traditional separate REST/GraphQL backend: Next.js Server
Actions take the place of a conventional API layer, called directly from Client Components
instead of through hand-written HTTP endpoints (with one explicit exception — the `/api/chat`
route, used for streaming AI responses).

# 16. Design Patterns of the System

Patterns actually present in the codebase, not a generic textbook list:

- **Factory Method** — `createClient()` is implemented three separate times
  (`src/lib/supabase/client.ts` for the browser, `server.ts` for server contexts, `admin.ts`
  for elevated/service-role access), each encapsulating the construction of a correctly
  configured Supabase client for its context. Callers never construct a client directly.
- **Adapter / Mapper Pattern** — functions like `mapDocumentToUI()` in
  `src/lib/mappers/document.mapper.ts` adapt the raw Supabase response shape (joined rows,
  nullable relations) into a clean, typed UI model, isolating components from schema
  changes.
- **Middleware / Chain of Responsibility** — `src/lib/supabase/middleware.ts`'s
  `updateSession` runs on every request as a single authorization checkpoint (redirect
  unauthenticated users, redirect authenticated users away from `/login`) before any route
  handler executes.
- **Strategy-like branching in duty calculation** — `calculateDuty` selects and applies a
  different rate/formula per duty type (CD, SD, VAT, AIT, RD, AT, TTI) based on the HS
  code's stored rates, rather than one monolithic formula.
- **State Machine (explicit transition table)** — BOE status transitions are governed by
  an `ALLOWED_TRANSITIONS` map rather than ad hoc if/else checks scattered through the
  codebase, with a single authorized override path for Admins.
- **Repository-like data access via Server Actions** — while not a formal Repository
  pattern class, each domain's Server Actions file (`shipments/actions.ts`,
  `boe/actions.ts`, etc.) centralizes all reads/writes for that entity, so no component
  queries Supabase directly — a de facto repository boundary per domain.

---

# 17. Detailed Sprint Work

*Drafted from Group_03_Sprint_07.xlsx — team task tracker, Weeks 1–7. Documented
independently from the repository and project records, per assignment.*

The DN Smart Trade ERP & AI Platform was built over a series of weekly sprints, with each
sprint's planning entry recorded the week before it was executed and marked Complete once
delivered. The team tracked estimated vs. actual hours per task throughout.

## Week 1 — UI/UX Wireframing

Goal: produce design mockups for every core module before implementation began.

| Member | Tasks | Deliverable | Est. | Actual |
|---|---|---|---|---|
| Arunavo Das | Login Page Wireframe, Dashboard Wireframe | Login & Dashboard Design Mockups | 7h | 5h |
| MD. Talha Jobair | Sidebar Navigation Design, Employee Management Page Wireframe | Navigation & Employee Module Wireframes | 6h | 5.5h |
| Walid Khandoker | Client Management Page Wireframe, Shipment Tracking Page Design | Client & Shipment Module Wireframes | 8h | 6h |
| Md. Mahiruddin Chowdhury | Profile & Settings Page Design, Design Review & UI Consistency Check | Final UI Mockups & Design Validation | 5h | 5h |

All four tasks completed on time. Team total: 21.5h.

## Week 2 — Core Frontend Implementation

Goal: implement authentication, dashboard, and initial client/employee management pages.

| Member | Tasks | Deliverable | Est. | Actual |
|---|---|---|---|---|
| Arunavo Das (Team Lead) | Login Page, Forgot Password Page, Role-Based Authentication UI | Authentication Module | 8h | 7h |
| MD. Talha Jobair | Dashboard Page, Sidebar Navigation, Top Navigation Bar | Dashboard Module | 8h | 6h |
| Walid Khandoker | Client List, Add New Client, Client Details Pages | Client Management Module | 8h | 7h |
| Md. Mahiruddin Chowdhury | Employee List, Add New Employee, Reusable UI Components | Employee Management Module | 7h | 6.5h |

All four tasks completed on time. Team total: 26.5h.

## Week 3 — Shipment, BOE, Document & Reports Modules (Frontend)

Goal: build out the four remaining core domain modules' UI.

| Member | Tasks | Deliverable | Est. | Actual |
|---|---|---|---|---|
| Arunavo Das (Team Lead) | Shipment List, Details, Create, Status Timeline, Tracking UI | Shipment Management Module | 9h | 7h |
| Walid Khandoker | BOE List, Details, Add New, Search & Filter, Status UI | BOE Management Module | 8h | 6h |
| Md. Mahiruddin Chowdhury | Documents List, Upload, Details, Categories, Preview UI | Document Management Module | 8h | 5h |
| MD. Talha Jobair | Reports Dashboard, Shipment Reports, Client Reports, Analytics Cards, Filter & Export UI | Reports & Analytics Module | 8h | 7h |

All four tasks completed. Team total: 25h.

## Week 4 — UI Redesign & Design System Unification

Goal: consolidate all modules onto a single global design system and resolve integration
conflicts ahead of backend work.

| Member | Tasks | Deliverable | Est. |
|---|---|---|---|
| Arunavo Das (Team Lead) | Dashboard Redesign, Global Layout (Sidebar/Nav/Breadcrumb/Shared Components), Design System Integration Across Modules, Code Review & Branch Merge | Core UI Layout & Final Frontend Integration | 9h |
| Walid Khandoker | Shipment Module Redesign, Client Module Responsive Layout, Navigation/Search Fixes, Cross-Browser Testing | Shipment/Client/Navigation Modules | 8h |
| Md. Mahiruddin Chowdhury | Employee Module Redesign, Document UI & File Preview, BOE Module & Timeline Enhancement, Responsive Layout Fixes | Employee/Document/BOE Modules | 8h |
| MD. Talha Jobair | Reports Dashboard Redesign, Duty Calculator/Notifications/Profile UI, UI Consistency Audit, Final Frontend Testing | Reports & Utility Modules | 8h |

All tasks completed. Team total hours (Week 4 delivery, recorded at Week 5 planning):
Arunavo 9h, Talha 8h, Walid 7h, Mahiruddin 9h — 33h.

## Week 5 — Backend Foundation (Supabase Integration)

Goal: stand up the Supabase backend — auth, schema, and CRUD operations for the core
entities — connecting it to the already-built frontend.

| Member | Tasks | Deliverable | Est. |
|---|---|---|---|
| Arunavo Das (Team Lead) | Supabase Project & Env Config, Authentication (Admin/Employee/Client), PostgreSQL Schema & Relationships Design, Frontend–Auth Integration | Backend Environment & Authentication Module | 9h |
| Walid Khandoker | Employee CRUD, Client CRUD, Role-Based Route Protection, API Integration Testing | Employee/Client Module Backend & Access Control | 8h |
| Md. Mahiruddin Chowdhury | Shipment CRUD, Document Upload via Supabase Storage, BOE CRUD, Shipment–Document Relationship Integration | Shipment/Document/BOE Backend | 8h |
| MD. Talha Jobair | Duty Calculator Backend Logic, Reports & Analytics API, Notifications & Activity Logs, Final Backend Integration Testing | Reports/Notification/Duty Backend | 8h |

All tasks completed. Team total hours (recorded at Week 6 planning): Arunavo 11h,
Talha 9h, Walid 10h, Mahiruddin 8h — 38h.

## Week 6 — AI Integration, Help Center & Security Hardening

Goal: integrate the Groq-based AI Assistant, build the Help Center, and finalize
authentication security ahead of testing.

| Member | Tasks | Deliverable | Est. |
|---|---|---|---|
| Arunavo Das (Team Lead) | AI Companion Integration with Groq API, AI Failover & Error Handling, Help Center (FAQ/Support/User Guide), Final Authentication & Security Audit | AI Companion & Help Center Modules | 9h |
| Walid Khandoker | Final Employee & Client Module Testing, Shipment & BOE Module Validation | Stable User Management, Shipment & BOE | 4h |
| Md. Mahiruddin Chowdhury | Document Management Testing & Bug Fixes, End-to-End Workflow Testing | Stable Document Module & Verified Workflow | 4h |
| MD. Talha Jobair | Reports & Dashboard Validation, Performance Optimization & Bug Fixing | Optimized Reports Module | 4h |
| All Members | Production Build Verification, GitHub Merge & Vercel Deployment | Production Deployment | 4h |

All tasks completed. Team total hours (recorded at Week 7 planning): Arunavo 6h,
Talha 5.5h, Walid 5h, Mahiruddin 5h — 21.5h.

## Week 7 — Full-System Testing & Production Verification *(in progress as of this report)*

Goal: end-to-end regression testing across every module ahead of final release.

| Member | Tasks | Deliverable | Est. | Status |
|---|---|---|---|---|
| Arunavo Das (Team Lead) | Full Auth & Role-Based Access Testing, AI Companion & Groq API Testing, HS Code Search & AI Classification Testing, Help Center & Support Testing | Verified Auth, AI, HS Code & Help Center | 7.5h | Incomplete |
| Walid Khandoker | Shipment & BOE End-to-End Testing, Client & Employee Regression Testing | Verified Shipment/BOE & User Management | 4h | Incomplete |
| Md. Mahiruddin Chowdhury | Document Management Testing & Bug Verification, Complete ERP End-to-End Workflow Testing | Verified Document Module & Integrated Workflow | 4h | Incomplete |
| MD. Talha Jobair | Reports & Dashboard Testing, Performance & Responsive UI Testing | Verified Reports & Performance | 4h | Incomplete |
| All Members | Final Cross-Module Regression Testing, Production/Vercel Verification & Final Release Check | Regression-Tested, Production-Verified Release | 4h | Incomplete |

*As of the most recent tracker snapshot (Group_03_Sprint_07.xlsx), Week 7 testing tasks
are still in progress and had not yet been marked Complete. Update this table's Status
column and add actual hours once Week 7 closes out, before final submission.*

## Sprint Work Summary

The project followed a design-first, frontend-first, backend-later sequence: Weeks 1–4
built and unified the UI across all modules; Week 5 introduced the Supabase backend and
wired it to the existing frontend; Week 6 layered in the AI Assistant and hardened
authentication; Week 7 is dedicated to full-system regression and production verification.
Total logged hours across Weeks 1–6: approximately 165.5 team-hours.

---

# 19. Final Application Development Summary

Development proceeded in a design-first, frontend-first, backend-later sequence, visible
directly in the sprint records: Week 1 established UI/UX wireframes for every module;
Weeks 2–3 implemented the core frontend for authentication, dashboard, clients, employees,
shipments, BOE, documents, and reports as static/mock-data-backed pages; Week 4 unified all
of these under one consistent design system and resolved integration conflicts before any
backend existed. Only in Week 5 was the Supabase backend introduced — schema design,
authentication, and CRUD operations were built and wired into the already-existing frontend,
rather than backend-first. Week 6 layered in the AI Assistant (Groq integration, with
explicit failover handling), a Help Center, and a final security audit of authentication.
Week 7 is dedicated to full-system regression testing and production verification across
every module before release.

This order — UI validated early, backend integrated once the interface was stable, AI
features added last as an enhancement layer — meant that by the time Supabase RLS policies
and the BOE state machine were implemented, the team already knew exactly which screens and
interactions those rules needed to support, reducing rework compared to a backend-first
approach. The result is a role-aware, audit-trailed ERP system covering the full customs
brokerage workflow from shipment booking through BOE clearance and document archival, with
AI assistance layered on top of — not embedded into the critical path of — the core
operational features. This directly addressed the client's original pain points around
manual, spreadsheet-based tracking and slow duty calculation, while adding AI-assisted
classification as a value beyond the initial scope.
