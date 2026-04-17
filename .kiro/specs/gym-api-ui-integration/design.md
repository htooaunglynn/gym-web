# Design Document: Gym API & UI Integration

## Overview

This document describes the technical design for completing the Gym Management System admin dashboard — a Next.js 16 frontend that integrates with a NestJS backend API at `http://localhost:3000/api/v1`.

The application skeleton already exists: authentication flow, sidebar navigation, `apiClient`, `DataTable`, `StatusBadge`, `PermissionGuard`, `Toast`, and page stubs for all modules. This design covers what must be built on top of that foundation to reach production-ready behaviour across all 14 modules (Users, Members, Trainers, Equipment, Inventory, Plans, Subscriptions, Products, Sales, Branches, Permissions, Dashboard, Auth, and the shared UI system).

### Key Design Goals

1. **Centralise all API calls through `apiClient.ts`** — no raw `fetch` calls in page components.
2. **Enforce permissions at every layer** — sidebar visibility, button visibility, and page-level guards all driven by the permission matrix from `GET /auth/me`.
3. **Consistent UX patterns** — every CRUD module follows the same fetch → DataTable → Modal → confirm-dialog → toast → refresh cycle.
4. **Design system compliance** — Pinterest-inspired warm palette, 16px button radius, 20px+ card radius, plum-black text, Pinterest Red CTAs.
5. **Testability** — pure logic (pagination math, query-string building, permission checks, form validation) is extracted into functions that can be property-tested with `fast-check`.

---

## Architecture

### High-Level Component Tree

```
app/layout.tsx
└── AuthProvider (AuthContext)
    └── ToastProvider (ToastContext)
        ├── app/login/page.tsx
        │   └── LoginForm
        └── app/dashboard/layout.tsx
            └── DashboardGuard (useAuthGuard)
                ├── Sidebar
                ├── TopHeader
                └── <page>
                    └── PermissionGuard (feature, action)
                        └── <PageContent>
                            ├── DataTable
                            ├── PaginationControls
                            ├── Modal (create/edit)
                            └── ConfirmDialog (delete)
```

### Data Flow

```
User Action
    │
    ▼
Page Component (useState: data, page, isLoading, modalOpen, selectedRow)
    │
    ├── fetchData() ──► apiClient<PaginationResponse<T>>(path, { params })
    │                       │
    │                       ├── Attaches Bearer token
    │                       ├── Builds query string
    │                       ├── Handles 401 → redirect /login
    │                       ├── Handles 403 → error toast
    │                       ├── Handles 400/409 → error toast
    │                       └── Returns typed T
    │
    ├── DataTable (columns, data, isLoading, actions)
    ├── PaginationControls (page, totalPages, onPageChange)
    ├── Modal (isOpen, onClose, onSuccess, row?)
    │       └── form submit → apiClient POST/PATCH → onSuccess() → fetchData()
    └── ConfirmDialog (open, onConfirm)
            └── onConfirm → apiClient DELETE → fetchData()
```

### Module Boundaries

