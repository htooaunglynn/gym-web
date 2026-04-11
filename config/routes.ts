/** Route constants for the application */
export const ROUTES = {
    // Auth
    LOGIN: "/login",
    REGISTER: "/register",

    // Dashboard
    DASHBOARD: "/",

    // Members
    MEMBERS: "/members",
    MEMBER_DETAIL: (id: string) => `/members/${id}`,
    MEMBER_CREATE: "/members/new",
    MEMBER_EDIT: (id: string) => `/members/${id}/edit`,

    // Trainers
    TRAINERS: "/trainers",
    TRAINER_DETAIL: (id: string) => `/trainers/${id}`,
    TRAINER_CREATE: "/trainers/new",
    TRAINER_EDIT: (id: string) => `/trainers/${id}/edit`,

    // Equipment
    EQUIPMENT: "/equipment",
    EQUIPMENT_DETAIL: (id: string) => `/equipment/${id}`,
    EQUIPMENT_CREATE: "/equipment/new",
    EQUIPMENT_EDIT: (id: string) => `/equipment/${id}/edit`,

    // Attendance
    ATTENDANCE: "/attendance",
    ATTENDANCE_DETAIL: (id: string) => `/attendance/${id}`,

    // Inventory
    INVENTORY: "/inventory",
    INVENTORY_DETAIL: (id: string) => `/inventory/${id}`,

    // Users
    USERS: "/users",
    USER_DETAIL: (id: string) => `/users/${id}`,
    USER_CREATE: "/users/new",
    USER_EDIT: (id: string) => `/users/${id}/edit`,
} as const;
