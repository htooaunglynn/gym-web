# Multi-Tenant Gym Platform - Infrastructure Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET / USERS                                │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │   Domain Resolution     │
                    │  (Route53 / Cloudflare) │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        │                        │                        │
┌───────▼────────┐    ┌──────────▼─────────┐   ┌────────▼────────┐
│ central.app    │    │ tenant1.app        │   │ tenant2.app     │
│ (Admin Panel)  │    │ (Hospital A)       │   │ (Hospital B)    │
└───────┬────────┘    └──────────┬─────────┘   └────────┬────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                                 │ HTTPS (SSL/TLS)
                                 │
┌────────────────────────────────▼────────────────────────────────────────────┐
│                         SINGLE APPLICATION SERVER                            │
│                         (AWS EC2 / DigitalOcean VPS)                        │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                         NGINX WEB SERVER                            │    │
│  │                    (Reverse Proxy / SSL Termination)                │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                            │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                     js-FPM (NestJS Application)                    │   │
│  │                                                                      │   │
│  │  ┌────────────────────┐              ┌────────────────────┐        │   │
│  │  │  Central Routes    │              │   Tenant Routes    │        │   │
│  │  │  (routes/web.js)  │              │ (routes/tenant.js)│        │   │
│  │  │                    │              │                    │        │   │
│  │  │ - Tenant CRUD      │              │ - Point Collection │        │   │
│  │  │ - Billing          │              │ - Customer Mgmt    │        │   │
│  │  │ - Monitoring       │              │ - Reports/Analytics│        │   │
│  │  │ - User Management  │              │ - API Endpoints    │        │   │
│  │  └────────┬───────────┘              └─────────┬──────────┘        │   │
│  │           │                                     │                   │   │
│  │           └─────────────────┬───────────────────┘                   │   │
│  │                             │                                       │   │
│  │  ┌──────────────────────────▼──────────────────────────┐           │   │
│  │  │         Tenancy Middleware Layer                    │           │   │
│  │  │  (stancl/tenancy - Tenant Identification)          │           │   │
│  │  │                                                     │           │   │
│  │  │  • InitializeTenancyByDomain                       │           │   │
│  │  │  • CheckTenantStatus (suspended/active)            │           │   │
│  │  │  • PreventAccessFromCentralDomains                 │           │   │
│  │  └──────────────────────────┬──────────────────────────┘           │   │
│  │                             │                                       │   │
│  │  ┌──────────────────────────▼──────────────────────────┐           │   │
│  │  │            Database Connection Manager              │           │   │
│  │  │    (Dynamic connection switching per tenant)        │           │   │
│  │  └──────────────────────────┬──────────────────────────┘           │   │
│  └─────────────────────────────┼───────────────────────────────────────┘   │
│                                │                                            │
│  ┌─────────────────────────────▼────────────────────────────────────┐     │
│  │                   NestJS HORIZON                                 │     │
│  │              (Queue Management Dashboard)                         │     │
│  │                                                                   │     │
│  │  • Monitors queue workers                                        │     │
│  │  • Failed job tracking                                           │     │
│  │  • Job metrics and throughput                                    │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                 SUPERVISOR (Process Manager)                       │    │
│  │                                                                    │    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │    │
│  │  │ Queue Workers    │  │ Queue Workers    │  │  Scheduler      │ │    │
│  │  │ (Central Queue)  │  │ (Tenant Queue)   │  │  (Cron Jobs)    │ │    │
│  │  │ • 2 processes    │  │ • 5 processes    │  │                 │ │    │
│  │  │ • Tenant creation│  │ • Email jobs     │  │ • Daily backups │ │    │
│  │  │ • Billing tasks  │  │ • Notifications  │  │ • Reports       │ │    │
│  │  └──────────────────┘  └──────────────────┘  └─────────────────┘ │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
          ┌─────────▼────┐  ┌────▼─────┐  ┌──▼──────────────┐
          │              │  │          │  │                 │
          │   REDIS      │  │  PostgreSQL   │  │   AWS S3        │
          │   SERVER     │  │  SERVER  │  │   (Storage)     │
          │              │  │          │  │                 │
          └──────────────┘  └──────────┘  └─────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            REDIS SERVER                                      │
