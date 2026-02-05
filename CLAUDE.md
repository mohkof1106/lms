# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Start dev server with hot reload
npm run build   # Production build
npm start       # Start production server
npm run lint    # Run ESLint
```

Deployed on Vercel: `vercel --prod` (project: koufahis-projects/lms)

## Architecture

**Next.js 16 App Router** dashboard for a creative agency (LOR). Uses **Supabase** for authentication and database.

### Backend (Supabase)

- **Auth**: Email/password authentication with RLS policies
- **Database**: PostgreSQL with tables for employees, customers, services, service_subtasks, assets, overhead_costs, offers, offer_line_items, expenses, holidays, user_profiles, notifications, tasks, etc.
- **RPC Functions**: `calculate_employee_hourly_cost` returns cost breakdown with overhead share
- **Client**: `src/lib/supabase/client.ts` (browser), `src/lib/supabase/server.ts` (server components)

### Routing

- `src/app/(dashboard)/` — grouped route with shared layout (Sidebar + Header)
- Root `/` redirects to `/dashboard`
- CRUD pattern: `/module/` (list), `/module/new` (create), `/module/[id]` (detail)
- Modules: employees, customers, services, packages, projects, tasks, offers, invoices, expenses, finance, assets, estimator, settings, profile

### Component Organization

- `src/components/ui/` — shadcn/ui primitives (New York style, Radix-based)
- `src/components/layout/` — Sidebar, Header, PageWrapper
- `src/components/providers/` — AuthProvider (wraps dashboard)
- `src/components/{module}/` — domain-specific components (forms, tables)
- `src/components/shared/` — cross-module utilities (SearchInput, StatusBadge)

### State Management (Zustand)

- `src/store/auth.ts` — User session, profile, logout
- `src/store/ui.ts` — Sidebar collapsed state
- `src/store/notifications.ts` — Notifications with 30s polling

### Key Patterns

- **All pages are client components** (`'use client'`)
- **Forms**: react-hook-form + Zod schemas, supports `useFieldArray` for nested data
- **Tables**: Direct data prop pattern with `useMemo` for client-side filtering
- **Data**: Supabase for persistence, mock data in `src/lib/mock-data/` for calculations
- **Types**: All domain models in `src/types/index.ts`

### Employee Cost Calculation

Monthly Salary = Base Salary + Compensation
Monthly Cost = Monthly Salary + Benefits (insurance/12 + ticket/12 + visa/24 + 13th month) + Asset Depreciation
Full Cost = Monthly Cost + Overhead Share (company costs ÷ active employees)
Hourly Rate = (Full Cost × 12) ÷ (Working Days × Working Hours)

Working Days = (working_days_per_week × 52) - vacation days - public holidays
Working Hours = from `company_settings.working_hours_per_day` (default 8)

### Styling

- Tailwind CSS v4 (PostCSS plugin, not legacy config)
- CSS variables in `globals.css` for theming (light/dark via next-themes)
- Brand: primary cyan `#00BCD4`, secondary gold `#FFD700`, accent coral `#FF6B6B`
- Path alias: `@/*` → `./src/*`
- **Dark mode default**: Set via `className="dark"` on html element

### Layout Structure

Fixed sidebar (collapsible 256px→64px) + fixed header. Main content responds to sidebar state with CSS transitions.

## Recent Updates (2026-02-05)

### Task Filtering & Views
- **Employee Filter**: Multi-select filter on Tasks page to filter by assigned employees
  - "Assigned to Me" quick button (toggles current user's employeeId)
  - Multi-select popover with checkbox list for employees
  - Filter logic: task matches if ANY subtask has matching assignee
- **Task Star/Favorite**: `is_starred` boolean for marking portfolio examples
  - Star icon on cards (hover-to-show), toggle in edit dialog, filter button
- **"By Employee" View**: Alternative to Kanban, groups tasks by assigned employee
  - Component: `src/components/tasks/TasksByEmployeeView.tsx`

### User Management System
- **System Roles**: Separate from job roles — admin/manager/member/viewer
- **Tables**: `user_profiles` (linked 1:1 to auth.users), `system_role` enum
- **Admin Page**: `/settings/users` with CRUD via server actions
- **Server Actions**: `src/app/(dashboard)/settings/users/actions.ts` uses `SUPABASE_SERVICE_ROLE_KEY`
- **RLS**: `is_admin()` SECURITY DEFINER function for non-recursive policy checks
- **Sidebar**: Settings now expandable with Company + Users sub-items

### Auth & Profile
- **AuthProvider**: `src/components/providers/AuthProvider.tsx` wraps dashboard
- **Zustand Stores**: `auth.ts` (user session), `ui.ts` (sidebar state)
- **Profile Page**: `/profile` with password change, linked employee info
- **Header**: Dynamic user name/role from auth store, functional Profile + Logout

### Notification System
- **Polling-Based**: 30-second polling (WebSocket Realtime disabled due to connection issues)
- **Tables**: `notifications` with `notification_type` enum (ping, task_assigned, etc.)
- **NotificationBell**: Popover with unread badge, notification list, mark-all-read
- **Ping Feature**: Send message (100 chars max) to any user
- **Sound**: Web Audio API chime + Sonner toast on new notification
- **Store**: `src/store/notifications.ts` with startPolling/stopPolling

### Employee-User Integration
- Optional "Create user account" toggle in employee form
- Creates both employee record + linked auth user in one step

### Bug Fixes
- Fixed recursive RLS on user_profiles (was causing 500 errors)
- Fixed WebSocket reconnection loop → switched to polling
- Added missing `DialogDescription` to dialogs (accessibility)
- Fixed task comments loading with FK hint for PostgREST join

## Task Management System

- **Tables**: `task_board_columns`, `tasks`, `task_subtasks`, `task_subtask_assignees`, `task_comments`
- **Kanban**: Drag-drop via @hello-pangea/dnd, columns at `/tasks/columns`
- **Task Edit Dialog**: Subtasks, assignees, comments with @mention autocomplete
- **Subtask Status**: pending → in_progress → completed (3-state)
- **Offers → Tasks**: "Initiate Tasks" creates tasks from accepted offers

## Previous Updates (2026-02-04)

- **Service Subtasks**: Breakdown services into subtasks with percentage allocation
- **Estimator Enhancements**: Quick time buttons (+D/+W/+M), cost columns, time reference widget
- **Outsourced Services**: Collapsible section, Markup vs Pass-through modes

## Previous Updates (2026-02-01)

- **Dynamic Cost Calculation**: RPC reads all settings from DB
- **Offers Module**: Full Supabase integration, auto-generated offer numbers
- **Expenses Module**: Full CRUD with categories, asset linking
