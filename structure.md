# Next.js UI/UX — Gym Management System

# Infrastructure-Aligned Agent Prompt Set

# Source: infrastructure.md + NestJS backend (NESTJS_INFRASTRUCTURE_PROMPTS.md)

> **Purpose:** Build and fix the Next.js frontend to match the NestJS gym management
> backend exactly. Two separate Next.js apps — Central Admin Portal
> (central.gym-saas.app) and Gym Tenant Portal ({slug}.gym-saas.app).
>
> **Run order:** Execute prompts 01 → 20 in strict sequence.
> **Assumption:** Next.js 14+ (App Router) project exists with partial setup.
> Tailwind CSS, shadcn/ui configured. Some pages may already exist
> but lack tenant awareness, correct API wiring, or domain routing.

---

## HOW TO USE

1. Paste the **MASTER CONTEXT BLOCK** once at the start of your agent session.
2. Run prompts **01 → 20** in order. Do not skip.
3. After each prompt: verify in browser, run tests (`pnpm test`), commit.
4. Use the **FINAL VERIFICATION CHECKLIST** at the bottom to sign off.

---

## MASTER CONTEXT BLOCK — paste this once before starting

```
You are a senior Next.js 14 (App Router) engineer building the frontend for a
multi-tenant gym management SaaS platform. You are modifying an existing project
to exactly match a defined infrastructure specification.

=== SYSTEM OVERVIEW ===

Two Next.js apps in a monorepo:
  apps/central/    →  central.gym-saas.app    (Super Admin Panel)
  apps/tenant/     →  {slug}.gym-saas.app     (Gym Tenant Portal)

Backend: NestJS on same server, port 3000 via Nginx
  Central API base:  https://central.gym-saas.app/api/central
  Tenant API base:   https://{slug}.gym-saas.app/api/tenant

Three user roles:
  superadmin   — accesses central.gym-saas.app only
  admin        — accesses {slug}.gym-saas.app, full gym management
  manager      — accesses {slug}.gym-saas.app, members + reports
  staff        — accesses {slug}.gym-saas.app, points collection only

Tenant DB tables (what the UI manages):
  members          — name, phone, email, points, tier_id
  tiers            — name, min_points, benefits (Bronze/Silver/Gold)
  point_transactions — member_id, amount, type (EARN/REDEEM/ADJUST/EXPIRE), reason
  users            — gym staff accounts with roles
  roles/permissions — RBAC

Central DB tables (super admin manages):
  tenants          — all gym tenants
  domains          — domain per tenant
  central_users    — superadmin accounts
  subscription_plans
  billing_records
  audit_logs

API response envelope (always):
  Success: { data: T, meta: { total?, page?, lastPage? }, error: null }
  Error:   { data: null, meta: {}, error: { code, message, details? } }

Auth:
  Access token: JWT in memory (React context) — NEVER localStorage
  Refresh token: httpOnly cookie — set by backend
  Login endpoint (tenant): POST /api/tenant/auth/login
  Login endpoint (central): POST /api/central/auth/login

=== CONSTRAINTS — NEVER BREAK THESE ===
1. Access token NEVER stored in localStorage or sessionStorage
2. tenantId NEVER in URL params, query strings, or form fields — resolved from hostname
3. Every authenticated page uses server-side session check (not useEffect guards)
4. Unauthenticated redirects happen in Next.js middleware, not components
5. Role-based UI uses <PermissionGate> component — no inline role checks in JSX
6. TypeScript strict mode — no `any`
7. Every component has co-located *.test.tsx (React Testing Library)
8. All forms: React Hook Form + Zod validation with field-level error display
9. Every data-fetching component has: loading skeleton, error state, empty state
10. S3 signed URLs used for all media (avatars, QR codes, receipts) — never expose raw S3

Output format for every task:
## Summary (1 sentence)
## Infrastructure section this implements
## Files changed / created
## Code (complete, runnable TypeScript)
## Tests
## Checklist:
  [ ] no token in localStorage
  [ ] tenantId not in URL/form
  [ ] server-side auth check
  [ ] PermissionGate used
  [ ] loading/error/empty states
  [ ] tests written
```

---

## PROMPT 01 — Project structure: two-app monorepo setup

```
Infrastructure.md reference:
  Three domains: central.gym-saas.app, tenant1.gym-saas.app, tenant2.gym-saas.app
  Two route types: Central Routes, Tenant Routes

Task: Establish the correct monorepo structure for both Next.js portals.
The existing project may be a single Next.js app. Split or reorganise it.

Target structure:

/
├── apps/
│   ├── central/                          # central.gym-saas.app
│   │   ├── app/
│   │   │   ├── layout.tsx                # Root: CentralAuthProvider
│   │   │   ├── (auth)/
│   │   │   │   └── login/
│   │   │   │       └── page.tsx
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx            # Sidebar + topbar
│   │   │       ├── overview/page.tsx
│   │   │       ├── tenants/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [uuid]/page.tsx
│   │   │       ├── billing/page.tsx
│   │   │       ├── plans/page.tsx
│   │   │       ├── users/page.tsx
│   │   │       ├── audit-logs/page.tsx
│   │   │       ├── monitoring/page.tsx
│   │   │       └── maintenance/page.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── tenants/
│   │   │   ├── billing/
│   │   │   └── monitoring/
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts             # Central API client
│   │   │   │   └── hooks/                # React Query hooks
│   │   │   └── auth/
│   │   └── middleware.ts                 # Auth guard for central domain
│   │
│   └── tenant/                           # {slug}.gym-saas.app
│       ├── app/
│       │   ├── layout.tsx                # Root: TenantProvider + AuthProvider
│       │   ├── (auth)/
│       │   │   └── login/
│       │   │       └── page.tsx
│       │   └── (dashboard)/
│       │       ├── layout.tsx            # Sidebar + topbar with gym branding
│       │       ├── dashboard/page.tsx
│       │       ├── members/
│       │       │   ├── page.tsx
│       │       │   └── [id]/page.tsx
│       │       ├── points/page.tsx
│       │       ├── tiers/page.tsx
│       │       ├── staff/page.tsx
│       │       └── reports/page.tsx
│       ├── components/
│       │   ├── layout/
│       │   ├── members/
│       │   ├── points/
│       │   ├── tiers/
│       │   └── reports/
│       ├── lib/
│       │   ├── api/
│       │   │   ├── client.ts             # Tenant API client
│       │   │   └── hooks/
│       │   ├── auth/
│       │   └── tenant/                   # TenantContext, useTenant
│       └── middleware.ts                 # Tenant resolution + auth guard
│
├── packages/
│   ├── ui/                               # Shared components (Button, Input, Table…)
│   │   └── src/
│   │       ├── components/
│   │       └── index.ts
│   └── types/                            # Shared TypeScript types
│       └── src/
│           └── index.ts
│
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json                    # strict: true

Create:
1. pnpm-workspace.yaml listing both apps and packages
2. turbo.json with build/dev/test pipelines
3. tsconfig.base.json with strict: true, paths for @gym/ui and @gym/types
4. packages/types/src/index.ts with ALL shared types:

   // Roles
   export type Role = 'superadmin' | 'admin' | 'manager' | 'staff'

   // Auth
   export interface JwtPayload {
     sub: string
     email: string
     role: Role
     tenantId: string | null   // null for superadmin
     permissions: string[]
   }

   // API envelope
   export interface ApiResponse<T> { data: T; meta: ApiMeta; error: null }
   export interface ApiError { data: null; meta: ApiMeta; error: { code: string; message: string; details?: Record<string, string[]> } }
   export interface ApiMeta { total?: number; page?: number; lastPage?: number }

   // Central entities
   export interface Tenant { id: string; name: string; plan: string; isActive: boolean; domain: string; createdAt: string; deletedAt: string | null }
   export interface SubscriptionPlan { id: string; name: string; priceMonthly: number; features: string[]; isActive: boolean }
   export interface BillingRecord { id: string; tenantId: string; planId: string; amount: number; status: 'PAID'|'FAILED'|'PENDING'|'REFUNDED'; paidAt: string | null }
   export interface AuditLog { id: string; tenantId: string | null; actorId: string; actorRole: string; action: string; resourceType: string; resourceId: string; diff: object | null; createdAt: string }

   // Tenant entities
   export interface Member { id: string; name: string; phone: string | null; email: string; points: number; tierId: string | null; tier: Tier | null; createdAt: string; deletedAt: string | null }
   export interface Tier { id: string; name: string; minPoints: number; benefits: string[] }
   export interface PointTransaction { id: string; memberId: string; amount: number; type: 'EARN'|'REDEEM'|'ADJUST'|'EXPIRE'; reason: string; createdAt: string }
   export interface GymUser { id: string; name: string; email: string; roleId: string; role: GymRole; createdAt: string }
   export interface GymRole { id: string; name: string; permissions: GymPermission[] }
   export interface GymPermission { id: string; name: string }

5. Each app's package.json must depend on @gym/ui and @gym/types

Tests: verify tsconfig paths resolve, type imports compile, no circular deps.
```

---

## PROMPT 02 — Tenant resolution middleware (domain → tenantSlug)

```
Infrastructure.md reference:
  Domain Resolution (Route53/Cloudflare)
  central.gym-saas.app → Central Admin Panel
  {slug}.gym-saas.app  → Gym Tenant Portal
  InitializeTenancyByDomain

Task: Implement middleware for both apps that mirrors backend tenant resolution.
The slug resolved here is used to scope ALL API calls — never comes from user input.

PART A — apps/tenant/middleware.ts
  import { NextRequest, NextResponse } from 'next/server'

  export function middleware(request: NextRequest) {
    const host = request.headers.get('host') ?? ''
    const hostname = host.split(':')[0]   // strip port in dev

    // Reject if somehow on central domain
    if (hostname === 'central.gym-saas.app') {
      return NextResponse.redirect('https://central.gym-saas.app' + request.nextUrl.pathname)
    }

    // Extract slug from {slug}.gym-saas.app
    // In dev: support localhost with x-tenant-slug header or NEXT_PUBLIC_DEV_TENANT_SLUG env
    let slug: string | null = null

    const isProd = hostname.endsWith('.gym-saas.app')
    if (isProd) {
      slug = hostname.replace('.gym-saas.app', '')
    } else {
      // Development: use NEXT_PUBLIC_DEV_TENANT_SLUG
      slug = process.env.NEXT_PUBLIC_DEV_TENANT_SLUG ?? null
    }

    if (!slug) {
      return NextResponse.rewrite(new URL('/not-found', request.url))
    }

    // Auth check: require access token cookie on protected routes
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
    const hasToken = request.cookies.has('tenant_refresh_token')
    if (!isAuthRoute && !hasToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Pass slug via header to server components
    const response = NextResponse.next()
    response.headers.set('x-tenant-slug', slug)
    response.headers.set('x-hostname', hostname)
    return response
  }

  export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/).*)'],
  }

PART B — apps/central/middleware.ts
  Similar but:
  - In prod: verify hostname === 'central.gym-saas.app'
  - If not central domain → redirect to tenant app
  - Auth check: require central_refresh_token cookie
  - No slug resolution needed (central has no tenant scope)
  - Set response header: x-portal: 'central'

PART C — apps/tenant/lib/tenant/TenantContext.tsx
  'use server' (used in layout, reads headers)

  Server function: getTenantFromHeaders()
    - Reads x-tenant-slug from Next.js headers()
    - Calls GET /api/tenant/tenant/me (server-side, passes auth cookie)
    - Returns: { slug, name, plan, isActive }
    - Throws if tenant inactive: renders TenantSuspendedPage

  'use client' TenantProvider:
    - Wraps entire (dashboard) layout
    - Provides TenantContext: { slug, name, plan }

  useTenant() hook:
    - const ctx = useContext(TenantContext)
    - if (!ctx) throw new Error('useTenant must be used inside TenantProvider')
    - return ctx

PART D — Dev environment setup
  .env.local for apps/tenant/:
    NEXT_PUBLIC_DEV_TENANT_SLUG=alpha
    NEXT_PUBLIC_API_URL=http://localhost:3000

  .env.local for apps/central/:
    NEXT_PUBLIC_API_URL=http://localhost:3000

Tests:
  - Tenant middleware: prod domain alpha.gym-saas.app → x-tenant-slug: alpha
  - Tenant middleware: no token on protected route → redirect to /login with ?redirect=
  - Tenant middleware: central domain → redirect to central app
  - Tenant middleware: no slug in dev without env var → rewrite to /not-found
  - Central middleware: non-central domain → redirect
  - TenantContext: getTenantFromHeaders reads slug from headers correctly
  - useTenant: throws outside provider with descriptive message
```

---

## PROMPT 03 — Auth system: login, token management, silent refresh

