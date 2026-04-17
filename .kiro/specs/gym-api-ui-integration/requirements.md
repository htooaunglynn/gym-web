# Requirements Document

## Introduction

This document defines the requirements for the Gym Management System admin dashboard — a Next.js web application that integrates with the existing NestJS backend API (`http://localhost:3000/api/v1`). The dashboard is used exclusively by gym staff and administrators to manage members, trainers, equipment, inventory, membership plans, subscriptions, products, sales, branches, and role-based permissions.

The application already has a working skeleton (authentication, sidebar navigation, `apiClient`, `DataTable`, `StatusBadge`, `PermissionGuard`, `Toast`, and several page stubs). These requirements define the complete, production-ready behaviour that must be implemented across all modules, building on top of the existing foundation.

The visual design follows the Pinterest-inspired warm design system documented in `DESIGN.md`: warm neutrals, Pinterest Red (`#e60023`) as the primary CTA accent, plum-black text (`#211922`), generous border-radius (16px buttons/inputs, 20px+ cards), and Pin Sans typography.

---

## Glossary

- **Dashboard**: The main overview page at `/dashboard` showing KPI cards, charts, and quick actions.
- **API_Client**: The centralised HTTP client in `src/lib/apiClient.ts` that attaches Bearer tokens, handles errors, and dispatches toasts.
- **Auth_Context**: The React context in `src/contexts/AuthContext.tsx` that stores the authenticated user, active branch, and permission matrix.
- **Permission_Guard**: The `PermissionGuard` component that gates page content behind a feature + action check.
- **DataTable**: The reusable `src/components/crud/DataTable.tsx` component used for all list views.
- **Toast**: The toast notification system in `src/contexts/ToastContext.tsx` and `src/components/shared/Toast.tsx`.
- **Status_Badge**: The `StatusBadge` component that renders colour-coded status pills.
- **Sidebar**: The fixed left navigation component at `src/components/dashboard/Sidebar.tsx`.
- **Top_Header**: The top bar component at `src/components/dashboard/TopHeader.tsx`.
- **Modal**: A full-screen overlay dialog used for create/edit forms.
- **Skeleton**: A loading placeholder that mimics the shape of content while data is being fetched.
- **Branch**: A physical gym location managed via `/api/v1/branches`.
- **User**: A web-platform staff account (role: ADMIN, BRANCH_ADMIN, STAFF, HR, MANAGER) managed via `/api/v1/users`.
- **Member**: A gym member (mobile platform) managed via `/api/v1/members`.
- **Trainer**: A gym trainer (mobile platform) managed via `/api/v1/trainers`.
- **Equipment**: A piece of gym equipment managed via `/api/v1/equipment`.
- **Inventory_Movement**: A stock movement record managed via `/api/v1/inventory-movements`.
- **Membership_Plan**: A subscription plan template managed via `/api/v1/membership-plans`.
- **Member_Subscription**: An active subscription linking a Member to a Membership_Plan, managed via `/api/v1/member-subscriptions`.
- **Product**: A retail product sold at the gym managed via `/api/v1/products`.
- **Product_Sale**: A sale transaction managed via `/api/v1/product-sales`.
- **Permission_Feature**: One of the feature keys defined in `AuthContext` (e.g. `MEMBERS`, `TRAINERS`, `EQUIPMENT`, etc.).
- **Permission_Action**: One of `VIEW`, `CREATE_UPDATE`, `DELETE`, `MANAGE`, `APPROVE`.
- **Global_Role**: One of `ADMIN`, `BRANCH_ADMIN`, `STAFF`, `HR`, `MANAGER`.
- **Pagination_Response**: The standard API response shape `{ data: T[], meta: { totalItems, page, limit, totalPages } }`.
- **Active_Branch**: The branch currently selected in the Top_Header branch switcher, stored in Auth_Context.

---

## Requirements

### Requirement 1: Authentication and Session Management

**User Story:** As a gym staff member, I want to log in with my email and password so that I can access the admin dashboard securely.

#### Acceptance Criteria

