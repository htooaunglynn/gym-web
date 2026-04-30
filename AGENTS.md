# AGENT.md — Gym Management System

> **Stack:** NestJS · Prisma · PostgreSQL · Next.js · React Native · Multi-tenant (database-per-gym)
> **Roles:** `SUPER_ADMIN` · `GYM_ADMIN` · `MEMBER`
> **Domain pattern:** `{gym-slug}.app.com` (admin web) · `api.{gym-slug}.com` (member API) · `admin.app.com` (super admin)

---

## 1. Project structure

```
/
├── apps/
│   ├── web/                    # Next.js — gym admin portal (web only)
│   ├── mobile/                 # React Native — member app (iOS + Android)
│   └── super-admin/            # Next.js — super admin portal (internal)
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/
│   │   │   ├── guards/         # JwtAuthGuard, RolesGuard, TenantGuard
│   │   │   ├── decorators/     # @Roles(), @CurrentTenant(), @CurrentUser()
│   │   │   ├── interceptors/   # TenantInterceptor
│   │   │   └── middleware/     # TenantResolverMiddleware
│   │   ├── modules/
│   │   │   ├── super-admin/    # Cross-tenant access — SUPER_ADMIN only
│   │   │   ├── auth/           # JWT issuance, refresh, role guards
│   │   │   ├── tenant/         # Provisioning, config, DB creation
│   │   │   ├── members/        # Profiles, memberships
│   │   │   ├── classes/        # Schedule, bookings
│   │   │   ├── billing/        # Plans, payments, invoices
│   │   │   ├── staff/          # Trainers, attendance
│   │   │   ├── reports/        # Analytics, exports
│   │   │   ├── notifications/  # Email, push, SMS
│   │   │   └── maintenance/    # Migrations, health — SUPER_ADMIN only
│   │   └── prisma/
│   │       ├── prisma.service.ts        # Root connection (registry DB)
│   │       └── tenant-prisma.service.ts # Dynamic per-tenant connection
├── prisma/
│   ├── registry/
│   │   └── schema.prisma       # Central registry schema
│   └── tenant/
│       └── schema.prisma       # Per-tenant schema (applied to every gym DB)
├── .env
├── .env.example
├── AGENT.md                    # ← this file
├── RULES.md
└── docker-compose.yml
```

---

## 2. Tenant resolution flow

```
Request hits NestJS
  │
  ├─ Host: admin.app.com          → role=SUPER_ADMIN, tenantId=null (all DBs)
  ├─ Host: {slug}.app.com         → role=GYM_ADMIN,   tenantId={slug}
  └─ Host: api.{slug}.com         → role=MEMBER,       tenantId={slug}
            │
            ▼
  TenantResolverMiddleware
    reads subdomain → queries central registry DB → resolves DATABASE_URL
            │
            ▼
  TenantPrismaService.forTenant(tenantId)
    returns cached PrismaClient for that gym's PostgreSQL DB
```

---

## 3. Environment variables

```env
# Central registry (shared)
REGISTRY_DATABASE_URL="postgresql://user:pass@host:5432/gym_registry"

# JWT
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# Object storage (S3-compatible)
STORAGE_BUCKET="gym-media"
STORAGE_ENDPOINT="https://s3.amazonaws.com"
STORAGE_ACCESS_KEY=""
STORAGE_SECRET_KEY=""

# Email / Push
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
FCM_SERVER_KEY=""
```

---

## 4. Key services

### TenantPrismaService

Manages a `Map<tenantId, PrismaClient>`. On first request for a tenant, fetches the `DATABASE_URL` from the registry, creates a new `PrismaClient`, and caches it. Super admin bypasses this and holds a direct reference to the registry client.

### TenantResolverMiddleware

Runs before every route. Parses `req.hostname`, extracts the gym slug, attaches `req.tenantId` and `req.role`. Applied globally in `AppModule`.

### RolesGuard

Reads `@Roles(Role.GYM_ADMIN)` decorator on controllers/handlers. Compares against JWT payload `role` claim. Throws `ForbiddenException` on mismatch.

### MaintenanceModule

Exposes endpoints to: run Prisma migrations across all tenant DBs, check DB health, rotate connection strings. Restricted to `SUPER_ADMIN` only via `@Roles(Role.SUPER_ADMIN)`.

---

## 5. Database schemas

### Registry schema (`prisma/registry/schema.prisma`)

```prisma
model Tenant {
  id          String   @id @default(cuid())
  slug        String   @unique       // "alpha", "beta"
  name        String
  databaseUrl String                 // per-gym PostgreSQL URL
  plan        String   @default("starter")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Tenant schema (`prisma/tenant/schema.prisma`)

Applied to every gym DB via `prisma migrate deploy --schema prisma/tenant/schema.prisma`.

Core models: `Member`, `Staff`, `MembershipPlan`, `Subscription`, `ClassSchedule`, `Booking`, `Payment`, `Notification`.

---

## 6. API conventions

- **Base URL:** `https://api.{gym-slug}.com/v1` (members) · `https://{gym-slug}.app.com/api/v1` (admin)
- **Auth header:** `Authorization: Bearer <jwt>`
- **Tenant header (optional override):** `x-tenant-id: alpha`
- **Response envelope:**
  ```json
  { "data": {}, "meta": {}, "error": null }
  ```
- **Pagination:** `?page=1&limit=20` → `meta.total`, `meta.page`, `meta.lastPage`
- **Errors:** RFC 7807 Problem Details format

---

## 7. Agent capabilities by role

| Capability                  | SUPER_ADMIN | GYM_ADMIN | MEMBER   |
| --------------------------- | ----------- | --------- | -------- |
| View all tenant DBs         | ✅          | ❌        | ❌       |
| Provision / deprovision gym | ✅          | ❌        | ❌       |
| Run migrations              | ✅          | ❌        | ❌       |
| System health dashboard     | ✅          | ❌        | ❌       |
| Manage members              | ✅ (any)    | ✅ (own)  | ❌       |
| Manage staff                | ✅ (any)    | ✅ (own)  | ❌       |
| Manage class schedule       | ✅ (any)    | ✅ (own)  | ❌       |
| View & manage billing       | ✅ (any)    | ✅ (own)  | ✅ (own) |
| Book classes                | ❌          | ❌        | ✅       |
| View own profile            | ❌          | ✅        | ✅       |
| Audit logs                  | ✅          | ❌        | ❌       |

---

## 8. Coding conventions

- **NestJS modules:** one module per domain feature. No cross-module direct imports — communicate via shared services or events.
- **DTOs:** always validate with `class-validator`. Use `@IsUUID()`, `@IsEmail()`, `@IsEnum()` strictly.
- **Prisma:** never call `prisma.$queryRaw` unless absolutely necessary. Use typed models.
- **Errors:** throw NestJS `HttpException` subclasses — never `throw new Error()` in controllers.
- **Logging:** use NestJS `Logger` with context name. Never `console.log` in production code.
- **Tests:** unit tests next to the file (`*.spec.ts`). Integration tests in `test/`.