```
Infrastructure.md reference:
  API token authentication (Sanctum → JWT)
  Session management per tenant
  Failed login throttling

Task: Implement full auth flow for both portals wired to the NestJS endpoints.

=== TENANT PORTAL AUTH ===

PART A — apps/tenant/lib/auth/AuthContext.tsx (client)
  State:
    user: JwtPayload | null
    accessToken: string | null   // MEMORY ONLY — never localStorage
    isLoading: boolean
    isAuthenticated: boolean

  Methods:
    login(email, password): calls POST /api/tenant/auth/login
      - Body: { email, password }
      - On success: store accessToken in state, decode JWT to get user
      - httpOnly cookie (tenant_refresh_token) set by backend — not touched by JS
      - On 401: throw with message 'Invalid credentials'
      - On 403: throw with message 'Account suspended'
      - On 429: throw with message 'Too many attempts. Try again in 10 minutes.'
                (backend locks after 5 failed attempts)

    logout(): calls POST /api/tenant/auth/logout
      - Clears state
      - Backend clears the httpOnly cookie

    silentRefresh():
      - Calls POST /api/tenant/auth/refresh (sends httpOnly cookie automatically)
      - On success: updates accessToken in state
      - On failure: clears state (do not redirect — middleware handles it)

  On mount (useEffect in provider):
    - Attempt silentRefresh()
    - Sets isLoading=false after attempt completes either way

PART B — apps/tenant/lib/api/client.ts
  Typed fetch wrapper for all tenant API calls:

  async function apiClient<T>(
    path: string,
    options: RequestInit & { skipAuth?: boolean } = {}
  ): Promise<T>
    - Reads accessToken from AuthContext (useAuth hook)
    - Prepends /api/tenant to path
    - Sets Authorization: Bearer {accessToken}
    - On 401: attempts ONE silentRefresh, retries request
    - On second 401: calls logout()
    - Parses { data, meta, error } envelope
    - If error is non-null: throws ApiError object (typed)
    - Returns data directly (unwrapped)

PART C — apps/tenant/app/(auth)/login/page.tsx (Server Component)
  - Fetches gym name for branding: GET /api/tenant/tenant/public/{slug}
    (public endpoint, no auth needed)
  - If gym not found or inactive: renders <TenantSuspendedPage />
  - Passes gymName to <LoginForm gymName={gymName} />

PART D — apps/tenant/app/(auth)/login/LoginForm.tsx (Client Component)
  Zod schema:
    email: z.string().email('Invalid email')
    password: z.string().min(1, 'Password is required')

  UI:
    - Gym logo (from S3 signed URL or placeholder)
    - Gym name as heading
    - Email input + Password input (show/hide toggle)
    - "Sign in" button with loading spinner
    - Error banner (not per-field — auth errors are top-level)
    - Error messages:
        401 → "Incorrect email or password"
        403 → "Your account has been suspended. Contact your gym administrator."
        429 → "Too many failed attempts. Account locked for 10 minutes."
    - On success: router.push('/dashboard') using next/navigation

=== CENTRAL PORTAL AUTH ===

PART E — apps/central/lib/auth/CentralAuthContext.tsx
  Same pattern as tenant but:
  - Calls POST /api/central/auth/login
  - User always has role: 'superadmin'
  - Cookie name: central_refresh_token
  - On success: router.push('/overview')

PART F — apps/central/app/(auth)/login/page.tsx
  - Simple centered login card
  - "Central Admin" branding (no gym name)
  - Same Zod schema
  - No suspended state (central is never suspended)

Tests:
  - login(): accessToken stored in state, NOT in localStorage
  - login(): 429 response → correct error message shown
  - silentRefresh(): on mount, called automatically
  - silentRefresh(): failure leaves user as null without throwing
  - apiClient: attaches Bearer token to every request
  - apiClient: retries once on 401 then calls logout
  - LoginForm: renders gym name from prop
  - LoginForm: loading spinner visible during submission
  - LoginForm: error banner shown on 401 (not field-level)
```

---

## PROMPT 04 — Tenant portal layout: sidebar, topbar, navigation, branding

```
Infrastructure.md reference:
  Tenant Routes: Member Mgmt, Reports/Analytics, API Endpoints
  Tenant DB: members, tiers, point_transactions, users

Task: Build the authenticated layout shell for the Tenant Portal.
      Every gym sees their own branding (name from TenantContext).

PART A — apps/tenant/app/(dashboard)/layout.tsx (Server Component)
  - Reads tenant slug from headers (set by middleware)
  - Verifies session server-side (decode JWT from cookie with jose)
  - If invalid → middleware already redirects, but as defence-in-depth: redirect('/login')
  - Wraps in:
      <TenantProvider tenantData={tenantData}>
        <AuthProvider>
          <QueryClientProvider>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main>{children}</main>
              </div>
            </div>
          </QueryClientProvider>
        </AuthProvider>
      </TenantProvider>

PART B — apps/tenant/components/layout/Sidebar.tsx (Client Component)
  Visual:
    - Fixed width: 260px desktop, icon-only (56px) at lg breakpoint, hidden on mobile
    - Top section: gym logo + name (from useTenant()), plan badge
    - Navigation items (with lucide-react icons):
        📊  Dashboard         /dashboard
        👥  Members           /members
        ⭐  Points            /points
        🏆  Tiers             /tiers
        👤  Staff             /staff
        📈  Reports           /reports
    - Active item: solid brand-color left border + background tint
    - Bottom section: logged-in user name, role badge, logout button
    - Collapse button (chevron) on desktop
    - Smooth 200ms CSS transition on collapse

  Role-based navigation hiding:
    staff role: hide Staff, Tiers, Reports items
    manager role: hide Staff item
    admin role: show all

PART C — apps/tenant/components/layout/Topbar.tsx (Client Component)
  - Sticky, full width, height 56px
  - Left: hamburger menu (mobile), breadcrumb
  - Right: notification bell (future), user avatar + dropdown
  - User dropdown: "My Profile", "Change Password", divider, "Sign out"
  - Gym name shown on mobile (sidebar hidden)

PART D — apps/tenant/components/layout/GymBrand.tsx
  - Gym logo: loads from S3 signed URL (GET /api/tenant/tenant/me returns logoUrl)
  - Falls back to initials avatar if no logo
  - Gym name text: truncated with ellipsis if > 20 chars
  - Plan badge: coloured chip (STARTER=gray, PRO=blue, ELITE=gold)

PART E — apps/tenant/components/layout/PageHeader.tsx
  Props: title, subtitle?, action? (React node for right side)
  Used at top of every page:
    <PageHeader
      title="Members"
      subtitle="Manage gym members and their points"
      action={<Button onClick={openAddModal}>Add Member</Button>}
    />

Tests:
  - Sidebar renders all navigation items for admin role
  - Sidebar hides Staff item for manager role
  - Sidebar hides Staff/Tiers/Reports for staff role
  - Active route item has aria-current="page"
  - GymBrand renders initials when logoUrl is null
  - GymBrand renders correct plan badge color
  - Topbar logout button calls auth.logout()
  - Sidebar collapses to icon-only at lg breakpoint
```

---

## PROMPT 05 — Permission gate component and RBAC hooks

```
Infrastructure.md reference:
  Role-based permissions (Spatie equivalent)
  Roles: admin | manager | staff
  Permissions: members:read, members:write, points:earn, points:adjust, reports:read, etc.

Task: Build the permission system that gates all UI actions.
      This mirrors the NestJS PermissionsGuard exactly on the frontend.

PART A — packages/ui/src/components/PermissionGate.tsx
  Props:
    permission?: string           // single permission check
    permissions?: string[]        // all must be satisfied
    anyOf?: string[]              // any one is sufficient
    role?: Role                   // role-level check
    roles?: Role[]
    fallback?: React.ReactNode    // shown when denied (default: null)
    children: React.ReactNode

  Behaviour:
    - Reads user from useAuth()
    - During auth loading: renders null (never flash-renders gated content)
    - Checks user.permissions array (from JWT) against required permissions
    - Checks user.role against required role(s)
    - If denied: renders fallback or null

  Usage examples:
    // Hide delete button from non-admin
    <PermissionGate permission="members:delete">
      <Button variant="destructive">Delete Member</Button>
    </PermissionGate>

    // Show tooltip instead of hiding
    <PermissionGate
      permission="points:adjust"
      fallback={<Tooltip content="Admin only"><Button disabled>Adjust Points</Button></Tooltip>}
    >
      <Button onClick={openAdjustModal}>Adjust Points</Button>
    </PermissionGate>

PART B — usePermission hook (apps/tenant/lib/hooks/usePermission.ts)
  const canAdjustPoints = usePermission('points:adjust')
  const canDeleteMember = usePermission('members:delete')
  Returns: boolean (false during loading — fail-closed)

PART C — Permission constants (packages/types/src/permissions.ts)
  Export all permission strings as typed constants:
    export const PERMISSIONS = {
      MEMBERS_READ:    'members:read',
      MEMBERS_WRITE:   'members:write',
      MEMBERS_DELETE:  'members:delete',
      POINTS_READ:     'points:read',
      POINTS_EARN:     'points:earn',
      POINTS_REDEEM:   'points:redeem',
      POINTS_ADJUST:   'points:adjust',
      TIERS_READ:      'tiers:read',
      TIERS_WRITE:     'tiers:write',
      REPORTS_READ:    'reports:read',
      USERS_READ:      'users:read',
      USERS_WRITE:     'users:write',
    } as const
    export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

PART D — Role-permission matrix (matches NestJS seed exactly)
  admin:   ALL permissions
  manager: MEMBERS_READ/WRITE, POINTS_READ/EARN/REDEEM, TIERS_READ, REPORTS_READ, USERS_READ
  staff:   MEMBERS_READ, POINTS_READ, POINTS_EARN

  Document this in packages/types/src/permissions.ts as a comment for developers.

PART E — useCurrentUser hook (apps/tenant/lib/hooks/useCurrentUser.ts)
  Returns: JwtPayload | null
  Used wherever the component needs to know who is logged in.

Tests:
  - PermissionGate renders children when user has permission
  - PermissionGate renders fallback when permission missing
  - PermissionGate renders null during auth loading
  - PermissionGate anyOf: renders if user has any one of the permissions
  - usePermission returns false when user is null (loading)
  - usePermission returns correct boolean based on JWT permissions array
```

---

## PROMPT 06 — React Query setup: API hooks for all tenant resources

```
Infrastructure.md reference:
  Tenant DB: members, tiers, point_transactions, users

Task: Create all React Query hooks for tenant data fetching.
      These are the single source of truth for ALL tenant data in the UI.

PART A — apps/tenant/lib/api/queryClient.ts
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status === 401) return false
          if (error instanceof ApiError && error.status === 403) return false
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
      },
    },
  })

  On any 401 error from a query: call auth.logout()
  (register a global queryCache error handler)

PART B — Query key factory (apps/tenant/lib/api/queryKeys.ts)
  Tenant slug MUST be in every key to prevent cross-tenant cache collisions:

  export const keys = {
    members: {
      all:    (slug: string) => ['members', slug] as const,
      list:   (slug: string, params: object) => ['members', slug, 'list', params] as const,
      detail: (slug: string, id: string) => ['members', slug, 'detail', id] as const,
    },
    tiers: {
      all:  (slug: string) => ['tiers', slug] as const,
      list: (slug: string) => ['tiers', slug, 'list'] as const,
    },
    points: {
      history: (slug: string, memberId: string, params: object) =>
        ['points', slug, 'history', memberId, params] as const,
    },
    users: {
      all:  (slug: string) => ['users', slug] as const,
      list: (slug: string) => ['users', slug, 'list'] as const,
    },
    reports: {
      dashboard: (slug: string) => ['reports', slug, 'dashboard'] as const,
      memberGrowth: (slug: string, params: object) => ['reports', slug, 'member-growth', params] as const,
      pointsSummary: (slug: string, params: object) => ['reports', slug, 'points-summary', params] as const,
    },
  }

PART C — Member hooks (apps/tenant/lib/api/hooks/useMembers.ts)
  useMembers(params: { page: number; limit: number; search?: string; tierId?: string })
    GET /api/tenant/members?page=&limit=&search=&tierId=
    Returns: { members: Member[], meta: ApiMeta }

  useMember(id: string)
    GET /api/tenant/members/{id}
    Returns: Member with tier and recent transactions

  useCreateMember(): useMutation
    POST /api/tenant/members
    On success: invalidate keys.members.all(slug)

  useUpdateMember(): useMutation
    PATCH /api/tenant/members/{id}
    Optimistic update: immediately update cached member
    On error: rollback

  useDeleteMember(): useMutation
    DELETE /api/tenant/members/{id}
    Optimistic update: remove from list cache immediately
    On error: rollback

  useMemberQRCode(memberId: string)
    GET /api/tenant/members/{id}/qr
    Returns: { signedUrl: string }  (S3 signed URL, 1 hour expiry)
    staleTime: 3_000_000  (50 minutes — refresh before URL expires)

PART D — Points hooks (apps/tenant/lib/api/hooks/usePoints.ts)
  usePointHistory(memberId: string, params: { page: number; limit: number })
    GET /api/tenant/points/member/{memberId}/history
    Returns: { transactions: PointTransaction[], meta: ApiMeta }

  useCollectPoints(): useMutation
    POST /api/tenant/points/collect
    On success: invalidate member detail cache + point history

  useRedeemPoints(): useMutation
    POST /api/tenant/points/redeem
    On success: invalidate member detail + point history

  useAdjustPoints(): useMutation
    POST /api/tenant/points/adjust
    On success: invalidate member detail + point history + audit log

PART E — Tier hooks (apps/tenant/lib/api/hooks/useTiers.ts)
  useTiers(): all tiers, staleTime: 3_600_000 (1 hour — tiers rarely change)
  useCreateTier, useUpdateTier, useDeleteTier (admin only)
  On any tier mutation: invalidate tiers list AND members list
  (tier changes affect member tier display)

PART F — Report hooks (apps/tenant/lib/api/hooks/useReports.ts)
  useDashboardStats(): GET /api/tenant/reports/dashboard
  useMemberGrowth(from: string, to: string)
  usePointsSummary(from: string, to: string)
  useMemberExport(): useMutation
    POST /api/tenant/reports/export/members
    Returns: { signedUrl: string }  (S3 CSV download link)

Tests:
  - useMembers: query key includes tenant slug
  - useDeleteMember: optimistic update removes from cache
  - useDeleteMember: cache rolled back on API error
  - useMemberQRCode: staleTime is 3_000_000 (near 50 mins)
  - On 401: queryClient error handler calls logout
  - Query keys: different slugs produce different cache entries
```

---

## PROMPT 07 — Dashboard page: gym overview with real data

```
Infrastructure.md reference:
  Tenant Routes: Reports/Analytics
  Tenant DB: members, tiers, point_transactions

Task: Build the /dashboard page for the Tenant Portal.
      First thing gym admin/manager/staff sees after login.

PART A — apps/tenant/app/(dashboard)/dashboard/page.tsx (Server Component)
  - Pre-fetch dashboard stats server-side for instant render:
      GET /api/tenant/reports/dashboard (with auth cookie)
  - Pass as initialData to client component

PART B — apps/tenant/app/(dashboard)/dashboard/DashboardClient.tsx
  Layout: responsive grid (4 stat cards, then 2-column content)

  Section 1 — Stats row (4 cards):
    Total Members      — count + "X new this month" subtext
    Total Points Issued — sum of all EARN transactions
    Active Tiers       — count of tiers with members
    Points Redeemed    — sum of REDEEM transactions this month
    Each card: large number, trend indicator (↑/↓ vs last month), icon

  Section 2 — Recent Transactions (left column, 60% width)
    Table: Member name, Type badge, Points, Reason, Date
    Type badges:
      EARN    → green badge
      REDEEM  → blue badge
      ADJUST  → amber badge
      EXPIRE  → gray badge
    Shows last 10 transactions
    "View all" link → /points

  Section 3 — Tier Breakdown (right column, 40% width)
    Horizontal bar chart (Recharts BarChart)
    X: tier name, Y: member count
    Each bar colored by tier:
      Bronze: #CD7F32
      Silver: #C0C0C0
      Gold:   #FFD700
    "Manage tiers" link → /tiers

  Section 4 — Member Growth Chart (full width)
    Line chart (Recharts LineChart)
    Last 30 days: X=date, Y=new members per day
    Area fill with gradient

  Loading states:
    Every section has its own Suspense boundary + skeleton
    Skeleton shapes match real content to avoid layout shift

  Error states:
    Per-section InlineError with retry — page never fully crashes

Tests:
  - Stat cards render correct values from mock data
  - EARN transaction renders green badge
  - REDEEM transaction renders blue badge
  - Tier chart renders correct bar count
  - Section error does not crash other sections
  - Loading skeletons render correct shapes
```