1. WHEN a user submits valid credentials via the login form, THE Auth_Context SHALL store the JWT access token in `localStorage` under the key `accessToken` and redirect the user to `/dashboard`.
2. WHEN a user submits invalid credentials, THE Login_Form SHALL display the error message returned by the API without clearing the password field.
3. WHEN the stored JWT token is expired or absent, THE Dashboard_Guard SHALL redirect the user to `/login` before rendering any dashboard content.
4. WHEN the API_Client receives a 401 response, THE API_Client SHALL remove the `accessToken` from `localStorage` and redirect the browser to `/login`.
5. WHEN a user clicks the logout button in the Sidebar, THE Auth_Context SHALL clear the `accessToken` from `localStorage`, reset the permission matrix to an empty array, and redirect to `/login`.
6. WHILE a user is authenticated, THE Auth_Context SHALL expose the decoded JWT fields (`sub`, `email`, `globalRole`, `branchId`) to all child components.
7. WHEN the application mounts and a valid token exists in `localStorage`, THE Auth_Context SHALL restore the session and fetch the permission matrix from `GET /auth/me` without requiring the user to log in again.

---

### Requirement 2: Role-Based Permission Enforcement

**User Story:** As a gym administrator, I want the UI to show only the features each staff member is permitted to use so that access is controlled without manual intervention.

#### Acceptance Criteria

1. WHEN the Auth_Context loads permissions from `GET /auth/me`, THE Sidebar SHALL render only the navigation items for which the current user holds a `VIEW` permission on the corresponding Permission_Feature.
2. WHEN a user navigates directly to a protected page URL without the required `VIEW` permission, THE Permission_Guard SHALL redirect the user to `/dashboard` and display a "You do not have permission to view this page" error toast.
3. WHEN a user lacks `CREATE_UPDATE` permission for a feature, THE Dashboard SHALL hide the "Add" / "Edit" action buttons for that feature's page.
4. WHEN a user lacks `DELETE` permission for a feature, THE Dashboard SHALL hide the "Delete" / "Remove" action in the row action menu for that feature's page.
5. WHEN the API returns a 403 response, THE API_Client SHALL display the error message from the response body as an error toast without redirecting.
6. THE Permission_Guard SHALL accept a `fallback` prop; WHEN provided, THE Permission_Guard SHALL render the fallback node instead of redirecting.

---

### Requirement 3: Dashboard Overview Page

**User Story:** As a gym admin, I want a dashboard overview page that shows key metrics at a glance so that I can monitor gym health without navigating to individual modules.

#### Acceptance Criteria

1. WHEN the Dashboard page mounts, THE Dashboard SHALL fetch total counts for members, trainers, equipment, and active subscriptions in parallel using the API_Client.
2. WHEN data is loading, THE Dashboard SHALL render Skeleton placeholders in place of KPI cards and charts.
3. WHEN all data has loaded, THE Dashboard SHALL display KPI cards for: total active members, total trainers, total equipment items, and count of active Member_Subscriptions.
4. WHEN the low-stock threshold is met (any Product with `stockQuantity` ≤ 5), THE Dashboard SHALL display a low-stock alert badge on the KPI card area.
5. THE Dashboard SHALL render an attendance trend chart using data from `GET /attendance` grouped by day for the last 30 days.
6. THE Dashboard SHALL render a sales trend chart using data from `GET /product-sales` grouped by day for the last 30 days.
7. THE Dashboard SHALL render a "Recent Activity" table showing the 5 most recent Inventory_Movements.
8. THE Dashboard SHALL render a "Quick Actions" widget with shortcut buttons to create a new Member, new Member_Subscription, and new Product_Sale.
9. IF any individual data fetch fails, THEN THE Dashboard SHALL display the successfully loaded sections and show an error toast for the failed section, without blocking the entire page.
10. WHERE the current user's Global_Role is `ADMIN`, THE Top_Header SHALL render a branch switcher dropdown populated from `GET /branches/mine`.

---

### Requirement 4: Users Module

**User Story:** As an administrator, I want to manage web-platform staff accounts so that I can control who has access to the admin dashboard.

#### Acceptance Criteria

