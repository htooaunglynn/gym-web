# Copilot Instructions For gym-web

Use these instructions when making changes in this repository.

## Project Model

- This repo is a single Next.js 16 admin dashboard, not a multi-app monorepo.
- The backend lives in the separate `gym-api` repository.
- The frontend uses React 19, TypeScript, Tailwind CSS 4, Vitest, and Testing Library.

## Core Coding Rules

- Prefer modifying existing dashboard patterns over introducing new architecture.
- Keep changes local and minimal.
- Use strict TypeScript and avoid `any`.
- Reuse `src/lib/apiClient.ts` and `src/services/*` for API access.
- Reuse existing shared UI primitives before creating new components.
- Preserve accessibility and responsive behavior.

## Auth And Authorization Rules

- The current implementation stores the JWT in `localStorage`; do not assume cookie auth unless you are explicitly implementing that migration.
- Use `AuthContext`, `DashboardGuard`, `hasAuthority(...)`, and branch-scope helpers instead of ad hoc auth logic.
- Do not bypass permission gates or all-branches read-only restrictions to make UI actions appear available.

## API Contract Rules

- Follow existing payload and response conventions already used in `src/services`.
- Do not invent backend fields or endpoints.
- Keep list parsing compatible with `normalizeListResponse(...)`.
- If an endpoint contract is unclear, inspect the existing service layer or the matching `gym-api` module before editing.

## UI And Design Rules

- Preserve the established dashboard visual language unless the task is explicitly a redesign.
- Avoid generic boilerplate layouts when adding new UI.
- Keep tables, forms, pagination, toasts, and modals consistent with neighboring features.
- Prefer meaningful loading, empty, and error states.

## Testing And Validation

- Add or update focused Vitest tests for behavior changes.
- Prefer the narrowest useful validation first.
- Use these commands as appropriate:
	- `npm run lint`
	- `npm run test`
	- `npm run build`

## Documentation Rules

- Keep `AGENTS.md`, `CLAUDE.md`, and `infrastructure.md` aligned with the actual codebase.
- Do not leave behind generic placeholder instructions copied from unrelated repos.
