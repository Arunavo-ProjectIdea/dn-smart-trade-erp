# UNIT_TESTING_PLAN.md

## 1. Project Overview
**DN Smart Trade ERP AI Platform** is a Next.js 16 App Router-based enterprise application tailored for customs, trade, and logistics management. It leverages React Server Components (RSC) and Client Components for interactivity. The application uses Tailwind CSS with Shadcn UI for styling, and Supabase for backend database and authentication.

Currently, the project is in an active development phase. Certain modules (like `clients` and authentication) are integrated with a live Supabase database, while others (like `boe`, `shipments`, `hs-codes`) rely on mock data to prototype the UI and UX.

## 2. Testing Strategy
To ensure the reliability and stability of the platform as it transitions from mock data to live integrations, a layered testing strategy is proposed:

*   **Unit Tests:** Focus on isolated functions, utilities, mappers, and custom hooks.
*   **Component Tests:** Test individual React components (especially reusable UI and layout elements) in isolation to ensure rendering and event handling work correctly.
*   **Integration Tests:** Test the interaction between Server Actions and the mock/local database, and the flow of data between parent and child components.
*   **End-to-End (E2E) Tests:** Validate critical user journeys like login, registration, and creating a bill of entry or client.

## 3. Testing Framework Recommendation
Based on the current tech stack (Next.js, React 19, TypeScript), the following testing frameworks are recommended (none are currently installed):

*   **Unit & Integration Testing:** **Vitest** (Fast, native TypeScript support, compatible with modern React).
*   **Component Testing:** **React Testing Library (RTL)** with `@testing-library/jest-dom`.
*   **End-to-End Testing:** **Playwright** (Excellent support for Next.js and full-stack flows).
*   **Mocking:** **MSW (Mock Service Worker)** for intercepting API requests, and standard Vitest mocks for Supabase clients and Next.js routers.

## 4. Complete Testing Checklist & Codebase Analysis

### 4.1 Project Architecture & Tech Stack
*   **Frameworks:** Next.js 16.2.9, React 19.2.4
*   **Styling:** Tailwind CSS v4, Shadcn UI
*   **Animations & Charts:** Framer Motion, Recharts
*   **Backend/Auth:** Supabase SSR & Supabase-JS
*   **Folder Structure:** Standard Next.js App Router (`src/app`), reusable components (`src/components`), utilities and types (`src/lib`).

### 4.2 Application Modules (Pages & API)
| Module | Location | Purpose | Status | Needs Unit Test |
| :--- | :--- | :--- | :--- | :--- |
| **Auth Flow** | `app/login`, `app/forgot-password` | Handles user sign-in and password resets | Fully Implemented (Supabase) | Yes (Component & E2E) |
| **Clients** | `app/(app)/clients/...` | Manage client records | Fully Implemented (Supabase Actions) | Yes (Actions & UI) |
| **Dashboard** | `app/(app)/dashboard` | Overview of KPIs and recent activities | Mock Data | Yes (Component) |
| **BOE** | `app/(app)/boe/...` | Bill of Entry management | Mock Data | Yes (Component) |
| **Shipments** | `app/(app)/shipments/...` | Track imports/exports | Mock Data | Yes (Component) |
| **Documents** | `app/(app)/documents/...` | Manage uploaded files | Mock Data | Yes (Component) |
| **Duty Calculator**| `app/(app)/duty-calculator`| Compute taxes and duties | Mock Data / Interfaces | Yes (Logic & Component)|
| **Employees** | `app/(app)/employees/...` | HR and staff management | Mock Data | Yes (Component) |
| **HS Codes** | `app/(app)/hs-codes/...` | Customs classification lookup | Mock Data | Yes (Component) |
| **Reports** | `app/(app)/reports` | Financial & logistical analytics | Mock Data | Yes (Component) |
| **AI Assistant** | `app/(app)/ai-assistant` | AI chat interface for domain queries | Mock Data / Frontend Logic | Yes (Component) |
| **Other Pages** | `settings`, `profile`, `help`, `notifications` | User management and notifications | Partially Implemented / Mock | Yes (Component) |

*(Note: API routes are not used; Next.js Server Actions are utilized instead).*

### 4.3 React Components
| Category | Components | Status | Needs Unit Test |
| :--- | :--- | :--- | :--- |
| **ERP Domain** | `boe-form`, `data-table`, `document-upload-form`, `shipment-form`, `tracking-timeline`, `status-badge`, `view-toggle`, etc. | Implemented | Yes (High Priority) |
| **Layout Shell** | `auth-guard`, `sidebar`, `top-nav`, `dashboard-shell`, `breadcrumbs`, `command-menu`, `user-nav` | Implemented | Yes |
| **Reports** | `analytics-insights`, `charts-section`, `filter-panel`, `kpi-cards` | Implemented | Yes |
| **UI (Shadcn)** | `button`, `card`, `select`, `table`, `input`, `dropdown-menu`, etc. (20+ components) | Fully Implemented | Low Priority (3rd party) |
| **Providers** | `auth-provider`, `theme-provider` | Implemented | Yes |