---

## PROMPT 08 — Members page: full CRUD with points display

```
Infrastructure.md reference:
  Tenant Routes: Member Mgmt
  Tenant DB: members (name, phone, email, points, tier_id)

Task: Build the /members page — the most-used page in the gym portal.

PART A — apps/tenant/app/(dashboard)/members/page.tsx (Server Component)
  Pre-fetch page 1 of members server-side for instant render.
  Pass as initialData to MembersClient.

PART B — apps/tenant/app/(dashboard)/members/MembersClient.tsx (Client)
  Table features:
    Columns:
      □  (checkbox for bulk select)
      Avatar (initials or S3 photo — 32px circle)
      Name (clickable → opens MemberDrawer)
      Email
      Phone
      Points (formatted: "1,234 pts" with tier color)
      Tier badge (Bronze/Silver/Gold colored chip)
      Joined date (relative: "3 months ago")
      Actions (⋯ dropdown: Edit, View QR, Collect Points, Delete)

    Features:
      - Search input (debounced 300ms): name, email, phone
      - Filter by tier (select from useTiers())
      - Sort: Name A-Z, Name Z-A, Points High-Low, Points Low-High, Newest, Oldest
      - Pagination: "Previous / Page X of Y / Next" + page size selector (10/20/50)
      - Row hover: subtle background change
      - Bulk actions (shown when ≥1 row selected):
          "X members selected" | Export CSV | Delete

    Empty state:
      Icon + "No members yet" + "Add your first member" button

PART C — MemberDrawer (apps/tenant/components/members/MemberDrawer.tsx)
  Slide-in panel from right (400px wide)
  Triggered by row click or "Edit" action

  Tabs:
    Profile
      - Avatar upload (drag-drop or click, uploads to S3 avatars/ folder)
        Shows preview, progress bar during upload
        GET /api/tenant/members/{id}/avatar-upload-url → presigned PUT URL
        After upload: call PATCH /members/{id} with avatarKey
      - Name, Email, Phone inputs
      - Joined date (read-only)
      - Save / Cancel buttons
      - Inline field validation (Zod)

    Points
      - Current tier: colored badge + progress bar to next tier
        Example: "Silver (1,200/2,000 pts to Gold)" with filled progress bar
      - Total points: large number
      - "Collect Points" button (opens CollectModal)
      - "Redeem Points" button (opens RedeemModal)
      - PermissionGate permission="points:adjust":
          "Adjust Points" button (opens AdjustModal)

    History
      - Paginated list of point_transactions
      - Each row: type badge, amount (+1,000 or -500), reason, timestamp
      - Filter by type: All | EARN | REDEEM | ADJUST

    QR Code
      - Loads from useMemberQRCode(memberId)
      - Shows QR code image (from S3 signed URL)
      - "Download QR" button (triggers file download)
      - "Regenerate QR" button (calls POST /members/{id}/qr)
      - Explanation: "Staff scan this QR to collect points at the counter"

PART D — AddMemberModal (apps/tenant/components/members/AddMemberModal.tsx)
  Zod schema:
    name:    z.string().min(2, 'Name must be at least 2 characters').max(100)
    email:   z.string().email('Invalid email')
    phone:   z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone').optional().or(z.literal(''))
    tierId:  z.string().uuid().optional()  // pre-assign to a tier

  Fields: Name*, Email*, Phone, Tier (select from useTiers())
  On success: close modal, toast "Member added", list refreshed

PART E — Tier progress bar component (shared)
  <TierProgress currentPoints={1200} currentTier={silverTier} nextTier={goldTier} />
  Shows: current tier name + next tier name + progress bar + points needed

  Props:
    currentPoints: number
    currentTier: Tier
    nextTier: Tier | null   // null if already at highest tier

  Visual:
    "Silver → Gold: 800 pts to go"
    [███████░░░░░] 60%

Tests:
  - Table renders correct number of rows
  - Search debounces correctly (300ms)
  - Tier filter sends tierId in API request
  - Sorting: clicking Name column toggles asc/desc
  - MemberDrawer opens on row click
  - Points tab renders tier progress bar
  - TierProgress: correct percentage and label
  - QR tab displays img with signed URL src
  - AddMemberModal field errors shown on blur
  - Avatar upload: progress bar visible during upload
```

---

## PROMPT 09 — Points collection page: QR scan + manual entry

```
Infrastructure.md reference:
  Tenant API Request Flow (Point Collection):
  Mobile App → PointsController → Redis cache → DB transaction → Queue job
  point_transactions: member_id, amount, type, reason

Task: Build the /points page — the primary daily-use page for staff.

PART A — apps/tenant/app/(dashboard)/points/page.tsx
  This page is the "counter view" — staff use this to collect points for walk-in members.

  Layout: two sections side by side (desktop) / stacked (mobile)

  LEFT — Quick Collect (60% width)
    Title: "Collect Points"
    Member search:
      - Large search input (autofocus on page load)
      - Searches by name, email, or phone (debounced 300ms)
      - Results dropdown (max 8 rows): avatar, name, tier badge, current points
      - Keyboard navigation (↑↓ arrows, Enter to select)
      - "Clear" button to reset

    When member is selected:
      - Member card appears below:
          Avatar, Name, Email, Current points (large), Tier badge + progress bar
      - Point collection form:
          Amount: number input (min 1, default 100)
          Reason: preset chips (Walk-in, Class Attended, Purchase, Referral, Other)
                  Selecting "Other" shows a text input for custom reason
          "Collect Points" button (primary, large)
          "Redeem Points" button (secondary)

    On successful collect:
      - Animated "+{amount} pts" green overlay on member card (1.5s, then fades)
      - Toast: "{memberName} earned {amount} points! Now at {newTotal} pts"
      - If tier upgrade: confetti animation + modal:
          "🏆 Tier Upgrade! {memberName} reached {newTier}!"
          Shows new tier badge + benefits list
      - Form resets, member card stays (allow multiple transactions)

  RIGHT — Recent Transactions (40% width)
    Live list of today's transactions (auto-refreshes every 30 seconds)
    Each row: member avatar, name, type badge, amount, time
    "View full history →" link

PART B — CollectPointsModal (for use from MemberDrawer too)
  Same form as above but in a modal wrapper
  Used when staff clicks "Collect Points" from the member table

PART C — AdjustPointsModal
  <PermissionGate permission="points:adjust"> (admin only)
  Fields:
    Amount: number input (positive = add, negative = deduct)
    Reason: text input (required, min 10 chars)
    Confirmation checkbox: "I confirm this adjustment is authorized"
  Warning banner: "Point adjustments are permanently logged in the audit trail"
  On success: toast with adjustment details

PART D — QR Scanner component (future-ready)
  Placeholder component: <QRScannerPlaceholder />
  Shows message: "QR scanning available in the mobile app"
  Renders a camera icon with "coming soon" badge
  (Actual QR scanning is for the mobile app — this page is the web counter view)

Tests:
  - Member search dropdown appears after typing 2+ chars
  - Keyboard navigation selects correct member
  - After collect: tier upgrade modal appears when tier changes
  - After collect: "+{amount} pts" animation fires
  - Amount input: rejects 0 and negative values
  - Reason "Other" shows custom input
  - AdjustModal: confirmation checkbox required before submit
  - Recent transactions list refreshes every 30 seconds
```

---

## PROMPT 10 — Tiers management page

```
Infrastructure.md reference:
  Tenant DB: tiers (name, min_points, benefits)

Task: Build the /tiers page — manage Bronze/Silver/Gold membership tiers.

PART A — apps/tenant/app/(dashboard)/tiers/page.tsx
  Access: admin and manager can view, admin can edit
  Display all tiers as cards in a row, sorted by min_points ascending.

  Tier card component (apps/tenant/components/tiers/TierCard.tsx):
    Visual:
      - Large tier icon/medal (different color per tier)
      - Tier name (editable inline for admin)
      - "From X points" label
      - Member count badge: "24 members" (from dashboard stats)
      - Benefits list: checkmark + benefit text
      - <PermissionGate permission="tiers:write">:
          Edit button (opens TierEditModal)
          Delete button (with confirmation — disabled if tier has members)

  Add Tier button (admin only, PermissionGate):
    Opens AddTierModal

PART B — TierEditModal / AddTierModal
  Zod schema:
    name:      z.string().min(2).max(50)
    minPoints: z.number().int().min(0)
    benefits:  z.array(z.string().min(1)).min(1, 'Add at least one benefit')

  Fields:
    Tier name
    Minimum points (number input)
    Benefits (dynamic list):
      - Default shows 1 text input
      - "+ Add benefit" button adds another input row
      - "×" button removes a benefit row
      - Drag to reorder (use @dnd-kit/core)

  Validation:
    min_points must be unique (no two tiers with same threshold)
    Warn if removing a tier that has members:
      "This tier has 12 members. They will be moved to the tier below."

PART C — Tier progression visualizer
  Below the tier cards, show a visual progression diagram:
    [Bronze: 0pts] ──────▶ [Silver: 500pts] ──────▶ [Gold: 2000pts]
  Horizontal timeline with arrows, points labeled above each milestone.
  Auto-generated from useTiers() data.

Tests:
  - Tier cards render in ascending minPoints order
  - Edit button hidden for manager role
  - Delete button disabled when tier has members
  - AddTierModal: duplicate minPoints shows validation error
  - Benefits list: add button adds new input row
  - Benefits list: remove button removes correct row
  - Tier progression visualizer updates when tiers change
```

---

## PROMPT 11 — Reports page: analytics and data export

```
Infrastructure.md reference:
  Tenant Routes: Reports/Analytics
  Tenant DB: members, point_transactions, tiers
  S3: tenant_{uuid}/exports/

Task: Build the /reports page — read-only analytics for admin and manager.
      PermissionGate permission="reports:read" on entire page.

PART A — apps/tenant/app/(dashboard)/reports/page.tsx
  Tabs: Overview | Member Growth | Points Activity | Export

  ── OVERVIEW TAB ──
  Date range picker at top (default: last 30 days)
  Uses react-day-picker with preset ranges: Today, Last 7 days, Last 30 days, Last 90 days

  4 metric cards: Total New Members, Points Earned, Points Redeemed, Net Points Balance

  Chart 1: Member Growth (LineChart)
    X: dates in range, Y: cumulative member count
    Hover tooltip: date + member count

  Chart 2: Points Activity (AreaChart)
    Two series: "Points Earned" (green) and "Points Redeemed" (blue)
    Stacked area chart, X: dates, Y: daily total

  Chart 3: Tier Distribution (PieChart / DonutChart)
    Each slice: tier name + member count + percentage
    Legend below chart

  ── MEMBER GROWTH TAB ──
  Table: Date | New Members | Cumulative Total
  Paginated, sortable by date or count

  ── POINTS ACTIVITY TAB ──
  Table: Date | EARN total | REDEEM total | ADJUST total | Net
  Colour-coded amounts: earn=green, redeem=blue, adjust=amber

  ── EXPORT TAB ──
  Two export options:

  Members Export:
    - "Export Members CSV" button
    - Calls POST /api/tenant/reports/export/members
    - Backend generates CSV, uploads to S3 exports/ folder, returns signed URL
    - Button shows spinner during generation
    - On success: auto-triggers file download via signed URL
    - File name: members_{gymName}_{date}.csv
    - Preview: shows column headers (Name, Email, Phone, Points, Tier, Joined)

  Point Transactions Export:
    - Date range filter
    - "Export Transactions CSV" button (same pattern)
    - File name: transactions_{gymName}_{from}_{to}.csv

Tests:
  - Reports page blocked for staff role (PermissionGate)
  - Date range picker: "Last 7 days" selects correct range
  - Member Growth chart renders with correct data points
  - PieChart renders one slice per tier
  - Export button shows spinner during mutation
  - Export success: file download triggered with signed URL
```

---

## PROMPT 12 — Staff management page (Gym Users)

```
Infrastructure.md reference:
  Tenant DB: users (admin, manager, staff roles)
  Access Control: Role-based permissions (Spatie)

Task: Build the /staff page — manage gym staff accounts and their roles.
      PermissionGate permission="users:read" to view, permission="users:write" to edit.

PART A — apps/tenant/app/(dashboard)/staff/page.tsx

  Table:
    Columns: Avatar, Name, Email, Role badge, Created, Last active, Actions
    Role badges:
      admin   → red badge
      manager → amber badge
      staff   → blue badge
    Actions (PermissionGate permission="users:write"):
      Edit role, Reset password, Deactivate

  "Add Staff Member" button → AddStaffModal
  PermissionGate permission="users:write"

PART B — AddStaffModal
  Fields (Zod validated):
    name:     z.string().min(2)
    email:    z.string().email()
    role:     z.enum(['admin', 'manager', 'staff'])
    password: z.string().min(8).regex(/(?=.*[A-Z])(?=.*[0-9])/, 'Must include uppercase and number')
    confirmPassword: matches password

  Role description shown below role select:
    admin   → "Full access: members, points, tiers, staff, reports"
    manager → "Members, points collection, view reports"
    staff   → "Points collection only"

  On success: staff member created, invite email sent (by backend queue), list refreshed

PART C — Edit Role modal
  Simple modal: current role shown, select new role
  Warning: "Changing role will immediately update their permissions"
  Requires confirmation checkbox for admin → staff/manager downgrade

PART D — Deactivate confirmation
  Destructive confirmation dialog:
    "Deactivate {name}? They will no longer be able to log in."
    "Deactivate" (red button) | "Cancel"

Tests:
  - Table renders correct role badge colors
  - Add Staff: password strength validation (uppercase + number required)
  - Add Staff: confirmPassword mismatch shows error
  - Role select: shows correct description for each role
  - Edit Role: admin downgrade shows confirmation checkbox
  - Deactivate: shows confirmation dialog before API call
  - Deactivate button hidden for users:write permission missing
```

---

## PROMPT 13 — Central Admin portal layout and navigation

