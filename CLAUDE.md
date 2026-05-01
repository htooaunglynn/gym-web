# CLAUDE.md

Read `AGENTS.md` first. This file adds repo-specific reasoning guidance for deeper work in `gym-web`.

## High-Level Architecture

`gym-web` is a standalone Next.js admin dashboard that consumes the NestJS API in `gym-api`.

Core characteristics:

- App Router frontend with shared global providers
- Browser-driven API access through a centralized client
- JWT-based client auth restoration
- Role and permission-aware dashboard navigation and actions
- Branch-scoped operations for admin users
- Shared CRUD, layout, toast, and form primitives

## Important Runtime Files

- `src/app/layout.tsx`: global providers and metadata
- `src/app/login/page.tsx`: login route entry
- `src/app/dashboard/layout.tsx`: authenticated shell
- `src/proxy.ts`: route matching and optional cookie-based screening
- `src/contexts/AuthContext.tsx`: user session, permissions, branch scope
- `src/lib/apiClient.ts`: request transport, error handling, auth headers
- `src/lib/authorization.ts`: feature/action authority checks
- `src/lib/branchScope.ts`: all-branches read-only semantics
- `src/services/auth.service.ts`: JWT decoding and token persistence helpers

## Architectural Rules

### Auth Reality

- The current app stores the JWT in `localStorage`.
- The proxy cannot fully authenticate requests from that storage model alone.
- Do not document this repo as cookie-authenticated unless you have changed the implementation.

### API Discipline

- Prefer the shared API client and existing service wrappers.
- Maintain normalized pagination behavior for list pages.
- Avoid scattered raw fetch logic and inconsistent error handling.

### Permission Discipline

- Use `hasAuthority(...)` and existing permission-aware patterns.
- Keep branch-admin and staff restrictions explicit.
- Preserve read-only behavior when the active scope is all branches.

### UI Discipline

- Match the existing dashboard shell and component patterns.
- Reuse shared primitives before introducing new component families.
- Keep responsive behavior intentional; list pages and controls must remain usable on smaller screens.

## Working Style For Agents

- Start from the concrete page, component, hook, or service that controls the behavior.
- Read only enough nearby context to form one falsifiable local hypothesis.
- Make the smallest grounded edit first.
- Validate immediately with the narrowest useful test or build check.
- If backend behavior matters, verify the actual contract instead of inferring it from placeholder docs.

## Repo-Specific Notes

- `README.md` is currently minimal boilerplate unless updated alongside your task.
- `next.config.ts` already enables standalone output and a small set of remote image hosts.
- `vitest.config.mts` uses `vite-tsconfig-paths`; keep path aliases aligned with `tsconfig.json`.
- This repository is downstream of `gym-api`; contract drift is a common failure mode.
