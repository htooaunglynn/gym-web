# Gym Web

Gym management dashboard built with React, TypeScript, Vite, Tailwind, and Recharts.

## API Setup

The frontend uses a Vite dev proxy in local development so browser requests avoid backend CORS preflight issues.

- Copy `.env.example` to `.env.local` when you need to customize API settings.
- `VITE_API_PROXY_TARGET` controls where the local `/api/*` proxy forwards requests. The default is `http://localhost:3000`.
- `VITE_API_BASE_URL` is optional and overrides the API base URL directly. If this is unset in development, the app uses the local `/api` proxy.
- Restart `npm run dev` after changing env values.

## Scripts

- `npm run dev` starts local development.
- `npm run build` runs type-check and production build.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint.

## Folder Architecture

The app now uses a feature-first structure. New code should prefer direct imports from `src/features/*`, `src/components/*`, `src/routes`, and `src/utils`.

```text
src/
  app/                    # app-level wiring (providers/config bootstrap)
  assets/                 # global static assets
  components/
    Avatar/ Badge/ Button/ Card/ Input/ Progress/ Select/ Separator/ Tabs/
    Modal/ PageHeader/ StatCard/ StatusBadge/ Table/
    shared/ ui/ layout/    # compatibility shims (legacy import support)
  constants/              # app constants and static config
  features/
    auth/                 # role dashboards + auth domain scaffolding
    dashboard/
    attendance/
    inbox/
    leave/
    members/
      hooks/
      pages/
      services/
    payroll/
    payments/
    performance/
    recruitment/
    schedule/
    subscriptions/
    trainers/
  hooks/                  # cross-feature reusable hooks
  layouts/                # app shell and navigation layout
  routes/                 # route declarations and route helpers
  services/               # cross-feature API/service layer
  types/                  # shared TypeScript types
  utils/                  # helper functions
```

## Import Rules

- Prefer importing domain logic from `src/features/<feature>/...`.
- Prefer direct component imports from taxonomy folders (e.g. `src/components/Table`, `src/components/Button`).
- Keep `src/components/shared` and `src/components/ui` as temporary compatibility layers only.
- Keep reusable cross-domain hooks in `src/hooks`; keep domain-specific hooks in each feature folder.

## Current Migration Status

- Added and switched to `src/routes` from legacy router structure.
- Migrated route pages and domain data into `src/features/*`.
- Added services/hooks scaffolding to all feature domains.
- Moved role and utility ownership to `src/utils`.
- Reorganized UI/shared components into taxonomy folders under `src/components/*`.
- Kept `src/components/shared`, `src/components/ui`, and `src/components/layout` as compatibility shims during transition.