1. WHEN a user with `USERS` `VIEW` permission navigates to `/dashboard/users`, THE Users_Page SHALL fetch and display all users from `GET /users?page=1&limit=20&includeDeleted=false` in the DataTable.
2. THE DataTable on the Users_Page SHALL display columns: ID (truncated), full name with avatar, email, phone, role badge, and created date.
3. WHEN a user with `USERS` `CREATE_UPDATE` permission clicks "Add User", THE Users_Page SHALL open a Modal with a form containing fields: first name, last name, email, phone, password, and role (select: ADMIN, BRANCH_ADMIN, STAFF, HR, MANAGER).
4. WHEN the Add User form is submitted with valid data, THE Users_Page SHALL call `POST /users`, close the Modal, show a success toast, and refresh the DataTable.
5. IF the `POST /users` call returns a 409 conflict, THEN THE API_Client SHALL display the conflict message as an error toast and keep the Modal open.
6. WHEN a user with `USERS` `CREATE_UPDATE` permission clicks "Edit" on a row, THE Users_Page SHALL open a pre-populated Modal and call `PATCH /users/:id` on submission.
7. WHEN a user with `USERS` `DELETE` permission clicks "Delete" on a row, THE Users_Page SHALL show a confirmation dialog; WHEN confirmed, THE Users_Page SHALL call `DELETE /users/:id`, show a success toast, and refresh the DataTable.
8. THE Users_Page SHALL support server-side pagination using `page` and `limit` query parameters, rendering PaginationControls below the DataTable.
9. IF the `GET /users` call returns a 401, THEN THE API_Client SHALL redirect to `/login`.

---

### Requirement 5: Members Module

**User Story:** As a gym staff member, I want to manage gym members so that I can track their information, trainer assignments, and subscription status.

#### Acceptance Criteria

1. WHEN a user with `MEMBERS` `VIEW` permission navigates to `/dashboard/members`, THE Members_Page SHALL fetch and display members from `GET /members?page=1&limit=20&includeDeleted=false` in the DataTable.
2. THE DataTable on the Members_Page SHALL display columns: ID, full name with avatar, email, phone, trainer assignment status, and created date.
3. WHEN a user with `MEMBERS` `CREATE_UPDATE` permission clicks "Add Member", THE Members_Page SHALL open a Modal with fields: first name, last name, email, phone, and password.
4. WHEN the Add Member form is submitted, THE Members_Page SHALL call `POST /members`, close the Modal, show a success toast, and refresh the DataTable.
5. WHEN a user with `MEMBERS` `CREATE_UPDATE` permission clicks "Edit" on a row, THE Members_Page SHALL open a pre-populated Modal and call `PATCH /members/:id` on submission.
6. WHEN a user with `MEMBERS` `DELETE` permission clicks "Remove" on a row, THE Members_Page SHALL show a confirmation dialog; WHEN confirmed, THE Members_Page SHALL call `DELETE /members/:id` and refresh the DataTable.
7. THE Members_Page SHALL support server-side pagination using PaginationControls.
8. WHEN a user with `MEMBERS` `CREATE_UPDATE` permission clicks "Assign Trainer" on a row, THE Members_Page SHALL open a trainer-select Modal that calls `PATCH /members/:id` with the selected `trainerId`.

---

### Requirement 6: Trainers Module

**User Story:** As a gym admin, I want to manage trainer profiles so that I can track their contact details and member assignments.

#### Acceptance Criteria

1. WHEN a user with `TRAINERS` `VIEW` permission navigates to `/dashboard/trainers`, THE Trainers_Page SHALL fetch and display trainers from `GET /trainers?page=1&limit=20&includeDeleted=false&includeMembers=false` in the DataTable.
2. THE DataTable on the Trainers_Page SHALL display columns: ID, full name with avatar, email, phone, and created date.
3. WHEN a user with `TRAINERS` `CREATE_UPDATE` permission clicks "Add Trainer", THE Trainers_Page SHALL open a Modal with fields: first name, last name, email, phone, and password.
4. WHEN the Add Trainer form is submitted, THE Trainers_Page SHALL call `POST /trainers`, close the Modal, show a success toast, and refresh the DataTable.
5. WHEN a user with `TRAINERS` `CREATE_UPDATE` permission clicks "Edit" on a row, THE Trainers_Page SHALL open a pre-populated Modal and call `PATCH /trainers/:id` on submission.
6. WHEN a user with `TRAINERS` `DELETE` permission clicks "Remove" on a row, THE Trainers_Page SHALL show a confirmation dialog; WHEN confirmed, THE Trainers_Page SHALL call `DELETE /trainers/:id` and refresh the DataTable.
7. THE Trainers_Page SHALL support server-side pagination using PaginationControls.

---

### Requirement 7: Equipment Module

**User Story:** As a gym admin, I want to manage gym equipment so that I can track condition, quantity, and maintenance needs.

