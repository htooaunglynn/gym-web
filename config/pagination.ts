/** Default page size per entity */
export const PAGINATION = {
    members: { limit: 20 },
    trainers: { limit: 50 },
    users: { limit: 20 },
    equipment: { limit: 20 },
    attendance: { limit: 30 },
    inventory: { limit: 30 },
} as const;