```
Infrastructure.md reference:
  central.gym-saas.app → Admin Panel
  Central Routes: Tenant CRUD, Billing, Monitoring, User Management

Task: Build the Central Admin portal layout at apps/central/.
      This is a completely separate app from the tenant portal.

PART A — apps/central/app/(dashboard)/layout.tsx (Server Component)
  Verify host === 'central.gym-saas.app' (done by middleware)
  Server-side session check: decode JWT from central_refresh_token cookie
  If invalid: redirect('/login')

PART B — apps/central/components/layout/CentralSidebar.tsx (Client Component)
  Visual:
    - Darker, more serious design than tenant sidebar
    - Header: "Gym SaaS" logo + "Central Admin" label
    - No gym branding (this is platform-level)
    - Navigation items:
        🏠  Overview           /overview
        🏢  Tenants            /tenants
        💳  Billing            /billing
        📦  Plans              /plans
        👤  Users              /users
        📋  Audit Logs         /audit-logs
        ⚙️  Monitoring         /monitoring
        🔧  Maintenance        /maintenance
    - All items visible (superadmin sees everything)
    - Bottom: logged-in user email, "Sign out"

PART C — apps/central/components/layout/CentralTopbar.tsx
  - "Central Admin" text left side
  - System health indicator (green/red dot) → links to /monitoring
  - Right: user menu

PART D — Central API client (apps/central/lib/api/client.ts)
  Same pattern as tenant client but:
  - Base URL: /api/central
  - Cookie name: central_refresh_token
  - No tenant slug needed

PART E — Central query key factory (apps/central/lib/api/queryKeys.ts)
  No tenant slug in keys (central sees all tenants):
    tenants:  { all: ['tenants'], list: (params) => ['tenants', 'list', params], detail: (uuid) => ['tenants', uuid] }
    billing:  { all: ['billing'], byTenant: (uuid) => ['billing', uuid] }
    plans:    { all: ['plans'] }
    users:    { all: ['central-users'] }
    auditLogs: { all: ['audit-logs'], filtered: (params) => ['audit-logs', params] }

Tests:
  - Central sidebar renders all 8 navigation items
  - Health indicator renders green when API returns healthy
  - Health indicator renders red when API returns unhealthy
  - Central client: no x-tenant-slug header sent
  - Route protection: non-superadmin JWT → redirect to login
```

---

## PROMPT 14 — Central: Overview dashboard and tenant management

```
Infrastructure.md reference:
  Central Routes: Tenant CRUD, Monitoring
  Tenant creation flow: 8-step atomic provisioning

Task: Build /overview and /tenants pages for the Central Admin portal.

PART A — apps/central/app/(dashboard)/overview/page.tsx
  Platform-wide stats (SSR):
    Total Gyms (active / inactive)
    Total Members across all tenants
    Total Revenue this month (sum PAID billing records)
    New Tenants this month
    Queue Health (central/tenant queue depth + failed jobs)

  Layout: full-width, 4 stat cards, then 2-column content

  Content left: Recent Tenant Activity
    List of last 5 tenant creations/changes with relative timestamp

  Content right: System Health summary
    Mini health dashboard (DB ✓, Redis ✓, Queues ✓)
    Each with green/red dot

PART B — apps/central/app/(dashboard)/tenants/page.tsx
  Table:
    Columns: Gym Name, Domain, Plan badge, Status badge, Members, Created, Health, Actions
    Status badges:
      ACTIVE       → green
      INACTIVE     → red
      PROVISIONING → amber with spinning indicator
    Health dot: fetched lazily per row (GET /api/central/tenants/{uuid}/health)
      → renders after table loads, doesn't block it
    Actions: View Details, Edit, Deactivate/Reactivate, Backup Now

  Search: by gym name or domain
  Filter: by status (All/Active/Inactive), by plan

  "Provision New Gym" button → ProvisionTenantModal

PART C — ProvisionTenantModal (8-step flow UI)
  This is the most complex modal in the central portal.
  Maps to the 8-step tenant creation flow in infrastructure.md.

  Step 1 — Form input:
    gymName:    text input
    domain:     text input with live availability check
                Debounced 500ms → GET /api/central/tenants/check-domain?domain=
                Shows: "✓ Available" (green) | "✗ Already taken" (red) | spinner
    plan:       radio cards (STARTER / PRO / ELITE with feature lists and price)
    adminEmail: email input for the gym admin account

    Zod validation:
      gymName: z.string().min(2).max(100)
      domain:  z.string().regex(/^[a-z0-9-]+\.gym-saas\.app$/)
      plan:    z.enum(['starter', 'pro', 'elite'])
      adminEmail: z.string().email()

  Step 2 — Provisioning progress (after form submitted):
    Replace form with step tracker:

    Each step shows: spinner → checkmark (success) | × (error)

    Step 1: Creating tenant record           ● → ✓
    Step 2: Registering domain               ● → ✓
    Step 3: Generating credentials           ● → ✓
    Step 4: Creating database                ● → ✓
    Step 5: Running migrations               ● → ✓
    Step 6: Seeding default data             ● → ✓
    Step 7: Creating storage folders         ● → ✓
    Step 8: Sending welcome email            ● → ✓

    Implementation:
    - After form submit: POST /api/central/tenants → gets back { tenantId, status }
    - Poll GET /api/central/tenants/{uuid}/provision-status every 1 second
    - API returns: { steps: [{ name, status: 'pending'|'running'|'done'|'error', error?: string }] }
    - Update step list in real time

    On all steps complete:
      Success banner:
        "✓ Alpha Gym is live!"
        "Admin portal: https://alpha.gym-saas.app"
        "Copy link" button | "View tenant" button | "Provision another" button

    On step failure:
      Error on that step with red ×
      Error message shown below step
      "Retry" button (re-runs from failed step)

PART D — Tenant detail page (/tenants/[uuid]/page.tsx)
  Header: gym name, domain link, plan badge, status badge, created date

  Tabs:
    Overview:
      DB health, member count, revenue this month, last activity
      Quick actions: Deactivate, Backup Now, Run Migrations

    Members (read-only view):
      Paginated member table (data from GET /api/central/tenants/{uuid}/members)
      Search by name/email
      Read-only: no edit/delete actions

    Billing:
      All billing records for this tenant
      Manual charge button

    Audit Log:
      Filtered audit logs for this tenant (from central audit_logs table)
      Filter by action type

Tests:
  - Tenants table: health dots load after table renders
  - ProvisionModal: domain availability check debounces 500ms
  - ProvisionModal: invalid domain format shows error
  - Step tracker: steps update in real time via polling
  - Step tracker: error step shows error message + Retry button
  - Success banner: shows correct gym URL
  - Tenant detail tabs: all 4 tabs render
  - Read-only members view: no edit/delete buttons
```

---

## PROMPT 15 — Central: Billing and subscription plans

```
Infrastructure.md reference:
  Central Routes: Billing
  Central DB: subscription_plans, billing_records

Task: Build /billing and /plans pages for Central Admin.

PART A — apps/central/app/(dashboard)/plans/page.tsx
  Subscription Plans management

  Plan cards (3 columns):
    STARTER: features list, price/month, active tenants count, edit button
    PRO:     same
    ELITE:   same
  "Add Plan" button → AddPlanModal

  AddPlanModal / EditPlanModal:
    Fields:
      name:           text
      priceMonthly:   decimal (e.g. "99.00")
      features:       dynamic list (same drag-add-remove as TierModal)
      isActive:       toggle switch

PART B — apps/central/app/(dashboard)/billing/page.tsx
  Tabs: All Records | By Tenant | Revenue Summary

  All Records tab:
    Table: Tenant name, Plan, Amount, Status badge, Paid date, Actions
    Status badges: PAID=green, FAILED=red, PENDING=amber, REFUNDED=gray
    Filter: by status, by plan, date range
    Search: by tenant name

  By Tenant tab:
    Select tenant (searchable dropdown)
    Shows billing history for that tenant
    Summary: total paid, outstanding, next renewal

  Revenue Summary tab:
    Date range picker
    Metric cards: Total Revenue, Failed Payments, Refunds
    Bar chart: monthly revenue for last 12 months (Recharts)
    Table: month | total | paid count | failed count

  Manual Charge button:
    Select tenant, select plan, amount
    Confirmation dialog with amount
    Dispatches to backend central-queue billing task

Tests:
  - Plan cards render feature lists
  - Billing table: PAID status renders green badge
  - Status filter: selecting FAILED shows only failed records
  - Revenue chart renders 12 months of data
  - Manual charge: confirmation dialog appears before API call
```

---

## PROMPT 16 — Central: Monitoring and maintenance pages

```
Infrastructure.md reference:
  NestJS Horizon (Queue Management Dashboard)
  Custom health check endpoint
  Maintenance: migrations, backups

Task: Build /monitoring and /maintenance pages for Central Admin.

PART A — apps/central/app/(dashboard)/monitoring/page.tsx

  System Health section:
    Auto-refreshes every 30 seconds (React Query refetchInterval)
    Health cards:
      PostgreSQL Central DB    — ping latency + ✓/✗
      Redis (all 3 DBs)        — connected + memory usage
      Central Queue            — depth, failed count, throughput/min
      Tenant Queue             — depth, failed count, throughput/min

    Each card:
      Status icon: green checkmark or red ×
      Latency or queue depth
      Last checked: "2 seconds ago"
      "Refresh" button per card

  Queue Stats section:
    Two side-by-side panels (central queue / tenant queue):
      Active jobs: count
      Waiting jobs: count
      Failed jobs: count (red if > 0)
      Completed today: count
    "View Bull Board →" link (external: https://central.gym-saas.app/admin/queues)
    Note: Bull Board is protected by IP allowlist, accessible only from office/VPN

  Failed Jobs section (if any):
    Table: job name, tenantId, error message, failed at, retry count
    "Retry" button per job → POST /api/central/monitoring/queues/retry/{jobId}
    "Discard" button → DELETE with confirmation

PART B — apps/central/app/(dashboard)/maintenance/page.tsx

  Database Migrations section:
    "Run Migrations Across All Tenants" button
    → Opens progress modal (same step-tracker pattern as ProvisionModal)
    Shows: per-tenant migration progress
    "Dry Run" checkbox: preview without executing
    Result summary: X/Y succeeded

  Backup section:
    Last backup time per tenant (list)
    "Backup All Now" button → dispatches to central queue
    "Backup Specific Tenant" → select tenant + run
    Progress tracked via polling

  Connection Pool section:
    List: tenant slug, pool status, last connected
    "Disconnect & Reset" button per tenant
    (Forces TenantPrismaService to close and re-open connection)

Tests:
  - Health cards auto-refresh every 30 seconds
  - Failed jobs table renders with retry/discard buttons
  - Migration modal: dry run checkbox changes button label to "Preview"
  - Backup All: button shows progress then success summary
  - Health card shows red × when status is 'error'
```

---

## PROMPT 17 — Central: Audit logs viewer

```
Infrastructure.md reference:
  Central DB: audit_logs
  Audit logging for point adjustments, tenant operations, billing

Task: Build /audit-logs page for Central Admin — the compliance view.

PART A — apps/central/app/(dashboard)/audit-logs/page.tsx

  Filters (side by side above table):
    Tenant:   searchable multi-select (all tenants)
    Action:   multi-select of action types grouped by category:
                Tenant: tenant.create, tenant.deactivate
                Billing: billing.charge, billing.refund
                Points: points.adjust
                Users: user.create, user.delete, user.role_change
    Actor Role: select (superadmin / admin / manager / staff)
    Date range: from/to date picker
    "Apply Filters" + "Reset" buttons

  Table:
    Columns: Timestamp, Tenant, Actor (email + role badge), Action, Resource, Changes (expand)

    Changes column:
      Collapsed: "View diff" link
      Expanded (inline accordion): shows before/after diff
        Two-column mini table:
          Field    | Before      | After
          points   | 1,200       | 1,700
          tierId   | silver-uuid | gold-uuid
        Changed values highlighted in yellow

  Pagination: 50 rows/page default, page selector

  Export button:
    "Export Filtered Logs CSV"
    Applies current filters, downloads CSV

Tests:
  - Action filter groups render correctly
  - Date range filter applied to query params
  - Diff expander shows before/after values
  - Changed fields highlighted
  - Export uses current filter state
  - Empty state: "No audit logs match your filters"
```

---

## PROMPT 18 — Central: Central users management

```
Infrastructure.md reference:
  Central DB: central_users (superadmin accounts)
  User Management in central routes

Task: Build /users page for managing superadmin accounts.

PART A — apps/central/app/(dashboard)/users/page.tsx

  Table:
    Columns: Name, Email, Created, Last Login, Status, Actions
    Status: ACTIVE (green) | INACTIVE (red)
    Actions: Edit, Deactivate, Reset Password

  "Add Admin User" button → AddCentralUserModal

PART B — AddCentralUserModal
  Zod schema:
    name:            z.string().min(2)
    email:           z.string().email()
    password:        z.string().min(10).regex(
                       /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                       'Must include uppercase, number, and special character'
                     )
    confirmPassword: matches password

  Password strength indicator:
    Shows bar with label: Weak / Fair / Strong / Very Strong
    Calculates based on: length, uppercase, numbers, special chars

PART C — Change Password flow (for logged-in central user)
  Accessible from topbar user dropdown
  Fields: Current password, New password, Confirm new password
  Same strength indicator

Tests:
  - Table renders correct status badges
  - Password strength indicator updates as user types
  - Weak password (no special chars): indicator shows "Fair"
  - AddUserModal: mismatched passwords shows error
  - Deactivate: confirmation dialog before API call
```

---

## PROMPT 19 — Shared UI: error boundaries, skeletons, toasts, empty states

