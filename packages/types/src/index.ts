// =============================================================================
// @gym/types — Shared TypeScript types for the Gym SaaS platform
// Used by both apps/central and apps/tenant
// =============================================================================

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

/** Platform-level roles */
export type Role = "superadmin" | "admin" | "manager" | "staff";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/** JWT payload decoded on the client — never trust without backend validation */
export interface JwtPayload {
  /** Subject (user ID) */
  sub: string;
  email: string;
  role: Role;
  /** null for superadmin; gym slug for tenant users */
  tenantId: string | null;
  permissions: string[];
  iat: number;
  exp: number;
}

// ---------------------------------------------------------------------------
// API envelope — every backend response matches one of these two shapes
// ---------------------------------------------------------------------------

export interface ApiMeta {
  total?: number;
  page?: number;
  lastPage?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
  error: null;
}

export interface ApiError {
  data: null;
  meta: ApiMeta;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/** Union of both shapes, useful for generic fetch handlers */
export type ApiResult<T> = ApiResponse<T> | ApiError;

// ---------------------------------------------------------------------------
// Central entities (managed by superadmin at central.gym-saas.app)
// ---------------------------------------------------------------------------

export interface Tenant {
  id: string;
  name: string;
  /** slug used in subdomain: {slug}.gym-saas.app */
  slug: string;
  plan: string;
  isActive: boolean;
  domain: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  features: string[];
  isActive: boolean;
}

export type BillingStatus = "PAID" | "FAILED" | "PENDING" | "REFUNDED";

export interface BillingRecord {
  id: string;
  tenantId: string;
  planId: string;
  amount: number;
  status: BillingStatus;
  paidAt: string | null;
}

export interface AuditLog {
  id: string;
  tenantId: string | null;
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  diff: object | null;
  createdAt: string;
}

export interface CentralUser {
  id: string;
  name: string;
  email: string;
  role: Extract<Role, "superadmin">;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Tenant entities (managed by admin/manager/staff at {slug}.gym-saas.app)
// ---------------------------------------------------------------------------

export interface Tier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
}

export interface Member {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  points: number;
  tierId: string | null;
  /** Populated when fetched with ?include=tier */
  tier: Tier | null;
  createdAt: string;
  deletedAt: string | null;
}

export type PointTransactionType = "EARN" | "REDEEM" | "ADJUST" | "EXPIRE";

export interface PointTransaction {
  id: string;
  memberId: string;
  /** Positive for EARN, negative for REDEEM/EXPIRE, any sign for ADJUST */
  amount: number;
  type: PointTransactionType;
  reason: string;
  createdAt: string;
}

export interface GymPermission {
  id: string;
  name: string;
}

export interface GymRole {
  id: string;
  name: string;
  permissions: GymPermission[];
}

export interface GymUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  /** Populated when fetched with ?include=role */
  role: GymRole;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Pagination helpers — mirror ApiMeta but explicit for list hooks
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
