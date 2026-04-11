// Domain entity types derived from the gym-api (NestJS backend)

// ─── Members ────────────────────────────────────────────────────────────────
export interface Member {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    trainerId?: string | null;
    trainer?: Trainer | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMemberPayload {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    password: string;
    trainerId?: string;
}

export interface UpdateMemberPayload {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    trainerId?: string | null;
}

// ─── Trainers ───────────────────────────────────────────────────────────────
export interface Trainer {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    members?: Member[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateTrainerPayload {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface UpdateTrainerPayload {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

// ─── Users ──────────────────────────────────────────────────────────────────
export type UserRole = "ADMIN" | "STAFF" | "HR" | "TRAINER" | "MEMBER";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserPayload {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    password: string;
}

export interface UpdateUserPayload {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: UserRole;
}

// ─── Equipment ──────────────────────────────────────────────────────────────
export type EquipmentStatus = "OPERATIONAL" | "UNDER_MAINTENANCE" | "DAMAGED" | "RETIRED";

export interface Equipment {
    id: string;
    name: string;
    category: string;
    quantity: number;
    status: EquipmentStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEquipmentPayload {
    name: string;
    category: string;
    quantity: number;
    status?: EquipmentStatus;
    notes?: string;
}

export interface UpdateEquipmentPayload {
    name?: string;
    category?: string;
    status?: EquipmentStatus;
    notes?: string;
    // note: quantity is NOT directly patchable — use inventory movements
}

// ─── Attendance ─────────────────────────────────────────────────────────────
export type AttendanceType = "CHECK_IN" | "CHECK_OUT" | "CORRECTION";

export interface AttendanceEvent {
    id: string;
    memberId: string;
    member?: Member;
    type: AttendanceType;
    timestamp: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CheckInPayload {
    memberId: string;
    timestamp?: string;
    notes?: string;
}

export interface CheckOutPayload {
    memberId: string;
    timestamp?: string;
    notes?: string;
}

export interface CorrectionPayload {
    memberId: string;
    type: "CHECK_IN" | "CHECK_OUT";
    timestamp: string;
    notes?: string;
}

// ─── Inventory Movements ────────────────────────────────────────────────────
export type MovementType = "INCOMING" | "OUTGOING" | "ADJUSTMENT";

export interface InventoryMovement {
    id: string;
    equipmentId: string;
    equipment?: Equipment;
    type: MovementType;
    quantity: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateIncomingMovementPayload {
    equipmentId: string;
    quantity: number;
    notes?: string;
}

export interface CreateOutgoingMovementPayload {
    equipmentId: string;
    quantity: number;
    notes?: string;
}

export interface CreateAdjustmentMovementPayload {
    equipmentId: string;
    quantity: number;
    notes?: string;
}

// ─── Payments ───────────────────────────────────────────────────────────────
export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "MOBILE";

export interface Payment {
    id: string;
    memberId: string;
    member?: Member;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    paidAt: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePaymentPayload {
    memberId: string;
    amount: number;
    currency?: string;
    method: PaymentMethod;
    status?: PaymentStatus;
    paidAt?: string;
    notes?: string;
}

export interface UpdatePaymentPayload {
    amount?: number;
    currency?: string;
    method?: PaymentMethod;
    status?: PaymentStatus;
    paidAt?: string;
    notes?: string;
}