```
Infrastructure.md reference: UX quality across all pages

Task: Build the shared UX infrastructure used across both portals.
      Every data state must be handled — loading, error, empty, offline.

PART A — packages/ui/src/components/TenantErrorBoundary.tsx
  Class-based React error boundary with hooks wrapper.
  Shows: tenant name (from context if available), friendly message, "Try again" button.
  Logs to console.error (integrate Sentry in production).
  Wrap every page-level component in layout.tsx.

PART B — packages/ui/src/components/skeletons/
  One skeleton per content type:

  TableSkeleton: props: rows (default 5), columns (default 4)
    Renders rows × columns gray animated rectangles in table layout.

  CardSkeleton: props: count (default 3)
    Renders count skeleton cards in a grid.

  StatCardSkeleton:
    Square skeleton with large number placeholder and label.

  FormSkeleton: props: fields (default 3)
    Renders fields input placeholders.

  Each skeleton uses Tailwind animate-pulse.
  Dimensions MUST match real content (prevents layout shift — CLS < 0.1).

PART C — packages/ui/src/components/InlineError.tsx
  Props: message, onRetry?
  Shows: warning icon, message text, optional "Try again" button.
  Used inside React Query error states at section level (not page level).

PART D — Toast system (apps/tenant and apps/central)
  Use sonner library (included with shadcn/ui).
  Add <Toaster /> to root layout of each app.

  Create toast helpers (lib/toast.ts in each app):
    toast.success(message: string)          → green, auto-dismiss 4s
    toast.error(message: string)            → red, auto-dismiss 8s
    toast.apiError(error: ApiError)         → maps error.code to user message:
      VALIDATION_ERROR  → "Please check your input"
      NOT_FOUND         → "Item not found"
      FORBIDDEN         → "You don't have permission to do this"
      CONFLICT          → "This item already exists"
      INTERNAL_ERROR    → "Something went wrong. Please try again."
      default           → error.message

PART E — Empty state component (packages/ui)
  <EmptyState
    icon={<UsersIcon />}
    title="No members yet"
    description="Add your first member to get started"
    action={<Button>Add Member</Button>}
  />
  Used in every table/list when data is empty.

PART F — Offline indicator (both portals)
  Add to root layout. Uses navigator.onLine + online/offline event listeners.
  Shows sticky yellow banner at top:
  "⚠ You're offline. Data shown may be outdated."
  Auto-hides 3 seconds after connection restores.

PART G — Tenant suspended page (apps/tenant)
  Shown when CheckTenantStatus middleware returns 403.
  Shows: large lock icon, "This gym account is suspended",
         "Contact support: support@gym-saas.app"
  No sidebar, no auth — standalone full-page design.

Tests:
  - TenantErrorBoundary catches render error, shows Try Again
  - TableSkeleton renders correct rows × columns
  - toast.apiError: FORBIDDEN maps to correct message
  - EmptyState: action button renders when provided
  - Offline indicator appears when navigator.onLine=false
  - Offline indicator disappears 3s after reconnect
  - TenantSuspendedPage renders with no sidebar
```

---

## PROMPT 20 — End-to-end verification: tests, accessibility, and performance

```
Infrastructure.md reference: All sections

Task: Write Playwright E2E tests and run the final verification.

PART A — Playwright E2E tests (e2e/)

  e2e/tenant-login.spec.ts
    ✓ Navigate to alpha.gym-saas.app/login
    ✓ Log in with valid credentials
    ✓ Redirected to /dashboard
    ✓ Gym name visible in sidebar
    ✓ localStorage has NO token keys
    ✓ document.cookie has NO access_token (it's httpOnly)

  e2e/tenant-isolation.spec.ts
    ✓ Login to alpha.gym-saas.app as admin
    ✓ Navigate to beta.gym-saas.app using same browser session
    ✓ Expect: redirected to beta's /login (JWT tenantId mismatch → 401 → logout)

  e2e/points-collection.spec.ts
    ✓ Login as staff
    ✓ Go to /points
    ✓ Search for "Jane" → Jane appears in dropdown
    ✓ Select Jane
    ✓ Enter amount 200, reason "Walk-in"
    ✓ Click "Collect Points"
    ✓ Success toast appears with "+200 pts"
    ✓ Jane's points updated on the member card

  e2e/tier-upgrade.spec.ts
    ✓ Set up member at 490 points (near Silver threshold of 500)
    ✓ Collect 100 points
    ✓ Tier upgrade modal appears with "Reached Silver!" message

  e2e/central-provision.spec.ts
    ✓ Login to central.gym-saas.app
    ✓ Go to /tenants → click "Provision New Gym"
    ✓ Fill form: name, domain, plan, adminEmail
    ✓ Submit → progress tracker appears
    ✓ All 8 steps complete with checkmarks
    ✓ Success banner shows correct URL
    ✓ New tenant appears in tenants table

  e2e/permission-gate.spec.ts
    ✓ Login as staff
    ✓ Navigate to /members
    ✓ Confirm "Add Member" button NOT visible (missing members:write)
    ✓ Confirm "Adjust Points" button NOT visible (missing points:adjust)
    ✓ Navigate to /reports
    ✓ Confirm redirected or page blocked (missing reports:read)

PART B — Accessibility checks (axe-core)
  Write axe tests for these pages:
    tenant/login, tenant/dashboard, tenant/members, tenant/points,
    tenant/tiers, tenant/reports, tenant/staff,
    central/login, central/overview, central/tenants, central/billing,
    central/monitoring, central/audit-logs

  Each page MUST pass:
  □ No missing alt text
  □ All form inputs have visible labels + aria-labelledby
  □ Color contrast ≥ 4.5:1 for normal text
  □ Focus ring visible on all interactive elements
  □ Modal focus trap works (tab stays inside open modal)
  □ Tables have thead + th with scope attribute
  □ aria-live region for toast notifications
  □ Buttons are <button> elements (not <div> with onClick)

PART C — Performance targets
  □ LCP (Largest Contentful Paint) < 2.5s on dashboard pages
  □ CLS (Cumulative Layout Shift) < 0.1 (skeletons must match content shape)
  □ Members table with 50 rows renders in < 200ms
  □ All member avatars use next/image with width/height props

PART D — Token security sweep
  Run these searches across the entire codebase and assert ZERO results:
  □ localStorage.setItem.*[Tt]oken      — tokens not in localStorage
  □ localStorage.getItem.*[Tt]oken      — same
  □ sessionStorage.*[Tt]oken            — not in sessionStorage
  □ searchParams.*tenantId              — tenantId not from URL
  □ params\.tenantId                    — tenantId not from URL params
  □ body\.tenantId                      — tenantId not from request body
  □ role\s*===\s*['"]                   — no inline role checks in JSX
  □ any\b                               — no TypeScript any
```

---

## FINAL VERIFICATION CHECKLIST

Check every item against infrastructure.md before declaring the frontend complete.

### Project structure

- [ ] `apps/central/` and `apps/tenant/` are separate Next.js apps in monorepo
- [ ] `packages/types/` exports all shared TypeScript types
- [ ] `packages/ui/` exports all shared UI components
- [ ] turbo.json and pnpm-workspace.yaml configured correctly

### Domain routing (mirrors infrastructure.md)

- [ ] `central.gym-saas.app` routes to central app only
- [ ] `{slug}.gym-saas.app` routes to tenant app, slug extracted from hostname
- [ ] Middleware rejects unknown domains with 404
- [ ] Suspended tenant shows TenantSuspendedPage (no access to dashboard)
- [ ] Dev environment uses `NEXT_PUBLIC_DEV_TENANT_SLUG` for local testing

### Auth and token security

- [ ] Access token lives ONLY in React Context memory
- [ ] Refresh token lives ONLY in httpOnly cookie
- [ ] Zero occurrences of `localStorage.*token` in codebase
- [ ] Zero occurrences of `sessionStorage.*token` in codebase
- [ ] Silent refresh attempted on every app mount
- [ ] Backend 429 (failed login lockout) shows correct UI message
- [ ] Logout clears memory state and calls logout endpoint

### Tenant isolation (UI)

- [ ] `tenantId` / `slug` NEVER in URL query params or form fields
- [ ] All React Query keys include tenant slug
- [ ] API client reads slug from TenantContext, never from URL
- [ ] Different tenant slugs produce separate cache entries

### Role-based UI

- [ ] `<PermissionGate>` component used for ALL role-sensitive UI
- [ ] Zero inline `role === 'admin'` checks in JSX
- [ ] Staff role: correct nav items hidden
- [ ] Permission constants from `packages/types/src/permissions.ts`

### Tenant portal pages

- [ ] Dashboard: 4 stat cards, transaction list, tier chart, growth chart
- [ ] Members: search, filter, sort, pagination, drawer with 4 tabs, QR code view
- [ ] Points: member search with dropdown, collect/redeem/adjust, live recent list
- [ ] Tiers: cards with progression visualizer, benefits list, admin edit/add
- [ ] Staff: table with role badges, add/edit/deactivate
- [ ] Reports: 4 tabs including CSV export via S3 signed URL

### Central portal pages

- [ ] Overview: platform stats, tenant activity, system health
- [ ] Tenants: table with lazy health dots, 8-step provision modal with polling
- [ ] Billing: all records, by tenant, revenue chart
- [ ] Plans: CRUD for subscription plans
- [ ] Monitoring: health cards (30s refresh), queue stats, failed jobs retry
- [ ] Maintenance: cross-tenant migration progress, backup controls
- [ ] Audit Logs: filterable with diff viewer
- [ ] Users: central staff accounts

### UX quality

- [ ] Every data fetch has: loading skeleton, error state, empty state
- [ ] Skeleton shapes match real content (CLS < 0.1)
- [ ] Global toast system handles all API error codes
- [ ] Offline indicator shown when network lost
- [ ] TenantErrorBoundary wraps all page-level components

### Accessibility

- [ ] All axe-core tests pass (zero violations)
- [ ] All form inputs have labels
- [ ] All modals trap focus
- [ ] Keyboard navigation works across all pages

### Tests

- [ ] Unit tests (React Testing Library) for every component
- [ ] Playwright E2E: login, tenant isolation, points collection, tier upgrade, provisioning, permissions
- [ ] E2E token security assertion: no tokens in localStorage

---

## PROMPT 21 — Shared component library: packages/ui build-out

```
Infrastructure.md reference: Used across all pages in both portals

Task: Build out packages/ui/src/components/ with every reusable primitive.
      These components must be portal-agnostic — no tenant or auth logic inside them.

PART A — Button variants (packages/ui/src/components/Button.tsx)
  Built on top of shadcn/ui Button. Add custom variants:
    variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link' | 'outline'
    size:    'xs' | 'sm' | 'md' | 'lg'
    loading: boolean  — shows spinner, disables click, keeps original width
    leftIcon, rightIcon: React.ReactNode

  Usage:
    <Button variant="primary" loading={isSubmitting} leftIcon={<PlusIcon />}>
      Add Member
    </Button>

  Constraint: loading=true MUST disable the button to prevent double-submit.

PART B — Input primitives (packages/ui/src/components/inputs/)
  All inputs must:
    - Accept ref (forwardRef)
    - Accept error?: string — renders red border + error text below
    - Accept label?: string — renders visible label above
    - Accept hint?: string — renders gray helper text below
    - Be fully keyboard accessible

  TextInput.tsx
    Standard text input. Props: placeholder, disabled, maxLength, prefix, suffix.
    suffix example: unit label like "pts" rendered inside the input right side.

  EmailInput.tsx
    TextInput with type="email" and email keyboard on mobile.

  PasswordInput.tsx
    TextInput with type toggle (password ↔ text).
    Toggle button: eye icon / eye-off icon with aria-label.

  PhoneInput.tsx
    TextInput with type="tel" and tel keyboard on mobile.
    Optional country code prefix selector (simple, not a full library).

  NumberInput.tsx
    type="number", props: min, max, step.
    Prevents non-numeric input.
    Shows + / - stepper buttons on sides.

  SearchInput.tsx
    TextInput with search icon prefix and × clear button (shown when value exists).
    Props: onSearch (debounced callback), debounceMs (default 300).

  Textarea.tsx
    Auto-resizes with content (max 6 rows before scrolling).
    Character counter shown bottom-right if maxLength is set.

PART C — Select inputs (packages/ui/src/components/inputs/SelectInput.tsx)
  Built on shadcn/ui Select.
  Props:
    options: { value: string; label: string; disabled?: boolean }[]
    placeholder: string
    searchable?: boolean  — shows filter input inside dropdown
    clearable?: boolean   — shows × to reset to empty

PART D — Badge component (packages/ui/src/components/Badge.tsx)
  Props: variant: 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'custom'
         size: 'sm' | 'md'
         dot?: boolean  — shows colored dot before text (for status indicators)

  Pre-built semantic badges:
    <StatusBadge status="ACTIVE" />    → green
    <StatusBadge status="INACTIVE" />  → red
    <StatusBadge status="PENDING" />   → amber
    <TierBadge tier="Bronze" />        → #CD7F32 background
    <TierBadge tier="Silver" />        → #C0C0C0 background
    <TierBadge tier="Gold" />          → #FFD700 background
    <RoleBadge role="admin" />         → red
    <RoleBadge role="manager" />       → amber
    <RoleBadge role="staff" />         → blue

PART E — Table component (packages/ui/src/components/Table/)
  Generic typed table:
    interface Column<T> {
      key: keyof T | string
      header: string
      render?: (row: T) => React.ReactNode
      sortable?: boolean
      width?: string
    }

    <DataTable<Member>
      data={members}
      columns={columns}
      onRowClick={(row) => openDrawer(row)}
      selectable={true}
      onSelectionChange={(selected) => setSelected(selected)}
      isLoading={isLoading}
      loadingRows={5}
      emptyState={<EmptyState ... />}
    />

  When isLoading=true: renders TableSkeleton with loadingRows rows.
  Sortable columns: click header toggles asc/desc.
  Selectable: checkbox column added automatically.

PART F — Modal / Dialog (packages/ui/src/components/Modal.tsx)
  Built on shadcn/ui Dialog.
  Props: title, description?, size: 'sm'|'md'|'lg'|'xl'|'full', onClose.
  Always traps focus.
  Closes on Escape key.
  Backdrop click closes (configurable with closeOnBackdrop prop, default true).
  Animated: scale-in on open, scale-out on close (framer-motion or CSS transitions).

PART G — Confirmation dialog (packages/ui/src/components/ConfirmDialog.tsx)
  Props:
    title: string
    description: string
    confirmLabel: string
    confirmVariant: 'danger' | 'primary'
    onConfirm: () => void
    isLoading?: boolean
  Usage:
    <ConfirmDialog
      title="Deactivate Alpha Gym?"
      description="Members will no longer be able to access this gym."
      confirmLabel="Deactivate"
      confirmVariant="danger"
      onConfirm={handleDeactivate}
    />

PART H — Pagination component (packages/ui/src/components/Pagination.tsx)
  Props: page, lastPage, onPageChange, total?, pageSize?, onPageSizeChange?
  Shows: "← Previous  1 2 3 … 10  Next →"
  Page size selector: "Show: 10 / 20 / 50"
  Shows: "Showing 1–20 of 134 results"

PART I — Avatar component (packages/ui/src/components/Avatar.tsx)
  Props: src?: string (S3 signed URL), name: string, size: 'xs'|'sm'|'md'|'lg'
  If src is provided: renders next/image with src.
  If no src: renders initials (first letter of each word in name, max 2 letters).
  Colors: deterministic color from name hash (always same color for same name).

Tests for every component:
  - Button: loading=true disables click and shows spinner
  - PasswordInput: toggle button switches input type
  - SearchInput: onSearch called after debounceMs
  - DataTable: renders skeleton when isLoading=true
  - DataTable: empty state shown when data=[]
  - Modal: closes on Escape key
  - ConfirmDialog: onConfirm called only after user clicks confirm button
  - Avatar: renders initials when no src provided
  - TierBadge: renders correct color for each tier
```

---