| Layer                           | Responsibility                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/lib/apiClient.ts`          | HTTP, auth headers, error handling, toast dispatch                                             |
| `src/contexts/AuthContext.tsx`  | JWT decode, user state, permission matrix, login/logout                                        |
| `src/contexts/ToastContext.tsx` | Toast queue, auto-dismiss                                                                      |
| `src/hooks/usePermission.ts`    | Permission lookup from AuthContext                                                             |
| `src/hooks/useAuthGuard.ts`     | Redirect-to-login guard                                                                        |
| `src/components/shared/`        | DataTable, PaginationControls, StatusBadge, ConfirmDialog, Toast, PermissionGuard, SkeletonRow |
| `src/components/crud/`          | Add/Edit modals for each entity                                                                |
| `src/app/dashboard/*/page.tsx`  | Page-level state, fetch orchestration, column definitions                                      |

---

## Components and Interfaces

### apiClient (enhanced)

The existing `apiClient.ts` already handles token attachment, error toasts, and 401 redirect. The following gaps must be closed:

```typescript
// Current signature — already correct
export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T>;

// ApiClientOptions already supports params
export interface ApiClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}
```

**Required changes:**

- `null` values in `params` must also be omitted (currently only `undefined` is omitted — add `value !== null` check).
- All page components must migrate from raw `fetch` to `apiClient`.

### PaginationResponse type

Add a shared type to `src/lib/apiClient.ts` (or a new `src/types/api.ts`):

```typescript
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
```

### Page-level state shape (all CRUD modules)

Every CRUD page follows this state pattern:

```typescript
const [rows, setRows] = useState<T[]>([]);
const [meta, setMeta] = useState<PaginationMeta>({
  totalItems: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
});
const [page, setPage] = useState(1);
const [isLoading, setIsLoading] = useState(true);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedRow, setSelectedRow] = useState<T | undefined>(undefined);
const [confirmDelete, setConfirmDelete] = useState<T | undefined>(undefined);
```

### Modal interface (standardised)

All create/edit modals share this prop interface:

```typescript
interface CrudModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  row?: T; // undefined = create mode, defined = edit mode
}
```

### New pages to create

The following routes exist as stubs or are missing entirely and must be implemented:

| Route                      | Status                                  | Module        |
| -------------------------- | --------------------------------------- | ------------- |
| `/dashboard/users`         | Partial (no edit/delete, no pagination) | Users         |
| `/dashboard/members`       | Partial (no edit/delete, no pagination) | Members       |
| `/dashboard/trainers`      | Partial (no edit/delete, no pagination) | Trainers      |
| `/dashboard/equipment`     | Partial (no edit/delete, no pagination) | Equipment     |
| `/dashboard/inventory`     | Partial (no edit/delete, no pagination) | Inventory     |
| `/dashboard/plans`         | Partial (no pagination)                 | Plans         |
| `/dashboard/products`      | Partial (no pagination)                 | Products      |
| `/dashboard/sales`         | Partial (no pagination)                 | Sales         |
| `/dashboard/subscriptions` | **Missing**                             | Subscriptions |
| `/dashboard/branches`      | **Missing**                             | Branches      |
| `/dashboard/permissions`   | **Missing**                             | Permissions   |

### New components to create

| Component           | Path                                             | Purpose                                         |
| ------------------- | ------------------------------------------------ | ----------------------------------------------- |
| `SubscriptionModal` | `src/components/crud/SubscriptionModal.tsx`      | Create/edit member subscriptions                |
| `BranchModal`       | `src/components/crud/BranchModal.tsx`            | Create/edit branches                            |
| `AssignUserModal`   | `src/components/crud/AssignUserModal.tsx`        | Assign user to branch                           |
| `PermissionsMatrix` | `src/components/dashboard/PermissionsMatrix.tsx` | Role × Feature × Action checkbox grid           |
| `TrainerSelect`     | `src/components/forms/TrainerSelect.tsx`         | Searchable trainer dropdown (like MemberSelect) |
| `PlanSelect`        | `src/components/forms/PlanSelect.tsx`            | Searchable plan dropdown                        |
| `BranchSwitcher`    | `src/components/dashboard/BranchSwitcher.tsx`    | ADMIN-only branch dropdown in TopHeader         |
| `SkeletonCard`      | `src/components/shared/SkeletonCard.tsx`         | Dashboard KPI card skeleton                     |

### DataTable enhancements

The existing `DataTable` component needs two additions:

```typescript
interface DataTableProps<T> {
  // ... existing props ...
  sortable?: boolean;
  onSort?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onSearch?: (query: string) => void;
  emptyState?: React.ReactNode; // custom empty state
}
```

The `SkeletonRow` component already exists at `src/components/shared/SkeletonRow.tsx` and should be rendered when `isLoading` is true.

---

## Data Models

### API Response Types

```typescript
// Auth
interface LoginResponse {
  accessToken: string;
}

interface MeResponse {
  id: string;
  email: string;
  globalRole: GlobalRole;
  permissions: RolePermission[];
}

// Users
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "BRANCH_ADMIN" | "STAFF" | "HR" | "MANAGER";
  createdAt: string;
}

// Members
interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  trainerId: string | null;
  createdAt: string;
}

// Trainers
interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

// Equipment
interface Equipment {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  condition: "NEW" | "GOOD" | "FAIR" | "POOR";
  createdAt: string;
}

// Inventory Movement
interface InventoryMovement {
  id: string;
  equipmentId: string;
  movementType: "INCOMING" | "OUTGOING" | "ADJUSTMENT";
  quantity: number;
  reason: string;
  note?: string;
  occurredAt: string;
  createdAt: string;
}

// Membership Plan
interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  billingCycle: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  isActive: boolean;
  createdAt: string;
}

// Member Subscription
interface MemberSubscription {
  id: string;
  memberId: string;
  membershipPlanId: string;
  status: "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  startDate: string;
  endDate: string;
  member?: Pick<Member, "firstName" | "lastName">;
  membershipPlan?: Pick<MembershipPlan, "name">;
  createdAt: string;
}

// Product
interface Product {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  unitPrice: number;
  quantity: number; // stockQuantity
  isActive: boolean;
  createdAt: string;
}

// Product Sale
interface ProductSale {
  id: string;
  memberId: string | null;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER" | "ONLINE";
  occurredAt: string;
  member?: Pick<Member, "firstName" | "lastName">;
  items: SaleItem[];
}

interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Pick<Product, "name">;
}

// Branch
interface Branch {
  id: string;
  name: string;
  description?: string;
  users?: BranchUser[];
  createdAt: string;
}

interface BranchUser {
  userId: string;
  role: string;
  user?: Pick<User, "firstName" | "lastName" | "email">;
}

// Permissions
interface RolePermissionMatrix {
  role: GlobalRole;
  permissions: RolePermission[];
}
```

### Form Payload Types

Each modal sends a subset of the entity type. Key payloads:

```typescript
// POST /users
interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "ADMIN" | "BRANCH_ADMIN" | "STAFF" | "HR" | "MANAGER";
}

// POST /member-subscriptions
interface CreateSubscriptionPayload {
  memberId: string;
  membershipPlanId: string;
  startDate: string;
  paymentStatus: "PENDING" | "PAID";
}

// POST /branches/:id/users
interface AssignBranchUserPayload {
  userId: string;
  role: string;
}

// PUT /permissions/roles/:role
interface UpsertPermissionsPayload {
  permissions: RolePermission[];
}
```

### Pagination query parameters (standard across all list endpoints)

```typescript
interface ListParams {
  page: number;
  limit: number;
  includeDeleted?: boolean;
  // module-specific filters added per page
}
```

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

This feature involves a mix of UI rendering, API integration, and pure logic. PBT is applicable to the pure logic layers: JWT decoding, permission checks, query-string building, pagination math, form validation, and data extraction from API responses. UI rendering and infrastructure wiring use example-based tests.

The project already has `fast-check` installed as a dev dependency.

### Property 1: JWT decode round-trip

_For any_ valid JWT payload containing `sub`, `email`, `globalRole`, and `branchId`, encoding it as a JWT and calling `login()` on the AuthContext SHALL result in the context exposing exactly those field values.

**Validates: Requirements 1.6**

### Property 2: Sidebar renders exactly the permitted nav items

_For any_ subset of `PermissionFeature` values granted with `VIEW` action, the Sidebar SHALL render navigation links for exactly those features (plus the always-visible Dashboard link) and no others.

**Validates: Requirements 2.1**

### Property 3: Permission-gated buttons are hidden when permission is absent

_For any_ CRUD page component and any permission set that excludes `CREATE_UPDATE` for that page's feature, the "Add" and "Edit" buttons SHALL not be present in the rendered DOM.

**Validates: Requirements 2.3**

### Property 4: Permission-gated delete action is hidden when permission is absent

_For any_ CRUD page component and any permission set that excludes `DELETE` for that page's feature, the "Delete" action SHALL not be present in the rendered row action menu.

**Validates: Requirements 2.4**

### Property 5: Low-stock badge appears iff any product has quantity ≤ 5

_For any_ list of products, the Dashboard low-stock alert badge SHALL be visible if and only if at least one product has `stockQuantity ≤ 5`.

**Validates: Requirements 3.4, 11.3**

### Property 6: apiClient omits undefined and null query params

_For any_ `params` object, the URL constructed by `apiClient` SHALL contain only the keys whose values are neither `undefined` nor `null`, and each included key SHALL appear exactly once with its string-coerced value.

**Validates: Requirements 16.2**

### Property 7: apiClient attaches Bearer token when token is present

_For any_ API path and any non-empty token string stored in `localStorage`, every request made by `apiClient` SHALL include an `Authorization` header with value `Bearer {token}`.

**Validates: Requirements 16.1**

### Property 8: 400 array message is joined with "; "

_For any_ non-empty array of error message strings returned in a 400 response body, the toast displayed by `apiClient` SHALL contain all messages joined by `"; "` in the same order.

**Validates: Requirements 16.3**

### Property 9: PaginationResponse data and meta are correctly extracted

_For any_ `PaginationResponse<T>` object, the page component's extraction logic SHALL set the DataTable rows to `response.data` and the PaginationControls `totalPages` to `response.meta.totalPages`.

**Validates: Requirements 16.8**

### Property 10: PaginationControls prev button disabled on first page

_For any_ `totalPages ≥ 1`, when `currentPage = 1`, the previous button SHALL be disabled (aria-disabled=true and not clickable).

**Validates: Requirements 15.4**

### Property 11: PaginationControls next button disabled on last page

_For any_ `totalPages ≥ 1`, when `currentPage = totalPages`, the next button SHALL be disabled.

**Validates: Requirements 15.4**

### Property 12: Search debounce — callback fires at most once per 300ms burst

_For any_ sequence of keystrokes all occurring within a 300ms window, the `onSearch` callback SHALL be invoked at most once after the burst ends.

**Validates: Requirements 15.2**

### Property 13: Inventory quantity validation rejects values less than 1

_For any_ integer value less than 1 entered in the inventory movement quantity field, form submission SHALL be prevented and a validation error SHALL be displayed.

**Validates: Requirements 8.6**

### Property 14: Sale quantity validation rejects values less than 1

_For any_ integer value less than 1 entered in the sale quantity field, form submission SHALL be prevented and a validation error SHALL be displayed.

**Validates: Requirements 12.6**

---

## Error Handling

### API Error Hierarchy

| HTTP Status               | Handler     | User-visible outcome                                              |
| ------------------------- | ----------- | ----------------------------------------------------------------- |
| 400 (array message)       | `apiClient` | Error toast: messages joined with `"; "`                          |
| 400 (string message)      | `apiClient` | Error toast: message string                                       |
| 401                       | `apiClient` | Clear token → redirect `/login`                                   |
| 403                       | `apiClient` | Error toast: message from body                                    |
| 404                       | `apiClient` | Error toast: "Resource not found"                                 |
| 409                       | `apiClient` | Error toast: conflict message                                     |
| 5xx                       | `apiClient` | Error toast: "An unexpected server error occurred."               |
| Network error (TypeError) | `apiClient` | Error toast: "Unable to reach the server. Check your connection." |

### Page-level error handling

- **Partial dashboard failure**: Each KPI card / chart section is fetched independently. If one fails, the others still render. The failed section shows an error toast (not a blank card).
- **Modal submission failure**: The modal stays open. The error is displayed inline within the modal (not just a toast) so the user can correct the form.
- **Delete failure**: The ConfirmDialog closes, the DataTable is not refreshed, and an error toast is shown.
- **Optimistic update failure (Permissions page)**: The checkbox state is reverted to its pre-toggle value and an error toast is shown.

### Form validation (client-side, before API call)

| Field                      | Rule                       |
| -------------------------- | -------------------------- |
| Quantity (inventory, sale) | Integer ≥ 1                |
| Price / Amount             | Float ≥ 0                  |
| Email                      | RFC pattern, max 254 chars |
| Required text fields       | Non-empty after trim       |
| Password (create user)     | Min 8 characters           |

Validation runs on submit. Inline error messages appear below the relevant field. The submit button is disabled while a request is in flight.

### 401 handling in existing page components

Several existing pages (members, trainers, equipment, users) currently handle 401 by calling `window.location.href = "/login"` directly. These must be migrated to use `apiClient`, which centralises this redirect.

---

## Testing Strategy

### Dual Testing Approach

Unit tests cover specific examples, edge cases, and integration points. Property-based tests (using `fast-check`) cover universal properties across all inputs. Both run via `vitest --run`.

### Unit Tests (example-based)

**Authentication flow** (`src/components/auth/LoginForm.test.tsx` — extend existing):

- Valid credentials → token stored, redirect to `/dashboard`
- 401 response → inline password error, no redirect
- Network error → general error banner

**AuthContext** (`src/contexts/AuthContext.test.ts` — extend existing):

- `login()` with valid token → user state populated
- `logout()` → localStorage cleared, redirect
- Mount with expired token → no user state

**PermissionGuard** (`src/components/shared/PermissionGuard.test.tsx`):

- Has permission → children rendered
- No permission, no fallback → redirect + toast
- No permission, with fallback → fallback rendered

**ConfirmDialog** (`src/components/shared/ConfirmDialog.test.tsx`):

- Escape key → `onCancel` called
- Backdrop click → `onCancel` called
- Confirm button → `onConfirm` called
- Focus trapped inside dialog

**DataTable** (`src/components/crud/DataTable.test.tsx`):

- `isLoading=true` → SkeletonRow rendered
- `data=[]` → empty state rendered
- `onSearch` prop → search input rendered
- `sortable` prop → sortable headers rendered

**PaginationControls** (extend existing tests):

- `page=1` → prev disabled
- `page=totalPages` → next disabled
- Click next → `onPageChange(page+1)` called

**apiClient** (`src/lib/apiClient.test.ts` — extend existing):

- 401 response → localStorage cleared
- 403 response → error toast, no redirect
- 409 response → error toast
- Network TypeError → connection error toast

### Property-Based Tests (fast-check)

Each property test runs a minimum of 100 iterations. Tests are tagged with a comment referencing the design property.

**`src/lib/apiClient.pbt.test.ts`**:

```typescript
// Feature: gym-api-ui-integration, Property 6: apiClient omits undefined/null params
// Feature: gym-api-ui-integration, Property 7: apiClient attaches Bearer token
// Feature: gym-api-ui-integration, Property 8: 400 array message joined with "; "
```

**`src/contexts/AuthContext.pbt.test.ts`**:

```typescript
// Feature: gym-api-ui-integration, Property 1: JWT decode round-trip
```

**`src/components/dashboard/Sidebar.pbt.test.tsx`**:

```typescript
// Feature: gym-api-ui-integration, Property 2: Sidebar renders exactly permitted nav items
```

**`src/components/shared/PermissionGuard.pbt.test.tsx`**:

```typescript
// Feature: gym-api-ui-integration, Property 3: Permission-gated add/edit buttons hidden
// Feature: gym-api-ui-integration, Property 4: Permission-gated delete action hidden
```

**`src/components/dashboard/DashboardPage.pbt.test.tsx`**:

```typescript
// Feature: gym-api-ui-integration, Property 5: Low-stock badge iff any product qty ≤ 5
```

**`src/lib/pagination.pbt.test.ts`** (pure helper extracted from page components):

```typescript
// Feature: gym-api-ui-integration, Property 9: PaginationResponse data/meta extraction
// Feature: gym-api-ui-integration, Property 10: PaginationControls prev disabled on page 1
// Feature: gym-api-ui-integration, Property 11: PaginationControls next disabled on last page
```

**`src/components/shared/DataTable.pbt.test.tsx`**:

```typescript
// Feature: gym-api-ui-integration, Property 12: Search debounce fires at most once per burst
```

**`src/components/crud/InventoryModal.pbt.test.tsx`**:

```typescript
// Feature: gym-api-ui-integration, Property 13: Inventory quantity < 1 rejected
```

**`src/components/dashboard/SaleModal.pbt.test.tsx`**:

```typescript
// Feature: gym-api-ui-integration, Property 14: Sale quantity < 1 rejected
```

### Integration Tests (example-based, MSW or real API)

- Full login → dashboard → CRUD flow for one module (e.g. Members)
- 401 mid-session → redirect to login
- Permission matrix save → optimistic update → revert on failure

### Test Configuration

```typescript
// vitest.config.mts — already configured with jsdom + @testing-library/jest-dom
// fast-check runs 100 iterations by default; increase with fc.configureGlobal({ numRuns: 200 })
```

### What is NOT property-tested

- Visual design compliance (border-radius, colours) — visual regression / Storybook snapshots
- Sidebar active route indicator — example-based test
- Toast auto-dismiss timing — example-based test with fake timers
- Permissions matrix UI rendering — example-based test
- Branch switcher dropdown — example-based test
