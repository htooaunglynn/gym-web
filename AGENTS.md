# AGENTS.md

This file gives coding agents the shortest accurate path through `gym-web`.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 5 strict mode
- Tailwind CSS 4
- Vitest + Testing Library
- Recharts for dashboard charts

Always treat `package.json` as the source of truth for versions and script names.

## Repo Shape

Important top-level areas:

- `src/app/layout.tsx`: root layout, metadata, auth and toast providers
- `src/app/login/page.tsx`: public login page
- `src/app/dashboard`: protected dashboard route tree
- `src/app/dashboard/layout.tsx`: dashboard shell with sidebar, top header, and guard
- `src/proxy.ts`: Next route matcher and limited server-side auth screening
- `src/contexts/AuthContext.tsx`: session restoration, branch selection, permission hydration
- `src/contexts/ToastContext.tsx`: toast state and API client error dispatch integration
- `src/lib/apiClient.ts`: shared fetch wrapper, auth header attachment, pagination normalization
- `src/lib/authorization.ts`: frontend authority checks by feature and action/stage
- `src/lib/branchScope.ts`: all-branches read-only guardrails
- `src/services`: feature-to-endpoint API wrappers
- `src/components`: dashboard layout, forms, CRUD, and shared UI primitives

## Architectural Reality

This repository is a single admin dashboard frontend, not a multi-app monorepo.

Current state:

- auth is restored client-side from a JWT stored in `localStorage`
- the frontend talks to `gym-api` over `NEXT_PUBLIC_API_BASE_URL`
- the proxy can only do limited server-side checks unless a cookie is also present
- branch scoping is handled with `activeBranchId` and `x-branch-id`
- permission gating is implemented in the UI, but backend enforcement remains authoritative

When changing code, preserve that reality instead of documenting or coding against a different auth or tenant model unless the task explicitly changes it.

## Request And Auth Flow

1. Public routes render through App Router.
2. Login submits credentials to `gym-api` and receives a JWT.
3. `AuthService` stores the token and decodes user claims.
4. `AuthContext` restores user state and fetches `/permissions/me`.
5. `apiClient` attaches `Authorization` and optional `x-branch-id` headers.
6. Dashboard pages render according to user role, branch scope, and permissions.

## Editing Rules

- Keep changes minimal and local.
- Fix the root cause instead of patching symptoms into multiple components.
- Use the shared API client and service layer before adding raw `fetch` calls.
- Preserve existing dashboard patterns when extending pages or CRUD flows.
- Do not invent backend endpoints or payload fields; follow existing service contracts or verify against `gym-api`.
- Avoid broad visual rewrites unless the task is explicitly design-focused.

## Auth And Permission Rules

- Protected dashboard routes should remain compatible with `DashboardGuard` and `AuthContext`.
- Permission-sensitive actions should use the established authority helpers instead of ad hoc inline checks.
- Do not weaken read-only behavior for all-branch admin scope just to enable mutations.
- Be explicit when a page is intentionally public.

## Data And API Rules

- Prefer `src/services/*` for feature API access.
- Keep pagination handling consistent with `normalizeListResponse`.
- Send branch scope through the existing `x-branch-id` mechanism when the feature already supports it.
- Treat the backend as the trust boundary; frontend checks are for UX, not security.

## UI And Frontend Rules

- Follow the current visual language already established in `src/components` and `src/app/globals.css`.
- Reuse shared table, toast, modal, and form primitives before creating new variants.
- Keep mobile behavior in mind for tables, pagination, and toast placement.
- Use semantic HTML and preserve accessibility labels and keyboard interactions.

## Tests And Validation

- Tests use Vitest with the `jsdom` environment.
- Unit and component tests live under `src` as `*.test.ts` or `*.test.tsx`.
- After editing code, run the narrowest relevant validation first.
- Prefer targeted test runs over full-suite runs unless the task is broad.

Useful commands:

- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run build`

## Documentation Discipline

- Keep `infrastructure.md` aligned with the actual single-app frontend architecture.
- Keep this file concise and operational.
- If auth, branch scoping, or API integration changes, update both this file and `CLAUDE.md`.