## PROMPT 22 — Form system: React Hook Form + Zod + submission patterns

```
Infrastructure.md reference: All data entry forms across both portals

Task: Establish the shared form system. Every form in the project uses this system.
      No form may bypass these patterns.

PART A — Form wrapper component (packages/ui/src/components/Form.tsx)
  Thin wrapper around React Hook Form's <FormProvider>.
  Provides consistent layout and spacing.
  Re-exports useFormContext for use in child components.

  <Form form={form} onSubmit={handleSubmit}>
    <FormField name="email" label="Email" required>
      <EmailInput />
    </FormField>
    <FormActions>
      <Button type="submit" loading={isSubmitting}>Save</Button>
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
    </FormActions>
  </Form>

PART B — FormField component (packages/ui/src/components/FormField.tsx)
  Connects a label + input + error + hint into one unit.
  Uses useFormContext() to read the error state for the field name.
  Props:
    name: string
    label: string
    required?: boolean
    hint?: string
    children: React.ReactNode  (the input component)

  Renders:
    <div>
      <label htmlFor={name}>{label} {required && <span aria-hidden>*</span>}</label>
      {children with id={name} and aria-describedby pointing to error/hint}
      {hint && <p id={name-hint}>{hint}</p>}
      {error && <p id={name-error} role="alert">{error.message}</p>}
    </div>

PART C — useFormSubmit hook (shared hook, each app implements its own)
  apps/tenant/lib/hooks/useFormSubmit.ts
  apps/central/lib/hooks/useFormSubmit.ts

  interface UseFormSubmitOptions<TData, TResponse> {
    mutation: UseMutationResult<TResponse, ApiError, TData>
    onSuccess?: (response: TResponse) => void
    onError?: (error: ApiError) => void
    form?: UseFormReturn<TData>    // if provided, maps API field errors to form errors
  }

  Returns:
    onSubmit: (data: TData) => Promise<void>
    isLoading: boolean

  Behaviour:
    - Calls mutation.mutateAsync(data)
    - On success: calls onSuccess callback
    - On ApiError with details: iterates error.details and calls form.setError() for each field
      Example: { "email": ["Email already taken"] } → form.setError("email", { message: "Email already taken" })
    - On ApiError without details: calls toast.apiError(error)
    - On network error: toast.error("Connection error. Please try again.")
    - Never exposes tenantId in the submitted data

PART D — All Zod schemas (centralised)
  Create schema files in each app:
  apps/tenant/lib/schemas/

    member.schema.ts:
      export const createMemberSchema = z.object({
        name:    z.string().min(2, 'Name must be at least 2 characters').max(100),
        email:   z.string().email('Enter a valid email'),
        phone:   z.string().regex(/^[0-9+\-\s()]{7,15}$/, 'Enter a valid phone number')
                   .optional().or(z.literal('')),
        tierId:  z.string().uuid().optional(),
      })
      export const updateMemberSchema = createMemberSchema.partial()
      export type CreateMemberInput = z.infer<typeof createMemberSchema>

    points.schema.ts:
      export const collectPointsSchema = z.object({
        memberId: z.string().uuid(),
        amount:   z.number().int().min(1, 'Amount must be at least 1').max(10000),
        reason:   z.string().min(1, 'Reason is required'),
      })
      export const adjustPointsSchema = collectPointsSchema.extend({
        amount:   z.number().int().min(-100000).max(100000).refine(n => n !== 0, 'Amount cannot be zero'),
        reason:   z.string().min(10, 'Provide a detailed reason for this adjustment (min 10 chars)'),
        confirmed: z.literal(true, { errorMap: () => ({ message: 'You must confirm this adjustment' }) }),
      })

    tier.schema.ts:
      export const tierSchema = z.object({
        name:      z.string().min(2).max(50),
        minPoints: z.number().int().min(0),
        benefits:  z.array(z.string().min(1)).min(1, 'Add at least one benefit'),
      })

    staff.schema.ts:
      export const createStaffSchema = z.object({
        name:            z.string().min(2),
        email:           z.string().email(),
        role:            z.enum(['admin', 'manager', 'staff']),
        password:        z.string().min(8).regex(/(?=.*[A-Z])(?=.*[0-9])/, 'Must include uppercase and number'),
        confirmPassword: z.string(),
      }).refine(d => d.password === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })

  apps/central/lib/schemas/

    tenant.schema.ts:
      export const provisionTenantSchema = z.object({
        gymName:    z.string().min(2).max(100),
        domain:     z.string()
                      .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens')
                      .min(3).max(30),
        plan:       z.enum(['starter', 'pro', 'elite']),
        adminEmail: z.string().email(),
      })

    billing.schema.ts:
      export const createPlanSchema = z.object({
        name:         z.string().min(2).max(50),
        priceMonthly: z.number().positive('Price must be greater than 0').multipleOf(0.01),
        features:     z.array(z.string().min(1)).min(1),
        isActive:     z.boolean(),
      })

PART E — Dynamic field list component (packages/ui/src/components/DynamicFieldList.tsx)
  Used for tier benefits and plan features (the add/remove rows pattern).

  Props:
    name: string              (RHF field array name)
    label: string             (e.g. "Benefits")
    placeholder: string       (e.g. "e.g. 10% discount on merchandise")
    addLabel: string          (e.g. "+ Add benefit")
    minItems?: number         (default 1)
    sortable?: boolean        (drag to reorder via @dnd-kit/sortable)

  Renders:
    - Row per item: text input + remove button
    - Error per item shown inline
    - "+ Add" button at bottom
    - When sortable=true: drag handle icon on left

Tests:
  - FormField: error message has role="alert"
  - FormField: error message linked via aria-describedby
  - useFormSubmit: API field errors set on correct form fields
  - useFormSubmit: network error shows toast (not field error)
  - adjustPointsSchema: zero amount fails validation
  - adjustPointsSchema: confirmed=false fails validation
  - DynamicFieldList: remove button removes correct item
  - DynamicFieldList: add button appends new empty row
  - provisionTenantSchema: domain with uppercase fails
  - provisionTenantSchema: domain with spaces fails
```

---

## PROMPT 23 — Mobile responsiveness for tenant portal

```
Infrastructure.md reference:
  "Mobile App → tenant1.gym-saas.app/api/points/collect"
  Staff use this on tablets/phones at the gym counter

Task: Make the entire tenant portal fully responsive.
      Staff will use the Points page on a tablet at the gym counter daily.

PART A — Responsive breakpoints (extend tailwind.config.ts in apps/tenant/)
  Use default Tailwind breakpoints:
    sm:  640px  — large phones landscape
    md:  768px  — tablets portrait
    lg:  1024px — tablets landscape / small laptops
    xl:  1280px — desktops

  Add custom:
    'counter': '900px'  — used specifically for the Points counter layout

PART B — Sidebar responsive behaviour (update from Prompt 04)
  Desktop (lg+):  visible, full width (260px), collapsible to icons (56px)
  Tablet (md-lg): hidden by default, slides in as overlay on hamburger click
  Mobile (<md):   hidden, accessible via bottom navigation bar

  Bottom navigation bar (mobile only, fixed bottom):
    Shows 5 icons: Dashboard, Members, Points, Tiers, Reports
    Active icon: colored, label shown
    Only visible on mobile (<md breakpoint)

PART C — Points page responsive layout (critical — Prompt 09)
  Desktop:    side-by-side (60/40 split)
  Tablet:     side-by-side (60/40) but tighter padding
  Mobile:     stacked vertically
    - Member search full width
    - Selected member card full width
    - Amount + reason full width
    - "Collect Points" button: large, full width, 56px height (thumb-friendly)
    - Recent transactions below (collapsible on mobile)

  Touch optimisations for staff at counter:
    - All tap targets minimum 44×44px (WCAG)
    - Large number input for point amount (font-size 24px)
    - Preset reason chips: large pill buttons, min 48px height
    - Haptic-style visual feedback on button press (scale-95 active state)

PART D — Members table responsive layout
  Desktop:  full table with all 8 columns
  Tablet:   hide Phone column
  Mobile:   card list view instead of table
    Each card: avatar + name + tier badge + points on left, action menu on right
    Swipe right to reveal "Collect Points" action (optional, nice-to-have)

  Implement the card/table switch:
    const isMobile = useMediaQuery('(max-width: 640px)')
    if (isMobile) return <MemberCardList members={members} />
    return <DataTable ... />

PART E — Member drawer responsive layout
  Desktop/tablet: fixed right panel, 400px wide, no overlay
  Mobile: full-screen bottom sheet (slides up from bottom)
    Uses Vaul (drawer library) or custom CSS for bottom sheet behaviour

PART F — Modal responsive behaviour
  All modals:
    Desktop:  centered, max-width based on size prop
    Mobile:   full-screen (100vw × 100vh) or bottom sheet style
  Update Modal component (from Prompt 21) to accept bottomSheet?: boolean
  On mobile viewports: always render as bottom sheet

PART G — Touch-friendly tap targets audit
  Run through every interactive element and verify:
  - All buttons: min-height 44px
  - All links: display block with padding to increase tap area
  - All form inputs: min-height 44px, font-size ≥ 16px (prevents iOS zoom)
  - Checkboxes: 20×20px minimum with larger label click area

Tests:
  - Bottom nav renders on mobile viewport (< 640px)
  - Bottom nav hidden on desktop (> 640px)
  - Points page: stacked layout on mobile
  - Points page: side-by-side layout on desktop
  - Members: card list rendered on mobile viewport
  - Members: table rendered on desktop viewport
  - All buttons: height ≥ 44px (check rendered styles)
  - All inputs: font-size ≥ 16px (prevents iOS auto-zoom)
```

---

## PROMPT 24 — Member QR code workflow: generate, display, download

```
Infrastructure.md reference:
  S3: tenant_{uuid}/qr-codes/ (customer QR codes)
  "Tenant API Request Flow" — QR code used to collect points

Task: Build the complete QR code workflow — generate, display, download, and scan ready.

PART A — QR code display (MemberDrawer QR tab — update from Prompt 08)
  Load: useMemberQRCode(memberId) → returns { signedUrl, expiresAt }

  Layout:
    Centered QR image (256×256px via next/image)
    Below image:
      Member name (bold)
      "Points Collection QR Code" label
      Expiry notice: "This link expires in {timeUntilExpiry}" (computed from expiresAt)

    Buttons (row):
      "Download QR Code" (primary)
      "Regenerate" (secondary, admin only via PermissionGate permission="members:write")
      "Print" (ghost)

PART B — QR download implementation
  async function downloadQRCode(signedUrl: string, memberName: string) {
    // Fetch the image as blob (avoids CORS issues with direct S3 URLs)
    const response = await fetch(signedUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-${memberName.toLowerCase().replace(/\s+/g, '-')}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

PART C — QR Print view
  When "Print" is clicked: opens a print-optimised view in new window/tab.
  Print layout (uses CSS @media print):
    Centered: gym logo, member name, tier badge, large QR code (4cm × 4cm)
    Below: "Scan to collect points"
    Page margins removed for close crop

PART D — Bulk QR export (admin only)
  Add to Members page bulk actions:
    When ≥1 member selected: "Download QR Codes" option
    Calls POST /api/tenant/members/bulk-qr
    Backend generates a ZIP with all QR images
    Returns S3 signed URL for the ZIP file
    Auto-triggers ZIP download via signed URL

    Progress UI:
      After clicking: "Generating QR codes for {n} members..."
      Progress spinner
      On complete: "Download ZIP" button appears

PART E — QR code preview in Members table
  Add QR icon button to each row's action menu:
    "View QR" → opens a mini modal (not full drawer)
    Mini modal: just the QR image + download button
    Faster than opening the full drawer for staff who only need the QR

Tests:
  - QR tab shows expiry countdown correctly
  - Download: triggers file download with correct filename
  - Print: opens new window/tab
  - Bulk QR: sends correct memberIds in request body
  - Bulk QR: download triggered with ZIP signed URL
  - QR mini modal: opens from table row action menu
  - Regenerate button hidden for manager/staff roles
```

---

## PROMPT 25 — S3 media handling: uploads, signed URLs, image previews

```
Infrastructure.md reference:
  S3: tenant_{uuid}/avatars/, /qr-codes/, /receipts/, /exports/
  CDN: CloudFront for QR code delivery

Task: Build all S3 media handling UI patterns used across the tenant portal.

PART A — Avatar upload component (apps/tenant/components/media/AvatarUpload.tsx)
  Used in: MemberDrawer Profile tab

  Flow:
    1. Click or drag-drop triggers file picker (accept: image/*)
    2. Client-side validation:
         max size: 5MB
         types: image/jpeg, image/png, image/webp
         If invalid: toast.error with specific message
    3. Crop modal (optional but recommended):
         Show image in circular crop preview
         User can pan/zoom
         "Crop & Upload" button
         Use react-image-crop library
    4. Upload:
         GET /api/tenant/members/{id}/avatar-upload-url
         Returns: { uploadUrl: string, key: string }  (presigned S3 PUT URL)
         PUT directly to S3 with the file (bypasses backend for large files)
         Show upload progress bar (track XHR progress event)
    5. On upload success:
         PATCH /api/tenant/members/{id} with { avatarKey: key }
         Refresh member cache
         Show new avatar immediately (local preview, no full reload)

  Visual states:
    Default:      circular placeholder with initials or existing photo
    Hover:        overlay with camera icon + "Change photo"
    Uploading:    circular progress ring overlay
    Error:        red border + error message below

PART B — Image component with S3 signed URL (packages/ui/src/components/S3Image.tsx)
  Props:
    signedUrl?: string
    fallbackInitials?: string
    alt: string
    size: number
    className?: string

  Handles:
    - Renders next/image when signedUrl is provided
    - Falls back to Avatar initials when signedUrl is null/undefined
    - Error state: if image fails to load → show initials as fallback
    - Signed URLs expire: if 403 on load → re-fetch signed URL automatically
      (call useMemberQRCode again or trigger a re-query)

PART C — File download helper (apps/tenant/lib/utils/download.ts)
  Centralise all file download logic:

  async function downloadFromSignedUrl(signedUrl: string, filename: string): Promise<void>
    // Same blob download pattern from Prompt 24 Part B
    // Used for: QR codes, CSV exports, receipt downloads

  async function downloadFromApi(
    apiPath: string,
    filename: string,
    onProgress?: (percent: number) => void
  ): Promise<void>
    // For large file downloads that go through the API (not direct S3)
    // Uses fetch with ReadableStream to track progress

PART D — Receipt viewer (in PointTransaction history)
  point_transactions may have a receiptUrl field (S3 signed URL).
  When present: show "View Receipt" link in transaction row.
  Opens a modal with:
    - Image preview (for photo receipts)
    - PDF embed via <iframe> (for PDF receipts)
    - "Download" button

PART E — Upload progress bar (packages/ui/src/components/UploadProgress.tsx)
  Generic reusable component for all file uploads:
  Props: percent: number, status: 'uploading' | 'done' | 'error', filename: string

  Shows:
    File name truncated (ellipsis)
    Progress bar: animated fill, green when done, red on error
    Status text: "Uploading... 60%" | "Upload complete" | "Upload failed"

Tests:
  - AvatarUpload: file > 5MB shows error toast
  - AvatarUpload: non-image file shows error toast
  - AvatarUpload: uploads directly to S3 presigned URL (not via backend)
  - AvatarUpload: shows progress bar during upload
  - S3Image: renders initials fallback when src is null
  - S3Image: re-fetches URL on 403 error
  - downloadFromSignedUrl: triggers browser download with correct filename
  - UploadProgress: shows 100% and "Upload complete" on done status
```

