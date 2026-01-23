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

**Next.js 16 App Router** dashboard for a creative agency (LOR). Currently uses mock data — no backend/database yet.

### Routing

- `src/app/(dashboard)/` — grouped route with shared layout (Sidebar + Header)
- Root `/` redirects to `/dashboard`
- CRUD pattern: `/module/` (list), `/module/new` (create), `/module/[id]` (detail)
- Modules: employees, customers, services, packages, projects, tasks, offers, invoices, finance, assets, estimator, settings

### Component Organization

- `src/components/ui/` — shadcn/ui primitives (New York style, Radix-based)
- `src/components/layout/` — Sidebar, Header, PageWrapper
- `src/components/{module}/` — domain-specific components (forms, tables)
- `src/components/shared/` — cross-module utilities (SearchInput, StatusBadge)

### Key Patterns

- **All pages are client components** (`'use client'`)
- **Forms**: react-hook-form + Zod schemas, supports `useFieldArray` for nested data
- **Tables**: Direct data prop pattern with `useMemo` for client-side filtering
- **Data**: Mock data in `src/lib/mock-data/`, re-exported from `index.ts`
- **Types**: All domain models in `src/types/index.ts`
- **State**: Zustand available (`src/store/`) but not yet wired up

### Styling

- Tailwind CSS v4 (PostCSS plugin, not legacy config)
- CSS variables in `globals.css` for theming (light/dark via next-themes)
- Brand: primary cyan `#00BCD4`, secondary gold `#FFD700`, accent coral `#FF6B6B`
- Path alias: `@/*` → `./src/*`

### Layout Structure

Fixed sidebar (collapsible 256px→64px) + fixed header. Main content responds to sidebar state with CSS transitions.
