## Gym-Web <-> Gym-API Alignment Closure Report

Date: 2026-04-18
Scope: Full dashboard contract and UX alignment milestone

### Verification Summary

- Runtime API probe: `POST /api/v1/auth/login` returns DTO validation `400`, confirming backend reachability from web environment.
- Static checks:
  - `npm run lint`: pass
  - `npm run test`: pass (75/75)
  - `npm run build`: pass

### Mismatch Closure Matrix

| Area | Prior Mismatch | Status | Resolution |
|---|---|---|---|
| API result parsing | Mixed array vs envelope responses caused brittle list pages | Fixed | Added tolerant parser in shared client via `normalizeListResponse` and applied across dashboard pages/selectors |
| Error handling | Inconsistent HTTP handling and redirect behavior | Fixed | Added typed `ApiClientError`, centralized HTTP mapping, and optional status-based toast suppression |
| Auth permission source | Permissions relied on `/auth/me` shape assumptions | Fixed | Auth permission hydration now uses `/permissions/me` with branch-aware refresh |
| Login UX | Raw fetch and inconsistent inline error mapping | Fixed | Login now uses shared client and maps `401`/`400` to inline feedback |
| Plan payload format | Decimal amount sent as number where API expects decimal-safe input | Fixed | Plan modal now validates numeric input and submits amount as decimal string |
| Subscription lifecycle payload | Missing backend-supported fields and enum coverage | Fixed | Subscription modal expanded for end date, payment status/method, reference, paidAt, note |
| Sale payload semantics | Nullable memberId and view mode submit path mismatch | Fixed | Payload omits memberId when absent; view mode now closes instead of submitting |
| Inventory movement constraints | Adjustment quantity minimum mismatch and label inconsistency | Fixed | Adjustment path allows `0`; action button text standardized to Save Movement |
| Invalid query params | Selectors sent unsupported params (`isActive` etc.) | Fixed | Removed unsupported query keys and normalized list parsing in selects |
| Permission guards | Several pages lacked explicit `VIEW` guard wrapping | Fixed | Added missing `PermissionGuard` wrappers on affected routes |
| Inventory tab behavior | Tabs not consistently mapped to backend filter semantics | Fixed | Tabs now drive `movementType` query and reset pagination on change |
| Header auth state | Header used independent auth fetch path | Fixed | Header now uses AuthContext state and logout path |
| Shared table behavior | Inconsistent table control spacing, action menu anchoring, empty/loading visuals | Fixed | Refined `DataTable` for consistent controls, styling, and action menu semantics |
| Pagination UX | Mobile and indicator inconsistency | Fixed | Responsive pagination layout with unified page indicator badge |
| Toast responsiveness | Toast layout clipped on small screens | Fixed | Mobile-safe toast container and width behavior |
| Global visual tokens | No common warm dashboard surface/focus utility layer | Fixed | Added dashboard tokens/utilities in global CSS (`surface`, `border`, `focus`, `no-scrollbar`) |

### Module Coverage Status

- Auth and permission layer: Closed
- Branches: Closed
- Users: Closed
- Members: Closed
- Trainers: Closed
- Membership Plans: Closed
- Member Subscriptions: Closed
- Products: Closed
- Sales: Closed
- Inventory Movements: Closed
- Dashboard aggregate metrics page: Closed
- Shared table/pagination/toast primitives: Closed

### Residual Risks / Deferred Items

- Manual role-based exploratory QA remains recommended for final sign-off:
  - Admin, Branch Admin, and Staff-like account behavior in live UI flows.
- Build warning still present (non-blocking): chart container width/height warning during static generation.
- Vitest warning about `vite-tsconfig-paths` plugin deprecation is informational only.

### Manual Smoke Matrix (Recommended Sign-Off)

#### 1) Authentication and Session

- Login with USER and MEMBER account types.
- Invalid credentials should show inline password error.
- Reload dashboard and verify session restoration.
- Logout should clear session and protect routes.

#### 2) Role and Permission Behavior

- Admin: full create/update/delete visibility where permitted.
- Branch Admin: branch-scoped behavior and restricted global operations.
- Staff-like role: view-only or constrained action visibility based on backend matrix.

#### 3) Per-Module Checks

- Branches: list, create, edit, assign/remove user, pagination.
- Users: list, create, edit, delete, pagination.
- Members: list, create, edit, delete, pagination.
- Trainers: list, create, edit, delete, pagination.
- Plans: list, create/edit with decimal amount formatting, delete.
- Subscriptions: create/edit with lifecycle/payment fields, approve/delete flows where allowed.
- Products: list, create, edit, delete.
- Sales: create sale with/without member, view details mode behavior.
- Inventory: incoming/outgoing/adjustment filters, create movement with adjustment target quantity rules.

#### 4) UX Consistency Checks

- Table tabs/search/action menu behavior on mobile/tablet/desktop.
- Pagination behavior and page indicator consistency.
- Inline validation placement and submit/loading states in modals.
- Toast positioning/readability on small and large screens.

### Final Outcome

Functional contract alignment and shared UX consistency objectives for this milestone are implemented and validated through lint, tests, build, and runtime API reachability checks.
