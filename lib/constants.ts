import type { UserRole } from "@/types/entities";
import type { EquipmentStatus } from "@/types/entities";

/** Display labels for user roles */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
    ADMIN: "Admin",
    STAFF: "Staff",
    HR: "HR",
    TRAINER: "Trainer",
    MEMBER: "Member",
};

/** Display labels and Badge variant for equipment status */
export const EQUIPMENT_STATUS_META: Record<
    EquipmentStatus,
    { label: string; variant: "success" | "warning" | "error" | "default" }
> = {
    OPERATIONAL: { label: "Operational", variant: "success" },
    UNDER_MAINTENANCE: { label: "Under Maintenance", variant: "warning" },
    DAMAGED: { label: "Damaged", variant: "error" },
    RETIRED: { label: "Retired", variant: "default" },
};

/** Categories used in the equipment form select */
export const EQUIPMENT_CATEGORIES = [
    "Cardio",
    "Strength",
    "Flexibility",
    "Free Weights",
    "Accessories",
    "Other",
] as const;

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

/** Public routes that don't require authentication (used in middleware) */
export const PUBLIC_ROUTES = ["/login", "/register"] as const;

/** Key used to store the JWT token in localStorage */
export const ACCESS_TOKEN_KEY = "accessToken";

/** Key used to store the current user object in localStorage */
export const CURRENT_USER_KEY = "currentUser";