---

## PROMPT 26 — Notification and real-time feedback system

```
Infrastructure.md reference:
  Queue Workers: email jobs, notifications (tenant queue)
  Job: SendPointsCollectedNotification

Task: Build the UI notification system — both in-app feedback and
      real-time updates that reflect backend queue processing.

PART A — Toast system (complete implementation — update from Prompt 19)
  apps/tenant/lib/toast.ts and apps/central/lib/toast.ts

  Full implementation:
    import { toast as sonnerToast } from 'sonner'

    export const toast = {
      success: (message: string, options?: { description?: string }) =>
        sonnerToast.success(message, { duration: 4000, ...options }),

      error: (message: string, options?: { description?: string }) =>
        sonnerToast.error(message, { duration: 8000, ...options }),

      warning: (message: string) =>
        sonnerToast.warning(message, { duration: 6000 }),

      info: (message: string) =>
        sonnerToast.info(message, { duration: 4000 }),

      loading: (message: string) =>
        sonnerToast.loading(message),  // returns toast ID

      dismiss: (id: string | number) =>
        sonnerToast.dismiss(id),

      promise: <T>(
        promise: Promise<T>,
        messages: { loading: string; success: string; error: string }
      ) => sonnerToast.promise(promise, messages),

      apiError: (error: { code: string; message: string }) => {
        const messages: Record<string, string> = {
          VALIDATION_ERROR:   'Please check your input and try again.',
          NOT_FOUND:          'The item you requested could not be found.',
          FORBIDDEN:          "You don't have permission to do this.",
          CONFLICT:           'This item already exists.',
          TOO_MANY_REQUESTS:  'Too many requests. Please wait a moment.',
          INTERNAL_ERROR:     'Something went wrong on our end. Please try again.',
        }
        sonnerToast.error(messages[error.code] ?? error.message, { duration: 8000 })
      },
    }

  Use toast.promise() for async operations:
    toast.promise(
      collectPoints(data),
      {
        loading: 'Collecting points...',
        success: `${member.name} earned ${data.amount} points!`,
        error:   'Failed to collect points',
      }
    )

PART B — Tier upgrade celebration modal (apps/tenant/components/points/TierUpgradeModal.tsx)
  Triggered from Prompt 09 when collectPoints returns tierUpgrade !== null.

  Visual design (full-screen overlay, centred card):
    Trophy icon with gold glow effect (CSS box-shadow or framer-motion glow animation)
    "🏆 Tier Upgrade!" heading
    Big bold: "{memberName} has reached {newTierName}!"
    Old tier badge → arrow → New tier badge (animated slide)
    Benefits list of the new tier (fetched from useTiers() cache)
    Confetti animation using canvas-confetti library:
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    "Awesome!" close button
    Auto-closes after 8 seconds

  Accessibility:
    role="dialog" aria-modal="true"
    Focus trapped inside
    aria-live="assertive" for screen reader announcement

PART C — Inline success feedback on point collection (Points page)
  After successful collect:
    Animated "+{amount} pts" badge flies up from the Collect button and fades out.
    Implementation: CSS animation, position: absolute, keyframes slide-up + fade-out.
    Duration: 1.5 seconds.
    Simultaneously: member card points number animates from old value to new value
      (use react-countup or a custom useCountAnimation hook for smooth number rollup).

PART D — Polling for provisioning status (Central — update Prompt 14)
  ProvisionTenantModal uses polling during the 8-step process.
  Implement useProvisioningStatus hook:

    function useProvisioningStatus(tenantUuid: string | null) {
      return useQuery({
        queryKey: ['provision-status', tenantUuid],
        queryFn: () => apiClient(`/tenants/${tenantUuid}/provision-status`),
        enabled: !!tenantUuid,
        refetchInterval: (data) => {
          // Stop polling when all steps are done or any step failed
          const allDone = data?.steps.every(s => s.status === 'done')
          const anyError = data?.steps.some(s => s.status === 'error')
          return (allDone || anyError) ? false : 1000
        },
      })
    }

PART E — Notification bell (future-ready placeholder)
  Add to topbar in both portals.
  Current: shows static bell icon with no badge count.
  Shows tooltip on hover: "Notifications coming soon"
  Structure is in place for when WebSocket/SSE is added later.
  Component: apps/tenant/components/layout/NotificationBell.tsx

Tests:
  - toast.apiError: FORBIDDEN → correct message
  - toast.promise: shows loading → success states
  - TierUpgradeModal: renders with new tier name and benefits
  - TierUpgradeModal: auto-closes after 8 seconds
  - TierUpgradeModal: confetti fires on mount
  - Points animation: "+{amount}" element has correct text
  - useProvisioningStatus: stops polling when all steps done
  - useProvisioningStatus: stops polling when any step errored
```

---

## PROMPT 27 — Dark mode support

```
Infrastructure.md reference: N/A (quality of life addition for staff who work evenings)

Task: Add dark mode to both portals. Many gym staff work evenings —
      dark mode reduces eye strain at the counter.

PART A — Theme configuration (Tailwind)
  In tailwind.config.ts for both apps:
    darkMode: 'class'   // controlled by class on <html> element

  Add CSS variables for both modes in globals.css:
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 47.4% 11.2%;
      --card: 0 0% 100%;
      --border: 214.3 31.8% 91.4%;
      --primary: 222.2 47.4% 11.2%;
      --muted: 210 40% 96%;
      --muted-foreground: 215.4 16.3% 46.9%;
      /* ... all shadcn/ui variables */
    }
    .dark {
      --background: 224 71% 4%;
      --foreground: 213 31% 91%;
      --card: 224 71% 4%;
      --border: 216 34% 17%;
      --primary: 210 40% 98%;
      --muted: 223 47% 11%;
      --muted-foreground: 215.4 16.3% 56.9%;
      /* ... */
    }

PART B — ThemeProvider (packages/ui/src/components/ThemeProvider.tsx)
  Uses next-themes library.
  Wrap root layout of both apps:
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>

  Stores preference in localStorage (ONLY for theme — this is acceptable).
  System preference respected by default (prefers-color-scheme media query).

PART C — Theme toggle button (packages/ui/src/components/ThemeToggle.tsx)
  Toggle between: Light | Dark | System
  Shows current mode icon: ☀️ | 🌙 | 💻
  Placed in:
    Tenant portal topbar: right side before user menu
    Central portal topbar: right side before user menu

PART D — Dark mode audit
  Review all custom colors added in Prompts 07–18 and ensure they use
  CSS variables (not hardcoded hex) so they automatically adapt.

  Specifically check:
  - Tier badge colors (Bronze/Silver/Gold): add dark mode variants that are
    slightly lighter for dark backgrounds
  - Chart colors (Recharts): pass colors from CSS variable values
    (read computed styles in a hook: useTailwindColor('primary'))
  - The points animation "+{amount}" badge: use CSS variables
  - The TierUpgradeModal: verify readability in dark mode

PART E — Dark mode screenshot tests (Storybook / visual regression optional)
  If Storybook is set up, add dark mode story variant for:
    - Sidebar
    - DataTable
    - TierCard
    - StatusBadge (all variants)
    - TierUpgradeModal

Tests:
  - ThemeToggle: clicking cycles through light/dark/system
  - ThemeProvider: applies 'dark' class to html element when dark selected
  - ThemeProvider: applies system preference on 'system' mode
  - Tier badge: Gold badge readable in dark mode (verify contrast ratio)
  - Theme preference persisted in localStorage (acceptable use of localStorage)
```

---

## PROMPT 28 — Member profile page (deep-link URL)

```
Infrastructure.md reference:
  Tenant DB: members (name, phone, email, points, tier_id)
  S3: tenant_{uuid}/avatars/

Task: Build /members/[id] as a standalone page (not just a drawer).
      Useful for deep linking and for admin who wants a full-screen member view.

PART A — apps/tenant/app/(dashboard)/members/[id]/page.tsx (Server Component)
  - Fetch member server-side: GET /api/tenant/members/{id}
  - If 404: return notFound() (Next.js 404 page)
  - If member belongs to different tenant: return notFound()
  - Pass data as initialData to MemberProfileClient

PART B — apps/tenant/app/(dashboard)/members/[id]/MemberProfileClient.tsx (Client)
  Layout (two columns, desktop):
    Left column (35%):
      Large avatar (128px) with upload capability (same as drawer)
      Member name (h1)
      Email (with mailto: link)
      Phone (with tel: link)
      Joined date
      Status badge (Active / Suspended)
      Edit Profile button → inline edit mode

    Right column (65%):
      Tabs: Points & Tier | Transaction History | QR Code

  Points & Tier tab:
    Large current points display: "2,400 pts" in a hero number
    Tier card: current tier name, colored background, benefits list
    Next tier progress bar (TierProgress component from Prompt 08)
    Action buttons:
      <PermissionGate permission="points:earn">
        <Button>Collect Points</Button>
      </PermissionGate>
      <PermissionGate permission="points:redeem">
        <Button>Redeem Points</Button>
      </PermissionGate>
      <PermissionGate permission="points:adjust">
        <Button variant="outline">Adjust Points</Button>
      </PermissionGate>

  Transaction History tab:
    Full paginated transaction table (not just recent 10 like in drawer)
    Columns: Date, Type badge, Amount (+/-), Reason, Balance after
    Filter by type
    Date range filter
    Export button: "Export History CSV"

  QR Code tab:
    Same as MemberDrawer QR tab (Prompt 08/24)

PART C — Breadcrumb
  Members → {member.name}
  Uses BreadcrumbContext from the layout.

PART D — Back navigation
  "← Back to Members" link at top.
  Preserves the members list's current page/filter/search state.
  Use next/navigation useRouter + searchParams to restore previous state.

Tests:
  - Page renders member name in h1
  - 404 returned for non-existent member ID
  - Points & Tier tab shows correct points and tier
  - Transaction History: full paginated list loads
  - Breadcrumb shows correct trail
  - Back link navigates to /members
```

---

## PROMPT 29 — Global search (tenant portal)

```
Infrastructure.md reference:
  Tenant DB: members (name, phone, email)

Task: Build a global search bar that searches across members, letting
      staff quickly find a member by name, email, or phone from anywhere.

PART A — GlobalSearch component (apps/tenant/components/layout/GlobalSearch.tsx)
  Located in Topbar (replaces placeholder area).
  Triggered by:
    - Click on search icon in topbar
    - Keyboard shortcut: Cmd+K / Ctrl+K (global listener)

  Search input modal (full-screen overlay on mobile, centered floating panel on desktop):
    Input: autofocus, placeholder "Search members by name, email, or phone..."
    Results appear below after 300ms debounce.

  Results section:
    Heading: "Members ({count})"
    Up to 8 results:
      Row: avatar + member name + email + tier badge + points
      Click: navigates to /members/{id}
      Keyboard navigation: ↑↓ arrows, Enter to select, Escape to close

    "No results" state:
      "No members found for '{query}'"
      Suggestion: "Add a new member" button (if permission allows)

    "View all results" at bottom → navigates to /members?search={query}

  API call: GET /api/tenant/members?search={query}&limit=8&page=1
  Uses React Query with staleTime: 0 (always fresh for search)

PART B — Keyboard shortcut registration
  In root layout (dashboard level):
    useEffect(() => {
      function handler(e: KeyboardEvent) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault()
          openGlobalSearch()
        }
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }, [])

PART C — Recent searches
  Store last 5 search terms in memory (not localStorage).
  When search input is empty and focused: show "Recent searches" with the terms.
  Clear button: "Clear recent" removes all from memory.

Tests:
  - Cmd+K opens search panel
  - Search result shows after 300ms debounce
  - Keyboard ↓↑ navigation highlights correct row
  - Enter on highlighted row navigates to correct member page
  - Escape closes the panel
  - "View all results" passes search query to members page URL
  - Empty state shown when no results
```

---

## PROMPT 30 — Dev tooling, environment setup, and local development guide

```
Infrastructure.md reference:
  Single Application Server — dev must mirror prod topology

Task: Set up the developer experience so the full multi-tenant stack
      runs correctly on a local machine.

PART A — Environment files
  apps/tenant/.env.local:
    NEXT_PUBLIC_API_URL=http://localhost:3000
    NEXT_PUBLIC_DEV_TENANT_SLUG=alpha          # gym slug for local dev
    NEXT_PUBLIC_APP_ENV=development

  apps/tenant/.env.example:
    NEXT_PUBLIC_API_URL=                       # NestJS URL
    NEXT_PUBLIC_DEV_TENANT_SLUG=               # Used in dev only (middleware reads this)
    NEXT_PUBLIC_APP_ENV=development

  apps/central/.env.local:
    NEXT_PUBLIC_API_URL=http://localhost:3000
    NEXT_PUBLIC_APP_ENV=development

  apps/central/.env.example:
    NEXT_PUBLIC_API_URL=
    NEXT_PUBLIC_APP_ENV=development

PART B — docker-compose.yml (root of monorepo)
  Runs only external services — not the Next.js or NestJS apps themselves
  (those run via pnpm dev):

    version: '3.8'
    services:
      postgres:
        image: postgres:15
        environment:
          POSTGRES_USER: gym_user
          POSTGRES_PASSWORD: gym_pass
          POSTGRES_DB: gym_saas_central
        ports:
          - '5432:5432'
        volumes:
          - postgres_data:/var/lib/postgresql/data

      redis:
        image: redis:7-alpine
        command: redis-server --databases 3
        ports:
          - '6379:6379'

    volumes:
      postgres_data:

PART C — Root package.json scripts
  "dev:tenant":    "turbo run dev --filter=@gym/tenant"
  "dev:central":   "turbo run dev --filter=@gym/central"
  "dev:all":       "turbo run dev"
  "build":         "turbo run build"
  "test":          "turbo run test"
  "test:e2e":      "playwright test"
  "lint":          "turbo run lint"
  "type-check":    "turbo run type-check"
  "db:up":         "docker compose up -d"
  "db:down":       "docker compose down"

PART D — turbo.json pipeline
  {
    "pipeline": {
      "build": { "dependsOn": ["^build"], "outputs": [".next/**"] },
      "dev":   { "cache": false, "persistent": true },
      "test":  { "dependsOn": ["^build"] },
      "lint":  {},
      "type-check": {}
    }
  }

PART E — DEVELOPMENT.md guide at repo root
  Write a clear setup guide:

  ## Quick Start
    1. Install: pnpm install
    2. Start DB + Redis: pnpm db:up
    3. Start NestJS: (instructions to start the backend)
    4. Run migrations: (NestJS migration commands)
    5. Start tenant portal: pnpm dev:tenant
       → Open http://localhost:3001 (Tenant portal for 'alpha' gym)
    6. Start central portal: pnpm dev:central
       → Open http://localhost:3002 (Central admin)

  ## Testing multi-tenant locally
    The tenant portal reads NEXT_PUBLIC_DEV_TENANT_SLUG=alpha in dev.
    To test a different tenant: change this value and restart.
    In production, the slug comes from the hostname automatically.

  ## Environment variables explained
    Table: variable name | required | description | example

  ## Common issues
    - "Tenant not found" → ensure alpha tenant exists in local DB
    - "CORS error" → check NEXT_PUBLIC_API_URL matches your NestJS port
    - "401 on refresh" → clear browser cookies and log in again

Tests:
  - docker-compose.yml: postgres and redis services defined
  - turbo.json: build pipeline defined with outputs
  - .env.example: all required variables documented
```

