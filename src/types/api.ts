// ===== Pagination & Filters =====
export interface PaginationParams {
    page?: number
    limit?: number
    includeDeleted?: boolean
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// ===== Auth Domain =====
export interface LoginDTO {
    email: string
    password: string
    accountType?: 'USER' | 'MEMBER'
}

export interface RegisterMemberDTO {
    email: string
    phone: string
    firstName: string
    lastName: string
    password: string
}

export interface AuthResponse {
    accessToken: string
    user?: UserResponse
}

export interface UserResponse {
    id: string
    email: string
    phone: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'STAFF' | 'HR'
    createdAt: string
    updatedAt: string
}

export interface MeResponse {
    id: string
    email: string
    phone: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'STAFF' | 'HR' | 'MEMBER' | 'TRAINER'
    createdAt: string
    updatedAt: string
}

// ===== Users Domain =====
export interface CreateUserDTO {
    email: string
    phone: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'STAFF' | 'HR'
    password?: string
}

export interface UpdateUserDTO {
    firstName?: string
    lastName?: string
    phone?: string
    role?: 'ADMIN' | 'STAFF' | 'HR'
}

// ===== Trainers Domain =====
export interface CreateTrainerDTO {
    email: string
    phone: string
    firstName: string
    lastName: string
}

export interface UpdateTrainerDTO {
    firstName?: string
    lastName?: string
    phone?: string
}

export interface TrainerResponse {
    id: string
    email: string
    phone: string
    firstName: string
    lastName: string
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
    members?: MemberResponse[]
}

// ===== Members Domain =====
export interface CreateMemberDTO {
    email: string
    phone: string
    firstName: string
    lastName: string
    trainerId?: string | null
}

export interface UpdateMemberDTO {
    firstName?: string
    lastName?: string
    phone?: string
    trainerId?: string | null
}

export interface MemberResponse {
    id: string
    email: string
    phone: string
    firstName: string
    lastName: string
    trainerId?: string | null
    trainer?: TrainerResponse
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}

// ===== Equipment Domain =====
export interface CreateEquipmentDTO {
    name: string
    description?: string
    quantity: number
    condition: 'GOOD' | 'FAIR' | 'POOR'
    createdByUserId: string
    managedByUserId: string
}

export interface UpdateEquipmentDTO {
    description?: string
    condition?: 'GOOD' | 'FAIR' | 'POOR'
}

export interface EquipmentResponse {
    id: string
    name: string
    description?: string
    quantity: number
    condition: 'GOOD' | 'FAIR' | 'POOR'
    createdByUserId: string
    managedByUserId: string
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}

// ===== Attendance Domain =====
export interface CheckInDTO {
    memberId: string
    occurredAt: string
    note?: string
}

export interface CheckOutDTO {
    memberId: string
    occurredAt: string
    note?: string
}

export interface AttendanceCorrectionDTO {
    memberId: string
    correctedAttendanceEventId: string
    eventType: 'CHECK_IN' | 'CHECK_OUT'
    occurredAt: string
    note?: string
}

export interface AttendanceFilterParams extends PaginationParams {
    memberId?: string
    eventType?: 'CHECK_IN' | 'CHECK_OUT'
    subjectType?: 'MEMBER' | 'TRAINER'
    isCorrection?: boolean
    dateFrom?: string
    dateTo?: string
}

export interface AttendanceResponse {
    id: string
    memberId: string
    eventType: 'CHECK_IN' | 'CHECK_OUT'
    occurredAt: string
    note?: string
    isCorrection: boolean
    correctedAttendanceEventId?: string | null
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}

// ===== Inventory Movements Domain =====
export interface RecordIncomingDTO {
    equipmentId: string
    quantity: number
    occurredAt: string
    reason: string
    note?: string
}

export interface RecordOutgoingDTO {
    equipmentId: string
    quantity: number
    occurredAt: string
    reason: string
    note?: string
}

export interface RecordAdjustmentDTO {
    equipmentId: string
    targetQuantity: number
    occurredAt: string
    reason: string
    note?: string
}

export interface MovementFilterParams extends PaginationParams {
    equipmentId?: string
    movementType?: 'INCOMING' | 'OUTGOING' | 'ADJUSTMENT'
    dateFrom?: string
    dateTo?: string
}

export interface InventoryMovementResponse {
    id: string
    equipmentId: string
    movementType: 'INCOMING' | 'OUTGOING' | 'ADJUSTMENT'
    quantity: number
    reason: string
    note?: string
    occurredAt: string
    createdBy?: string
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}
