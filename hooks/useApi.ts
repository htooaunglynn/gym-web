// TanStack Query v5 — centralized query key factories
// Factory pattern: queryKeys.entity.list(filters) / .detail(id)

export const queryKeys = {
    // Auth
    auth: {
        me: () => ["auth", "me"] as const,
    },

    // Members
    members: {
        all: () => ["members"] as const,
        list: (params?: Record<string, unknown>) => ["members", "list", params] as const,
        detail: (id: string) => ["members", "detail", id] as const,
    },

    // Trainers
    trainers: {
        all: () => ["trainers"] as const,
        list: (params?: Record<string, unknown>) => ["trainers", "list", params] as const,
        detail: (id: string) => ["trainers", "detail", id] as const,
        dropdown: () => ["trainers", "dropdown"] as const,
    },

    // Users
    users: {
        all: () => ["users"] as const,
        list: (params?: Record<string, unknown>) => ["users", "list", params] as const,
        detail: (id: string) => ["users", "detail", id] as const,
    },

    // Equipment
    equipment: {
        all: () => ["equipment"] as const,
        list: (params?: Record<string, unknown>) => ["equipment", "list", params] as const,
        detail: (id: string) => ["equipment", "detail", id] as const,
    },

    // Attendance
    attendance: {
        all: () => ["attendance"] as const,
        list: (params?: Record<string, unknown>) => ["attendance", "list", params] as const,
        detail: (id: string) => ["attendance", "detail", id] as const,
    },

    // Inventory Movements
    inventory: {
        all: () => ["inventory"] as const,
        list: (params?: Record<string, unknown>) => ["inventory", "list", params] as const,
        detail: (id: string) => ["inventory", "detail", id] as const,
    },

    // Payments
    payments: {
        all: () => ["payments"] as const,
        list: (params?: Record<string, unknown>) => ["payments", "list", params] as const,
        detail: (id: string) => ["payments", "detail", id] as const,
    },
} as const;
