# Next.js UI/UX — Gym Management System
# Infrastructure-Aligned Agent Prompt Set
# Source: infrastructure.md + NestJS backend (NESTJS_INFRASTRUCTURE_PROMPTS.md)

> **Purpose:** Build and fix the Next.js frontend to match the NestJS gym management
>              backend exactly. Two separate Next.js apps — Central Admin Portal
>              (central.gym-saas.app) and Gym Tenant Portal ({slug}.gym-saas.app).
>
> **Run order:** Execute prompts 01 → 20 in strict sequence.
> **Assumption:** Next.js 14+ (App Router) project exists with partial setup.
>                 Tailwind CSS, shadcn/ui configured. Some pages may already exist
>                 but lack tenant awareness, correct API wiring, or domain routing.

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
```