#### Acceptance Criteria

1. WHEN a user with `EQUIPMENT` `VIEW` permission navigates to `/dashboard/equipment`, THE Equipment_Page SHALL fetch and display equipment from `GET /equipment?page=1&limit=20&includeDeleted=false` in the DataTable.
2. THE DataTable on the Equipment_Page SHALL display columns: ID, name, category, quantity, condition (Status_Badge), and created date.
3. THE Status_Badge on the Equipment_Page SHALL render equipment condition values (`NEW`, `GOOD`, `FAIR`, `POOR`) using the `equipment` variant with the colour mapping defined in `StatusBadge.tsx`.
4. WHEN a user with `EQUIPMENT` `CREATE_UPDATE` permission clicks "Add Equipment", THE Equipment_Page SHALL open a Modal with fields: name, category, quantity (number), and condition (select: NEW, GOOD, FAIR, POOR).
5. WHEN the Add Equipment form is submitted, THE Equipment_Page SHALL call `POST /equipment`, close the Modal, show a success toast, and refresh the DataTable.
6. WHEN a user with `EQUIPMENT` `CREATE_UPDATE` permission clicks "Edit" on a row, THE Equipment_Page SHALL open a pre-populated Modal and call `PATCH /equipment/:id` on submission.
7. WHEN a user with `EQUIPMENT` `DELETE` permission clicks "Remove" on a row, THE Equipment_Page SHALL show a confirmation dialog; WHEN confirmed, THE Equipment_Page SHALL call `DELETE /equipment/:id` and refresh the DataTable.
8. THE Equipment_Page SHALL support server-side pagination using PaginationControls.

---

### Requirement 8: Inventory Movements Module

**User Story:** As a gym staff member, I want to record and view inventory movements so that I can track stock changes for products and equipment.

#### Acceptance Criteria

1. WHEN a user with `INVENTORY_MOVEMENTS` `VIEW` permission navigates to `/dashboard/inventory`, THE Inventory_Page SHALL fetch and display movements from `GET /inventory-movements?page=1&limit=20` in the DataTable.
2. THE DataTable on the Inventory_Page SHALL display columns: ID, item name, movement type (IN/OUT badge), quantity, notes, and created date.
3. WHEN a user with `INVENTORY_MOVEMENTS` `CREATE_UPDATE` permission clicks "Add Movement", THE Inventory_Page SHALL open a Modal with fields: item reference (product or equipment select), movement type (IN/OUT), quantity (number), and notes.
4. WHEN the Add Movement form is submitted, THE Inventory_Page SHALL call `POST /inventory-movements`, close the Modal, show a success toast, and refresh the DataTable.
5. THE Inventory_Page SHALL support server-side pagination using PaginationControls.
6. IF the quantity field is submitted with a value less than 1, THEN THE Inventory_Page SHALL display a validation error on the quantity field without submitting the form.

---

### Requirement 9: Membership Plans Module

**User Story:** As a gym admin, I want to manage membership plan templates so that I can define the pricing and duration options available to members.

#### Acceptance Criteria

1. WHEN a user with `MEMBERSHIP_PLANS` `VIEW` permission navigates to `/dashboard/plans`, THE Plans_Page SHALL fetch and display plans from `GET /membership-plans?page=1&limit=20` in the DataTable.
2. THE DataTable on the Plans_Page SHALL display columns: ID, name, duration (days), price, and created date.
3. WHEN a user with `MEMBERSHIP_PLANS` `CREATE_UPDATE` permission clicks "Add Plan", THE Plans_Page SHALL open a Modal with fields: name, duration in days (number), and price (number).
4. WHEN the Add Plan form is submitted, THE Plans_Page SHALL call `POST /membership-plans`, close the Modal, show a success toast, and refresh the DataTable.
5. WHEN a user with `MEMBERSHIP_PLANS` `CREATE_UPDATE` permission clicks "Edit" on a row, THE Plans_Page SHALL open a pre-populated Modal and call `PATCH /membership-plans/:id` on submission.
6. WHEN a user with `MEMBERSHIP_PLANS` `DELETE` permission clicks "Delete" on a row, THE Plans_Page SHALL show a confirmation dialog; WHEN confirmed, THE Plans_Page SHALL call `DELETE /membership-plans/:id` and refresh the DataTable.
7. THE Plans_Page SHALL support server-side pagination using PaginationControls.

