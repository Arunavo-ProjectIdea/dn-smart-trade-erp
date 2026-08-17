# 17/28. Detailed Sprint Work

*Drafted from Group_03_Sprint_07.xlsx — team task tracker, Weeks 1–7. Documented
independently from the repository and project records, per assignment.*

The DN Smart Trade ERP & AI Platform was built over a series of weekly sprints, with each
sprint's planning entry recorded the week before it was executed and marked Complete once
delivered. The team (Arunavo Das – Team Lead, MD. Talha Jobair, Walid Khandoker, Md.
Mahiruddin Chowdhury) tracked estimated vs. actual hours per task throughout.

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

## Summary

The project followed a design-first, frontend-first, backend-later sequence: Weeks 1–4
built and unified the UI across all modules; Week 5 introduced the Supabase backend and
wired it to the existing frontend; Week 6 layered in the AI Assistant and hardened
authentication; Week 7 is dedicated to full-system regression and production verification.
Total logged hours across Weeks 1–6: approximately 165.5 team-hours.