│                         (Single Instance)                                    │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐               │
│  │   Database 0   │  │   Database 1   │  │   Database 2   │               │
│  │   (Cache)      │  │   (Sessions)   │  │   (Queues)     │               │
│  │                │  │                │  │                │               │
│  │ • Tenant cache │  │ • User sessions│  │ • Central queue│               │
│  │   with prefixes│  │   by tenant    │  │ • Tenant queue │               │
│  │   tenant_{id}_ │  │                │  │ • Failed jobs  │               │
│  └────────────────┘  └────────────────┘  └────────────────┘               │
│                                                                              │
│  Configuration:                                                              │
│  • maxmemory: 2GB                                                           │
│  • maxmemory-policy: allkeys-lru                                            │
│  • Persistence: AOF + RDB snapshots                                         │
└──────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                          PostgreSQL DATABASE SERVER                               │
│                      (Single Server, Multiple Databases)                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Central Database                                 │  │
│  │                    (Gym_saas_central)                             │  │
│  │                                                                       │  │
│  │  Tables:                                                              │  │
│  │  • tenants (id, data, timestamps, soft_deletes) -- stancl/tenancy JSON convention │  │
│  │  • domains (tenant_id, domain)                                       │  │
│  │  • central_users (superadmin accounts)                               │  │
│  │  • subscription_plans                                                 │  │
│  │  • billing_records                                                    │  │
│  │  • audit_logs                                                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Tenant Database: Hospital A                        │  │
│  │                  (Gym_saas_tenant_uuid_1)                         │  │
│  │                                                                       │  │
│  │  Tables:                                                              │  │
│  │  • customers (name, phone, email, points, tier_id)                   │  │
│  │  • tiers (name, min_points, benefits)                                │  │
│  │  • point_transactions (customer_id, amount, type, reason)            │  │
│  │  • users (admin, manager, staff roles)                               │  │
│  │  • roles, permissions (Spatie)                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Tenant Database: Hospital B                        │  │
│  │                  (Gym_saas_tenant_uuid_2)                         │  │
│  │                                                                       │  │
│  │  Tables:                                                              │  │
│  │  • customers                                                          │  │
│  │  • tiers                                                              │  │
│  │  • point_transactions                                                 │  │
│  │  • users                                                              │  │
│  │  • ... (same schema as Hospital A)                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Tenant Database: Hospital C                        │  │
│  │                  (Gym_saas_tenant_uuid_3)                         │  │
│  │                                                                       │  │
│  │  ... repeats for each tenant (target: 10 tenants/year)               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Configuration:                                                              │
│  • max_connections: 200                                                     │
│  • Connection pooling via ProxySQL (future enhancement)                     │
│  • Automated daily backups per database                                     │
│  • Binary logging enabled for point-in-time recovery                        │
└──────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                          AWS S3 STORAGE                                      │
│                    (File & Asset Storage)                                    │
│                                                                              │
│  Bucket Structure:                                                           │
│                                                                              │
│  Gym-saas-production/                                                   │
│  │                                                                           │
│  ├── central/                                                               │
│  │   ├── logos/              (tenant logos)                                │
│  │   └── documents/          (contracts, invoices)                         │
│  │                                                                           │
│  ├── tenant_{uuid_1}/                                                       │
│  │   ├── qr-codes/           (customer QR codes)                           │
│  │   ├── receipts/           (transaction receipts)                        │
│  │   ├── avatars/            (customer profile photos)                     │
│  │   └── exports/            (CSV/Excel reports)                           │
│  │                                                                           │
│  ├── tenant_{uuid_2}/                                                       │
│  │   ├── qr-codes/                                                          │
│  │   ├── receipts/                                                          │
│  │   └── ...                                                                │
│  │                                                                           │
│  └── backups/                                                               │
│      ├── central/            (daily central DB dumps)                       │
│      └── tenants/            (daily per-tenant DB dumps)                    │
│                                                                              │
│  Configuration:                                                              │
│  • Encryption: AES-256 at rest                                              │
│  • Access: IAM roles for NestJS app                                        │
│  • CDN: CloudFront for QR code delivery (optional)                          │
│  • Lifecycle: Auto-delete old backups after 90 days                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Request Flow Diagrams

### Central Admin Request Flow

```
User Browser → central.Gym-saas.app
     │
     ▼
  NGINX (SSL termination)
     │
     ▼
  NestJS Router (routes/web.js)
     │
     ▼
  Central Middleware
  • Authentication
  • CSRF protection
     │
     ▼
  Central Controller
  • TenantController::create()
  • BillingController::index()
     │
     ▼
  Central Database Connection
  (Gym_saas_central)
     │
     ▼
  Response → User Browser
```

### Tenant API Request Flow (Point Collection)

```
Mobile App → tenant1.Gym-saas.app/api/points/collect
     │
     ▼
  NGINX (SSL termination)
     │
     ▼
  NestJS Router (routes/tenant.js)
     │
     ▼
  Tenancy Middleware Stack:
  • InitializeTenancyByDomain (identifies tenant1)
  • CheckTenantStatus (verify active)
  • Sanctum Authentication
     │
     ├─── Tenant Context Set ───┐
     │                           │
     ▼                           ▼
  Tenant Controller        Redis Cache Check
  PointsController         (tenant_uuid_1_customer_*)
     │                           │
     ▼                           ▼
  RewardService            If miss → query DB
     │
     ▼
  Database Transaction:
  1. Calculate points
  2. Update customer.points
  3. Check tier upgrade
  4. Create point_transaction
  5. Dispatch notification job
     │
     ▼
  Tenant Database Connection
  (Gym_saas_tenant_uuid_1)
     │
     ▼
  Redis Queue (database 2)
  • Job: SendPointsCollectedNotification
     │
     ▼
  Response → Mobile App
     │
     └─── Queue Worker processes job asynchronously
```