---

### Requirement 10: Member Subscriptions Module

**User Story:** As a gym staff member, I want to manage member subscriptions so that I can track which members are enrolled in which plans and their payment status.

#### Acceptance Criteria

1. WHEN a user with `MEMBER_SUBSCRIPTIONS` `VIEW` permission navigates to `/dashboard/subscriptions`, THE Subscriptions_Page SHALL fetch and display subscriptions from `GET /member-subscriptions?page=1&limit=20` in the DataTable.
2. THE DataTable on the Subscriptions_Page SHALL display columns: ID, member name, plan name, status (Status_Badge with `subscription` variant), start date, end date, and payment status (Status_Badge with `payment` variant).
3. WHEN a user with `MEMBER_SUBSCRIPTIONS` `CREATE_UPDATE` permission clicks "Add Subscription", THE Subscriptions_Page SHALL open a Modal with fields: member select (searchable), plan select, start date, and payment status.
4. WHEN the Add Subscription form is submitted, THE Subscriptions_Page SHALL call `POST /member-subscriptions`, close the Modal, show a success toast, and refresh the DataTable.
5. WHEN a user with `MEMBER_SUBSCRIPTIONS` `CREATE_UPDATE` permission clicks "Edit" on a row, THE Subscriptions_Page SHALL open a pre-populated Modal and call `PATCH /member-subscriptions/:id` on submission.
6. WHEN a user with `SUBSCRIPTION_APPROVALS` `APPROVE` permission clicks "Approve" on a pending subscription row, THE Subscriptions_Page SHALL call the appropriate approval endpoint and refresh the DataTable.
7. THE Subscriptions_Page SHALL support server-side pagination using PaginationControls.
8. THE Subscriptions_Page SHALL render tabs for filtering by status: "All", "Active", "Paused", "Cancelled", "Expired".

---

### Requirement 11: Products Module

**User Story:** As a gym admin, I want to manage retail products so that I can track stock levels and pricing for items sold at the gym.

#### Acceptance Criteria

1. WHEN a user with `PRODUCTS` `VIEW` permission navigates to `/dashboard/products`, THE Products_Page SHALL fetch and display products from `GET /products?page=1&limit=20` in the DataTable.
2. THE DataTable on the Products_Page SHALL display columns: ID, name, price, stock quantity, and created date.
3. WHEN a product's `stockQuantity` is ≤ 5, THE Products_Page SHALL render the stock quantity cell with a red text colour and a "Low Stock" label.
4. WHEN a user with `PRODUCTS` `CREATE_UPDATE` permission clicks "Add Product", THE Products_Page SHALL open a Modal with fields: name, price (number), and stock quantity (number).
5. WHEN the Add Product form is submitted, THE Products_Page SHALL call `POST /products`, close the Modal, show a success toast, and refresh the DataTable.
6. WHEN a user with `PRODUCTS` `CREATE_UPDATE` permission clicks "Edit" on a row, THE Products_Page SHALL open a pre-populated Modal and call `PATCH /products/:id` on submission.
7. WHEN a user with `PRODUCTS` `DELETE` permission clicks "Delete" on a row, THE Products_Page SHALL show a confirmation dialog; WHEN confirmed, THE Products_Page SHALL call `DELETE /products/:id` and refresh the DataTable.
8. THE Products_Page SHALL support server-side pagination using PaginationControls.

---

### Requirement 12: Product Sales Module

**User Story:** As a gym staff member, I want to record and view product sales so that I can track revenue and inventory consumption.

#### Acceptance Criteria

1. WHEN a user with `PRODUCT_SALES` `VIEW` permission navigates to `/dashboard/sales`, THE Sales_Page SHALL fetch and display sales from `GET /product-sales?page=1&limit=20` in the DataTable.
2. THE DataTable on the Sales_Page SHALL display columns: ID, product name, member name, quantity sold, total price, and created date.
3. WHEN a user with `PRODUCT_SALES` `CREATE_UPDATE` permission clicks "Record Sale", THE Sales_Page SHALL open a Modal with fields: product select (searchable), member select (searchable), and quantity (number).
4. WHEN the Record Sale form is submitted, THE Sales_Page SHALL call `POST /product-sales`, close the Modal, show a success toast, and refresh the DataTable.
5. THE Sales_Page SHALL support server-side pagination using PaginationControls.
6. IF the quantity field is submitted with a value less than 1, THEN THE Sales_Page SHALL display a validation error on the quantity field without submitting the form.