### 4.4 Utilities, Hooks, Services, Helpers, and Logic
| Item | Location | Purpose | Status | Needs Unit Test |
| :--- | :--- | :--- | :--- | :--- |
| **Actions** | `app/(app)/clients/actions.ts` | Server Actions for Client CRUD | Implemented (Supabase) | Yes |
| **Mappers** | `app/(app)/clients/mappers.ts` | Transform DB schema to UI types | Implemented | Yes |
| **Auth Server Utils** | `lib/auth-server.ts`, `lib/auth.ts` | Authentication checks for RSC | Implemented | Yes |
| **Supabase Clients**| `lib/supabase/client.ts`, `server.ts`, `middleware.ts`| Initialize Supabase clients | Implemented | Yes (Mocked tests) |
| **Hooks** | `useAuth` (`auth-provider`), `useToast` | State management | Implemented | Yes |
| **General Utils** | `lib/utils.ts` | CSS class merging (`cn`) | Implemented | Yes |

### 4.5 Domain Specific Systems
*   **Role-based Permission System:** Basic role-checking exists in UI (e.g., hiding edit buttons if `userRole === "Client"`). Needs robust backend validation in Server Actions.
*   **AI Features:** Currently mocked via `setTimeout` in the `ai-assistant` page. Needs testing for state changes and typing indicators.
*   **External APIs:** Currently none integrated directly. Future integrations defined via `lib/interfaces/duty-integration.ts`.

## 5. Estimated Number of Tests per Module

| Area | Estimated Tests | Type |
| :--- | :--- | :--- |
| **Utilities & Helpers** (Mappers, `cn`, hooks) | 20 - 30 | Unit Tests |
| **Server Actions** (Clients CRUD) | 15 - 20 | Unit / Integration Tests |
| **Auth Flow & Middleware** | 10 - 15 | Unit / E2E Tests |
| **ERP Components** (Forms, Data Table) | 30 - 40 | Component Tests |
| **Layout & Shell** (Sidebar, AuthGuard) | 10 - 15 | Component Tests |
| **Domain Pages** (BOE, Shipments, etc.) | 40 - 50 | Component Tests |
| **Total Estimated Tests** | **~125 - 170** | |

## 6. Testing Priority

1.  **Critical Path (High):**
    *   Authentication utilities (`auth-server.ts`, middleware).
    *   Supabase Server Actions (`clients/actions.ts`) to prevent data corruption.
    *   Data mapping functions (`mappers.ts`).
    *   Shared UI components heavily used across the app (`data-table`, `status-badge`).
2.  **User Experience (Medium):**
    *   Forms (`boe-form`, `shipment-form`, `edit-client-form`) to ensure validation works.
    *   Layout elements and route guards (`auth-guard`).
3.  **Visuals & Mocked Domains (Low):**
    *   Shadcn UI base components (relies on Radix UI testing).
    *   Pages currently utilizing static mock data (e.g., `dashboard`, `reports`). These should be thoroughly tested once connected to real APIs/Supabase.

## 7. Untestable Modules
No modules are fundamentally untestable, but certain areas require specific strategies:
*   **React Server Components (RSCs):** Standard RTL testing is difficult for RSCs fetching data asynchronously. These are best tested via E2E tests (Playwright) or by extracting logic into pure functions/Client Components.
*   **Supabase Direct Queries:** Direct database queries in server components require mocking the Supabase client or using a local Supabase test database instance.

## 8. Missing Infrastructure
*   **Test Runner Configuration:** Missing `vitest.config.ts` and `setupTests.ts`.
*   **Mock Database Setup:** Need a local Supabase instance or robust mock implementations for the `createClient` functions to isolate tests from the production/staging database.
*   **CI/CD Pipeline:** No GitHub Actions or similar workflows to run tests on Pull Requests.
*   **Environment Variables:** Need `.env.test` for test-specific configurations.

## 9. Recommendations
1.  **Install the Test Suite:** Begin by installing Vitest, RTL, and Playwright.
2.  **Start with Utilities:** Write unit tests for `lib/utils.ts` and `clients/mappers.ts` to establish the testing pattern.
3.  **Mock Supabase:** Create a centralized mock for the Supabase client to easily test Server Actions without hitting the live database.
4.  **Implement E2E for Auth:** Set up Playwright to cover the critical authentication flow before scaling out component tests.
5.  **Delay Testing Mock Pages:** Hold off on deep component testing for pages like `reports` and `dashboard` until they are connected to Supabase to avoid rewriting tests.
