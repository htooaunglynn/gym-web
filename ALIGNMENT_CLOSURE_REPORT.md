## Gym-Web Alignment Report

Date: 2026-05-01
Scope: Documentation and architecture alignment for the current `gym-web` repository

## Purpose

This report replaces the previous milestone-style closure note that overstated certainty and assumed a different project shape. It now records what is verifiably true about the current frontend and where alignment with `gym-api` depends on ongoing validation.

## Verified Repository Facts

- `gym-web` is a single Next.js dashboard application, not a two-app tenant monorepo.
- The frontend depends on `gym-api` through `NEXT_PUBLIC_API_BASE_URL`.
- Authentication is restored from a JWT stored in `localStorage`.
- Permission hydration is driven by `/permissions/me`.
- Branch scope is propagated via `x-branch-id` and guarded in the UI.
- Shared API behavior is centralized in `src/lib/apiClient.ts`.

## Alignment State

### Aligned Patterns Present In Code

- Centralized API transport and error mapping
- Shared pagination normalization for mixed list response shapes
- Decoded JWT session restoration through a dedicated auth service
- Permission-aware UI gating via `hasAuthority(...)`
- Branch-aware read-only rules for all-branch admin scope
- Shared toast handling for API-facing failures

### Known Architectural Gaps

- Full server-side auth enforcement is not possible with the current `localStorage` token model alone.
- The proxy can only validate cookie tokens when present, so dashboard protection still depends heavily on client-side guard logic.
- Final contract alignment still depends on backend endpoint stability and manual end-to-end verification.

## Confidence Boundaries

This report should be treated as a current-state alignment snapshot, not proof that every page and API contract is fully signed off. Confidence is highest for repository structure and frontend integration patterns, and lower for production-runtime behavior unless separately validated against a live `gym-api` instance.

## Recommended Ongoing Verification

1. Run `npm run lint` for static correctness.
2. Run `npm run test` for component and utility coverage.
3. Run `npm run build` to catch App Router and bundling regressions.
4. Smoke test login, dashboard load, branch switching, and at least one CRUD path against `gym-api`.
5. Re-check this document whenever auth storage, route protection, permission handling, or API response shapes change.

## Outcome

Repository documentation is now aligned to the actual `gym-web` architecture and no longer claims a project model or validation status that the codebase does not support.
