/**
 * @gym/types — compile-time type import verification
 *
 * This file has NO runtime assertions. It verifies that all exported types
 * can be imported and used in TypeScript strict mode without errors.
 * `tsc --noEmit` will catch any issues during CI.
 */

import type {
  // Roles
  Role,
  // Auth
  JwtPayload,
  // API envelope
  ApiResponse,
  ApiError,
  ApiMeta,
  ApiResult,
  // Central entities
  Tenant,
  SubscriptionPlan,
  BillingRecord,
  BillingStatus,
  AuditLog,
  CentralUser,
  // Tenant entities
  Member,
  Tier,
  PointTransaction,
  PointTransactionType,
  GymUser,
  GymRole,
  GymPermission,
  // Pagination
  PaginationMeta,
  PaginationResponse,
} from "../src/index";

// ── Role ──────────────────────────────────────────────────────────────────────

const _role: Role = "superadmin";
const _roles: Role[] = ["superadmin", "admin", "manager", "staff"];

// ── JwtPayload ────────────────────────────────────────────────────────────────

const _payload: JwtPayload = {
  sub: "user-uuid",
  email: "admin@central.gym-saas.app",
  role: "superadmin",
  tenantId: null,
  permissions: ["tenant:read", "tenant:write"],
  iat: 0,
  exp: 9999999999,
};

// ── API envelope ──────────────────────────────────────────────────────────────

const _meta: ApiMeta = { total: 100, page: 1, lastPage: 5 };

const _success: ApiResponse<Tenant> = {
  data: {
    id: "t1",
    name: "Gym Alpha",
    slug: "alpha",
    plan: "pro",
    isActive: true,
    domain: "alpha.gym-saas.app",
    createdAt: "2024-01-01",
    deletedAt: null,
  },
  meta: _meta,
  error: null,
};

const _error: ApiError = {
  data: null,
  meta: {},
  error: { code: "NOT_FOUND", message: "Tenant not found", details: { id: ["must be a valid UUID"] } },
};

// Type narrowing works correctly
const _result: ApiResult<Tenant> = _success;
if (_result.error === null) {
  const tenant: Tenant = _result.data;
  console.assert(tenant.isActive);
}

// ── Tenant entities ──────────────────────────────────────────────────────────

const _tenant: Tenant = {
  id: "t1",
  name: "Gym Alpha",
  slug: "alpha",
  plan: "starter",
  isActive: true,
  domain: "alpha.gym-saas.app",
  createdAt: "2024-01-01T00:00:00Z",
  deletedAt: null,
};

const _plan: SubscriptionPlan = {
  id: "p1",
  name: "Starter",
  priceMonthly: 29,
  features: ["5 staff", "unlimited members"],
  isActive: true,
};

const _billingStatus: BillingStatus = "PAID";
const _billing: BillingRecord = {
  id: "b1",
  tenantId: "t1",
  planId: "p1",
  amount: 29,
  status: _billingStatus,
  paidAt: "2024-01-15T00:00:00Z",
};

const _log: AuditLog = {
  id: "l1",
  tenantId: null,
  actorId: "u1",
  actorRole: "superadmin",
  action: "tenant.created",
  resourceType: "Tenant",
  resourceId: "t1",
  diff: { name: ["old", "new"] },
  createdAt: "2024-01-01T00:00:00Z",
};

const _centralUser: CentralUser = {
  id: "u1",
  name: "Super Admin",
  email: "admin@central.gym-saas.app",
  role: "superadmin",
  createdAt: "2024-01-01T00:00:00Z",
};

// ── Tenant-side entities ─────────────────────────────────────────────────────

const _tier: Tier = { id: "tier-1", name: "Gold", minPoints: 500, benefits: ["free class"] };

const _member: Member = {
  id: "m1",
  name: "Alice",
  phone: "+1234567890",
  email: "alice@example.com",
  points: 120,
  tierId: "tier-1",
  tier: _tier,
  createdAt: "2024-01-01T00:00:00Z",
  deletedAt: null,
};

const _txType: PointTransactionType = "EARN";
const _tx: PointTransaction = {
  id: "tx1",
  memberId: "m1",
  amount: 50,
  type: _txType,
  reason: "Class attendance",
  createdAt: "2024-01-01T00:00:00Z",
};

const _perm: GymPermission = { id: "perm-1", name: "members:read" };
const _gymRole: GymRole = { id: "role-1", name: "Manager", permissions: [_perm] };
const _gymUser: GymUser = {
  id: "u2",
  name: "Bob",
  email: "bob@gym.com",
  roleId: "role-1",
  role: _gymRole,
  createdAt: "2024-01-01T00:00:00Z",
};

// ── Pagination ────────────────────────────────────────────────────────────────

const _paginationMeta: PaginationMeta = {
  totalItems: 100,
  page: 2,
  limit: 20,
  totalPages: 5,
};

const _paginatedMembers: PaginationResponse<Member> = {
  data: [_member],
  meta: _paginationMeta,
};

// Suppress unused variable warnings (TypeScript-only verification file)
void _role;
void _roles;
void _payload;
void _success;
void _error;
void _result;
void _tenant;
void _plan;
void _billing;
void _log;
void _centralUser;
void _member;
void _tx;
void _gymUser;
void _paginatedMembers;