---

## PROMPT 31 — Deployment configuration: Next.js on the same VPS as NestJS

```
Infrastructure.md reference:
  Single Application Server (AWS EC2 / DigitalOcean VPS)
  Nginx (Reverse Proxy / SSL Termination)

Task: Configure the Next.js apps for production deployment on the same
      server as NestJS, behind the same Nginx instance.

PART A — next.config.ts for apps/tenant/
  import type { NextConfig } from 'next'

  const nextConfig: NextConfig = {
    output: 'standalone',  // minimal production bundle for VPS deployment

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.s3.amazonaws.com',  // S3 direct URLs
        },
        {
          protocol: 'https',
          hostname: '*.cloudfront.net',    // CloudFront CDN URLs
        },
      ],
    },

    // API rewrites: /api/tenant/* → NestJS localhost:3000
    async rewrites() {
      return [
        {
          source: '/api/tenant/:path*',
          destination: `${process.env.NESTJS_INTERNAL_URL}/api/tenant/:path*`,
        },
      ]
    },

    // Security headers
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ],
        },
      ]
    },
  }

  export default nextConfig

PART B — next.config.ts for apps/central/
  Same pattern but rewrites to /api/central/* instead.
  Add:
    // Bull Board proxy (served by NestJS, protected by IP)
    { source: '/admin/queues/:path*', destination: 'http://localhost:3000/admin/queues/:path*' }

PART C — Nginx configuration additions (update from NestJS Prompt 15)
  Add tenant and central Next.js upstreams to the Nginx config:

  upstream nextjs_tenant {
      server 127.0.0.1:3001;   # Tenant Next.js
  }

  upstream nextjs_central {
      server 127.0.0.1:3002;   # Central Next.js
  }

  server {
      listen 443 ssl;
      server_name *.gym-saas.app;

      # Next.js static assets
      location /_next/static/ {
          proxy_pass http://nextjs_tenant;
          proxy_cache_valid 200 1y;
          add_header Cache-Control "public, immutable";
      }

      # API calls go directly to NestJS (skip Next.js)
      location /api/ {
          proxy_pass http://127.0.0.1:3000;
          proxy_set_header Host $host;
      }

      # Everything else → Next.js
      location / {
          proxy_pass http://nextjs_tenant;
          proxy_set_header Host $host;
      }
  }

  server {
      listen 443 ssl;
      server_name central.gym-saas.app;

      location /api/ {
          proxy_pass http://127.0.0.1:3000;
      }
      location / {
          proxy_pass http://nextjs_central;
          proxy_set_header Host $host;
      }
  }

PART D — pm2 ecosystem additions (update from NestJS Prompt 08)
  Add Next.js processes to ecosystem.config.js:

    {
      name: 'tenant-nextjs',
      script: 'node_modules/.bin/next',
      args: 'start --port 3001',
      cwd: './apps/tenant',
      env_production: {
        NODE_ENV: 'production',
        NESTJS_INTERNAL_URL: 'http://localhost:3000',
      }
    },
    {
      name: 'central-nextjs',
      script: 'node_modules/.bin/next',
      args: 'start --port 3002',
      cwd: './apps/central',
      env_production: {
        NODE_ENV: 'production',
        NESTJS_INTERNAL_URL: 'http://localhost:3000',
      }
    },

PART E — DEPLOYMENT.md at repo root
  Covers:
    1. Build step: pnpm build (runs turbo build for all apps)
    2. Copy .env files to server
    3. Run: pm2 start ecosystem.config.js --env production
    4. Nginx reload: sudo nginx -s reload
    5. Verify health: curl https://central.gym-saas.app/api/central/health

  Zero-downtime deployment:
    pm2 reload ecosystem.config.js --env production
    (pm2 gracefully restarts each process, keeping old one alive until new is ready)

Tests:
  - next.config.ts: API rewrite proxies to NESTJS_INTERNAL_URL
  - next.config.ts: security headers present on all routes
  - output: 'standalone' is set (verifiable in next.config.ts)
  - S3 image domain whitelisted in remotePatterns
```

---

## PROMPT 32 — Final integration: wire everything together and fix gaps

```
Infrastructure.md reference: All sections

Task: Final pass — find and fix all gaps between existing code and the
      full infrastructure specification. This prompt identifies common
      issues in existing Next.js projects that need fixing.

PART A — Fix common existing code issues

1. Replace any existing direct fetch() calls with the typed apiClient:
   Search for: fetch('/api/
   Replace with: apiClient<T>('/...')
   This ensures: auth headers attached, envelope unwrapped, 401 handled.

2. Replace any role checks in JSX:
   Search for: {user?.role === or {user.role ===
   Replace with: <PermissionGate permission="..."> or usePermission()

3. Fix any cookies() usage in client components:
   cookies() is a server-only API. Move any client-side cookie reads to
   server components or server actions.

4. Fix any missing Suspense boundaries:
   Every async server component MUST be wrapped in <Suspense fallback={<PageSkeleton />}>
   Search for: async function Page and ensure each has a loading.tsx sibling.

5. Fix any next/image violations:
   Search for: <img src= and replace with <Image from 'next/image'
   Add width and height to every Image.
   Add loading="lazy" to below-fold images.

PART B — Add missing loading.tsx files
  Create loading.tsx for every (dashboard) route:
    apps/tenant/app/(dashboard)/dashboard/loading.tsx
    apps/tenant/app/(dashboard)/members/loading.tsx
    apps/tenant/app/(dashboard)/points/loading.tsx
    apps/tenant/app/(dashboard)/tiers/loading.tsx
    apps/tenant/app/(dashboard)/staff/loading.tsx
    apps/tenant/app/(dashboard)/reports/loading.tsx

    apps/central/app/(dashboard)/overview/loading.tsx
    apps/central/app/(dashboard)/tenants/loading.tsx
    (... all central routes)

  Each loading.tsx:
    export default function Loading() {
      return <PageSkeleton variant="dashboard" />
      // or the appropriate variant for that page
    }

PART C — Add missing error.tsx files
  Create error.tsx for every (dashboard) route:
    Same structure as loading.tsx but renders TenantErrorBoundary fallback.

    'use client'
    import { TenantErrorBoundary } from '@gym/ui'
    export default function Error({ error, reset }: { error: Error; reset: () => void }) {
      return <TenantErrorBoundary error={error} reset={reset} />
    }

PART D — Fix API base URL construction
  Verify that apps/tenant/lib/api/client.ts constructs the correct base URL:

  In development:
    Base URL = process.env.NEXT_PUBLIC_API_URL + '/api/tenant'
    (e.g. http://localhost:3000/api/tenant)

  In production:
    Base URL = '' + '/api/tenant'
    (relative URL — Next.js rewrite handles proxying to NestJS)
    This means: apiClient('/members') → /api/tenant/members → NestJS

  The client must NOT hardcode the full domain — that breaks the
  rewrite proxy pattern in production.

  Fix if necessary:
    const BASE_URL = process.env.NODE_ENV === 'production'
      ? '/api/tenant'
      : `${process.env.NEXT_PUBLIC_API_URL}/api/tenant`

PART E — Verify Zod schemas match NestJS DTOs exactly
  Go through each schema file (Prompt 22) and compare against the NestJS DTOs:

  member.schema.ts vs CreateMemberDto (NestJS):
    ✓ name: min(2), max(100)
    ✓ email: email()
    ✓ phone: optional, regex matches
    ✓ tierId: optional UUID

  points schemas vs CollectPointsDto:
    ✓ amount: int, min(1)
    ✓ reason: min(1)
    (memberId is NOT in the form — it's injected server-side from URL param)

  provisionTenantSchema vs CreateTenantDto:
    ✓ domain: regex matches NestJS regex ^[a-z0-9-]+\.gym-saas\.app$
    ✓ plan: same enum values as NestJS Plan enum

  Fix any mismatches. Frontend validation must be stricter or equal to backend.

PART F — Type safety sweep
  Run TypeScript compiler: pnpm type-check
  Fix ALL errors. Common issues to look for:
    - ApiResponse<T> generic used without type argument
    - Member | null not handled before accessing .name
    - React Query data is T | undefined before data loads (use optional chaining)
    - Event handlers typed as (e: any) instead of correct event type
    - Children typed as any instead of React.ReactNode

PART G — Final code quality
  Run ESLint: pnpm lint
  Common rules to enforce:
    - no-unused-vars: 'error'
    - react-hooks/exhaustive-deps: 'error'
    - @next/next/no-img-element: 'error'
    - jsx-a11y/alt-text: 'error'
    - jsx-a11y/click-events-have-key-events: 'warn'

  Fix ALL errors before merging.

Tests:
  - TypeScript compiler passes with zero errors
  - ESLint passes with zero errors
  - All loading.tsx files render the correct skeleton variant
  - All error.tsx files render TenantErrorBoundary
  - apiClient: uses relative URL in production (no hardcoded domain)
  - apiClient: uses NEXT_PUBLIC_API_URL in development
  - Every page route has a sibling loading.tsx and error.tsx
```

---

## EXTENDED VERIFICATION CHECKLIST (Prompts 21–32)

Add these to the checklist from Prompt 20 before sign-off.

### Shared component library (Prompt 21)

- [ ] Button: loading prop disables click and shows spinner
- [ ] All inputs: error prop renders red border + error text
- [ ] DataTable: generic typed, renders skeleton when isLoading=true
- [ ] Modal: focus trapped, closes on Escape
- [ ] ConfirmDialog: onConfirm only fires after user clicks
- [ ] Avatar: initials rendered from name when no image
- [ ] TierBadge, RoleBadge, StatusBadge: correct colors for all variants

### Form system (Prompt 22)

- [ ] FormField: error linked via aria-describedby
- [ ] useFormSubmit: API field errors mapped to correct form fields
- [ ] All Zod schemas match NestJS DTOs exactly
- [ ] DynamicFieldList: add/remove/reorder works correctly
- [ ] No form has tenantId as a field

### Mobile responsiveness (Prompt 23)

- [ ] Bottom nav visible on mobile, hidden on desktop
- [ ] Points page: stacked on mobile, side-by-side on desktop
- [ ] Members: card list on mobile, table on desktop
- [ ] All tap targets ≥ 44×44px
- [ ] All form inputs: font-size ≥ 16px (no iOS zoom)

### QR code workflow (Prompt 24)

- [ ] QR code displayed from S3 signed URL
- [ ] Download triggers browser file download
- [ ] Regenerate button restricted by permission
- [ ] Bulk QR export available in member table bulk actions

### S3 media (Prompt 25)

- [ ] Avatar upload: direct to S3 presigned URL (not through backend)
- [ ] Upload progress bar shown during upload
- [ ] S3Image: falls back to initials on error
- [ ] All S3 media uses signed URLs (no raw S3 URLs exposed)

### Notifications (Prompt 26)

- [ ] toast.promise() used for all async operations
- [ ] TierUpgradeModal: fires confetti, shows new tier benefits
- [ ] TierUpgradeModal: accessible (role=dialog, focus trapped)
- [ ] Points animation: "+{n} pts" badge fires on successful collect
- [ ] useProvisioningStatus: polling stops when all steps done or errored

### Dark mode (Prompt 27)

- [ ] ThemeToggle in both portals' topbars
- [ ] System preference respected by default
- [ ] Dark mode theme stored in localStorage (only acceptable localStorage use)
- [ ] All custom colors use CSS variables (none hardcoded)

### Member profile page (Prompt 28)

- [ ] /members/[id] renders full profile
- [ ] 404 returned for non-existent ID
- [ ] Breadcrumb shows Members → {name}
- [ ] Back navigation preserves list state

### Global search (Prompt 29)

- [ ] Cmd+K / Ctrl+K opens search panel
- [ ] Results appear after 300ms debounce
- [ ] Keyboard navigation (↑↓ + Enter) works
- [ ] "View all results" passes query to members page

### Dev tooling (Prompt 30)

- [ ] pnpm dev:tenant starts tenant portal locally
- [ ] pnpm dev:central starts central portal locally
- [ ] docker-compose.yml starts postgres and redis
- [ ] DEVELOPMENT.md explains multi-tenant local setup

### Deployment (Prompt 31)

- [ ] output: 'standalone' set in both next.config.ts files
- [ ] API rewrites configured in next.config.ts
- [ ] S3 remote patterns whitelisted for next/image
- [ ] pm2 ecosystem.config.js includes both Next.js processes
- [ ] Nginx config proxies both portals correctly
- [ ] Security headers set on all routes

### Final integration (Prompt 32)

- [ ] Zero direct fetch() calls — all use apiClient
- [ ] Zero inline role checks in JSX — all use PermissionGate
- [ ] Every (dashboard) route has loading.tsx and error.tsx
- [ ] TypeScript compiles with zero errors
- [ ] ESLint passes with zero errors
- [ ] apiClient uses relative URL in production
- [ ] All Zod schemas validated against NestJS DTOs