---

### Requirement 13: Branches Module

**User Story:** As an administrator, I want to manage gym branches so that I can organise staff assignments and track each physical location.

#### Acceptance Criteria

1. WHEN a user with `BRANCHES` `VIEW` permission navigates to `/dashboard/branches`, THE Branches_Page SHALL fetch and display branches from `GET /branches?page=1&limit=20&includeDeleted=false&includeUsers=true` in the DataTable.
2. THE DataTable on the Branches_Page SHALL display columns: ID, name, description, assigned user count, and created date.
3. WHEN a user with `BRANCHES` `CREATE_UPDATE` permission clicks "Add Branch", THE Branches_Page SHALL open a Modal with fields: name and description.
4. WHEN the Add Branch form is submitted, THE Branches_Page SHALL call `POST /branches`, close the Modal, show a success toast, and refresh the DataTable.
5. WHEN a user with `BRANCHES` `CREATE_UPDATE` permission clicks "Edit" on a row, THE Branches_Page SHALL open a pre-populated Modal and call `PATCH /branches/:id` on submission.
6. WHEN a user with `BRANCH_USER_ASSIGNMENTS` `MANAGE` permission clicks "Assign User" on a branch row, THE Branches_Page SHALL open a user-select Modal that calls `POST /branches/:id/users` with the selected `userId` and `role`.
7. WHEN a user with `BRANCH_USER_ASSIGNMENTS` `MANAGE` permission clicks "Remove User" on an assigned user, THE Branches_Page SHALL show a confirmation dialog; WHEN confirmed, THE Branches_Page SHALL call `DELETE /branches/:id/users/:userId`.
8. WHEN a user with `BRANCHES` `DELETE` permission clicks "Delete" on a row, THE Branches_Page SHALL show a confirmation dialog; WHEN confirmed, THE Branches_Page SHALL call `DELETE /branches/:id` and refresh the DataTable.
9. THE Branches_Page SHALL support server-side pagination using PaginationControls.

---

### Requirement 14: Permissions Module

**User Story:** As an administrator, I want to configure role-based permissions per branch so that I can control what each staff role can see and do.

#### Acceptance Criteria

1. WHEN a user with `ROLE_PERMISSIONS` `VIEW` permission navigates to `/dashboard/permissions`, THE Permissions_Page SHALL fetch all available roles from `GET /permissions/roles?branchId={activeBranchId}`.
2. THE Permissions_Page SHALL render a permission matrix table with roles as columns and Permission_Features as rows, with checkboxes for each Permission_Action.
3. WHEN a user with `ROLE_PERMISSIONS` `MANAGE` permission toggles a permission checkbox, THE Permissions_Page SHALL update the local state immediately (optimistic update).
4. WHEN a user with `ROLE_PERMISSIONS` `MANAGE` permission clicks "Save Changes" for a role, THE Permissions_Page SHALL call `PUT /permissions/roles/:role?branchId={activeBranchId}` with the full updated permission array and show a success toast on completion.
5. IF the `PUT /permissions/roles/:role` call fails, THEN THE Permissions_Page SHALL revert the optimistic update and show an error toast.
6. THE Permissions_Page SHALL display the current user's own permissions fetched from `GET /permissions/me?branchId={activeBranchId}` in a read-only summary panel.
7. WHEN the Active_Branch changes in the Top_Header, THE Permissions_Page SHALL re-fetch permissions for the newly selected branch.

---

### Requirement 15: Reusable UI Component System

**User Story:** As a developer, I want a consistent set of reusable UI components so that all pages share the same interaction patterns, visual style, and accessibility behaviour.

#### Acceptance Criteria