### Tenant Creation Flow

```
Central Admin → Create Tenant Form
     │
     ▼
  TenantController::store()
     │
     ├─── 1. Create tenant record ────▼
     │    Central DB: INSERT into tenants
     │
     ├─── 2. Create domain record ────▼
     │    Central DB: INSERT into domains
     │
     ├─── 3. Generate DB credentials ─▼
     │    tenant_key: UUID
     │
     ├─── 4. Create tenant database ──▼
     │    PostgreSQL: CREATE DATABASE Gym_saas_tenant_{uuid}
     │
     ├─── 5. Run tenant migrations ───▼
     │    js artisan tenants:migrate --tenants={uuid}
     │
     ├─── 6. Seed default data ───────▼
     │    Tenant DB: INSERT default tiers, admin user
     │
     ├─── 7. Create S3 folders ───────▼
     │    AWS S3: Create tenant_{uuid}/ structure
     │
     └─── 8. Dispatch welcome job ────▼
          Queue: SendTenantWelcomeEmail
```

## Data Isolation Strategy

### Database Isolation

- **Method**: Separate PostgreSQL databases per tenant
- **Naming**: `Gym_saas_tenant_{uuid}`
- **Migration**: Independent schema per tenant
- **Backup**: Individual backups per tenant database
- **Security**: No cross-tenant queries possible

### Cache Isolation

- **Method**: Tenant-prefixed cache keys
- **Pattern**: `tenant_{uuid}_{key}`
- **Example**: `tenant_abc123_customer_456`
- **Benefit**: Single Redis instance, logical separation

### Storage Isolation

- **Method**: Tenant-based S3 folder structure
- **Pattern**: `tenant_{uuid}/{resource_type}`
- **Access**: IAM policies enforce path restrictions
- **CDN**: CloudFront paths include tenant identifier

### Queue Isolation

- **Method**: Tenant context serialized in job
- **Pattern**: `stancl/tenancy` auto-injects tenant_id
- **Processing**: Worker re-initializes tenant context
- **Benefit**: Shared queue, isolated execution

## Scaling Considerations

### Current Single-Server Limits

- **Tenants**: 10-20 comfortably
- **Transactions**: 10,000 - 20,000 daily total
- **Database Connections**: 200 max (PostgreSQL)
- **Redis Memory**: 2GB allocated

### First Scaling Path (When needed)

1. **Database Server Separation**
   - Move PostgreSQL to dedicated server
   - Implement ProxySQL for connection pooling
2. **Redis Scaling**
   - Separate Redis instances for cache/queue
   - Or Redis Cluster for high availability

3. **Horizontal Scaling**
   - Add second application server
   - Implement load balancer (Nginx/HAProxy)
   - Sticky sessions for tenant routing

### Future Architecture (Beyond 50 tenants)

- Database read replicas per tenant
- Multi-region deployment
- CDN for all static assets
- Dedicated queue servers
- Elasticsearch for tenant search

## Security Layers

### Network Security

- SSL/TLS encryption (Let's Encrypt)
- Firewall rules (UFW/Security Groups)
- Database access restricted to app server IP

### Application Security

- Tenant isolation via middleware
- CSRF protection
- XSS prevention
- SQL injection protection (Eloquent ORM)
- Rate limiting per tenant

### Data Security

- S3 encryption at rest (AES-256)
- Database encryption for sensitive fields
- Secure credential storage (NestJS encryption)
- Audit logging for point adjustments

### Access Control

- Role-based permissions (Spatie)
- API token authentication (Sanctum)
- Session management per tenant
- Failed login throttling

## Monitoring & Health Checks

### Application Monitoring

- NestJS Horizon dashboard (queue health)
- Custom health check endpoint
- Failed job alerts
- Slow query logging

### Infrastructure Monitoring

- Server resource utilization (CPU, RAM, Disk)
- PostgreSQL connection pool status
- Redis memory usage
- S3 request metrics

### Business Metrics

- Tenant creation rate
- Transaction volume per tenant
- API response times
- Queue processing delays

## Backup Strategy

### Database Backups

- **Frequency**: Daily at 2 AM
- **Retention**: 30 days rolling
- **Method**: PostgreSQLdump per tenant + central
- **Storage**: Encrypted in S3 backups/ folder

### File Backups

- **Method**: S3 versioning enabled
- **Retention**: 90 days lifecycle policy

### Recovery Testing

- Monthly restoration test
- Documented recovery procedures
- RTO target: 4 hours
- RPO target: 24 hours
