# Plan: Gym Admin Dashboard (TeamHub-style)

## TL;DR
Build a full gym management admin dashboard in the existing Vite + React 19 + TypeScript project using Tailwind CSS v4, shadcn/ui, Recharts, and React Router v7. All data is static mock data. The reference is the "TeamHub" HR system UI — recreated for gym domain with green color theme.

## Tech Stack
- Tailwind CSS v4 via `@tailwindcss/vite`
- shadcn/ui (latest, Tailwind v4 compatible)
- react-router v7 (`react-router` package)
- Recharts (with `react-is: ^19.0.0` override in package.json)
- lucide-react (comes with shadcn/ui)
- date-fns (for Calendar page)

## Pages
1. Dashboard — overview stats, charts, recent activity
2. Members — list + detail (/:id)
3. Calendar / Schedule — monthly class schedule
4. Attendance — daily log table + trend chart
5. Performance / Analytics — trainer & class metrics
6. Payroll / Payments — revenue stats + payments table
7. Leave Management — trainer leave requests
8. Inbox / Messages — two-column message view
9. Recruitment — staff applicant tracking

## File Structure
```
src/
├── components/
│   ├── ui/                     # shadcn/ui generated components
│   ├── layout/
│   │   ├── Sidebar.tsx         # Fixed nav with icon+label items
│   │   ├── Header.tsx          # Search bar, notifications, avatar
│   │   └── DashboardLayout.tsx # Sidebar + Header + <Outlet>
│   └── shared/
│       ├── StatCard.tsx        # Reusable metric card
│       └── PageHeader.tsx      # Page title + breadcrumb + slot for actions
├── pages/
│   ├── Dashboard.tsx
│   ├── Members/
│   │   ├── MembersList.tsx
│   │   └── MemberDetail.tsx
│   ├── CalendarPage.tsx
│   ├── AttendancePage.tsx
│   ├── PerformancePage.tsx
│   ├── PayrollPage.tsx
│   ├── LeaveManagementPage.tsx
│   ├── InboxPage.tsx
│   └── RecruitmentPage.tsx
├── data/
│   ├── members.ts
│   ├── attendance.ts
│   ├── schedule.ts
│   ├── payroll.ts
│   ├── messages.ts
│   └── performance.ts
├── types/index.ts              # All shared TS interfaces
├── lib/utils.ts                # cn() from shadcn
├── router/index.tsx            # Route tree
├── App.tsx                     # BrowserRouter setup
├── index.css                   # @import "tailwindcss" + shadcn CSS vars
└── main.tsx                    # Entry (keep as-is)
```

## Routing
```
/                → redirect to /dashboard
/dashboard
/members
/members/:id
/calendar
/attendance
/performance
/payroll
/leave
/inbox
/recruitment
```

## Color Theme
- Primary green: #10B981 (emerald-500)
- Sidebar background: white
- Active nav item: light green bg + green text/icon
- Page background: #F8FAFC
- Cards: white with subtle shadow

## Phase Breakdown

### Phase 1: Setup (sequential)
1. Add `"overrides": { "react-is": "^19.0.0" }` to package.json
2. `npm install tailwindcss @tailwindcss/vite @types/node`
3. `npm install react-router`
4. `npm install recharts --legacy-peer-deps`
5. `npm install date-fns`
6. Run `npx shadcn@latest init` (handles Tailwind v4 CSS vars + vite.config path alias)
7. Update vite.config.ts: add `tailwindcss()` plugin + keep React Compiler babel setup + add `@` path alias
8. Update index.css: `@import "tailwindcss"` + shadcn CSS vars with custom green primary

### Phase 2: Core Architecture (sequential)
9. Create `src/types/index.ts` — Member, Trainer, Class, Attendance, Payment, LeaveRequest, Message, Applicant interfaces
10. Create `src/lib/utils.ts` — `cn()` utility
11. Create `src/router/index.tsx` — full route tree with Navigate redirect
12. Update `src/App.tsx` — replace Vite default with `<BrowserRouter>` + router

### Phase 3: Layout (sequential, blocks all pages)
13. Create `Sidebar.tsx` — fixed 240px, logo at top, nav items with lucide icons, active state highlight
14. Create `Header.tsx` — search input, bell icon, user avatar + name
15. Create `DashboardLayout.tsx` — flex layout wrapping sidebar + header + `<Outlet>`
16. Create shared `StatCard.tsx` and `PageHeader.tsx`

### Phase 4: Mock Data (parallel batch)
17. Create all 6 data files simultaneously (members, attendance, schedule, payroll, messages, performance) — 20-30 typed entries each

### Phase 5: Pages (can implement in parallel pairs after Phase 3+4)
18. Dashboard.tsx — 4 stat cards, area chart (membership growth), bar chart (class attendance by day), donut chart (plan distribution), recent members table, today's classes list
19. MembersList.tsx — searchable/filterable table with avatar, name, plan badge, status badge, trainer, join date, row click → detail
20. MemberDetail.tsx — profile card, info grid, attendance bar chart, payment history table
21. CalendarPage.tsx — monthly grid with event dots, sidebar showing day's classes on click
22. AttendancePage.tsx — date filter, table (member, class, check-in time), weekly attendance area chart
23. PerformancePage.tsx — trainer performance table + rating bars, class popularity bar chart, member retention donut
24. PayrollPage.tsx — 4 stat cards, payments table with status badges, monthly revenue line chart
25. LeaveManagementPage.tsx — leave type donut, leave overview table (trainer, type, dates, status), calendar dots
26. InboxPage.tsx — left panel (conversation list with avatar+preview), right panel (message thread)
27. RecruitmentPage.tsx — 4 stat cards (total/pending/accepted/rejected), applicants table, applications-per-month bar chart

## Verification
1. `npm run dev` — all routes accessible, no console errors
2. Each page renders with correct mock data and charts
3. Members list → click row → detail page navigates correctly
4. `npm run build` — TypeScript compiles cleanly
5. `npm run lint` — no ESLint errors

## Decisions
- Domain: Gym management (members, trainers, classes, payments)
- Styling: shadcn/ui + Tailwind v4
- Charts: Recharts (best React-native option)
- Data: Static mock only — no API calls, no state management library needed
- Leave Management kept from reference: repurposed for trainer leave requests
- Responsive: Desktop-first (matching the reference image's design)
- React Compiler (existing setup) is preserved — no need for manual memoization