1. THE DataTable SHALL accept a `sortable` prop; WHEN enabled, THE DataTable SHALL render sortable column headers that toggle ascending/descending order and pass `sortBy` and `sortOrder` parameters to the parent's data-fetch callback.
2. THE DataTable SHALL accept a `onSearch` prop; WHEN provided, THE DataTable SHALL render a search input above the table that debounces input by 300ms before invoking the callback.
3. THE DataTable SHALL render a Skeleton row (using the existing `SkeletonRow` component) for each expected row WHILE `isLoading` is true.
4. THE PaginationControls SHALL accept `page`, `totalPages`, and `onPageChange` props and render previous/next buttons and a page indicator; WHEN `page` equals 1, THE PaginationControls SHALL disable the previous button; WHEN `page` equals `totalPages`, THE PaginationControls SHALL disable the next button.
5. THE Modal component SHALL trap keyboard focus within the overlay WHILE it is open, and SHALL close WHEN the Escape key is pressed or the backdrop is clicked.
6. THE ConfirmDialog component SHALL require explicit user confirmation before any destructive action is executed.
7. THE Toast notification system SHALL display success toasts with a green accent, error toasts with a red accent, and warning toasts with an amber accent, and SHALL auto-dismiss after 4 seconds.
8. ALL interactive elements (buttons, inputs, links, checkboxes) SHALL have a visible focus ring using the Focus Blue colour (`#435ee5`) to meet WCAG 2.1 AA focus visibility requirements.
9. THE Sidebar navigation SHALL mark the currently active route with a filled background indicator using the warm design system colours.
10. WHERE a page has no data to display, THE DataTable SHALL render an empty-state illustration with a descriptive message and, WHEN the user has `CREATE_UPDATE` permission, a call-to-action button.

---

### Requirement 16: API Integration and Error Handling

**User Story:** As a developer, I want all API calls to go through the centralised API_Client so that authentication, error handling, and toast notifications are consistent across the entire application.

#### Acceptance Criteria

1. THE API_Client SHALL attach the `Authorization: Bearer {token}` header to every request WHEN a token is present in `localStorage`.
2. THE API_Client SHALL build query strings from the `params` option object, omitting keys whose value is `undefined` or `null`.
3. WHEN the API returns a 400 response with an array `message` field, THE API_Client SHALL join the array items with "; " and display the result as a single error toast.
4. WHEN the API returns a 409 response, THE API_Client SHALL display the conflict message as an error toast.
5. WHEN a network error occurs (fetch throws `TypeError`), THE API_Client SHALL display "Unable to reach the server. Check your connection." as an error toast.
6. THE API_Client SHALL accept a generic type parameter `T` and return `Promise<T>`, allowing callers to type the response without casting.
7. ALL page-level data fetches SHALL use the API_Client rather than calling `fetch` directly, so that token attachment and error handling are applied uniformly.
8. WHEN the API returns a `Pagination_Response`, THE page component SHALL extract `data` for the DataTable rows and `meta.totalItems` / `meta.totalPages` for PaginationControls.

---

### Requirement 17: Visual Design System Compliance

**User Story:** As a gym admin, I want the dashboard to look polished and consistent with the Pinterest-inspired warm design system so that the application feels professional and inviting.

#### Acceptance Criteria

1. THE Dashboard SHALL use `#ffffff` as the page background and `#211922` (plum black) as the primary text colour throughout all pages.
2. THE Dashboard SHALL use `#e60023` (Pinterest Red) exclusively for primary CTA buttons (Add, Save, Record Sale) and SHALL use `#e5e5e0` (sand gray) for secondary/cancel buttons.
3. ALL buttons and input fields SHALL have a border-radius of 16px; ALL cards and modal containers SHALL have a border-radius of at least 20px.
4. THE Dashboard SHALL use the font stack `"Pin Sans", -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif` as the primary typeface.
5. THE Dashboard SHALL use `#62625b` (olive gray) for secondary/helper text and `#91918c` (warm silver) for input borders and disabled text.
6. ALL form inputs SHALL have a `1px solid #91918c` border in their default state and a `2px solid #435ee5` focus ring in their focused state.
7. THE Sidebar SHALL use a warm off-white background (`#F8F9FA`) with icon-only navigation items; the active item SHALL use a filled rounded indicator.
8. THE Top_Header SHALL render a search bar, branch switcher (for ADMIN users), notification icon, and user avatar/menu on a white background with a bottom border of `1px solid #e5e5e0`.
9. ALL loading states SHALL use Skeleton placeholders that match the shape and size of the content they replace, using a warm gray (`#e5e5e0`) animated shimmer.
10. THE Dashboard SHALL be responsive: the Sidebar SHALL collapse to icon-only on screens narrower than 768px, and DataTable columns SHALL scroll horizontally on screens narrower than the table's minimum width.
