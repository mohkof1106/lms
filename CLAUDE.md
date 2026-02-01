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
- **Database**: PostgreSQL with tables for employees, customers, services, assets, overhead_costs, offers, offer_line_items, expenses, holidays, etc.
- **RPC Functions**: `calculate_employee_hourly_cost` returns cost breakdown with overhead share
- **Client**: `src/lib/supabase.ts` exports configured client

### Routing

- `src/app/(dashboard)/` — grouped route with shared layout (Sidebar + Header)
- Root `/` redirects to `/dashboard`
- CRUD pattern: `/module/` (list), `/module/new` (create), `/module/[id]` (detail)
- Modules: employees, customers, services, packages, projects, tasks, offers, invoices, expenses, finance, assets, estimator, settings

### Component Organization

- `src/components/ui/` — shadcn/ui primitives (New York style, Radix-based)
- `src/components/layout/` — Sidebar, Header, PageWrapper
- `src/components/{module}/` — domain-specific components (forms, tables)
- `src/components/shared/` — cross-module utilities (SearchInput, StatusBadge)

### Key Patterns

- **All pages are client components** (`'use client'`)
- **Forms**: react-hook-form + Zod schemas, supports `useFieldArray` for nested data
- **Tables**: Direct data prop pattern with `useMemo` for client-side filtering
- **Data**: Supabase for persistence, mock data in `src/lib/mock-data/` for calculations
- **Types**: All domain models in `src/types/index.ts`
- **State**: Zustand available (`src/store/`) but not yet wired up

### Employee Cost Calculation

Monthly Salary = Base Salary + Compensation
Monthly Cost = Monthly Salary + Benefits (insurance/12 + ticket/12 + visa/24 + 13th month) + Asset Depreciation
Full Cost = Monthly Cost + Overhead Share (company costs ÷ active employees)
Hourly Rate = (Full Cost × 12) ÷ (Working Days × Working Hours)

Working Days = (working_days_per_week × 52) - vacation days - public holidays
Working Hours = from `company_settings.working_hours_per_day` (default 8)

**Dynamic Settings**: All cost calculation settings come from `company_settings` table:
- `working_hours_per_day` - hours per workday (default 8)
- `working_days_per_week` - days per week (default 5)
- Public holidays counted from `holidays` table by current year

### Styling

- Tailwind CSS v4 (PostCSS plugin, not legacy config)
- CSS variables in `globals.css` for theming (light/dark via next-themes)
- Brand: primary cyan `#00BCD4`, secondary gold `#FFD700`, accent coral `#FF6B6B`
- Path alias: `@/*` → `./src/*`

### Layout Structure

Fixed sidebar (collapsible 256px→64px) + fixed header. Main content responds to sidebar state with CSS transitions.

### Theme

- **Dark mode default**: Set via `className="dark"` on html element in `layout.tsx`
- Theme variables defined in `globals.css`

## Recent Updates (2026-02-01)

- **Fully Dynamic Employee Cost Calculation**: RPC `calculate_employee_hourly_cost` now reads ALL settings from DB
  - `working_hours_per_day` from `company_settings` (no more hardcoded 8)
  - `working_days_per_week` from `company_settings` (no more hardcoded 260 base days)
  - Returns settings in response for frontend display
  - CostBreakdown component displays actual configured values
- **Outsourced Services in Estimator**: New widget for vendor/third-party costs
  - Two modes: **Markup** (profit added) vs **Pass-through** (back-to-back billing)
  - UAE VAT compliant: single VAT rate applied to everything (per FTA VATP013)
  - Overhead moved below Labor Cost in calculation panel (only applies to labor)
  - Pre-calculated totals passed to offers to avoid rounding errors
- **Offers Module Backend**: Full Supabase integration with `offers` and `offer_line_items` tables
  - Auto-generated offer numbers (LOR-YYYY-NNN format via DB trigger)
  - Status workflow: Draft → Sent → Accepted/Rejected (+ Expired display)
  - CRUD operations: create, edit (draft only), delete, duplicate
  - Estimator → Offer flow via sessionStorage with outsourced costs
  - PDF generation with real data
- **Customer Detail Page**: Now fetches real data from Supabase (was using mock data)

## Previous Updates (2026-01-31)

- **Supabase Integration**: Auth (login/signup), employee CRUD, cost calculations via RPC
- **Employee Cost Breakdown**: Table shows Monthly Salary, Benefits, Overhead, Hourly, Monthly columns
- **Monthly Salary Grouping**: Base + Compensation shown as grouped total with breakdown
- **Estimator**: Service selection, profit margin input, discount percentage, customer dropdown
- **Offers**: Integration with estimator, PDF generation ready
- **Expenses Module**: Full CRUD for expenses with categories, asset linking, recurring expenses
- **Finance Integration**: Costs tab shows real expenses from Supabase
- **LOR Logo**: Custom SVG icon in sidebar (`public/logo-icon.svg`)
- **Dark Mode Default**: App now defaults to dark theme
